package helpers

import (
	"crypto/sha512"
	"encoding/hex"
	"fmt"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/config"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
)

// GetSnapToken membuat transaksi Snap Midtrans untuk order dan user tertentu.
//
// Function ini menyusun item transaksi dari order items, menambahkan ongkir
// jika ada, lalu mengembalikan snap token dan redirect URL dari Midtrans.
//
// Contoh:
//
//	token, redirectURL, err := helpers.GetSnapToken(order, user)
func GetSnapToken(order models.Order, user models.User) (token, redirectURL string, err error) {
	serverKey := config.GetEnv("MIDTRANS_SERVER_KEY")
	if serverKey == "" {
		return "", "", fmt.Errorf("MIDTRANS_SERVER_KEY is empty")
	}

	isProd := config.GetEnv("MIDTRANS_IS_PRODUCTION") == "true"

	var s = snap.Client{}
	env := midtrans.Sandbox
	if isProd {
		env = midtrans.Production
	}

	s.New(serverKey, env)

	var calculatedGrossAmount int64 = 0
	var items []midtrans.ItemDetails
	for _, item := range order.Items {
		if item.Price <= 0 {
			return "", "", fmt.Errorf("product %d has invalid price", item.ProductId)
		}
		if item.Quantity <= 0 {
			return "", "", fmt.Errorf("product %d has invalid quantity", item.ProductId)
		}

		name := item.Product.Name
		if len(name) > 50 {
			name = name[:50]
		}
		if name == "" {
			name = fmt.Sprintf("Product %d", item.ProductId)
		}

		items = append(items, midtrans.ItemDetails{
			ID:    fmt.Sprintf("PROD-%d", item.ProductId),
			Name:  name,
			Price: int64(item.Price),
			Qty:   int32(item.Quantity),
		})

		calculatedGrossAmount += int64(item.Price) * int64(item.Quantity)
	}

	if order.ShippingCost > 0 {
		items = append(items, midtrans.ItemDetails{
			ID:    "SHIPPING",
			Name:  fmt.Sprintf("Shipping (%s - %s)", order.Courier, order.Service),
			Price: int64(order.ShippingCost),
			Qty:   1,
		})
		calculatedGrossAmount += int64(order.ShippingCost)
	}

	if len(items) == 0 {
		return "", "", fmt.Errorf("order has no items")
	}
	if calculatedGrossAmount <= 0 {
		return "", "", fmt.Errorf("gross amount must be greater than 0")
	}

	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  order.Id,
			GrossAmt: calculatedGrossAmount,
		},
		CreditCard: &snap.CreditCardDetails{
			Secure: true,
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName: user.Name,
			Email: user.Email,
		},
		Items: &items,
	}
	snapResp, midtransErr := s.CreateTransaction(req)
	if midtransErr != nil {
		return "", "", midtransErr
	}
	if snapResp == nil {
		return "", "", fmt.Errorf("Midtrans response is empty")
	}
	if snapResp.Token == "" || snapResp.RedirectURL == "" {
		return "", "", fmt.Errorf("Midtrans response does not contain token or redirect URL")
	}

	return snapResp.Token, snapResp.RedirectURL, nil
}

// VerifySignature memvalidasi signature key dari notifikasi pembayaran Midtrans.
//
// Signature dihitung dari orderId, statusCode, grossAmount, dan
// MIDTRANS_SERVER_KEY, lalu dibandingkan dengan signatureKey dari Midtrans.
//
// Contoh:
//
//	isValid := helpers.VerifySignature(orderID, statusCode, grossAmount, signatureKey)
func VerifySignature(orderId, statusCode, grossAmount, signatureKey string) bool {
	serverKey := config.GetEnv("MIDTRANS_SERVER_KEY")
	signatureString := orderId + statusCode + grossAmount + serverKey

	hasher := sha512.New()
	hasher.Write([]byte(signatureString))
	expectedSignature := hex.EncodeToString(hasher.Sum(nil))

	return expectedSignature == signatureKey
}
