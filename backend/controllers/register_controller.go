package controllers

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	var req structs.RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation Errors",
			Errors:  helpers.TranslateErrorMessage(err, req),
		})
		return
	}

	var existingUser models.User
	if err := database.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "Email already registered",
			Errors:  map[string]string{"email": "Email is already in use"},
		})
		return
	}

	hashedPassword, err := helpers.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to has password",
		})
		return
	}

	user := models.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: hashedPassword,
		Username: helpers.Slugify(req.Name),
	}

	var role models.Role
	if err := database.DB.Where("name = ?", "user").First(&role).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Role 'user' not found.",
		})
		return
	}

	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to create user.",
		})
		return
	}

	database.DB.Model(&user).Association("Roles").Append(&role)

	c.JSON(http.StatusCreated, structs.SuccessResponse{
		Success: true,
		Message: "Registration successful",
		Data:    user,
	})
}
