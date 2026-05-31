package adminController

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
	"github.com/gin-gonic/gin"
)

func FindRoles(c *gin.Context) {
	var roles []models.Role
	var total int64

	search, page, limit, offset := helpers.GetPaginationParams(c)
	baseURL := helpers.BuildBaseURL(c)

	query := database.DB.Model(&models.Role{})
	if search != "" {
		query = query.Where("name LIKE ?", "%"+search+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to count roles.",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	// Preload permissions agar terlihat di list (optional, bisa dihilangkan jika berat).
	if err := query.Preload("Permissions").Order("id desc").Limit(limit).Offset(offset).Find(&roles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to fetch roles",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	helpers.PaginateResponse(c, roles, total, page, limit, baseURL, search, "List Data Roles")

}

// CreateRole menambahkan role baru
func CreateRole(c *gin.Context) {
	var request structs.RoleCreateRequest

	// 1. Validasi Input
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation Failed",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	// 2. Siapkan Model
	role := models.Role{
		Name: request.Name,
	}

	// 3. Cari permissions berdasarkan ID yang dikirim
	var permissions []models.Permission
	if len(request.PermissionIDs) > 0 {
		database.DB.Where("id IN ?", request.PermissionIDs).Find(&permissions)
	}
	role.Permissions = permissions

	// 4. Simpan Role + Relasi Permissions
	if err := database.DB.Create(&role).Error; err != nil {
		if helpers.IsDuplicateEntryError(err) {
			c.JSON(http.StatusConflict, structs.ErrorResponse{
				Success: false,
				Message: "Create Role Failed",
				Errors:  helpers.TranslateErrorMessage(err, nil),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to create role",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	c.JSON(http.StatusCreated, structs.SuccessResponse{
		Success: true,
		Message: "Role Created Successfully",
		Data:    role,
	})
}
