package adminController

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
	"github.com/gin-gonic/gin"
)

// Dashboard mengambil statistik
func Dashboard(c *gin.Context) {
	var (
		totalRevenue   float64
		totalOrders    int64
		totalProducts  int64
		totalCustomers int64
		pendingOrders  int64
		paidOrders     int64
	)

	type Result struct {
		Total float64
	}
	var revenueResult Result
	database.DB.Model(&models.Order{}).Select("sum(total_price) as total").Where("status = ?", "paid").Scan(&revenueResult)
	totalRevenue = revenueResult.Total

	if err := database.DB.Model(&models.Order{}).Count(&totalOrders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to get orders count",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	database.DB.Model(&models.Order{}).Where("status = ?", "pending").Count(&pendingOrders)
	database.DB.Model(&models.Order{}).Where("status = ?", "paid").Count(&paidOrders)

	if err := database.DB.Model(&models.Product{}).Count(&totalProducts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to get products count",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	var customerRole models.Role
	if err := database.DB.Where("name = ?", "user").First(&customerRole).Error; err == nil {
		database.DB.Model(&customerRole).Association("Users").Count()
		database.DB.Table("users").
			Joins("JOIN user_roles ON user_roles.user_id = users.id").
			Where("user_roles.role_id = ?", customerRole.Id).
			Count(&totalCustomers)
	}

	var recentOrders []models.Order
	database.DB.Preload("User").Order("created_at desc").Limit(5).Find(&recentOrders)

	// Map ke Struct Response
	var recentOrderResponses []structs.OrderResponse
	for _, o := range recentOrders {
		recentOrderResponses = append(recentOrderResponses, structs.OrderResponse{
			Id:        o.Id,
			Customer:  o.User.Name,
			Total:     o.TotalPrice,
			Status:    o.Status,
			CreatedAt: o.CreatedAt.Format("2006-01-02 15:04"),
		})
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Dashboard stats retrieved successfully",
		Data: structs.DashboardResponse{
			TotalRevenue:   totalRevenue,
			TotalOrders:    totalOrders,
			TotalProducts:  totalProducts,
			TotalCustomers: totalCustomers,
			PendingOrders:  pendingOrders,
			PaidOrders:     paidOrders,
			RecentOrders:   recentOrderResponses,
		},
	})
}
