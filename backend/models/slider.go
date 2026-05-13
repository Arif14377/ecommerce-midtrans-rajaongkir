package models

import "time"

type Slider struct {
	Id        uint      `json:"id" gorm:"primaryKey"`
	Image     string    `json:"image" gorm:"type:varchar(255)"`
	Link      string    `json:"link" gorm:"type:varchar(255)"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
