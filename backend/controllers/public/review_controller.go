package publicController

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
	"github.com/gin-gonic/gin"
)

func CreateReview(c *gin.Context) {
	// ambil body request
	var req structs.ReviewCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation error.",
			Errors:  helpers.TranslateErrorMessage(err, req),
		})
		return
	}

	// ambil userID dari auth
	userID, err := helpers.GetAuthUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, structs.ErrorResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	// cek review berdasarkan product id dan user id (tidak boleh 2x)
	var existingReview models.Review
	if err := database.DB.Where("user_id = ? AND product_id = ?", userID, req.ProductId).First(&existingReview).Error; err == nil {
		c.JSON(http.StatusConflict, structs.ErrorResponse{
			Success: false,
			Message: "You have already reviewed this product",
		})
		return
	}

	// cek pembayaran. harus sudah melakukan pembayaran sebelum review
	var hasPurchased bool
	if err := database.DB.Table("orders").
		Joins("JOIN order_items ON order_items.order_id = orders.id").
		Where("orders.user_id = ? AND orders.status = ? AND order_items.product_id = ?", userID, "paid", req.ProductId).
		Select("count(*) > 0").
		Find(&hasPurchased).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to verify purchase",
		})
		return
	}

	if !hasPurchased {
		c.JSON(http.StatusForbidden, structs.ErrorResponse{
			Success: false,
			Message: "You must purchase this product before reviewing it",
		})
		return
	}

	// mapping review dari request ke models review
	review := models.Review{
		UserId:    userID,
		ProductId: req.ProductId,
		Rating:    req.Rating,
		Comment:   req.Comment,
	}

	// save

	if err := database.DB.Create(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to create review",
		})
		return
	}

	// kembalikan respon ok
	c.JSON(http.StatusCreated, structs.SuccessResponse{
		Success: true,
		Message: "Review created successfully",
		Data:    review,
	})
}
