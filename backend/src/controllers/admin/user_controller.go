package adminController

import (
	"net/http"
	"strconv"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/database"
	helpers2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/helpers"
	models2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"
	structs2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/structs"
	"github.com/gin-gonic/gin"
)

func FindUsers(c *gin.Context) {
	var users []models2.User
	var total int64

	search, page, limit, offset := helpers2.GetPaginationParams(c)
	baseURL := helpers2.BuildBaseURL(c)

	query := database.DB.Model(&models2.User{})
	if search != "" {
		query = query.Where("name LIKE ? OR username LIKE ? OR email LIKE ?", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to count users",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	if err := query.Preload("Roles").Order("id desc").Limit(limit).Offset(offset).Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to fetch users",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	var data []structs2.UserDetailResponse
	for _, u := range users {
		var userRoles []structs2.RoleResponse
		for _, r := range u.Roles {
			userRoles = append(userRoles, structs2.RoleResponse{
				Id:   r.Id,
				Name: r.Name,
			})
		}

		data = append(data, structs2.UserDetailResponse{
			Id:       u.Id,
			Name:     u.Name,
			Username: u.Username,
			Email:    u.Email,
			Roles:    userRoles,
		})
	}

	helpers2.PaginateResponse(c, data, total, page, limit, baseURL, search, "List Data User.")
}

func CreateUser(c *gin.Context) {
	var request structs2.UserCreateRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs2.ErrorResponse{
			Success: false,
			Message: "Validation failed.",
			Errors:  helpers2.TranslateErrorMessage(err, request),
		})
		return
	}

	hashedPassword, err := helpers2.HashPassword(request.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to hash password",
		})
		return
	}

	user := models2.User{
		Name:     request.Name,
		Username: request.Username,
		Email:    request.Email,
		Password: hashedPassword,
	}

	var roles []models2.Role
	if len(request.RoleIDs) > 0 {
		database.DB.Where("id in ?", request.RoleIDs).Find(&roles)
	}
	user.Roles = roles

	if err := database.DB.Create(&user).Error; err != nil {
		if helpers2.IsDuplicateEntryError(err) {
			c.JSON(http.StatusConflict, structs2.ErrorResponse{
				Success: false,
				Message: "Create User Failed",
				Errors:  helpers2.TranslateErrorMessage(err, nil),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to create user.",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	c.JSON(http.StatusCreated, structs2.SuccessResponse{
		Success: true,
		Message: "User created successfully",
		Data: gin.H{
			"id":       user.Id,
			"name":     user.Name,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}

func UpdateUser(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var user models2.User
	var req structs2.UserUpdateRequest

	if err := database.DB.Preload("Roles").First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "User not found",
		})
		return
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs2.ErrorResponse{
			Success: false,
			Message: "Validation Failed",
			Errors:  helpers2.TranslateErrorMessage(err, req),
		})
		return
	}

	// ganti data lama dengan data baru
	user.Name = req.Name
	user.Username = req.Username
	user.Email = req.Email

	if req.Password != "" {
		hashed, err := helpers2.HashPassword(req.Password)
		if err == nil {
			user.Password = hashed
		}
	}

	var newRoles []models2.Role
	if len(req.RoleIDs) > 0 {
		database.DB.Where("id IN ?", req.RoleIDs).Find(&newRoles)
	}

	if err := database.DB.Model(&user).Association("Roles").Replace(newRoles); err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to update user roles",
		})
		return
	}

	// simpan user
	if err := database.DB.Save(&user).Error; err != nil {
		if helpers2.IsDuplicateEntryError(err) {
			c.JSON(http.StatusConflict, structs2.ErrorResponse{
				Success: false,
				Message: "Update User Failed (Duplicate Data)",
				Errors:  helpers2.TranslateErrorMessage(err, nil),
			})
			return
		}
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to update user",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "User Updated Successfully",
	})

}

func GetUserDetail(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var user models2.User

	if err := database.DB.Preload("Roles").First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "User Not Found",
		})
		return
	}

	var userRoles []structs2.RoleResponse
	for _, r := range user.Roles {
		userRoles = append(userRoles, structs2.RoleResponse{
			Id:   r.Id,
			Name: r.Name,
		})
	}

	res := structs2.UserDetailResponse{
		Id:       user.Id,
		Name:     user.Name,
		Username: user.Username,
		Email:    user.Email,
		Roles:    userRoles,
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "User Detail",
		Data:    res,
	})
}

// DeleteUser
func DeleteUser(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var user models2.User

	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "User Not Found",
		})
		return
	}

	if err := database.DB.Select("Roles").Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to delete user",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "User Deleted Successfully",
	})
}
