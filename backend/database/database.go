package database

import (
	"fmt"
	"log"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/config"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	// load konfigurasi db dari .env
	dbUser := config.GetEnv("DB_USER")
	dbPassword := config.GetEnv("DB_PASSWORD")
	dbHost := config.GetEnv("DB_HOST")
	dbPort := config.GetEnv("DB_PORT")
	dbName := config.GetEnv("DB_NAME")

	// format dsn untuk mysql
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPassword, dbHost, dbPort, dbName)

	// koneksi ke database
	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v\n", err)
	}

	log.Printf("Database connected successfully\n")

	// Auto migrate models
	err = DB.AutoMigrate(
		&models.User{},
		&models.Role{},
		&models.Permission{},
		&models.Category{},
		&models.Slider{},
		&models.Product{},
		&models.ProductImage{},
		&models.Review{},
		&models.Address{},
		&models.Order{},
		&models.OrderItem{},
		&models.Cart{},
		&models.Payment{},
	)

	if err != nil {
		log.Printf("Failed to migrate database: %v", err)
	}

	log.Printf("Database migrated successfully.")
}
