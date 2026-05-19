package structs

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
