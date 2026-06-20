package helpers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/config"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
)

const RAJAONGKIR_URL = "https://rajaongkir.komerce.id/api/v1"

// RajaOngkirRequest mengirim request ke API RajaOngkir dan mengembalikan field
// data dari response.
//
// Function ini otomatis menambahkan API key dari environment RAJAONGKIR_API_KEY
// dan memvalidasi meta.code dari response RajaOngkir.
//
// Contoh:
//
//	data, err := helpers.RajaOngkirRequest(http.MethodGet, "/destination/domestic-destination", nil, "")
func RajaOngkirRequest(method, path string, body []byte, contentType string) (any, error) {
	apiKey := config.GetEnv("RAJAONGKIR_API_KEY")
	url := RAJAONGKIR_URL + path

	var reqBody io.Reader
	if body != nil {
		reqBody = bytes.NewBuffer(body)
	}

	req, err := http.NewRequest(method, url, reqBody)
	if err != nil {
		return nil, err
	}

	if contentType == "" {
		contentType = "application/json"
	}

	req.Header.Set("key", apiKey)
	req.Header.Set("Key", apiKey)
	req.Header.Set("Content-Type", contentType)
	req.Header.Set("accept", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result structs.RajaOngkirResponseWrapper
	if err := json.Unmarshal(respBody, &result); err != nil {
		return nil, fmt.Errorf("Status %d: %s\n", resp.StatusCode, string(respBody))
	}

	if result.Meta.Code != 200 {
		return nil, fmt.Errorf("Rajaongkir API error: %s (Code: %d)\n", result.Meta.Message, result.Meta.Code)
	}

	return result.Data, nil
}

// ToJSON mengubah data Go menjadi JSON dalam bentuk []byte.
//
// Function ini mengabaikan error marshal, sehingga sebaiknya hanya digunakan
// untuk data yang memang pasti bisa diubah menjadi JSON.
//
// Contoh:
//
//	body := helpers.ToJSON(map[string]any{"origin": "501"})
func ToJSON(data any) []byte {
	b, _ := json.Marshal(data)
	return b
}
