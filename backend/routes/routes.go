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
		// Route Permissions
		admin.GET("/permissions/all", middlewares.Permission("permissions-index"), adminController.GetAllPermissions)
		admin.GET("/permissions", middlewares.Permission("permissions-index"), adminController.FindPermissions)
		admin.POST("/permissions", middlewares.Permission("permissions-create"), adminController.CreatePermissions)
		admin.GET("/permissions/:id", middlewares.Permission("permissions-show"), adminController.GetPermissionDetail)
		admin.PUT("/permissions/:id", middlewares.Permission("permissions-update"), adminController.UpdatePermission)
		admin.DELETE("/permissions/:id", middlewares.Permission("permissions-delete"), adminController.DeletePermission)

		// Route Roles
		admin.GET("roles/all", middlewares.Permission("roles-index"), adminController.GetAllRoles)
		admin.GET("/roles", middlewares.Permission("roles-index"), adminController.FindRoles)
		admin.POST("/roles", middlewares.Permission("roles-create"), adminController.CreateRole)
		admin.GET("roles/:id", middlewares.Permission("roles-show"), adminController.GetRoleDetail)
		admin.PUT("/roles/:id", middlewares.Permission("roles-update"), adminController.UpdateRole)
		admin.DELETE("/roles/:id", middlewares.Permission("roles-delete"), adminController.DeleteRole)

		// Route Users
		admin.GET("/users", middlewares.Permission("users-index"), adminController.FindUsers)
		admin.POST("/users", middlewares.Permission("users-create"), adminController.CreateUser)
		admin.PUT("/users/:id", middlewares.Permission("users-update"), adminController.UpdateUser)
	}

	return router
}
