package publicController

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type MidtransNotification struct {
	TransactionStatus string `json:"transaction_status"`
	OrderId           string `json:"order_id"`
	FraudStatus       string `json:"fraud_status"`
	SignatureKey      string `json:"signature_key"`
	StatusCode        string `json:"status_code"`
	GrossAmount       string `json:"gross_amount"`
}

func MidtransCallback(c *gin.Context) {
	var notification MidtransNotification

	if err := c.ShouldBindJSON(&notification); err != nil {
		c.JSON(http.StatusOK, gin.H{"received": true})
		return
	}

	if !helpers.VerifySignature(
		notification.OrderId,
		notification.StatusCode,
		notification.GrossAmount,
		notification.SignatureKey,
	) {
		c.JSON(http.StatusOK, gin.H{"received": true})
		return
	}

	var order models.Order
	err := database.DB.Preload("Items").
		First(&order, "id = ?", notification.OrderId).Error

	if err != nil {
		c.JSON(http.StatusOK, gin.H{"received": true})
		return
	}

	if order.Status == "paid" || order.Status == "success" {
		c.JSON(http.StatusOK, gin.H{"received": true})
		return
	}

	newStatus := "pending"
	switch notification.TransactionStatus {
	case "capture":
		if notification.FraudStatus == "accept" {
			newStatus = "paid"
		}
	case "settlement":
		newStatus = "paid"
	case "deny", "cancel":
		newStatus = "cancelled"
	case "expire":
		newStatus = "expired"
	}

	if newStatus == "paid" {
		database.DB.Transaction(func(tx *gorm.DB) error {
			tx.Model(&order).Update("status", "paid")
			for _, item := range order.Items {
				tx.Model(&models.Product{}).
					Where("id = ?", item.ProductId).
					UpdateColumn("stock", gorm.Expr("stock - ?", item.Quantity))
			}
			return nil
		})
	} else {
		database.DB.Model(&order).Update("status", newStatus)
	}

	c.JSON(http.StatusOK, gin.H{"received": true})
}
