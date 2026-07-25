package main

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Module struct {
	ID           string    `gorm:"primaryKey"`
	Name         string
	Description  *string
	CurriculumID string    `gorm:"column:curriculumId"`
	Order        int       `gorm:"column:order"`
	IsActive     bool      `gorm:"column:isActive"`
	CreatedAt    time.Time `gorm:"column:createdAt"`
	UpdatedAt    time.Time `gorm:"column:updatedAt"`
}

func main() {
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Println("Error loading .env file")
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	description := "Fundamentals of clinical medicine and practice."
	module := Module{
		ID:           "cmv1234567890abcdefghijklm",
		Name:         "Clinical Foundations",
		Description:  &description,
		CurriculumID: "cmohjow6t0000uf1sabwkkvng", // From the test curriculum
		Order:        1,
		IsActive:     true,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := db.Create(&module).Error; err != nil {
		log.Fatal("Failed to create module:", err)
	}

	log.Println("Successfully seeded module!")
}
