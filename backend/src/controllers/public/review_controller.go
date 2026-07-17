package publicController

import (
	"net/http"
	"strconv"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/database"
	helpers2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"
	structs2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/structs"
	"github.com/gin-gonic/gin"
)

func CreateReview(c *gin.Context) {
	// ambil body request
	var req structs2.ReviewCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs2.ErrorResponse{
			Success: false,
			Message: "Validation error.",
			Errors:  helpers2.TranslateErrorMessage(err, req),
		})
		return
	}

	// ambil userID dari auth
	userID, err := helpers2.GetAuthUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, structs2.ErrorResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	// cek review berdasarkan product id dan user id (tidak boleh 2x)
	var existingReview models.Review
	if err := database.DB.Where("user_id = ? AND product_id = ?", userID, req.ProductId).First(&existingReview).Error; err == nil {
		c.JSON(http.StatusConflict, structs2.ErrorResponse{
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
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to verify purchase",
		})
		return
	}

	if !hasPurchased {
		c.JSON(http.StatusForbidden, structs2.ErrorResponse{
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
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to create review",
		})
		return
	}

	// kembalikan respon ok
	c.JSON(http.StatusCreated, structs2.SuccessResponse{
		Success: true,
		Message: "Review created successfully",
		Data:    review,
	})
}

// GetReviewsByProduct - Menampilkan daftar review berdasarkan Product ID
func GetReviewsByProduct(c *gin.Context) {
	productID := c.Param("id")
	var reviews []models.Review

	limit := 10
	page := 1
	if c.Query("page") != "" {
		page, _ = strconv.Atoi(c.Query("page"))
	}
	offset := (page - 1) * limit

	// Count total reviews
	var total int64
	database.DB.Model(&models.Review{}).Where("product_id = ?", productID).Count(&total)

	err := database.DB.Preload("User").
		Where("product_id = ?", productID).
		Order("created_at desc").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to fetch reviews",
		})
		return
	}

	var data []structs2.ReviewResponse
	for _, r := range reviews {
		data = append(data, structs2.ReviewResponse{
			Id:        r.Id,
			Rating:    r.Rating,
			Comment:   r.Comment,
			CreatedAt: r.CreatedAt,
			User: structs2.UserResponse{
				Id:       r.User.Id,
				Name:     r.User.Name,
				Email:    r.User.Email,
				Username: r.User.Username,
			},
		})
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "List Reviews",
		Data:    data,
		Meta: gin.H{
			"current_page": page,
			"per_page":     limit,
			"total":        total,
			"total_pages":  (int(total) + limit - 1) / limit,
		},
	})
}
