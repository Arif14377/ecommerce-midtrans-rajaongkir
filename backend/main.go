package main

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/config"
	"github.com/gin-gonic/gin"
)

func main() {
	// load cofig .env
	config.LoadEnv()

	r := gin.Default()

	// test server
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Pong",
		})
	})

	r.Run(":" + config.GetEnv("APP_PORT"))
}
