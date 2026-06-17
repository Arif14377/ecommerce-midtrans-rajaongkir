package publicController

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
	"github.com/gin-gonic/gin"
)

func ListCategories(c *gin.Context) {
	var categories []models.Category
	if err := database.DB.Order("name asc").Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to fetch categories",
		})
		return
	}

	var data []structs.CategoryResponse
	for _, cat := range categories {
		data = append(data, structs.ToCategoryResponse(cat))
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "List Categories",
		Data:    data,
	})
}

// GetCategoryBySlug
func GetCategoryBySlug(c *gin.Context) {
	slug := c.Param("slug")
	var category models.Category

	if err := database.DB.Where("slug = ?", slug).First(&category).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "Category Not Found",
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Category Detail",
		Data:    structs.ToCategoryResponse(category),
	})
}
