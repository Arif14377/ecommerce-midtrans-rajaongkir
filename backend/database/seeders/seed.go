package seeders

import (
	"log"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
)

func Seed() {
	db := database.DB
	if db == nil {
		log.Printf("Database connection is nil, skipping seeding.\n")
		return
	}

	log.Printf("Running database seeders...\n")

	// 1. Permissions (Harus duluan)
	log.Printf("Seeding permissions...\n")
	SeedPermissions(db)

	// 2. Roles (Butuh Permissions)
	log.Printf("Seeding roles...\n")
	SeedRoles(db)

	// 3. Users (Butuh Roles)
	log.Printf("Seeding users...\n")
	SeedUsers(db)

	log.Printf("Database seeding completed!\n")
}
