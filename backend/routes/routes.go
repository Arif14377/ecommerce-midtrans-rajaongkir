package routes

import (
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/controllers"
	adminController "github.com/arif14377/ecommerce-midtrans-rajaongkir/controllers/admin"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/middlewares"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	// auth routes (no auth required)
	api := router.Group("/api")
	{
		api.POST("/register", controllers.Register)
		api.POST("login", controllers.Login)
	}

	admin := api.Group("/admin")
	admin.Use(middlewares.AuthMiddleware())
	{
		admin.GET("/permissions", middlewares.Permission("permissions-index"), adminController.FindPermissions)
		admin.POST("/permissions", middlewares.Permission("permissions-create"), adminController.CreatePermissions)
		admin.GET("/permissions/:id", middlewares.Permission("permissions-show"), adminController.GetPermissionDetail)
		admin.PUT("/permissions/:id", middlewares.Permission("permissions-update"), adminController.UpdatePermission)
	}

	return router
}
