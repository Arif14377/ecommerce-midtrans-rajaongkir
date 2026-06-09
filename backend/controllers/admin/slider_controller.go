package adminController

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

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

func CreateSlider(c *gin.Context) {
	var request structs.SliderCreateRequest

	// 1. Validasi Input (Form Data)
	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation Failed",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	// Handle image upload
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "Image is required",
		})
		return
	}

	// Create directory if not exists
	uploadPath := "./public/uploads/sliders"
	if _, err := os.Stat(uploadPath); os.IsNotExist(err) {
		os.MkdirAll(uploadPath, os.ModePerm)
	}

	// Save file
	// Format nama file: timestamp-namafileasli
	fileName := fmt.Sprintf("%d-%s", time.Now().Unix(), file.Filename)
	filePath := filepath.Join(uploadPath, fileName)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to upload image",
		})
		return
	}

	// Simpan ke database
	slider := models.Slider{
		Image: fileName,
		Link:  request.Link,
	}

	if err := database.DB.Create(&slider).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to create slider",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	c.JSON(http.StatusCreated, structs.SuccessResponse{
		Success: true,
		Message: "Slider Created Successfully",
		Data:    slider,
	})
}
