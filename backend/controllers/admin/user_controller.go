package adminController

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
	"github.com/gin-gonic/gin"
)

func FindUsers(c *gin.Context) {
	var users []models.User
	var total int64

	search, page, limit, offset := helpers.GetPaginationParams(c)
	baseURL := helpers.BuildBaseURL(c)

	query := database.DB.Model(&models.User{})
	if search != "" {
		query = query.Where("name LIKE ? OR username LIKE ? OR email LIKE ?", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to count users",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	if err := query.Preload("Roles").Order("id desc").Limit(limit).Offset(offset).Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to fetch users",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	var data []structs.UserDetailResponse
	for _, u := range users {
		var userRoles []structs.RoleResponse
		for _, r := range u.Roles {
			userRoles = append(userRoles, structs.RoleResponse{
				Id:   r.Id,
				Name: r.Name,
			})
		}

		data = append(data, structs.UserDetailResponse{
			Id:       u.Id,
			Name:     u.Name,
			Username: u.Username,
			Email:    u.Email,
			Roles:    userRoles,
		})
	}

	helpers.PaginateResponse(c, data, total, page, limit, baseURL, search, "List Data User.")
}
