package publicController

import (
	"fmt"
	"log"
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
	ws "github.com/arif14377/ecommerce-midtrans-rajaongkir/websocket"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func Checkout(c *gin.Context) {
	// ambil body request
	var req structs.CheckoutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation error",
			Errors:  helpers.TranslateErrorMessage(err, req),
		})
		return
	}

	// ambil userID (auth)
	userID, err := helpers.GetAuthUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, structs.ErrorResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	// ambil data user
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "User not found",
		})
		return
	}

	// ambil item keranjang
	var carts []models.Cart
	if err := database.DB.Preload("Product").
		Where("user_id = ?", userID).
		Find(&carts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to fetch cart",
		})
		return
	}

	if len(carts) == 0 {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "Cart is empty",
		})
		return
	}

	// hitung total & prepare order item
	var subTotal float64
	var orderItems []models.OrderItem
	orderID := fmt.Sprintf("ORD-%s", uuid.New().String())

	for _, cart := range carts {
		var itemSubTotal = float64(cart.Quantity) * cart.Product.Price
		subTotal += itemSubTotal

		orderItems = append(orderItems, models.OrderItem{
			OrderId:   orderID,
			ProductId: cart.ProductId,
			Product:   cart.Product,
			Quantity:  cart.Quantity,
			Price:     cart.Product.Price,
			SubTotal:  itemSubTotal,
		})
	}

	total := subTotal + req.ShippingCost

	order := models.Order{
		Id:              orderID,
		UserId:          userID,
		TotalPrice:      total,
		Status:          "pending",
		ShippingName:    req.ShippingName,
		ShippingPhone:   req.ShippingPhone,
		ShippingAddress: req.ShippingAddress,
		ShippingCost:    req.ShippingCost,
		Courier:         req.Courier,
		Service:         req.Service,
		Items:           orderItems,
	}

	// init transaction
	tx := database.DB.Begin()

	// save order
	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to create order",
		})
		return
	}

	// get midtrans snap token
	token, redirectURL, err := helpers.GetSnapToken(order, user)
	if err != nil {
		tx.Rollback()
		errorMessage := fmt.Sprintf("%v", err)
		log.Printf("failed to generate Midtrans payment token for order %s: %s", order.Id, errorMessage)
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to generate payment token",
			Errors: map[string]string{
				"midtrans": errorMessage,
			},
		})
		return
	}

	order.SnapToken = token
	order.SnapRedirectUrl = redirectURL
	if err := tx.Model(&order).Updates(map[string]any{
		"snap_token":        token,
		"snap_redirect_url": redirectURL,
	}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to save order token",
		})
		return
	}

	// clear chart (jika clear chart gagal, rollback transaction)
	if err := tx.Where("user_id = ?", userID).
		Delete(&models.Cart{}).Error; err != nil {

		tx.Rollback()

		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to clear cart",
		})
		return
	}

	// finish transaction (commit)
	tx.Commit()

	// kirim notif realtime

	if ws.GlobalHub != nil {
		ws.GlobalHub.BroadcastToAdmins(ws.Message{
			Type: "new_order",
			Payload: map[string]any{
				"order_id":    orderID,
				"customer":    user.Name,
				"total_price": total,
				"status":      "pending",
			},
		})
	}

	// kembalikan response
	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Order created successfully",
		Data: structs.CheckoutResponse{
			SnapToken:   token,
			RedirectURL: redirectURL,
			OrderID:     orderID,
			TotalPrice:  total,
		},
	})

}

func GetMyOrder(c *gin.Context) {
	// ambil user ID dari auth
	userID, err := helpers.GetAuthUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, structs.ErrorResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	// ambil order dari database berdasarkan userID
	var orders []models.Order
	if err := database.DB.Preload("Items.Product.Images").
		Where("user_id = ?", userID).
		Order("created_at desc").
		Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to fetch orders",
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Data:    orders,
	})
}

func GetOrderDetail(c *gin.Context) {
	id := c.Param("id")
	userId, err := helpers.GetAuthUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, structs.ErrorResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	var order models.Order
	if err := database.DB.
		Preload("Items.Product.Images").
		Where("id = ? AND user_id = ?", id, userId).
		First(&order).Error; err != nil {

		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "Order not found",
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Data:    order,
	})
}
