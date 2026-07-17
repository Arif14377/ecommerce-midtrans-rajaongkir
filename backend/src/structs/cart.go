package structs

import (
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"
)

type CartRequest struct {
	ProductId uint `json:"product_id" binding:"required"`
	Quantity  int  `json:"quantity" binding:"required,min=1"`
}

type CartUpdateRequest struct {
	Quantity int `json:"quantity" binding:"required,min=1"`
}

type CartResponse struct {
	Id         uint            `json:"id"`
	Product    ProductResponse `json:"product"`
	Quantity   int             `json:"quantity"`
	TotalPrice float64         `json:"total_price"`
}

func ToCartResponse(cart models.Cart) CartResponse {
	return CartResponse{
		Id:         cart.Id,
		Product:    ToProductResponse(cart.Product),
		Quantity:   cart.Quantity,
		TotalPrice: cart.Product.Price * float64(cart.Quantity),
	}
}
