package helpers

import (
	"errors"
	"time"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/config"
	"github.com/golang-jwt/jwt/v5"
)

func getJWTKey() ([]byte, error) {
	secret := config.GetEnv("JWT_SECRET")
	if secret == "" {
		return nil, errors.New("JWT_SECRET is not configured")
	}

	return []byte(secret), nil
}

// GenerateToken membuat JWT untuk username dengan masa berlaku 24 jam.
//
// Username disimpan sebagai subject claim pada token.
//
// Contoh:
//
//	token, err := helpers.GenerateToken(user.Username)
func GenerateToken(username string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	jwtKey, err := getJWTKey()
	if err != nil {
		return "", err
	}

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
	jwtKey, err := getJWTKey()
	if err != nil {
		return nil, err
	}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) {
		return jwtKey, nil
	})

	return token, err
}
