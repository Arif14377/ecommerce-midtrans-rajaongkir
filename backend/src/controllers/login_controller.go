package controllers

import (
	"net/http"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/database"
	helpers2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"
	structs2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/structs"
	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	req := structs2.LoginRequest{}
	user := models.User{}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs2.ErrorResponse{
			Success: false,
			Message: "Validation Errors",
			Errors:  helpers2.TranslateErrorMessage(err, req),
		})
		return
	}

	if err := database.DB.Preload("Roles").Preload("Roles.Permissions").Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, structs2.ErrorResponse{
			Success: false,
			Message: "User Not Found",
			Errors:  map[string]string{"email": "User not found or invalid credentials"},
		})
		return
	}

	if !helpers2.CheckPasswordHash(req.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, structs2.ErrorResponse{
			Success: false,
			Message: "Invalid Password",
			Errors:  map[string]string{"password": "Invalid password"},
		})
		return
	}

	token, err := helpers2.GenerateToken(user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to generate token",
		})
		return
	}

	permissionMap := helpers2.GetPermissionMap(user.Roles)

	userResponse := structs2.ToUserLoginResponse(user, permissionMap)

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Login Success",
		Data: structs2.LoginResponse{
			Token: token,
			User:  userResponse,
		},
	})

}
