package middlewares

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/gin-gonic/gin"
)

func Permission(permissionName string) gin.HandlerFunc {
	return func(c *gin.Context) {
		username, exists := c.Get("username")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Wrong email or password",
			})
			c.Abort()
			return
		}

		var user models.User
		err := database.DB.
			Preload("Roles.Permissions").
			Where("username = ?", username).
			First(&user).Error

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Wrong email or password",
			})
			c.Abort()
			return
		}

		for _, role := range user.Roles {
			for _, perm := range role.Permissions {
				if perm.Name == permissionName {
					c.Next()
					return
				}
			}
		}

		c.JSON(http.StatusForbidden, gin.H{
			"error": "You don't have permission to access this resource",
		})
		c.Abort()
	}
}
