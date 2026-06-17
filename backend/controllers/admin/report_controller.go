package adminController

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
	"github.com/gin-gonic/gin"
)

func GetSalesReport(c *gin.Context) {
	var request structs.ReportRequest
	if err := c.ShouldBindQuery(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation failed",
			Errors:  helpers.TranslateErrorMessage(err, request),
		})
		return
	}

	var totalRevenue int64
	var totalOrders int64

	// Count total orders dengan status paid
	if err := database.DB.Model(&models.Order{}).
		Where("status = ?", "paid").
		Where("created_at BETWEEN ? AND ?", request.StartDate+" 00:00:00", request.EndDate+" 23:59:59").
		Count(&totalOrders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to count orders",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	// Sum total revenue dengan status paid
	var result struct {
		Total float64
	}

	if err := database.DB.Model(&models.Order{}).
		Select("COALESCE(SUM(total_price), 0) as total").
		Where("status = ?", "paid").
		Where("created_at BETWEEN ? AND ?", request.StartDate+" 00:00:00", request.EndDate+" 23:59:59").
		Scan(&result).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to calculate revenue",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	totalRevenue = int64(result.Total)

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Sales Report Data",
		Data: structs.ReportResponse{
			TotalRevenue: totalRevenue,
			TotalOrders:  totalOrders,
		},
	})
}
