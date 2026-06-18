package publicController

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
	"github.com/gin-gonic/gin"
)

func GetAddresses(c *gin.Context) {
	// ambil user id dari auth middleware
	userID, err := helpers.GetAuthUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, structs.ErrorResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	// ambil address milik user (by user id)
	var addresses []models.Address
	if err := database.DB.Where("user_id = ?", userID).Order("is_primary desc, created_at desc").Find(&addresses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to fetch addresses",
		})
		return
	}

	// kembalikan response data address
	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Addresses fetched successfully",
		Data:    addresses,
	})
}
