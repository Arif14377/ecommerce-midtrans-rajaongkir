package publicController

import (
	"net/http"
	"net/url"
	"sort"
	"strconv"
	"strings"

	"github.com/arif14377/ecommerce-midtrans-rajaongkir/helpers"
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/structs"
	"github.com/gin-gonic/gin"
)

// GetProvinces - Fetch provinces from RajaOngkir
func GetProvinces(c *gin.Context) {
	results, err := helpers.RajaOngkirRequest("GET", "/destination/province", nil, "")
	if err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}
	sortRajaOngkirResultsByName(results)

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Provinces fetched",
		Data:    results,
	})
}

// GetCities - Fetch cities by province ID
func GetCities(c *gin.Context) {
	provinceId := c.Param("province_id")
	path := "/destination/city/" + provinceId

	results, err := helpers.RajaOngkirRequest("GET", path, nil, "")
	if err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}
	sortRajaOngkirResultsByName(results)

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Cities fetched",
		Data:    results,
	})
}

// GetDistricts - Fetch districts by city ID
func GetDistricts(c *gin.Context) {
	cityId := c.Param("city_id")
	path := "/destination/district/" + cityId

	results, err := helpers.RajaOngkirRequest("GET", path, nil, "")
	if err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}
	sortRajaOngkirResultsByName(results)

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Districts fetched",
		Data:    results,
	})
}

func sortRajaOngkirResultsByName(results any) {
	items, ok := results.([]any)
	if !ok {
		return
	}

	sort.SliceStable(items, func(i, j int) bool {
		return getRajaOngkirName(items[i]) < getRajaOngkirName(items[j])
	})
}

func getRajaOngkirName(item any) string {
	row, ok := item.(map[string]any)
	if !ok {
		return ""
	}

	for _, field := range []string{"name", "province_name", "city_name", "district_name"} {
		value, ok := row[field].(string)
		if ok {
			return strings.ToLower(strings.TrimSpace(value))
		}
	}

	return ""
}

// CheckCost - Check shipping cost
func CheckCost(c *gin.Context) {
	var req struct {
		Destination string `json:"destination" binding:"required"`
		Weight      int    `json:"weight" binding:"required"`
		Courier     string `json:"courier" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.ErrorResponse{
			Success: false,
			Message: "Invalid request body",
		})
		return
	}
	// Origin District ID: Jagakarsa (Jakarta Selatan) -> ID 1361
	// Komerce API v1 REQUIRES District ID for both origin and destination
	originId := "1361"

	// Komerce v1 Calculate Cost works best with form-urlencoded
	form := url.Values{}
	form.Set("origin", originId)
	form.Set("destination", req.Destination)
	form.Set("weight", strconv.Itoa(req.Weight))
	form.Set("courier", req.Courier)

	results, err := helpers.RajaOngkirRequest("POST", "/calculate/district/domestic-cost", []byte(form.Encode()), "application/x-www-form-urlencoded")

	if err != nil {
		c.JSON(http.StatusInternalServerError, structs.ErrorResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, structs.SuccessResponse{
		Success: true,
		Message: "Costs calculated",
		Data:    results,
	})
}
