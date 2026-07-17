package helpers

import (
	"net/http"
	"reflect"
	"strconv"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/src/structs"
	"github.com/gin-gonic/gin"
)

type PaginationLink struct {
	URL    string `json:"url"`
	Label  string `json:"label"`
	Active bool   `json:"active"`
}

// StringToInt mengubah string menjadi int positif.
//
// Jika string kosong, bukan angka, atau nilainya kurang dari 1, function ini
// mengembalikan nilai default 1.
//
// Contoh:
//
//	page := helpers.StringToInt("2")
//	invalidPage := helpers.StringToInt("abc") // hasil: 1
func StringToInt(str string) int {
	i, err := strconv.Atoi(str)
	if err != nil || i < 1 {
		return 1
	}
	return i
}

// TotalPage menghitung jumlah halaman berdasarkan total data dan jumlah data
// per halaman.
//
// Contoh:
//
//	lastPage := helpers.TotalPage(25, 10) // hasil: 3
func TotalPage(total int64, perPage int) int {
	if perPage == 0 {
		return 1
	}
	pages := int(total) / perPage
	if int(total)%perPage != 0 {
		pages++
	}
	return pages
}

// BuildPaginationLinks membuat daftar link pagination untuk response API.
//
// Link yang dibuat mencakup previous, nomor halaman, dan next. Parameter search
// akan ikut ditambahkan ke query string jika nilainya tidak kosong.
//
// Contoh:
//
//	links := helpers.BuildPaginationLinks(1, 3, "http://localhost:8080/admin/permissions", "role")
func BuildPaginationLinks(currentPage, lastPage int, baseURL, search string) []PaginationLink {
	links := []PaginationLink{}

	var prevURL string
	if currentPage > 1 {
		prevURL = PageURL(baseURL, currentPage-1, lastPage, search)
	}

	links = append(links, PaginationLink{
		URL:    prevURL,
		Label:  "&laquo; Previous",
		Active: false,
	})

	for i := 1; i <= lastPage; i++ {
		links = append(links, PaginationLink{
			URL:    baseURL + "?page=" + strconv.Itoa(i) + QueryString(search),
			Label:  strconv.Itoa(i),
			Active: i == currentPage,
		})
	}

	var nextURL string
	if currentPage < lastPage {
		nextURL = PageURL(baseURL, currentPage+1, lastPage, search)
	}

	links = append(links, PaginationLink{
		URL:    nextURL,
		Label:  "Next &raquo;",
		Active: false,
	})

	return links
}

// PageURL membuat URL halaman tertentu untuk pagination.
//
// Jika page berada di luar rentang 1 sampai lastPage, function ini
// mengembalikan string kosong.
//
// Contoh:
//
//	url := helpers.PageURL("http://localhost:8080/admin/permissions", 2, 5, "role")
func PageURL(baseURL string, page, lastPage int, search string) string {
	if page < 1 || page > lastPage {
		return ""
	}
	return baseURL + "?page=" + strconv.Itoa(page) + QueryString(search)
}

// QueryString membuat tambahan query string untuk parameter search.
//
// Jika search kosong, function ini mengembalikan string kosong.
//
// Contoh:
//
//	query := helpers.QueryString("admin") // hasil: "&search=admin"
func QueryString(search string) string {
	if search == "" {
		return ""
	}
	return "&search=" + search
}

// GetPaginationParams mengambil parameter pagination dari query request Gin.
//
// Function ini membaca search, page, dan limit dari URL, lalu menghitung offset
// untuk query database.
//
// Contoh:
//
//	search, page, limit, offset := helpers.GetPaginationParams(c)
func GetPaginationParams(c *gin.Context) (search string, page, limit, offset int) {
	search = c.Query("search")
	page = StringToInt(c.DefaultQuery("page", "1"))
	limit = StringToInt(c.DefaultQuery("limit", "10"))
	offset = (page - 1) * limit
	return
}

// BuildBaseURL membuat URL lengkap request saat ini tanpa query string.
//
// Function ini membaca scheme dari header X-Forwarded-Proto atau dari TLS
// request, lalu menggabungkannya dengan host dan path.
//
// Contoh:
//
//	baseURL := helpers.BuildBaseURL(c)
//	// hasil contoh: "http://localhost:8080/admin/permissions"
func BuildBaseURL(c *gin.Context) string {
	scheme := c.Request.Header.Get("X-Forwarded-Proto")
	if scheme == "" {
		if c.Request.TLS != nil {
			scheme = "https"
		} else {
			scheme = "http"
		}
	}
	return scheme + "://" + c.Request.Host + c.Request.URL.Path
}

// BuildHostURL membuat URL host aplikasi tanpa path dan query string.
//
// Function ini berguna saat perlu membuat URL absolut menuju asset atau route
// lain dari host yang sama.
//
// Contoh:
//
//	hostURL := helpers.BuildHostURL(c)
//	// hasil contoh: "http://localhost:8080"
func BuildHostURL(c *gin.Context) string {
	scheme := c.Request.Header.Get("X-Forwarded-Proto")
	if scheme == "" {
		if c.Request.TLS != nil {
			scheme = "https"
		} else {
			scheme = "http"
		}
	}
	return scheme + "://" + c.Request.Host
}

// PaginateResponse mengirim response JSON berisi data dan metadata pagination.
//
// Function ini menghitung last_page, from, to, link previous/next, dan struktur
// pagination lain yang dibutuhkan client.
//
// Contoh:
//
//	helpers.PaginateResponse(c, users, total, page, limit, baseURL, search, "List Data Users")
func PaginateResponse(c *gin.Context, data any, total int64, page, limit int, baseURL, search, message string) {
	lastPage := TotalPage(total, limit)

	dataLen := reflect.ValueOf(data).Len()
	var from, to int
	if dataLen > 0 {
		from = (page-1)*limit + 1
		to = from + dataLen - 1
	} else {
		from = 0
		to = 0
	}

	links := BuildPaginationLinks(page, lastPage, baseURL, search)

	var prevPageURL, nextPageURL string
	if page > 1 {
		prevPageURL = PageURL(baseURL, page-1, lastPage, search)
	}
	if page < lastPage {
		nextPageURL = PageURL(baseURL, page+1, lastPage, search)
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: message,
		Data: gin.H{
			"current_page":   page,
			"data":           data,
			"first_page_url": baseURL + "?page=1" + QueryString(search),
			"from":           from,
			"last_page":      lastPage,
			"last_page_url":  baseURL + "?page=" + strconv.Itoa(lastPage) + QueryString(search),
			"links":          links,
			"next_page_url":  nextPageURL,
			"path":           baseURL,
			"per_page":       limit,
			"prev_page_url":  prevPageURL,
			"to":             to,
			"total":          total,
		},
	})
}
