package seeders

import (
	models2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"
	"gorm.io/gorm"
)

func SeedRoles(db *gorm.DB) {
	// data role
	roles := []models2.Role{
		{Name: "admin"},
		{Name: "user"},
	}

	for _, role := range roles {
		// insert role into table
		db.FirstOrCreate(&role, models2.Role{Name: role.Name})

		// permission admin
		if role.Name == "admin" {
			var adminPermissions []models2.Permission
			db.Where("name NOT LIKE ?", "customer-%").Find(&adminPermissions)
			db.Model(&role).Association("Permissions").Replace(adminPermissions)
		}

		// permission user
		if role.Name == "user" {
			var userPermissions []models2.Permission
			db.Where("name LIKE ?", "customer-%").Find(&userPermissions)
			db.Model(&role).Association("Permissions").Replace(userPermissions)
		}
	}
}
