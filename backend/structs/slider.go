package structs

import "mime/multipart"

type SliderCreateRequest struct {
	Link  string                `form:"link"`
	Image *multipart.FileHeader `form:"image" binding:"required"`
}

type SliderResponse struct {
	Id    uint   `json:"id"`
	Image string `json:"image"`
	Link  string `json:"link"`
}
