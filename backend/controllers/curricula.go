package controllers

import (
	"synapsemed-backend/database"
	"synapsemed-backend/models"

	"github.com/gofiber/fiber/v2"
)

// GetCurricula fetches all curricula, with optional inclusion of modules
func GetCurricula(c *fiber.Ctx) error {
	var curricula []models.Curriculum

	// Preload modules if needed, or just fetch curricula
	// We'll preload Modules so it mirrors the Prisma behavior if required
	result := database.DB.Preload("Modules").Find(&curricula)

	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch curricula",
		})
	}

	return c.JSON(fiber.Map{
		"curricula": curricula,
	})
}

// GetCurriculumByID fetches a single curriculum by ID
func GetCurriculumByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var curriculum models.Curriculum
	result := database.DB.Preload("Modules").First(&curriculum, "id = ?", id)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Curriculum not found"})
	}
	return c.JSON(curriculum)
}

// CreateCurriculum creates a new curriculum
func CreateCurriculum(c *fiber.Ctx) error {
	var curriculum models.Curriculum
	if err := c.BodyParser(&curriculum); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := database.DB.Create(&curriculum).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create curriculum"})
	}
	return c.Status(201).JSON(curriculum)
}

// UpdateCurriculum updates an existing curriculum
func UpdateCurriculum(c *fiber.Ctx) error {
	id := c.Params("id")
	var curriculum models.Curriculum
	if err := database.DB.First(&curriculum, "id = ?", id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Curriculum not found"})
	}
	if err := c.BodyParser(&curriculum); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := database.DB.Save(&curriculum).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update curriculum"})
	}
	return c.JSON(curriculum)
}

// DeleteCurriculum deletes a curriculum
func DeleteCurriculum(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.Curriculum{}, "id = ?", id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete curriculum"})
	}
	return c.SendStatus(204)
}
