package helpers

import "golang.org/x/crypto/bcrypt"

// HashPassword mengubah password plain text menjadi hash bcrypt.
//
// Hash yang dihasilkan aman untuk disimpan di database.
//
// Contoh:
//
//	hashed, err := helpers.HashPassword("secret123")
func HashPassword(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashed), nil
}

// CheckPasswordHash membandingkan password plain text dengan hash bcrypt.
//
// Function ini mengembalikan true jika password cocok dengan hash.
//
// Contoh:
//
//	isValid := helpers.CheckPasswordHash("secret123", user.Password)
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
