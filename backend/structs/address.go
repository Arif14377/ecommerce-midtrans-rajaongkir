package structs

import (
	"github.com/arif14377/ecommerce-midtrans-rajaongkir/models"
)

type AddressCreateRequest struct {
	RecipientName string `json:"recipient_name" binding:"required" label:"Nama penerima"`
	Phone         string `json:"phone" binding:"required" label:"Nomor telepon"`
	AddressLine1  string `json:"address_line1" binding:"required" label:"Alamat lengkap"`
	AddressLine2  string `json:"address_line2" label:"Detail alamat"`
	District      string `json:"district" binding:"required" label:"Kecamatan"`
	DistrictId    string `json:"district_id" binding:"required" label:"Kecamatan"`
	City          string `json:"city" binding:"required" label:"Kota/Kabupaten"`
	CityId        string `json:"city_id" binding:"required" label:"Kota/Kabupaten"`
	Province      string `json:"province" binding:"required" label:"Provinsi"`
	ProvinceId    string `json:"province_id" binding:"required" label:"Provinsi"`
	PostalCode    string `json:"postal_code" binding:"required" label:"Kode pos"`
	IsPrimary     bool   `json:"is_primary" label:"Alamat utama"`
}

type AddressUpdateRequest struct {
	RecipientName string `json:"recipient_name" label:"Nama penerima"`
	Phone         string `json:"phone" label:"Nomor telepon"`
	AddressLine1  string `json:"address_line1" label:"Alamat lengkap"`
	AddressLine2  string `json:"address_line2" label:"Detail alamat"`
	District      string `json:"district" label:"Kecamatan"`
	DistrictId    string `json:"district_id" label:"Kecamatan"`
	City          string `json:"city" label:"Kota/Kabupaten"`
	CityId        string `json:"city_id" label:"Kota/Kabupaten"`
	Province      string `json:"province" label:"Provinsi"`
	ProvinceId    string `json:"province_id" label:"Provinsi"`
	PostalCode    string `json:"postal_code" label:"Kode pos"`
	IsPrimary     bool   `json:"is_primary" label:"Alamat utama"`
}

func ToCreateAddressResponse(userID uint, request AddressCreateRequest) models.Address {
	return models.Address{
		UserId:        userID,
		RecipientName: request.RecipientName,
		Phone:         request.Phone,
		AddressLine1:  request.AddressLine1,
		AddressLine2:  request.AddressLine2,
		District:      request.District,
		DistrictId:    request.DistrictId,
		City:          request.City,
		CityId:        request.CityId,
		Province:      request.Province,
		ProvinceId:    request.ProvinceId,
		PostalCode:    request.PostalCode,
		IsPrimary:     request.IsPrimary,
	}
}

func ApplyUpdateAddressRequest(address *models.Address, request AddressUpdateRequest) {
	// Partial updates
	if request.RecipientName != "" {
		address.RecipientName = request.RecipientName
	}
	if request.Phone != "" {
		address.Phone = request.Phone
	}
	if request.AddressLine1 != "" {
		address.AddressLine1 = request.AddressLine1
	}
	if request.AddressLine2 != "" {
		address.AddressLine2 = request.AddressLine2
	}
	if request.District != "" {
		address.District = request.District
	}
	if request.DistrictId != "" {
		address.DistrictId = request.DistrictId
	}
	if request.City != "" {
		address.City = request.City
	}
	if request.CityId != "" {
		address.CityId = request.CityId
	}
	if request.Province != "" {
		address.Province = request.Province
	}
	if request.ProvinceId != "" {
		address.ProvinceId = request.ProvinceId
	}
	if request.PostalCode != "" {
		address.PostalCode = request.PostalCode
	}
	address.IsPrimary = request.IsPrimary
}
