package routes

import (
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/controllers"
	adminController "github.com/arif14377/ecommerce-midtrans-rajaongkir/controllers/admin"
	publicController "github.com/arif14377/ecommerce-midtrans-rajaongkir/controllers/public"
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
		// Route Dashboard
		admin.GET("/dashboard", middlewares.Permission("dashboard-index"), adminController.Dashboard)

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
		admin.GET("/users/:id", middlewares.Permission("users-index"), adminController.GetUserDetail)
		admin.DELETE("/users/:id", middlewares.Permission("users-delete"), adminController.DeleteUser)

		// Route Categories
		admin.GET("/categories", middlewares.Permission("categories-index"), adminController.FindCategories)
		admin.POST("/categories", middlewares.Permission("categories-create"), adminController.CreateCategory)
		admin.GET("/categories/:id", middlewares.Permission("categories-show"), adminController.GetCategoryDetail)
		admin.PUT("/categories/:id", middlewares.Permission("categories-update"), adminController.UpdateCategory)
		admin.DELETE("/categories/:id", middlewares.Permission("categories-delete"), adminController.DeleteCategory)
		admin.GET("/categories/all", middlewares.Permission("categories-index"), adminController.GetAllCategories)

		// Route Sliders
		admin.GET("/sliders", middlewares.Permission("sliders-index"), adminController.FindSliders)
		admin.POST("/sliders", middlewares.Permission("sliders-create"), adminController.CreateSlider)
		admin.DELETE("/sliders/:id", middlewares.Permission("sliders-delete"), adminController.DeleteSlider)

		// Route Products
		admin.GET("/products", middlewares.Permission("products-index"), adminController.FindProducts)
		admin.POST("/products", middlewares.Permission("products-create"), adminController.CreateProduct)
		admin.GET("/products/:id", middlewares.Permission("products-show"), adminController.GetProductDetail)
		admin.PUT("/products/:id", middlewares.Permission("products-update"), adminController.UpdateProduct)
		admin.DELETE("/products/:id", middlewares.Permission("products-delete"), adminController.DeleteProduct)

		// Route Customers
		admin.GET("/customers", middlewares.Permission("customers-index"), adminController.FindCustomers)

		// Route Orders
		admin.GET("orders", middlewares.Permission("orders-index"), adminController.FindOrders)
		admin.GET("orders/:id", middlewares.Permission("orders-show"), adminController.GetOrderDetail)

		// Route Sales Reports
		admin.GET("/reports/sales", middlewares.Permission("reports-index"), adminController.GetSalesReport)
	}

	// Public router group
	public := api.Group("/public")
	{
		public.GET("/sliders", publicController.ListSliders)
		public.GET("/categories", publicController.ListCategories)
		public.GET("/categories/:slug", publicController.GetCategoryBySlug)
		public.GET("/products", publicController.ListProduct)
	}

	return router
}
