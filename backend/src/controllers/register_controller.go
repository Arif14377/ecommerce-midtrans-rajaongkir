package controllers

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/database"
	helpers2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/helpers"
	models2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"
	structs2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/structs"
	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	var req structs2.RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs2.ErrorResponse{
			Success: false,
			Message: "Validation Errors",
			Errors:  helpers2.TranslateErrorMessage(err, req),
		})
		return
	}

	var existingUser models2.User
	if err := database.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, structs2.ErrorResponse{
			Success: false,
			Message: "Email already registered",
			Errors:  map[string]string{"email": "Email is already in use"},
		})
		return
	}

	hashedPassword, err := helpers2.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to has password",
		})
		return
	}

	user := models2.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: hashedPassword,
		Username: helpers2.Slugify(req.Name),
	}

	var role models2.Role
	if err := database.DB.Where("name = ?", "user").First(&role).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Role 'user' not found.",
		})
		return
	}

	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to create user.",
		})
		return
	}

	database.DB.Model(&user).Association("Roles").Append(&role)

	c.JSON(http.StatusCreated, structs2.SuccessResponse{
		Success: true,
		Message: "Registration successful",
		Data:    user,
	})
}
