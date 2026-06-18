package publicController

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
	"github.com/gin-gonic/gin"
)

func GetCart(c *gin.Context) {
	// dapatkan user id dari auth
	userID, err := helpers.GetAuthUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, structs.ErrorResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	// ambil data cart sesuai user, dilengkapi dengan relasinya.
	var carts []models.Cart
	if err := database.DB.Preload("Product").Preload("Product.Category").Preload("Product.Images").Where("user_id = ?", userID).Find(&carts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Internal Server Error",
		})
		return
	}

	// kembalikan cart respon beserta grand total.
	var response []structs.CartResponse
	var grandTotal float64

	for _, cart := range carts {
		res := structs.ToCartResponse(cart)
		response = append(response, res)
		grandTotal += res.TotalPrice
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Success Get Cart",
		Data:    response,
	})
}
