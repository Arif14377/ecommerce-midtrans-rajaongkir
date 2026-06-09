package adminController

import (
	"net/http"
	"strconv"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
	"github.com/gin-gonic/gin"
)

func FindCategories(c *gin.Context) {
	var categories []models.Category
	var total int64

	search, page, limit, offset := helpers.GetPaginationParams(c)
	baseURL := helpers.BuildBaseURL(c)

	query := database.DB.Model(&models.Category{})
	if search != "" {
		query = query.Where("name LIKE ?", "%"+search+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to count categories",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	if err := query.Order("id desc").Limit(limit).Offset(offset).Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to fetch categories",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	helpers.PaginateResponse(c, categories, total, page, limit, baseURL, search, "List Data Category.")
}

func CreateCategory(c *gin.Context) {
	var request structs.CategoryCreateRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation failed",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	slug := helpers.Slugify(request.Name)

	category := models.Category{
		Name: request.Name,
		Slug: slug,
	}

	if err := database.DB.Create(&category).Error; err != nil {
		if helpers.IsDuplicateEntryError(err) {
			c.JSON(http.StatusConflict, structs.ErrorResponse{
				Success: false,
				Message: "Category name or slug already exists.",
				Errors:  helpers.TranslateErrorMessage(err, nil),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to create category",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	c.JSON(http.StatusCreated, structs.SuccessResponse{
		Success: true,
		Message: "Category Created Successfully",
		Data:    structs.ToCategoryResponse(category),
	})

}

// Get category detail
func GetCategoryDetail(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var category models.Category

	if err := database.DB.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "Category not found",
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Category Detail",
		Data:    structs.ToCategoryResponse(category),
	})
}
