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

func AddToCart(c *gin.Context) {
	// ambil user id dari auth
	userID, err := helpers.GetAuthUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, structs.ErrorResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	// ambil request cart
	var request structs.CartRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation Error",
			Errors:  helpers.TranslateErrorMessage(err, request),
		})
		return
	}

	// cek produknya (ada atau tidak)
	var product models.Product
	if err := database.DB.First(&product, request.ProductId).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "Product not found.",
		})
		return
	}

	// cek cart saat ini (tambah qty jika sudah ada productnya)
	// Cek stock
	var cart models.Cart
	err = database.DB.Where("user_id = ? AND product_id = ?", userID, request.ProductId).First(&cart).Error

	if err == nil {
		newQuantity := cart.Quantity + request.Quantity

		// cek stock
		if newQuantity > product.Stock {
			c.JSON(http.StatusBadRequest, structs.ErrorResponse{
				Success: false,
				Message: "Insufficient stock",
			})
			return
		}

		cart.Quantity = newQuantity
		database.DB.Save(&cart)
	} else {
		// create new
		if request.Quantity > product.Stock {
			c.JSON(http.StatusBadRequest, structs.ErrorResponse{
				Success: false,
				Message: "Insufficient Stock",
			})
			return
		}

		cart = models.Cart{
			UserId:    userID,
			ProductId: request.ProductId,
			Quantity:  request.Quantity,
		}

		if err := database.DB.Create(&cart).Error; err != nil {
			c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
				Success: false,
				Message: "Failed to add to cart",
			})
			return
		}
	}

	// kembalikan response
	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Product Added to Cart",
	})

}
