package adminController

import (
	"net/http"
	"strconv"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/database"
	helpers2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"
	structs2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/structs"
	"github.com/gin-gonic/gin"
)

func FindCategories(c *gin.Context) {
	var categories []models.Category
	var total int64

	search, page, limit, offset := helpers2.GetPaginationParams(c)
	baseURL := helpers2.BuildBaseURL(c)

	query := database.DB.Model(&models.Category{})
	if search != "" {
		query = query.Where("name LIKE ?", "%"+search+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to count categories",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	if err := query.Order("id desc").Limit(limit).Offset(offset).Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to fetch categories",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	helpers2.PaginateResponse(c, categories, total, page, limit, baseURL, search, "List Data Category.")
}

func CreateCategory(c *gin.Context) {
	var request structs2.CategoryCreateRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs2.ErrorResponse{
			Success: false,
			Message: "Validation failed",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	slug := helpers2.Slugify(request.Name)

	category := models.Category{
		Name: request.Name,
		Slug: slug,
	}

	if err := database.DB.Create(&category).Error; err != nil {
		if helpers2.IsDuplicateEntryError(err) {
			c.JSON(http.StatusConflict, structs2.ErrorResponse{
				Success: false,
				Message: "Category name or slug already exists.",
				Errors:  helpers2.TranslateErrorMessage(err, nil),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to create category",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	c.JSON(http.StatusCreated, structs2.SuccessResponse{
		Success: true,
		Message: "Category Created Successfully",
		Data:    structs2.ToCategoryResponse(category),
	})

}

// Get category detail
func GetCategoryDetail(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var category models.Category

	if err := database.DB.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Category not found",
		})
		return
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Category Detail",
		Data:    structs2.ToCategoryResponse(category),
	})
}

// Update category
func UpdateCategory(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var category models.Category
	var request structs2.CategoryUpdateRequest

	if err := database.DB.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Category Not Found",
		})
		return
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs2.ErrorResponse{
			Success: false,
			Message: "Validation Failed",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	category.Name = request.Name
	category.Slug = helpers2.Slugify(request.Name)

	if err := database.DB.Save(&category).Error; err != nil {
		if helpers2.IsDuplicateEntryError(err) {
			c.JSON(http.StatusConflict, structs2.ErrorResponse{
				Success: false,
				Message: "Update Category Failed (Duplicate)",
				Errors:  helpers2.TranslateErrorMessage(err, nil),
			})
			return
		}
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to update category",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Category Updated Successfully",
		Data:    structs2.ToCategoryResponse(category),
	})

}

// DeleteCategory
func DeleteCategory(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var category models.Category

	if err := database.DB.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Category Not Found",
		})
		return
	}

	if err := database.DB.Delete(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to delete category",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Category Deleted Successfully",
	})
}

// GetAllCategories mengambil semua categories tanpa pagination
func GetAllCategories(c *gin.Context) {
	var categories []models.Category
	if err := database.DB.Order("name asc").Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to fetch categories",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "All Categories List",
		Data:    categories,
	})
}
