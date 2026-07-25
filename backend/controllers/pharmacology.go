package controllers

import (
	"synapsemed-backend/database"
	"synapsemed-backend/models"

	"github.com/gofiber/fiber/v2"
)

// GetDrugClasses fetches all drug classes
func GetDrugClasses(c *fiber.Ctx) error {
	var drugClasses []models.DrugClass
	
	result := database.DB.Find(&drugClasses)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch drug classes",
		})
	}

	return c.JSON(fiber.Map{
		"drugClasses": drugClasses,
		"count":       len(drugClasses),
	})
}

// GetDrugClassByID fetches a single drug class by ID
func GetDrugClassByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var drugClass models.DrugClass

	result := database.DB.Preload("Drugs").First(&drugClass, "id = ?", id)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Drug class not found",
		})
	}

	return c.JSON(drugClass)
}

// GetDrugs fetches all drugs
func GetDrugs(c *fiber.Ctx) error {
	var drugs []models.Drug
	
	query := database.DB.Model(&models.Drug{})
	
	drugClassId := c.Query("drugClassId")
	if drugClassId != "" {
		query = query.Where("drugClassId = ?", drugClassId)
	}

	result := query.Find(&drugs)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch drugs",
		})
	}

	return c.JSON(fiber.Map{
		"drugs": drugs,
		"count": len(drugs),
	})
}

// GetDrugByID fetches a single drug by ID
func GetDrugByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var drug models.Drug

	result := database.DB.Preload("DrugClass").First(&drug, "id = ?", id)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Drug not found",
		})
	}

	return c.JSON(drug)
}

// CreateDrugClass creates a new drug class
func CreateDrugClass(c *fiber.Ctx) error {
	var drugClass models.DrugClass
	if err := c.BodyParser(&drugClass); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := database.DB.Create(&drugClass).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create drug class"})
	}
	return c.Status(201).JSON(drugClass)
}

// UpdateDrugClass updates a drug class
func UpdateDrugClass(c *fiber.Ctx) error {
	id := c.Params("id")
	var drugClass models.DrugClass
	if err := database.DB.First(&drugClass, "id = ?", id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Drug class not found"})
	}
	if err := c.BodyParser(&drugClass); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := database.DB.Save(&drugClass).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update drug class"})
	}
	return c.JSON(drugClass)
}

// DeleteDrugClass deletes a drug class
func DeleteDrugClass(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.DrugClass{}, "id = ?", id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete drug class"})
	}
	return c.SendStatus(204)
}

// CreateDrug creates a new drug
func CreateDrug(c *fiber.Ctx) error {
	var drug models.Drug
	if err := c.BodyParser(&drug); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := database.DB.Create(&drug).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create drug"})
	}
	return c.Status(201).JSON(drug)
}

// UpdateDrug updates a drug
func UpdateDrug(c *fiber.Ctx) error {
	id := c.Params("id")
	var drug models.Drug
	if err := database.DB.First(&drug, "id = ?", id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Drug not found"})
	}
	if err := c.BodyParser(&drug); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := database.DB.Save(&drug).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update drug"})
	}
	return c.JSON(drug)
}

// DeleteDrug deletes a drug
func DeleteDrug(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.Drug{}, "id = ?", id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete drug"})
	}
	return c.SendStatus(204)
}
