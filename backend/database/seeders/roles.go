package seeders

import (
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"gorm.io/gorm"
)

func SeedRoles(db *gorm.DB) {
	// data role
	roles := []models.Role{
		{Name: "admin"},
		{Name: "user"},
	}

	for _, role := range roles {
		// insert role into table
		db.FirstOrCreate(&role, models.Role{Name: role.Name})

		// permission admin
		if role.Name == "admin" {
			var adminPermissions []models.Permission
			db.Where("name NOT LIKE ?", "customer-%").Find(&adminPermissions)
			db.Model(&role).Association("Permissions").Replace(adminPermissions)
		}

		// permission user
		if role.Name == "user" {
			var userPermissions []models.Permission
			db.Where("name LIKE ?", "customer-%").Find(&userPermissions)
			db.Model(&role).Association("Permissions").Replace(userPermissions)
		}
	}
}
