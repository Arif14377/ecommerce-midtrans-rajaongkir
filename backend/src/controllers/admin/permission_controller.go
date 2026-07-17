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

// FindPermissions mengambil list permission dengan pagination & search
func FindPermissions(c *gin.Context) {
	var permissions []models.Permission
	var total int64

	search, page, limit, offset := helpers2.GetPaginationParams(c)
	baseURL := helpers2.BuildBaseURL(c)

	query := database.DB.Model(&models.Permission{})
	if search != "" {
		query = query.Where("name LIKE ?", "%"+search+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to count permissions",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	if err := query.Order("id desc").Limit(limit).Offset(offset).Find(&permissions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to fetch permissions",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	helpers2.PaginateResponse(c, permissions, total, page, limit, baseURL, search, "List Data Permissions")
}

func CreatePermissions(c *gin.Context) {
	var request structs2.PermissionCreateRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs2.ErrorResponse{
			Success: false,
			Message: "Validation failed",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	permission := models.Permission{
		Name: request.Name,
	}

	if err := database.DB.Create(&permission).Error; err != nil {
		if helpers2.IsDuplicateEntryError(err) {
			c.JSON(http.StatusConflict, structs2.ErrorResponse{
				Success: false,
				Message: "Create permission failed.",
				Errors:  helpers2.TranslateErrorMessage(err, nil),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to create permission.",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
	}

	c.JSON(http.StatusCreated, structs2.SuccessResponse{
		Success: true,
		Message: "Permission created successfully.",
		Data:    permission,
	})

}

func GetPermissionDetail(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var permission models.Permission

	if err := database.DB.First(&permission, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Permission not found",
		})
		return
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Permission detail.",
		Data:    permission,
	})
}

func UpdatePermission(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var permission models.Permission
	var request structs2.PermissionCreateRequest

	// 1. cek data
	if err := database.DB.First(&permission, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Permission not found.",
		})
		return
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs2.ErrorResponse{
			Success: false,
			Message: "Validation failed.",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	permission.Name = request.Name
	if err := database.DB.Save(&permission).Error; err != nil {
		if helpers2.IsDuplicateEntryError(err) {
			c.JSON(http.StatusConflict, structs2.ErrorResponse{
				Success: false,
				Message: "Update permission failed",
				Errors:  helpers2.TranslateErrorMessage(err, nil),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to update permission.",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Permission updated successfully.",
		Data:    permission,
	})

}

func DeletePermission(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var permission models.Permission

	if err := database.DB.First(&permission, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Permission not found.",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	if err := database.DB.Delete(&permission).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to delete permission.",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Permission deleted successfully",
	})
}

func GetAllPermissions(c *gin.Context) {
	var permissions []models.Permission
	if err := database.DB.Order("name asc").Find(&permissions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to fetch permissions.",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "All permissions list.",
		Data:    permissions,
	})
}
