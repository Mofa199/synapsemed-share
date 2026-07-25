package controllers

import (
	"math/rand"
	"synapsemed-backend/database"
	"synapsemed-backend/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

// GetModules fetches all modules
func GetModules(c *fiber.Ctx) error {
	var modules []models.Module
	
	query := database.DB.Model(&models.Module{})
	
	// Optional filtering by curriculumId
	curriculumId := c.Query("curriculumId")
	if curriculumId != "" {
		query = query.Where("curriculumId = ?", curriculumId)
	}

	result := query.Find(&modules)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch modules",
		})
	}

	return c.JSON(fiber.Map{
		"modules": modules,
		"count":   len(modules),
	})
}

// GetModuleByID fetches a single module by ID
func GetModuleByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var module models.Module

	result := database.DB.Preload("Topics").Preload("Books").First(&module, "id = ?", id)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Module not found",
		})
	}

	return c.JSON(module)
}

// GetTopics fetches all topics
func GetTopics(c *fiber.Ctx) error {
	var topics []models.Topic
	
	query := database.DB.Model(&models.Topic{})
	
	moduleId := c.Query("moduleId")
	if moduleId != "" {
		query = query.Where("moduleId = ?", moduleId)
	}

	result := query.Find(&topics)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch topics",
		})
	}

	return c.JSON(fiber.Map{
		"topics": topics,
		"count":  len(topics),
	})
}

// GetTopicByID fetches a single topic by ID
func GetTopicByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var topic models.Topic

	result := database.DB.First(&topic, "id = ?", id)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Topic not found",
		})
	}

	return c.JSON(topic)
}

// GetBooks fetches all books
func GetBooks(c *fiber.Ctx) error {
	var books []models.Book
	result := database.DB.Find(&books)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch books",
		})
	}

	return c.JSON(fiber.Map{
		"books": books,
		"count": len(books),
	})
}

// GetBookByID fetches a single book by ID
func GetBookByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var book models.Book

	result := database.DB.First(&book, "id = ?", id)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Book not found",
		})
	}

	return c.JSON(book)
}

// CreateModule creates a new module
func CreateModule(c *fiber.Ctx) error {
	var module models.Module
	if err := c.BodyParser(&module); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	// Generate ID if missing
	if module.ID == "" {
		module.ID = "c" + generateRandomString(24)
	}

	if err := database.DB.Create(&module).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create module", "success": false})
	}
	return c.Status(201).JSON(fiber.Map{"success": true, "data": module})
}

// UpdateModule updates a module
func UpdateModule(c *fiber.Ctx) error {
	id := c.Params("id")
	var module models.Module
	if err := database.DB.First(&module, "id = ?", id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Module not found"})
	}
	if err := c.BodyParser(&module); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := database.DB.Save(&module).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update module"})
	}
	return c.JSON(module)
}

// DeleteModule deletes a module
func DeleteModule(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.Module{}, "id = ?", id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete module"})
	}
	return c.SendStatus(204)
}

// CreateTopic creates a new topic
func CreateTopic(c *fiber.Ctx) error {
	var topic models.Topic
	if err := c.BodyParser(&topic); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	// Generate ID if missing
	if topic.ID == "" {
		topic.ID = "c" + generateRandomString(24)
	}

	if err := database.DB.Create(&topic).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create topic", "success": false})
	}
	return c.Status(201).JSON(fiber.Map{"success": true, "data": topic})
}

// generateRandomString generates a random alphanumeric string
func generateRandomString(n int) string {
	var letters = []rune("abcdefghijklmnopqrstuvwxyz0123456789")
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func init() {
	rand.Seed(time.Now().UnixNano())
}

// UpdateTopic updates a topic
func UpdateTopic(c *fiber.Ctx) error {
	id := c.Params("id")
	var topic models.Topic
	if err := database.DB.First(&topic, "id = ?", id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Topic not found"})
	}
	if err := c.BodyParser(&topic); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := database.DB.Save(&topic).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update topic"})
	}
	return c.JSON(topic)
}

// DeleteTopic deletes a topic
func DeleteTopic(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.Topic{}, "id = ?", id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete topic"})
	}
	return c.SendStatus(204)
}

// CreateBook creates a new book
func CreateBook(c *fiber.Ctx) error {
	var book models.Book
	if err := c.BodyParser(&book); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := database.DB.Create(&book).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create book"})
	}
	return c.Status(201).JSON(book)
}

// UpdateBook updates a book
func UpdateBook(c *fiber.Ctx) error {
	id := c.Params("id")
	var book models.Book
	if err := database.DB.First(&book, "id = ?", id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Book not found"})
	}
	if err := c.BodyParser(&book); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := database.DB.Save(&book).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update book"})
	}
	return c.JSON(book)
}

// DeleteBook deletes a book
func DeleteBook(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.Book{}, "id = ?", id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete book"})
	}
	return c.SendStatus(204)
}
