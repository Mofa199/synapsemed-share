package main

import (
	"log"
	"synapsemed-backend/database"
	"synapsemed-backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// Initialize Database connection
	database.Connect()

	// Initialize Fiber app
	app := fiber.New()

	// Middleware
	app.Use(logger.New())
	app.Use(cors.New())

	// Setup API Routes
	routes.SetupRoutes(app)

	// Start server on port 8081
	log.Println("Starting Go backend on port 8081...")
	err := app.Listen(":8081")
	if err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
