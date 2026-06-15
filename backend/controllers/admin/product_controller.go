package adminController

import (
	"net/http"
	"strconv"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/database"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
	"github.com/gin-gonic/gin"
)

func FindProducts(c *gin.Context) {
	var products []models.Product
	var total int64

	search, page, limit, offset := helpers.GetPaginationParams(c)
	baseURL := helpers.BuildBaseURL(c)
	hostURL := helpers.BuildHostURL(c)

	query := database.DB.Model(&models.Product{}).Preload("Category").Preload("Images")
	if search != "" {
		query = query.Where("name LIKE ?", "%"+search+"%")
	}

	if err := query.Order("id desc").Limit(limit).Offset(offset).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to fetch products",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	var data []structs.ProductResponse
	for _, p := range products {
		data = append(data, structs.ToProductResponseWithBaseURL(p, hostURL))
	}

	helpers.PaginateResponse(c, data, total, page, limit, baseURL, search, "List Data Product")
}

// Create Product
func CreateProduct(c *gin.Context) {
	var request structs.ProductCreateRequest

	// Gunakan ShouldBind agar support multipart/form-data dan validasi struct
	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs.ErrorResponse{
			Success: false,
			Message: "Validation Failed",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	// Buat Slug
	slug := helpers.Slugify(request.Name)

	product := models.Product{
		Name:        request.Name,
		Slug:        slug,
		Description: request.Description,
		Price:       request.Price,
		Stock:       request.Stock,
		CategoryId:  request.CategoryId,
	}

	// Simpan Product
	if err := database.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: "Failed to create product",
			Errors:  helpers.TranslateErrorMessage(err, nil),
		})
		return
	}

	form, _ := c.MultipartForm()
	files := form.File["images[]"]

	if len(files) > 0 {
		config := structs.UploadConfig{
			AllowedTypes:   []string{".jpg", ".jpeg", ".png", ".webp"},
			MaxSize:        2 * 1024 * 1024, // 2MB
			DestinationDir: "./public/uploads/products",
		}

		for i, file := range files {
			config.File = file
			res := helpers.UploadFile(c, config)
			if res.Response == nil {
				// Simpan ke DB
				productImage := models.ProductImage{
					ProductId: product.Id,
					ImageUrl:  res.FileName,
				}

				if i == 0 {
					productImage.IsPrimary = true
				} else {
					productImage.IsPrimary = false
				}

				database.DB.Create(&productImage)
			}
		}
	}

	// Reload product dengan relasi
	database.DB.Preload("Category").Preload("Images").First(&product, product.Id)

	c.JSON(http.StatusCreated, structs.SuccessResponse{
		Success: true,
		Message: "Product Created Successfully",
		Data:    structs.ToProductResponse(product),
	})
}

// Menampilkan detail produk
func GetProductDetail(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var product models.Product

	if err := database.DB.Preload("Category").Preload("Images").First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.ErrorResponse{
			Success: false,
			Message: "Product Not Found",
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Product Detail",
		Data:    structs.ToProductResponse(product),
	})
}
