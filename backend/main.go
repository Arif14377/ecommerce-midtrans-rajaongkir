package main

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/config"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database/seeders"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	// load cofig .env
	config.LoadEnv()

	// inisialisasi database
	database.InitDB()

	// menjalankan seeder
	seeders.Seed()

	r := routes.SetupRouter()

	// test server
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Pong",
		})
	})

	r.Run(":" + config.GetEnv("APP_PORT"))
}
