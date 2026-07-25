package models

import "time"

type Curriculum struct {
	ID          string    `json:"id" gorm:"column:id;primaryKey"`
	Name        string    `json:"name" gorm:"column:name"`
	Description *string   `json:"description" gorm:"column:description"`
	Field       string    `json:"field" gorm:"column:field"`
	IsActive    bool      `json:"isActive" gorm:"column:isActive"`
	CreatedAt   time.Time `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt   time.Time `json:"updatedAt" gorm:"column:updatedAt"`

	Modules []Module `json:"modules,omitempty" gorm:"foreignKey:CurriculumID;references:ID"`
}

func (Curriculum) TableName() string {
	return "curricula"
}


