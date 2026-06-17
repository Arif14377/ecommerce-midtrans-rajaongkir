package adminController

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
	"github.com/gin-gonic/gin"
)

func FindOrders(c *gin.Context) {
	search, page, limit, offset := helpers.GetPaginationParams(c)
	baseURL := helpers.BuildBaseURL(c)

	var filter structs.OrderAdminFilter
	_ = c.ShouldBindQuery(&filter)

	query := database.DB.Model(&models.Order{}).
		Preload("User").
		Preload("Items").
		Preload("Items.Product").
		Joins("LEFT JOIN users ON users.id = orders.user_id")

	if search != "" {
		query = query.Where(
			"users.name LIKE ? OR orders.shipping_name LIKE ?",
			"%"+search+"%",
			"%"+search+"%",
		)
	}

	if filter.Status != "" {
		query = query.Where("orders.status = ?", filter.Status)
	}

	if filter.Date != "" {
		query = query.Where("DATE(orders.created_at) = ?", filter.Date)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to count orders",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	var orders []models.Order
	if err := query.Order("orders.created_at DESC").Limit(limit).Offset(offset).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to fetch orders",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	responses := make([]structs.OrderAdminResponse, 0, len(orders))
	for _, order := range orders {
		responses = append(responses, structs.OrderAdminResponse{
			ID:          order.Id,
			Invoice:     order.Id,
			Customer:    order.User.Name,
			Total:       int(order.TotalPrice),
			Status:      order.Status,
			CreatedAt:   order.CreatedAt.Format("2006-01-02"),
			PaymentType: "Midtrans",
		})
	}

	helpers.PaginateResponse(c, responses, total, page, limit, baseURL, search, "List data orders")
}
