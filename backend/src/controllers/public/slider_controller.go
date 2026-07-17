package publicController

import (
	"fmt"
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"
	structs2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/structs"
	"github.com/gin-gonic/gin"
)

func ListSliders(c *gin.Context) {
	var sliders []models.Slider

	if err := database.DB.Order("id desc").Find(&sliders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to fetch sliders",
		})
		return
	}

	sliderResponses := []structs2.SliderResponse{}
	for _, s := range sliders {
		sliderResponses = append(sliderResponses, structs2.SliderResponse{
			Id:    s.Id,
			Image: fmt.Sprintf("%s/uploads/sliders/%s", helpers.BuildHostURL(c), s.Image),
			Link:  s.Link,
		})
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "List of sliders",
		Data:    sliderResponses,
	})
}
