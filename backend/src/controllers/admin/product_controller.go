package adminController

import (
	"net/http"
	"strconv"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/database"
	helpers2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/helpers"
	models2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/models"
	structs2 "github.com/arif14377/ecommerce-midtrans-rajaongkir/src/structs"
	"github.com/gin-gonic/gin"
)

func FindProducts(c *gin.Context) {
	var products []models2.Product
	var total int64

	search, page, limit, offset := helpers2.GetPaginationParams(c)
	baseURL := helpers2.BuildBaseURL(c)
	hostURL := helpers2.BuildHostURL(c)

	query := database.DB.Model(&models2.Product{}).Preload("Category").Preload("Images")
	if search != "" {
		query = query.Where("name LIKE ?", "%"+search+"%")
	}

	if err := query.Order("id desc").Limit(limit).Offset(offset).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to fetch products",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	var data []structs2.ProductResponse
	for _, p := range products {
		data = append(data, structs2.ToProductResponseWithBaseURL(p, hostURL))
	}

	helpers2.PaginateResponse(c, data, total, page, limit, baseURL, search, "List Data Product")
}

// Create Product
func CreateProduct(c *gin.Context) {
	var request structs2.ProductCreateRequest

	// Gunakan ShouldBind agar support multipart/form-data dan validasi struct
	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs2.ErrorResponse{
			Success: false,
			Message: "Validation Failed",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	// Buat Slug
	slug := helpers2.Slugify(request.Name)

	product := models2.Product{
		Name:        request.Name,
		Slug:        slug,
		Description: request.Description,
		Price:       request.Price,
		Stock:       request.Stock,
		CategoryId:  request.CategoryId,
	}

	// Simpan Product
	if err := database.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to create product",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	form, _ := c.MultipartForm()
	files := form.File["images[]"]

	if len(files) > 0 {
		config := structs2.UploadConfig{
			AllowedTypes:   []string{".jpg", ".jpeg", ".png", ".webp"},
			MaxSize:        2 * 1024 * 1024, // 2MB
			DestinationDir: "./public/uploads/products",
		}

		for i, file := range files {
			config.File = file
			res := helpers2.UploadFile(c, config)
			if res.Response == nil {
				// Simpan ke DB
				productImage := models2.ProductImage{
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

	c.JSON(http.StatusCreated, structs2.SuccessResponse{
		Success: true,
		Message: "Product Created Successfully",
		Data:    structs2.ToProductResponse(product),
	})
}

// Menampilkan detail produk
func GetProductDetail(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var product models2.Product

	if err := database.DB.Preload("Category").Preload("Images").First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Product Not Found",
		})
		return
	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Product Detail",
		Data:    structs2.ToProductResponse(product),
	})
}

func UpdateProduct(c *gin.Context) {
	// ambil param id, siapkan models product
	id, _ := strconv.Atoi(c.Param("id"))
	var product models2.Product

	// cari product di db
	if err := database.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Product not found.",
		})
		return
	}

	// binding data request
	var request structs2.ProductCreateRequest

	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusUnprocessableEntity, structs2.ErrorResponse{
			Success: false,
			Message: "Validation Failed",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	// update data produk
	product.Name = request.Name
	product.Slug = helpers2.Slugify(request.Name)
	product.Description = request.Description
	product.Price = request.Price
	product.Stock = request.Stock
	product.CategoryId = request.CategoryId

	// simpan data update ke db
	if err := database.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to update product",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return
	}

	// handle image upload (append jika ada foto baru)
	form, _ := c.MultipartForm()
	files := form.File["images[]"]

	if len(files) > 0 {
		config := structs2.UploadConfig{
			AllowedTypes:   []string{".jpg", ".jpeg", ".png", ".webp"},
			MaxSize:        2 * 1024 * 1024,
			DestinationDir: "./public/uploads/products",
		}

		for _, file := range files {
			config.File = file
			res := helpers2.UploadFile(c, config)
			if res.Response == nil {
				imageURL := res.FileName
				productImage := models2.ProductImage{
					ProductId: product.Id,
					ImageUrl:  imageURL,
				}
				database.DB.Create(&productImage)
			}
		}
	}

	database.DB.Preload("Category").Preload("Images").First(&product, id)

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Product Updated Successfully",
		Data:    structs2.ToProductResponse(product),
	})

}

func DeleteProduct(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	var product models2.Product

	// Ambil product beserta images dan reviews
	if err := database.DB.
		Preload("Images").
		Preload("Reviews").
		First(&product, id).Error; err != nil {

		c.JSON(http.StatusNotFound, structs2.ErrorResponse{
			Success: false,
			Message: "Product Not Found",
		})

	}

	// Hapus file image dari storage
	for _, image := range product.Images {
		filePath := "./public/uploads/products/" + image.ImageUrl
		_ = helpers2.RemoveFile(filePath)
	}

	// Hapus product beserta relasinya
	if err := database.DB.Select("Images", "Reviews").Delete(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs2.ErrorResponse{
			Success: false,
			Message: "Failed to delete product",
			Errors:  helpers2.TranslateErrorMessage(err, nil),
		})
		return

	}

	c.JSON(http.StatusOK, structs2.SuccessResponse{
		Success: true,
		Message: "Product Deleted Successfully",
	})
}
