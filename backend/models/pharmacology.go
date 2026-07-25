package models

import "time"

type DrugClass struct {
	ID          string    `json:"id" gorm:"column:id;primaryKey"`
	Name        string    `json:"name" gorm:"column:name"`
	Description *string   `json:"description" gorm:"column:description"`
	Category    string    `json:"category" gorm:"column:category"`
	CreatedAt   time.Time `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt   time.Time `json:"updatedAt" gorm:"column:updatedAt"`
	Drugs       []Drug    `json:"drugs,omitempty" gorm:"foreignKey:DrugClassID"`
}

func (DrugClass) TableName() string {
	return "drug_classes"
}

type Drug struct {
	ID                         string     `json:"id" gorm:"column:id;primaryKey"`
	Name                       string     `json:"name" gorm:"column:name"`
	GenericName                *string    `json:"genericName" gorm:"column:genericName"`
	BrandNames                 string     `json:"brandNames" gorm:"column:brandNames"`
	DrugClassID                string     `json:"drugClassId" gorm:"column:drugClassId"`
	Description                *string    `json:"description" gorm:"column:description"`
	Mechanism                  *string    `json:"mechanism" gorm:"column:mechanism"`
	Indications                string     `json:"indications" gorm:"column:indications"`
	DosageAdult                *string    `json:"dosageAdult" gorm:"column:dosageAdult"`
	DosagePediatric            *string    `json:"dosagePediatric" gorm:"column:dosagePediatric"`
	DosageElderly              *string    `json:"dosageElderly" gorm:"column:dosageElderly"`
	AdministrationRoute        *string    `json:"administrationRoute" gorm:"column:administrationRoute"`
	AdministrationTiming       *string    `json:"administrationTiming" gorm:"column:administrationTiming"`
	AdministrationInstructions *string    `json:"administrationInstructions" gorm:"column:administrationInstructions"`
	Contraindications          string     `json:"contraindications" gorm:"column:contraindications"`
	Warnings                   string     `json:"warnings" gorm:"column:warnings"`
	SideEffectsCommon          string     `json:"sideEffectsCommon" gorm:"column:sideEffectsCommon"`
	SideEffectsSerious         string     `json:"sideEffectsSerious" gorm:"column:sideEffectsSerious"`
	SideEffectsRare            string     `json:"sideEffectsRare" gorm:"column:sideEffectsRare"`
	Interactions               string     `json:"interactions" gorm:"column:interactions"`
	Monitoring                 string     `json:"monitoring" gorm:"column:monitoring"`
	Storage                    *string    `json:"storage" gorm:"column:storage"`
	Pregnancy                  *string    `json:"pregnancy" gorm:"column:pregnancy"`
	Absorption                 *string    `json:"absorption" gorm:"column:absorption"`
	Distribution               *string    `json:"distribution" gorm:"column:distribution"`
	Metabolism                 *string    `json:"metabolism" gorm:"column:metabolism"`
	Elimination                *string    `json:"elimination" gorm:"column:elimination"`
	HalfLife                   *string    `json:"halfLife" gorm:"column:halfLife"`
	IsActive                   bool       `json:"isActive" gorm:"column:isActive"`
	CreatedAt                  time.Time  `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt                  time.Time  `json:"updatedAt" gorm:"column:updatedAt"`
	DrugClass                  *DrugClass `json:"drugClass,omitempty" gorm:"foreignKey:DrugClassID"`
}

func (Drug) TableName() string {
	return "drugs"
}
