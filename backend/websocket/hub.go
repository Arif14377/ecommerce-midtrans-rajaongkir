package ws

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/gorilla/websocket"
)

type Message struct {
	Type    string `json:"type"`
	Payload any    `json:"payload"`
}

type Client struct {
	Hub    *Hub
	Conn   *websocket.Conn
	UserID uint
	Role   string
	Send   chan []byte
}

type Hub struct {
	// Registered clients (admin only for now)
	clients map[*Client]bool

	// Broadcast channel - pesan yang akan dikirim ke semua client
	broadcast chan []byte

	// Register channel - client baru yang ingin terdaftar
	register chan *Client

	// Unregister channel - client yang disconnect
	unregister chan *Client

	// Mutex untuk thread safety
	mu sync.RWMutex
}

var GlobalHub *Hub

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
			log.Printf("WebSocket: Client connected. Total clients: %d", len(h.clients))

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.Send)
			}
			h.mu.Unlock()
			log.Printf("WebSocket: Client disconnected. Total clients: %d", len(h.clients))

		case message := <-h.broadcast:
			h.mu.RLock()
			for client := range h.clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(h.clients, client)
				}
			}
			h.mu.RUnlock()
		}
	}
}

// BroadcastToAdmins mengirim pesan ke semua admin yang terkoneksi
func (h *Hub) BroadcastToAdmins(msg Message) {
	data, err := json.Marshal(msg)
	if err != nil {
		log.Printf("WebSocket: Failed to marshal message: %v", err)
		return
	}

	h.mu.RLock()
	defer h.mu.RUnlock()

	for client := range h.clients {
		// Hanya kirim ke admin
		if client.Role == "admin" {
			select {
			case client.Send <- data:
			default:
				close(client.Send)
				delete(h.clients, client)
			}
		}
	}
}

// Broadcast mengirim pesan ke semua client
func (h *Hub) Broadcast(msg Message) {
	data, err := json.Marshal(msg)
	if err != nil {
		log.Printf("WebSocket: Failed to marshal message: %v", err)
		return
	}
	h.broadcast <- data
}

// GetClientCount mengembalikan jumlah client yang terkoneksi
func (h *Hub) GetClientCount() int {
	h.mu.RLock()
	defer h.mu.RUnlock()
	return len(h.clients)
}

// InitHub menginisialisasi global hub
func InitHub() {
	GlobalHub = NewHub()
	go GlobalHub.Run()
	log.Println("WebSocket Hub initialized")
}
