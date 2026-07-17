package helpers

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	structs2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/structs"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// UploadFile memvalidasi dan menyimpan file upload berdasarkan konfigurasi.
//
// Function ini mengecek file wajib ada, ukuran maksimum, extension yang
// diperbolehkan, membuat folder tujuan jika belum ada, lalu menyimpan file
// dengan nama UUID.
//
// Contoh:
//
//	result := helpers.UploadFile(c, structs.UploadConfig{
//		File: file,
//		DestinationDir: "uploads/products",
//		AllowedTypes: []string{".jpg", ".jpeg", ".png"},
//		MaxSize: 2 << 20,
//	})
func UploadFile(c *gin.Context, config structs2.UploadConfig) structs2.UploadResult {
	if config.File == nil {
		return structs2.UploadResult{
			Response: &structs2.ErrorResponse{
				Success: false,
				Message: "File is required",
				Errors:  map[string]string{"file": "No file was uploaded."},
			},
		}
	}

	if config.File.Size > config.MaxSize {
		return structs2.UploadResult{
			Response: &structs2.ErrorResponse{
				Success: false,
				Message: "File too large.",
				Errors:  map[string]string{"file": fmt.Sprintf("Maximum file size is %dMb", config.MaxSize/(1<<20))},
			},
		}
	}

	ext := strings.ToLower(filepath.Ext(config.File.Filename))
	allowed := false
	for _, t := range config.AllowedTypes {
		if ext == t {
			allowed = true
			break
		}
	}

	if !allowed {
		return structs2.UploadResult{
			Response: &structs2.ErrorResponse{
				Success: false,
				Message: "Invalid file type",
				Errors:  map[string]string{"file": fmt.Sprintf("Allowed file types: %v", config.AllowedTypes)},
			},
		}
	}

	uuidName := uuid.New().String()
	filename := uuidName + ext
	filePath := filepath.Join(config.DestinationDir, filename)

	if err := os.MkdirAll(config.DestinationDir, 0755); err != nil {
		return structs2.UploadResult{
			Response: &structs2.ErrorResponse{
				Success: false,
				Message: "Failed to create upload directory",
				Errors:  map[string]string{"system": err.Error()},
			},
		}
	}

	if err := c.SaveUploadedFile(config.File, filePath); err != nil {
		return structs2.UploadResult{
			Response: &structs2.ErrorResponse{
				Success: false,
				Message: "Failed to save file",
				Errors:  map[string]string{"file": err.Error()},
			},
		}
	}

	return structs2.UploadResult{
		FileName: filename,
		FilePath: filePath,
	}

}

// RemoveFile menghapus file dari filesystem berdasarkan path.
//
// Function ini mengembalikan error dari os.Remove jika file gagal dihapus.
//
// Contoh:
//
//	err := helpers.RemoveFile("uploads/products/image.png")
func RemoveFile(filePath string) error {
	return os.Remove(filePath)
}
