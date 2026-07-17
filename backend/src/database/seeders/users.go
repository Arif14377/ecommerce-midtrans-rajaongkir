package seeders

import (
	models2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedUsers(db *gorm.DB) {
	// hash password default "password"
	password, _ := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)

	var adminRole models2.Role
	db.Where("name = ?", "admin").First(&adminRole)

	users := []models2.User{
		{
			Name:     "Admin Toko",
			Username: "admin",
			Email:    "admin@toko.com",
			Password: string(password),
			Roles:    []models2.Role{adminRole},
		},
	}

	for _, u := range users {
		var user models2.User

		if err := db.Where("username = ?", u.Username).First(&user).Error; err != nil {
			db.Create(&u)
		} else {
			// Jika sudah ada, update info dasar (password reset ke default jika seed dijalankan ulang)
			db.Model(&user).Updates(models2.User{
				Name:     u.Name,
				Email:    u.Email,
				Password: string(password),
			})
			// Update juga relasi Role-nya
			db.Model(&user).Association("Roles").Replace(u.Roles)
		}
	}

}
