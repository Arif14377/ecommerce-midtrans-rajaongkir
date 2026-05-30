package routes

import (
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	// auth routes (no auth required)
	auth := router.Group("/api")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("login", controllers.Login)
	}

	return router
}
