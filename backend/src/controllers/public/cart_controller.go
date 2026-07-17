package publicController

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/database"
	helpers2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/helpers"
	models2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"
	structs2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/structs"
	"github.com/gin-gonic/gin"
)

func GetCart(c *gin.Context) {
	// dapatkan user id dari auth
	userID, err := helpers2.GetAuthUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, structs2.ErrorResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	// ambil data cart sesuai user, dilengkapi dengan relasinya.
	var carts []models2.Cart
	if err := database.DB.Preload("Product").Preload("Product.Category").Preload("Product.Images").Where("user_id = ?", userID).Find(&carts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Internal Server Error",
		})
		return
	}

	// kembalikan cart respon beserta grand total.
	var response []structs2.CartResponse
	var grandTotal float64

	for _, cart := range carts {
		res := structs2.ToCartResponse(cart)
		response = append(response, res)
		grandTotal += res.TotalPrice
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Success Get Cart",
		Data:    response,
	})
}

func AddToCart(c *gin.Context) {
	// ambil user id dari auth
	userID, err := helpers2.GetAuthUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, structs2.ErrorResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	// ambil request cart
	var request structs2.CartRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs2.ErrorResponse{
			Success: false,
			Message: "Validation Error",
			Errors:  helpers2.TranslateErrorMessage(err, request),
		})
		return
	}

	// cek produknya (ada atau tidak)
	var product models2.Product
	if err := database.DB.First(&product, request.ProductId).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Product not found.",
		})
		return
	}

	// cek cart saat ini (tambah qty jika sudah ada productnya)
	// Cek stock
	var cart models2.Cart
	err = database.DB.Where("user_id = ? AND product_id = ?", userID, request.ProductId).First(&cart).Error

	if err == nil {
		newQuantity := cart.Quantity + request.Quantity

		// cek stock
		if newQuantity > product.Stock {
			c.JSON(http.StatusBadRequest, structs2.ErrorResponse{
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
			c.JSON(http.StatusBadRequest, structs2.ErrorResponse{
				Success: false,
				Message: "Insufficient Stock",
			})
			return
		}

		cart = models2.Cart{
			UserId:    userID,
			ProductId: request.ProductId,
			Quantity:  request.Quantity,
		}

		if err := database.DB.Create(&cart).Error; err != nil {
			c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
				Success: false,
				Message: "Failed to add to cart",
			})
			return
		}
	}

	// kembalikan response
	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Product Added to Cart",
	})

}

func UpdateCart(c *gin.Context) {
	// ambil id user dari auth
	userID, err := helpers2.GetAuthUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, structs2.ErrorResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	// ambil cart id dari param
	// ambil request body
	cartId := c.Param("id")
	var request structs2.CartUpdateRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs2.ErrorResponse{
			Success: false,
			Message: "Validation errors",
			Errors:  helpers2.TranslateErrorMessage(err, request),
		})
		return
	}

	// cek apakah ada di cart produknya
	var cart models2.Cart
	if err := database.DB.Where("id = ? AND user_id = ?", cartId, userID).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Cart Item Not Found",
		})
		return
	}

	var product models2.Product
	if err := database.DB.First(&product, cart.ProductId).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Product Not Found",
		})
		return
	}

	// cek ketersediaan stock
	if request.Quantity > product.Stock {
		c.JSON(http.StatusBadRequest, structs2.ErrorResponse{
			Success: false,
			Message: "Insufficient Stock",
		})
		return
	}

	// update cart dan kembalikan response
	cart.Quantity = request.Quantity
	database.DB.Save(&cart)

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Cart Updated Successfully",
	})

}

func RemoveFromCart(c *gin.Context) {
	userId, err := helpers2.GetAuthUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, structs2.ErrorResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	cartId := c.Param("id")

	var cart models2.Cart
	if err := database.DB.Where("id = ? AND user_id = ?", cartId, userId).First(&cart).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Cart Item Not Found",
		})
		return
	}

	database.DB.Delete(&cart)

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Item Removed from Cart",
	})
}
