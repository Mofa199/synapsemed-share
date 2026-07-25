package controllers

import (
	"synapsemed-backend/database"
	"synapsemed-backend/models"

	"github.com/gofiber/fiber/v2"
)

// Helper function to handle Generic CRUD Helpers
func getAllWithKey[T any](key string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var items []T
		result := database.DB.Find(&items)
		if result.Error != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch data"})
		}
		return c.JSON(fiber.Map{
			key:     items,
			"data":  items,
			"count": len(items),
		})
	}
}

func getByID[T any](c *fiber.Ctx) error {
	id := c.Params("id")
	var item T
	result := database.DB.First(&item, "id = ?", id)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Item not found"})
	}
	return c.JSON(item)
}

func createItem[T any](c *fiber.Ctx) error {
	var item T
	if err := c.BodyParser(&item); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := database.DB.Create(&item).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create item"})
	}
	return c.Status(fiber.StatusCreated).JSON(item)
}

func updateItem[T any](c *fiber.Ctx) error {
	id := c.Params("id")
	var item T
	if err := database.DB.First(&item, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Item not found"})
	}
	if err := c.BodyParser(&item); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := database.DB.Save(&item).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update item"})
	}
	return c.JSON(item)
}

func deleteItem[T any](c *fiber.Ctx) error {
	id := c.Params("id")
	var item T
	if err := database.DB.Delete(&item, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete item"})
	}
	return c.SendStatus(fiber.StatusNoContent)
}

// QuestionBanks
var GetQuestionBanks = getAllWithKey[models.QuestionBank]("questionBanks")
func GetQuestionBankByID(c *fiber.Ctx) error { return getByID[models.QuestionBank](c) }
func CreateQuestionBank(c *fiber.Ctx) error { return createItem[models.QuestionBank](c) }
func UpdateQuestionBank(c *fiber.Ctx) error { return updateItem[models.QuestionBank](c) }
func DeleteQuestionBank(c *fiber.Ctx) error { return deleteItem[models.QuestionBank](c) }

// Questions
var GetQuestions = getAllWithKey[models.Question]("questions")
func GetQuestionByID(c *fiber.Ctx) error { return getByID[models.Question](c) }
func CreateQuestion(c *fiber.Ctx) error { return createItem[models.Question](c) }
func UpdateQuestion(c *fiber.Ctx) error { return updateItem[models.Question](c) }
func DeleteQuestion(c *fiber.Ctx) error { return deleteItem[models.Question](c) }

// FlashcardSets
var GetFlashcardSets = getAllWithKey[models.FlashcardSet]("flashcardSets")
func GetFlashcardSetByID(c *fiber.Ctx) error { return getByID[models.FlashcardSet](c) }
func CreateFlashcardSet(c *fiber.Ctx) error { return createItem[models.FlashcardSet](c) }
func UpdateFlashcardSet(c *fiber.Ctx) error { return updateItem[models.FlashcardSet](c) }
func DeleteFlashcardSet(c *fiber.Ctx) error { return deleteItem[models.FlashcardSet](c) }

// Flashcards
var GetFlashcards = getAllWithKey[models.Flashcard]("flashcards")
func GetFlashcardByID(c *fiber.Ctx) error { return getByID[models.Flashcard](c) }
func CreateFlashcard(c *fiber.Ctx) error { return createItem[models.Flashcard](c) }
func UpdateFlashcard(c *fiber.Ctx) error { return updateItem[models.Flashcard](c) }
func DeleteFlashcard(c *fiber.Ctx) error { return deleteItem[models.Flashcard](c) }

// Simulations
var GetSimulations = getAllWithKey[models.Simulation]("simulations")
func GetSimulationByID(c *fiber.Ctx) error { return getByID[models.Simulation](c) }
func CreateSimulation(c *fiber.Ctx) error { return createItem[models.Simulation](c) }
func UpdateSimulation(c *fiber.Ctx) error { return updateItem[models.Simulation](c) }
func DeleteSimulation(c *fiber.Ctx) error { return deleteItem[models.Simulation](c) }

// SimulationSteps
var GetSimulationSteps = getAllWithKey[models.SimulationStep]("simulationSteps")
func GetSimulationStepByID(c *fiber.Ctx) error { return getByID[models.SimulationStep](c) }
func CreateSimulationStep(c *fiber.Ctx) error { return createItem[models.SimulationStep](c) }
func UpdateSimulationStep(c *fiber.Ctx) error { return updateItem[models.SimulationStep](c) }
func DeleteSimulationStep(c *fiber.Ctx) error { return deleteItem[models.SimulationStep](c) }

// StudyGuides
var GetStudyGuides = getAllWithKey[models.StudyGuide]("studyGuides")
func GetStudyGuideByID(c *fiber.Ctx) error { return getByID[models.StudyGuide](c) }
func CreateStudyGuide(c *fiber.Ctx) error { return createItem[models.StudyGuide](c) }
func UpdateStudyGuide(c *fiber.Ctx) error { return updateItem[models.StudyGuide](c) }
func DeleteStudyGuide(c *fiber.Ctx) error { return deleteItem[models.StudyGuide](c) }

// Videos
var GetVideos = getAllWithKey[models.Video]("videos")
func GetVideoByID(c *fiber.Ctx) error { return getByID[models.Video](c) }
func CreateVideo(c *fiber.Ctx) error { return createItem[models.Video](c) }
func UpdateVideo(c *fiber.Ctx) error { return updateItem[models.Video](c) }
func DeleteVideo(c *fiber.Ctx) error { return deleteItem[models.Video](c) }

// Magazines
var GetMagazines = getAllWithKey[models.Magazine]("magazines")
func GetMagazineByID(c *fiber.Ctx) error { return getByID[models.Magazine](c) }
func CreateMagazine(c *fiber.Ctx) error { return createItem[models.Magazine](c) }
func UpdateMagazine(c *fiber.Ctx) error { return updateItem[models.Magazine](c) }
func DeleteMagazine(c *fiber.Ctx) error { return deleteItem[models.Magazine](c) }

// MagazineArticles
var GetMagazineArticles = getAllWithKey[models.MagazineArticle]("magazineArticles")
func GetMagazineArticleByID(c *fiber.Ctx) error { return getByID[models.MagazineArticle](c) }
func CreateMagazineArticle(c *fiber.Ctx) error { return createItem[models.MagazineArticle](c) }
func UpdateMagazineArticle(c *fiber.Ctx) error { return updateItem[models.MagazineArticle](c) }
func DeleteMagazineArticle(c *fiber.Ctx) error { return deleteItem[models.MagazineArticle](c) }

// Articles
var GetArticles = getAllWithKey[models.Article]("articles")
func GetArticleByID(c *fiber.Ctx) error { return getByID[models.Article](c) }
func CreateArticle(c *fiber.Ctx) error { return createItem[models.Article](c) }
func UpdateArticle(c *fiber.Ctx) error { return updateItem[models.Article](c) }
func DeleteArticle(c *fiber.Ctx) error { return deleteItem[models.Article](c) }

// Concepts
var GetConcepts = getAllWithKey[models.Concept]("concepts")
func GetConceptByID(c *fiber.Ctx) error { return getByID[models.Concept](c) }
func CreateConcept(c *fiber.Ctx) error { return createItem[models.Concept](c) }
func UpdateConcept(c *fiber.Ctx) error { return updateItem[models.Concept](c) }
func DeleteConcept(c *fiber.Ctx) error { return deleteItem[models.Concept](c) }

