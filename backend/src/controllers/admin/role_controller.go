package adminController

import (
	"net/http"
	"strconv"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/database"
	helpers2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/helpers"
	models2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"
	structs2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/structs"
	"github.com/gin-gonic/gin"
)

func FindRoles(c *gin.Context) {
	var roles []models2.Role
	var total int64

	search, page, limit, offset := helpers2.GetPaginationParams(c)
	baseURL := helpers2.BuildBaseURL(c)

	query := database.DB.Model(&models2.Role{})
	if search != "" {
		query = query.Where("name LIKE ?", "%"+search+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to count roles.",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	// Preload permissions agar terlihat di list (optional, bisa dihilangkan jika berat).
	if err := query.Preload("Permissions").Order("id desc").Limit(limit).Offset(offset).Find(&roles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to fetch roles",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	helpers2.PaginateResponse(c, roles, total, page, limit, baseURL, search, "List Data Roles")

}

// CreateRole menambahkan role baru
func CreateRole(c *gin.Context) {
	var request structs2.RoleCreateRequest

	// 1. Validasi Input
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs2.ErrorResponse{
			Success: false,
			Message: "Validation Failed",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	// 2. Siapkan Model
	role := models2.Role{
		Name: request.Name,
	}

	// 3. Cari permissions berdasarkan ID yang dikirim
	var permissions []models2.Permission
	if len(request.PermissionIDs) > 0 {
		database.DB.Where("id IN ?", request.PermissionIDs).Find(&permissions)
	}
	role.Permissions = permissions

	// 4. Simpan Role + Relasi Permissions
	if err := database.DB.Create(&role).Error; err != nil {
		if helpers2.IsDuplicateEntryError(err) {
			c.JSON(http.StatusConflict, structs2.ErrorResponse{
				Success: false,
				Message: "Create Role Failed",
				Errors:  helpers2.TranslateErrorMessage(err, nil),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to create role",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	c.JSON(http.StatusCreated, structs2.SuccessResponse{
		Success: true,
		Message: "Role Created Successfully",
		Data:    role,
	})
}

func GetRoleDetail(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var role models2.Role

	if err := database.DB.Preload("Permissions").First(&role, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Role not found.",
		})
		return
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Role detail.",
		Data:    role,
	})
}

func UpdateRole(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var role models2.Role
	var request structs2.RoleUpdateRequest

	if err := database.DB.Preload("Permissions").First(&role, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Role not found.",
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

	role.Name = request.Name

	var newPermissions []models2.Permission
	if len(request.PermissionIDs) > 0 {
		database.DB.Where("id IN ?", request.PermissionIDs).Find(&newPermissions)
	}

	if err := database.DB.Model(&role).Association("Permissions").Replace(newPermissions); err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to update role permissions",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	if err := database.DB.Save(&role).Error; err != nil {
		if helpers2.IsDuplicateEntryError(err) {
			c.JSON(http.StatusConflict, structs2.ErrorResponse{
				Success: false,
				Message: "Update Role Failed",
				Errors:  helpers2.TranslateErrorMessage(err, nil),
			})
			return
		}
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to update role",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	database.DB.Preload("Permissions").First(&role, id)

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Role Updated Successfully",
		Data:    role,
	})
}

// DeleteRole menghapus role
func DeleteRole(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var role models2.Role

	if err := database.DB.First(&role, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Role Not Found",
		})
		return
	}

	if err := database.DB.Select("Permissions").Delete(&role).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to delete role",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Role Deleted Successfully",
	})
}

// GetAllRoles mengambil semua data role tanpa pagination
func GetAllRoles(c *gin.Context) {
	var roles []models2.Role
	if err := database.DB.Preload("Permissions").Order("name asc").Find(&roles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to fetch roles",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "All Roles List",
		Data:    roles,
	})
}
