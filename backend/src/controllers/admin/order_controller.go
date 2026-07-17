package adminController

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/database"
	helpers2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"
	structs2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/structs"
	"github.com/gin-gonic/gin"
)

func FindOrders(c *gin.Context) {
	search, page, limit, offset := helpers2.GetPaginationParams(c)
	baseURL := helpers2.BuildBaseURL(c)

	var filter structs2.OrderAdminFilter
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
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to count orders",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	var orders []models.Order
	if err := query.Order("orders.created_at DESC").Limit(limit).Offset(offset).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to fetch orders",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	responses := make([]structs2.OrderAdminResponse, 0, len(orders))
	for _, order := range orders {
		responses = append(responses, structs2.OrderAdminResponse{
			ID:          order.Id,
			Invoice:     order.Id,
			Customer:    order.User.Name,
			Total:       int(order.TotalPrice),
			Status:      order.Status,
			CreatedAt:   order.CreatedAt.Format("2006-01-02"),
			PaymentType: "Midtrans",
		})
	}

	helpers2.PaginateResponse(c, responses, total, page, limit, baseURL, search, "List data orders")
}

func GetOrderDetail(c *gin.Context) {
	id := c.Param("id")

	var order models.Order
	err := database.DB.
		Preload("User").
		Preload("Items").
		Preload("Items.Product").
		First(&order, "id = ?", id).Error

	if err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Order Not Found",
		})
		return
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Order Detail",
		Data:    order,
	})
}
