package publicController

import (
	"net/http"
	"strconv"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
	"github.com/gin-gonic/gin"
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
