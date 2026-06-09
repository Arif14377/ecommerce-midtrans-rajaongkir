package adminController

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
	"github.com/gin-gonic/gin"
)

func FindSliders(c *gin.Context) {
	var sliders []models.Slider

	if err := database.DB.Order("id desc").Find(&sliders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to fetch sliders",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	// Transform image URLs
	sliderResponses := []structs.SliderResponse{}
	for _, s := range sliders {
		sliderResponses = append(sliderResponses, structs.SliderResponse{
			Id:    s.Id,
			Image: s.Image,
			Link:  s.Link,
		})
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "List Data Sliders",
		Data:    sliderResponses,
	})
}
