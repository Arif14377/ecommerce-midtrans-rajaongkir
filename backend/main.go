package main

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/config"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/database/seeders"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/routes"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/websocket"
	"github.com/gin-gonic/gin"
)

func main() {
	// load cofig .env
	config.LoadEnv()

	// inisialisasi database
	database.InitDB()

	// menjalankan seeder
	seeders.Seed()

	//inisialisasi WebSocket Hub
	ws.InitHub()

	r := routes.SetupRouter()

	// test server
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Pong",
		})
	})

	r.Run(":" + config.GetEnv("APP_PORT"))
}
