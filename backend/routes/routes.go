package routes

import (
	"synapsemed-backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	// API Group
	api := app.Group("/api/v2")

	// Curricula Routes
	api.Get("/curricula", controllers.GetCurricula)
	api.Get("/curricula/:id", controllers.GetCurriculumByID)
	api.Post("/curricula", controllers.CreateCurriculum)
	api.Put("/curricula/:id", controllers.UpdateCurriculum)
	api.Delete("/curricula/:id", controllers.DeleteCurriculum)
	
	// Core Content Routes
	api.Get("/modules", controllers.GetModules)
	api.Get("/modules/:id", controllers.GetModuleByID)
	api.Post("/modules", controllers.CreateModule)
	api.Put("/modules/:id", controllers.UpdateModule)
	api.Delete("/modules/:id", controllers.DeleteModule)

	api.Get("/topics", controllers.GetTopics)
	api.Get("/topics/:id", controllers.GetTopicByID)
	api.Post("/topics", controllers.CreateTopic)
	api.Put("/topics/:id", controllers.UpdateTopic)
	api.Delete("/topics/:id", controllers.DeleteTopic)

	api.Get("/books", controllers.GetBooks)
	api.Get("/books/:id", controllers.GetBookByID)
	api.Post("/books", controllers.CreateBook)
	api.Put("/books/:id", controllers.UpdateBook)
	api.Delete("/books/:id", controllers.DeleteBook)

	// Pharmacology Routes
	api.Get("/drug-classes", controllers.GetDrugClasses)
	api.Get("/drug-classes/:id", controllers.GetDrugClassByID)
	api.Post("/drug-classes", controllers.CreateDrugClass)
	api.Put("/drug-classes/:id", controllers.UpdateDrugClass)
	api.Delete("/drug-classes/:id", controllers.DeleteDrugClass)

	api.Get("/drugs", controllers.GetDrugs)
	api.Get("/drugs/:id", controllers.GetDrugByID)
	api.Post("/drugs", controllers.CreateDrug)
	api.Put("/drugs/:id", controllers.UpdateDrug)
	api.Delete("/drugs/:id", controllers.DeleteDrug)

	// Interactive Learning Routes
	api.Get("/question-banks", controllers.GetQuestionBanks)
	api.Get("/question-banks/:id", controllers.GetQuestionBankByID)
	api.Post("/question-banks", controllers.CreateQuestionBank)
	api.Put("/question-banks/:id", controllers.UpdateQuestionBank)
	api.Delete("/question-banks/:id", controllers.DeleteQuestionBank)

	api.Get("/questions", controllers.GetQuestions)
	api.Get("/questions/:id", controllers.GetQuestionByID)
	api.Post("/questions", controllers.CreateQuestion)
	api.Put("/questions/:id", controllers.UpdateQuestion)
	api.Delete("/questions/:id", controllers.DeleteQuestion)

	api.Get("/flashcard-sets", controllers.GetFlashcardSets)
	api.Get("/flashcard-sets/:id", controllers.GetFlashcardSetByID)
	api.Post("/flashcard-sets", controllers.CreateFlashcardSet)
	api.Put("/flashcard-sets/:id", controllers.UpdateFlashcardSet)
	api.Delete("/flashcard-sets/:id", controllers.DeleteFlashcardSet)

	api.Get("/flashcards", controllers.GetFlashcards)
	api.Get("/flashcards/:id", controllers.GetFlashcardByID)
	api.Post("/flashcards", controllers.CreateFlashcard)
	api.Put("/flashcards/:id", controllers.UpdateFlashcard)
	api.Delete("/flashcards/:id", controllers.DeleteFlashcard)

	api.Get("/simulations", controllers.GetSimulations)
	api.Get("/simulations/:id", controllers.GetSimulationByID)
	api.Post("/simulations", controllers.CreateSimulation)
	api.Put("/simulations/:id", controllers.UpdateSimulation)
	api.Delete("/simulations/:id", controllers.DeleteSimulation)

	api.Get("/simulation-steps", controllers.GetSimulationSteps)
	api.Get("/simulation-steps/:id", controllers.GetSimulationStepByID)
	api.Post("/simulation-steps", controllers.CreateSimulationStep)
	api.Put("/simulation-steps/:id", controllers.UpdateSimulationStep)
	api.Delete("/simulation-steps/:id", controllers.DeleteSimulationStep)

	api.Get("/study-guides", controllers.GetStudyGuides)
	api.Get("/study-guides/:id", controllers.GetStudyGuideByID)
	api.Post("/study-guides", controllers.CreateStudyGuide)
	api.Put("/study-guides/:id", controllers.UpdateStudyGuide)
	api.Delete("/study-guides/:id", controllers.DeleteStudyGuide)

	api.Get("/videos", controllers.GetVideos)
	api.Get("/videos/:id", controllers.GetVideoByID)
	api.Post("/videos", controllers.CreateVideo)
	api.Put("/videos/:id", controllers.UpdateVideo)
	api.Delete("/videos/:id", controllers.DeleteVideo)

	api.Get("/magazines", controllers.GetMagazines)
	api.Get("/magazines/:id", controllers.GetMagazineByID)
	api.Post("/magazines", controllers.CreateMagazine)
	api.Put("/magazines/:id", controllers.UpdateMagazine)
	api.Delete("/magazines/:id", controllers.DeleteMagazine)

	api.Get("/magazine-articles", controllers.GetMagazineArticles)
	api.Get("/magazine-articles/:id", controllers.GetMagazineArticleByID)
	api.Post("/magazine-articles", controllers.CreateMagazineArticle)
	api.Put("/magazine-articles/:id", controllers.UpdateMagazineArticle)
	api.Delete("/magazine-articles/:id", controllers.DeleteMagazineArticle)

	api.Get("/articles", controllers.GetArticles)
	api.Get("/articles/:id", controllers.GetArticleByID)
	api.Post("/articles", controllers.CreateArticle)
	api.Put("/articles/:id", controllers.UpdateArticle)
	api.Delete("/articles/:id", controllers.DeleteArticle)

	api.Get("/concepts", controllers.GetConcepts)
	api.Get("/concepts/:id", controllers.GetConceptByID)
	api.Post("/concepts", controllers.CreateConcept)
	api.Put("/concepts/:id", controllers.UpdateConcept)
	api.Delete("/concepts/:id", controllers.DeleteConcept)

	// User & Gamification Routes
	api.Get("/users", controllers.GetUsers)
	api.Get("/users/:id", controllers.GetUserByID)
	api.Post("/users", controllers.CreateUser)
	api.Put("/users/:id", controllers.UpdateUser)
	api.Delete("/users/:id", controllers.DeleteUser)

	api.Get("/bookmarks", controllers.GetBookmarks)
	api.Get("/bookmarks/:id", controllers.GetBookmarkByID)
	api.Post("/bookmarks", controllers.CreateBookmark)
	api.Put("/bookmarks/:id", controllers.UpdateBookmark)
	api.Delete("/bookmarks/:id", controllers.DeleteBookmark)

	api.Get("/highlights", controllers.GetHighlights)
	api.Get("/highlights/:id", controllers.GetHighlightByID)
	api.Post("/highlights", controllers.CreateHighlight)
	api.Put("/highlights/:id", controllers.UpdateHighlight)
	api.Delete("/highlights/:id", controllers.DeleteHighlight)

	api.Get("/ratings", controllers.GetRatings)
	api.Get("/ratings/:id", controllers.GetRatingByID)
	api.Post("/ratings", controllers.CreateRating)
	api.Put("/ratings/:id", controllers.UpdateRating)
	api.Delete("/ratings/:id", controllers.DeleteRating)

	api.Get("/progress", controllers.GetProgresses)
	api.Get("/progress/:id", controllers.GetProgressByID)
	api.Post("/progress", controllers.CreateProgress)
	api.Put("/progress/:id", controllers.UpdateProgress)
	api.Delete("/progress/:id", controllers.DeleteProgress)

	api.Get("/chat-messages", controllers.GetChatMessages)
	api.Get("/chat-messages/:id", controllers.GetChatMessageByID)
	api.Post("/chat-messages", controllers.CreateChatMessage)
	api.Put("/chat-messages/:id", controllers.UpdateChatMessage)
	api.Delete("/chat-messages/:id", controllers.DeleteChatMessage)

	api.Get("/badges", controllers.GetBadges)
	api.Get("/badges/:id", controllers.GetBadgeByID)
	api.Post("/badges", controllers.CreateBadge)
	api.Put("/badges/:id", controllers.UpdateBadge)
	api.Delete("/badges/:id", controllers.DeleteBadge)

	api.Get("/user-badges", controllers.GetUserBadges)
	api.Get("/user-badges/:id", controllers.GetUserBadgeByID)
	api.Post("/user-badges", controllers.CreateUserBadge)
	api.Put("/user-badges/:id", controllers.UpdateUserBadge)
	api.Delete("/user-badges/:id", controllers.DeleteUserBadge)

	api.Get("/challenges", controllers.GetChallenges)
	api.Get("/challenges/:id", controllers.GetChallengeByID)
	api.Post("/challenges", controllers.CreateChallenge)
	api.Put("/challenges/:id", controllers.UpdateChallenge)
	api.Delete("/challenges/:id", controllers.DeleteChallenge)

	api.Get("/user-challenges", controllers.GetUserChallenges)
	api.Get("/user-challenges/:id", controllers.GetUserChallengeByID)
	api.Post("/user-challenges", controllers.CreateUserChallenge)
	api.Put("/user-challenges/:id", controllers.UpdateUserChallenge)
	api.Delete("/user-challenges/:id", controllers.DeleteUserChallenge)

	api.Get("/notes", controllers.GetNotes)
	api.Get("/notes/:id", controllers.GetNoteByID)
	api.Post("/notes", controllers.CreateNote)
	api.Put("/notes/:id", controllers.UpdateNote)
	api.Delete("/notes/:id", controllers.DeleteNote)

	api.Get("/spaced-repetition-cards", controllers.GetSpacedRepetitionCards)
	api.Get("/spaced-repetition-cards/:id", controllers.GetSpacedRepetitionCardByID)
	api.Post("/spaced-repetition-cards", controllers.CreateSpacedRepetitionCard)
	api.Put("/spaced-repetition-cards/:id", controllers.UpdateSpacedRepetitionCard)
	api.Delete("/spaced-repetition-cards/:id", controllers.DeleteSpacedRepetitionCard)
	
	// Health check route
	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "message": "Go backend is running!"})
	})
}
