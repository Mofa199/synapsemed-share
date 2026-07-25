package controllers

import (
	"synapsemed-backend/models"

	"github.com/gofiber/fiber/v2"
)



// Users
var GetUsers = getAllWithKey[models.User]("users")
func GetUserByID(c *fiber.Ctx) error { return getByID[models.User](c) }
func CreateUser(c *fiber.Ctx) error { return createItem[models.User](c) }
func UpdateUser(c *fiber.Ctx) error { return updateItem[models.User](c) }
func DeleteUser(c *fiber.Ctx) error { return deleteItem[models.User](c) }

// Bookmarks
var GetBookmarks = getAllWithKey[models.Bookmark]("bookmarks")
func GetBookmarkByID(c *fiber.Ctx) error { return getByID[models.Bookmark](c) }
func CreateBookmark(c *fiber.Ctx) error { return createItem[models.Bookmark](c) }
func UpdateBookmark(c *fiber.Ctx) error { return updateItem[models.Bookmark](c) }
func DeleteBookmark(c *fiber.Ctx) error { return deleteItem[models.Bookmark](c) }

// Highlights
var GetHighlights = getAllWithKey[models.Highlight]("highlights")
func GetHighlightByID(c *fiber.Ctx) error { return getByID[models.Highlight](c) }
func CreateHighlight(c *fiber.Ctx) error { return createItem[models.Highlight](c) }
func UpdateHighlight(c *fiber.Ctx) error { return updateItem[models.Highlight](c) }
func DeleteHighlight(c *fiber.Ctx) error { return deleteItem[models.Highlight](c) }

// Ratings
var GetRatings = getAllWithKey[models.Rating]("ratings")
func GetRatingByID(c *fiber.Ctx) error { return getByID[models.Rating](c) }
func CreateRating(c *fiber.Ctx) error { return createItem[models.Rating](c) }
func UpdateRating(c *fiber.Ctx) error { return updateItem[models.Rating](c) }
func DeleteRating(c *fiber.Ctx) error { return deleteItem[models.Rating](c) }

// Progress
var GetProgresses = getAllWithKey[models.Progress]("progress")
func GetProgressByID(c *fiber.Ctx) error { return getByID[models.Progress](c) }
func CreateProgress(c *fiber.Ctx) error { return createItem[models.Progress](c) }
func UpdateProgress(c *fiber.Ctx) error { return updateItem[models.Progress](c) }
func DeleteProgress(c *fiber.Ctx) error { return deleteItem[models.Progress](c) }

// ChatMessages
var GetChatMessages = getAllWithKey[models.ChatMessage]("chatMessages")
func GetChatMessageByID(c *fiber.Ctx) error { return getByID[models.ChatMessage](c) }
func CreateChatMessage(c *fiber.Ctx) error { return createItem[models.ChatMessage](c) }
func UpdateChatMessage(c *fiber.Ctx) error { return updateItem[models.ChatMessage](c) }
func DeleteChatMessage(c *fiber.Ctx) error { return deleteItem[models.ChatMessage](c) }

// Badges
var GetBadges = getAllWithKey[models.Badge]("badges")
func GetBadgeByID(c *fiber.Ctx) error { return getByID[models.Badge](c) }
func CreateBadge(c *fiber.Ctx) error { return createItem[models.Badge](c) }
func UpdateBadge(c *fiber.Ctx) error { return updateItem[models.Badge](c) }
func DeleteBadge(c *fiber.Ctx) error { return deleteItem[models.Badge](c) }

// UserBadges
var GetUserBadges = getAllWithKey[models.UserBadge]("userBadges")
func GetUserBadgeByID(c *fiber.Ctx) error { return getByID[models.UserBadge](c) }
func CreateUserBadge(c *fiber.Ctx) error { return createItem[models.UserBadge](c) }
func UpdateUserBadge(c *fiber.Ctx) error { return updateItem[models.UserBadge](c) }
func DeleteUserBadge(c *fiber.Ctx) error { return deleteItem[models.UserBadge](c) }

// Challenges
var GetChallenges = getAllWithKey[models.Challenge]("challenges")
func GetChallengeByID(c *fiber.Ctx) error { return getByID[models.Challenge](c) }
func CreateChallenge(c *fiber.Ctx) error { return createItem[models.Challenge](c) }
func UpdateChallenge(c *fiber.Ctx) error { return updateItem[models.Challenge](c) }
func DeleteChallenge(c *fiber.Ctx) error { return deleteItem[models.Challenge](c) }

// UserChallenges
var GetUserChallenges = getAllWithKey[models.UserChallenge]("userChallenges")
func GetUserChallengeByID(c *fiber.Ctx) error { return getByID[models.UserChallenge](c) }
func CreateUserChallenge(c *fiber.Ctx) error { return createItem[models.UserChallenge](c) }
func UpdateUserChallenge(c *fiber.Ctx) error { return updateItem[models.UserChallenge](c) }
func DeleteUserChallenge(c *fiber.Ctx) error { return deleteItem[models.UserChallenge](c) }

// Notes
var GetNotes = getAllWithKey[models.Note]("notes")
func GetNoteByID(c *fiber.Ctx) error { return getByID[models.Note](c) }
func CreateNote(c *fiber.Ctx) error { return createItem[models.Note](c) }
func UpdateNote(c *fiber.Ctx) error { return updateItem[models.Note](c) }
func DeleteNote(c *fiber.Ctx) error { return deleteItem[models.Note](c) }

// SpacedRepetitionCards
var GetSpacedRepetitionCards = getAllWithKey[models.SpacedRepetitionCard]("spacedRepetitionCards")
func GetSpacedRepetitionCardByID(c *fiber.Ctx) error { return getByID[models.SpacedRepetitionCard](c) }
func CreateSpacedRepetitionCard(c *fiber.Ctx) error { return createItem[models.SpacedRepetitionCard](c) }
func UpdateSpacedRepetitionCard(c *fiber.Ctx) error { return updateItem[models.SpacedRepetitionCard](c) }
func DeleteSpacedRepetitionCard(c *fiber.Ctx) error { return deleteItem[models.SpacedRepetitionCard](c) }
