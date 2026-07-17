package helpers

import (
	"time"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/config"
	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte(config.GetEnv("JWT_SECRET"))

// GenerateToken membuat JWT untuk username dengan masa berlaku 24 jam.
//
// Username disimpan sebagai subject claim pada token.
//
// Contoh:
//
//	token, err := helpers.GenerateToken(user.Username)
func GenerateToken(username string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)

	claims := &jwt.RegisteredClaims{
		Subject:   username,
		ExpiresAt: jwt.NewNumericDate(expirationTime),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// VerifyToken memverifikasi JWT dan mengembalikan token hasil parsing.
//
// Function ini menggunakan JWT_SECRET yang sama dengan GenerateToken.
//
// Contoh:
//
//	token, err := helpers.VerifyToken(tokenString)
func VerifyToken(tokenString string) (*jwt.Token, error) {
	claims := &jwt.RegisteredClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) {
		return jwtKey, nil
	})

	return token, err
}
