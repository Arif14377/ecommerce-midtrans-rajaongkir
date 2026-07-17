package middlewares

import (
	"net/http"
	"strings"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/config"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")

		if tokenString == "" {
			tokenString = c.Query("token")
		}

		tokenString = strings.TrimPrefix(tokenString, "Bearer ")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Please login.",
			})
			c.Abort()
			return
		}

		claims := &jwt.RegisteredClaims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) {
			return []byte(config.GetEnv("JWT_SECRET")), nil
		})

		if err != nil || token == nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Wrong email or password",
			})
			c.Abort()
			return
		}

		var user models.User
		if err := database.DB.Where("username = ?", claims.Subject).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Wrong email or password",
			})
			c.Abort()
			return
		}

		c.Set("username", claims.Subject)
		c.Set("user_id", user.Id)

		c.Next()
	}
}
