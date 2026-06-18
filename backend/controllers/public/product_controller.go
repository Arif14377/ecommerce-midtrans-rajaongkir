package publicController

import (
	"net/http"
	"strconv"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func ListProduct(c *gin.Context) {
	var products []models.Product
	var total int64

	search := c.Query("search")
	categorySlug := c.Query("category")

	limitCount := 12
	pageInt := 1

	if c.Query("page") != "" {
		pageInt, _ = strconv.Atoi(c.Query("page"))
	}

	if pageInt > 1 {
		pageInt = 1
	}

	offset := (pageInt - 1) * limitCount

	query := database.DB.Model(&models.Product{}).Preload("Category").Preload("Images")

	if search != "" {
		query = query.Where("name LIKE ?", "%"+search+"%")
	}

	if categorySlug != "" {
		var cat models.Category
		if err := database.DB.Where("slug = ?", categorySlug).First(&cat).Error; err == nil {
			query = query.Where("category_id = ?", cat.Id)
		}
	}

	if err := query.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to fetch products",
		})
		return
	}

	if err := query.Order("id desc").Limit(limitCount).Offset(offset).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to fetch products",
		})
		return
	}

	hostURL := helpers.BuildHostURL(c)

	var data []structs.ProductResponse
	for _, p := range products {
		data = append(data, structs.ToProductResponseWithBaseURL(p, hostURL))
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "List Products",
		Data:    data,
		Meta: gin.H{
			"total": total,
			"page":  pageInt,
			"limit": limitCount,
			"pages": (int(total) + limitCount - 1) / limitCount,
		},
	})
}

func GetProductDetailBySlug(c *gin.Context) {
	slug := c.Param("slug")
	var product models.Product

	if err := database.DB.Preload("Category").Preload("Images").Preload("Reviews").Preload("Reviews.User").Where("slug = ?", slug).First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "Product not found.",
		})
		return
	}

	hostURL := helpers.BuildHostURL(c)
	productResponse := structs.ToProductResponseWithBaseURL(product, hostURL)

	// Check Authorization Header for Optional Review Permission
	tokenString := c.GetHeader("Authorization")
	if tokenString != "" {
		// Remove "Bearer " prefix
		if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
			tokenString = tokenString[7:]
		}

		// Parse token manually (simulating auth middleware logic)
		token, err := helpers.VerifyToken(tokenString) // We need to expose VerifyToken in helpers
		if err == nil && token.Valid {
			// Extract User ID
			claims, ok := token.Claims.(*jwt.RegisteredClaims)
			if ok && token.Valid {
				var user models.User
				// Find user by username (subject in claims)
				if err := database.DB.Where("username = ?", claims.Subject).First(&user).Error; err == nil {
					// Check if user has a completed order for this product
					var count int64
					database.DB.Table("orders").
						Joins("JOIN order_items ON orders.id = order_items.order_id").
						Where("orders.user_id = ? AND order_items.product_id = ? AND (orders.status = 'paid' OR orders.status = 'shipped' OR orders.status = 'delivered')", user.Id, product.Id).
						Count(&count)

					if count > 0 {
						productResponse.CanReview = true
					}
				}
			}
		}
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Product Detail",
		Data:    productResponse,
	})
}
