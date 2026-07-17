package publicController

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/database"
	helpers2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"
	structs2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/structs"
	"github.com/gin-gonic/gin"
)

func GetAddresses(c *gin.Context) {
	// ambil user id dari auth middleware
	userID, err := helpers2.GetAuthUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, structs2.ErrorResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	// ambil address milik user (by user id)
	var addresses []models.Address
	if err := database.DB.Where("user_id = ?", userID).Order("is_primary desc, created_at desc").Find(&addresses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to fetch addresses",
		})
		return
	}

	// kembalikan response data address
	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Addresses fetched successfully",
		Data:    addresses,
	})
}

func CreateAddress(c *gin.Context) {
	// ambil user id dari context middleware
	userID, err := helpers2.GetAuthUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, structs2.ErrorResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	// ambil request body request address
	var request structs2.AddressCreateRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs2.ErrorResponse{
			Success: false,
			Message: "Validation Errors",
			Errors:  helpers2.TranslateErrorMessage(err, request),
		})
		return
	}

	// kalau request diset sebagai primary, ubah alamat lainnya menjadi false
	if request.IsPrimary {
		if err := database.DB.Model(&models.Address{}).Where("user_id = ?", userID).Update("is_primary", false).Error; err != nil {
			c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
				Success: false,
				Message: "Failed to update primary address",
			})
			return
		}
	}

	// isi data models address dengan data request
	address := structs2.ToCreateAddressResponse(userID, request)

	// simpan di database
	if err := database.DB.Create(&address).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to create address",
		})
		return
	}

	// kembalikan response dengan data
	c.JSON(http.StatusCreated, structs2.SuccessResponse{
		Success: true,
		Message: "Address created successfully",
		Data:    address,
	})
}

func UpdateAddress(c *gin.Context) {
	// ambil user id
	userID, err := helpers2.GetAuthUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, structs2.ErrorResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	// ambil address id & request body
	addressID := c.Param("id")

	var request structs2.AddressUpdateRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs2.ErrorResponse{
			Success: false,
			Message: "Validation Errors",
			Errors:  helpers2.TranslateErrorMessage(err, request),
		})
		return
	}

	// ambil data address berdasarkan address id dan user id
	var address models.Address
	if err := database.DB.Where("id = ? AND user_id = ?", addressID, userID).First(&address).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Address not found",
		})
		return
	}

	// jika request address primary, maka unset false others
	if request.IsPrimary {
		database.DB.Model(&models.Address{}).Where("user_id = ?", userID).Update("is_primary", false)
	}

	// partial update
	structs2.ApplyUpdateAddressRequest(&address, request)

	// save ke database
	database.DB.Save(&address)

	// kembalikan respon dengan data address
	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Address updated successfully",
		Data:    address,
	})
}

// DeleteAddress - Delete an address
func DeleteAddress(c *gin.Context) {
	userId, err := helpers2.GetAuthUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, structs2.ErrorResponse{Success: false, Message: "Unauthorized"})
		return
	}
	addressId := c.Param("id")

	if err := database.DB.Where("id = ? AND user_id = ?", addressId, userId).Delete(&models.Address{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to delete address",
		})
		return
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Address deleted successfully",
	})
}
