package adminController

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/database"
	helpers2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/structs"
	"github.com/gin-gonic/gin"
)

func FindCustomers(c *gin.Context) {
	var users []models.User
	var total int64

	search, page, limit, offset := helpers2.GetPaginationParams(c)
	baseURL := helpers2.BuildBaseURL(c)

	query := database.DB.Model(&models.User{}).
		Joins("JOIN user_roles ON user_roles.user_id = users.id").
		Joins("JOIN roles ON roles.id = user_roles.role_id").
		Where("roles.name IN ?", []string{"user", "customer"})

	if search != "" {
		query = query.Where("users.name LIKE ? OR users.email LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to count customers",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	if err := query.Preload("Roles").Preload("Addresses").
		Order("users.id desc").Limit(limit).Offset(offset).Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to fetch customers",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	helpers2.PaginateResponse(c, users, total, page, limit, baseURL, search, "List data customers.")

}
