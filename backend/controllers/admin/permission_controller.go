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

// FindPermissions mengambil list permission dengan pagination & search
func FindPermissions(c *gin.Context) {
	var permissions []models.Permission
	var total int64

	search, page, limit, offset := helpers.GetPaginationParams(c)
	baseURL := helpers.BuildBaseURL(c)

	query := database.DB.Model(&models.Permission{})
	if search != "" {
		query = query.Where("name LIKE ?", "%"+search+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to count permissions",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	if err := query.Order("id desc").Limit(limit).Offset(offset).Find(&permissions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to fetch permissions",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	helpers.PaginateResponse(c, permissions, total, page, limit, baseURL, search, "List Data Permissions")
}

func CreatePermissions(c *gin.Context) {
	var request structs.PermissionCreateRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation failed",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	permission := models.Permission{
		Name: request.Name,
	}

	if err := database.DB.Create(&permission).Error; err != nil {
		if helpers.IsDuplicateEntryError(err) {
			c.JSON(http.StatusConflict, structs.ErrorResponse{
				Success: false,
				Message: "Create permission failed.",
				Errors:  helpers.TranslateErrorMessage(err, nil),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to create permission.",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
	}

	c.JSON(http.StatusCreated, structs.SuccessResponse{
		Success: true,
		Message: "Permission created successfully.",
		Data:    permission,
	})

}

func GetPermissionDetail(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var permission models.Permission

	if err := database.DB.First(&permission, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "Permission not found",
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Permission detail.",
		Data:    permission,
	})
}

func UpdatePermission(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var permission models.Permission
	var request structs.PermissionCreateRequest

	// 1. cek data
	if err := database.DB.First(&permission, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "Permission not found.",
		})
		return
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation failed.",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	permission.Name = request.Name
	if err := database.DB.Save(&permission).Error; err != nil {
		if helpers.IsDuplicateEntryError(err) {
			c.JSON(http.StatusConflict, structs.ErrorResponse{
				Success: false,
				Message: "Update permission failed",
				Errors:  helpers.TranslateErrorMessage(err, nil),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to update permission.",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Permission updated successfully.",
		Data:    permission,
	})

}
