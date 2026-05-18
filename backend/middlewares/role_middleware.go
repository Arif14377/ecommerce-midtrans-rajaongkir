package middlewares

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/gin-gonic/gin"
)

func RoleMiddleware(roleName string) gin.HandlerFunc {
	return func(c *gin.Context) {
		username, exists := c.Get("username")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Wrong email or password.",
			})
			c.Abort()
			return
		}

		var user models.User

		if err := database.DB.Preload("Roles").Where("username = ?", username).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": http.StatusText(http.StatusUnauthorized),
			})
			c.Abort()
			return
		}

		hashRole := false
		for _, role := range user.Roles {
			if role.Name == roleName {
				hashRole = true
				break
			}
		}

		if !hashRole {
			c.JSON(http.StatusForbidden, gin.H{
				"error": http.StatusText(http.StatusForbidden),
			})
			c.Abort()
			return
		}

		c.Next()

	}
}
