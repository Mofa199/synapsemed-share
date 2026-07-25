package models

import "time"

type User struct {
	ID               string    `json:"id" gorm:"column:id;primaryKey"`
	Email            string    `json:"email" gorm:"column:email"`
	Name             string    `json:"name" gorm:"column:name"`
	Password         string    `json:"password" gorm:"column:password"`
	Role             string    `json:"role" gorm:"column:role"`
	Field            string    `json:"field" gorm:"column:field"`
	AvatarUrl        *string   `json:"avatarUrl" gorm:"column:avatarUrl"`
	Level            int       `json:"level" gorm:"column:level"`
	Points           int       `json:"points" gorm:"column:points"`
	Streak           int       `json:"streak" gorm:"column:streak"`
	IsActive         bool      `json:"isActive" gorm:"column:isActive"`
	LastLoginAt      *time.Time `json:"lastLoginAt" gorm:"column:lastLoginAt"`
	ResetToken       *string   `json:"resetToken" gorm:"column:resetToken"`
	ResetTokenExpiry *time.Time `json:"resetTokenExpiry" gorm:"column:resetTokenExpiry"`
	CreatedAt        time.Time `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt        time.Time `json:"updatedAt" gorm:"column:updatedAt"`
}

func (User) TableName() string {
	return "users"
}

type Bookmark struct {
	ID             string    `json:"id" gorm:"column:id;primaryKey"`
	UserID         string    `json:"userId" gorm:"column:userId"`
	ResourceType   string    `json:"resourceType" gorm:"column:resourceType"`
	TopicID        *string   `json:"topicId" gorm:"column:topicId"`
	ArticleID      *string   `json:"articleId" gorm:"column:articleId"`
	BookID         *string   `json:"bookId" gorm:"column:bookId"`
	DrugID         *string   `json:"drugId" gorm:"column:drugId"`
	QuestionBankID *string   `json:"questionBankId" gorm:"column:questionBankId"`
	StudyGuideID   *string   `json:"studyGuideId" gorm:"column:studyGuideId"`
	MagazineID     *string   `json:"magazineId" gorm:"column:magazineId"`
	VideoID        *string   `json:"videoId" gorm:"column:videoId"`
	FlashcardSetID *string   `json:"flashcardSetId" gorm:"column:flashcardSetId"`
	SimulationID   *string   `json:"simulationId" gorm:"column:simulationId"`
	ConceptID      *string   `json:"conceptId" gorm:"column:conceptId"`
	CreatedAt      time.Time `json:"createdAt" gorm:"column:createdAt"`
	User           *User     `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

func (Bookmark) TableName() string {
	return "bookmarks"
}

type Highlight struct {
	ID           string    `json:"id" gorm:"column:id;primaryKey"`
	UserID       string    `json:"userId" gorm:"column:userId"`
	ResourceType string    `json:"resourceType" gorm:"column:resourceType"`
	TopicID      *string   `json:"topicId" gorm:"column:topicId"`
	ArticleID    *string   `json:"articleId" gorm:"column:articleId"`
	StudyGuideID *string   `json:"studyGuideId" gorm:"column:studyGuideId"`
	Text         string    `json:"text" gorm:"column:text"`
	Color        string    `json:"color" gorm:"column:color"`
	Note         *string   `json:"note" gorm:"column:note"`
	CreatedAt    time.Time `json:"createdAt" gorm:"column:createdAt"`
	User         *User     `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

func (Highlight) TableName() string {
	return "highlights"
}

type Rating struct {
	ID             string    `json:"id" gorm:"column:id;primaryKey"`
	UserID         string    `json:"userId" gorm:"column:userId"`
	ResourceType   string    `json:"resourceType" gorm:"column:resourceType"`
	TopicID        *string   `json:"topicId" gorm:"column:topicId"`
	ArticleID      *string   `json:"articleId" gorm:"column:articleId"`
	BookID         *string   `json:"bookId" gorm:"column:bookId"`
	DrugID         *string   `json:"drugId" gorm:"column:drugId"`
	QuestionBankID *string   `json:"questionBankId" gorm:"column:questionBankId"`
	StudyGuideID   *string   `json:"studyGuideId" gorm:"column:studyGuideId"`
	MagazineID     *string   `json:"magazineId" gorm:"column:magazineId"`
	VideoID        *string   `json:"videoId" gorm:"column:videoId"`
	FlashcardSetID *string   `json:"flashcardSetId" gorm:"column:flashcardSetId"`
	SimulationID   *string   `json:"simulationId" gorm:"column:simulationId"`
	Rating         int       `json:"rating" gorm:"column:rating"`
	Review         *string   `json:"review" gorm:"column:review"`
	CreatedAt      time.Time `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt      time.Time `json:"updatedAt" gorm:"column:updatedAt"`
	User           *User     `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

func (Rating) TableName() string {
	return "ratings"
}

type Progress struct {
	ID                   string    `json:"id" gorm:"column:id;primaryKey"`
	UserID               string    `json:"userId" gorm:"column:userId"`
	ResourceType         string    `json:"resourceType" gorm:"column:resourceType"`
	TopicID              *string   `json:"topicId" gorm:"column:topicId"`
	ArticleID            *string   `json:"articleId" gorm:"column:articleId"`
	BookID               *string   `json:"bookId" gorm:"column:bookId"`
	VideoID              *string   `json:"videoId" gorm:"column:videoId"`
	DrugID               *string   `json:"drugId" gorm:"column:drugId"`
	QuestionBankID       *string   `json:"questionBankId" gorm:"column:questionBankId"`
	StudyGuideID         *string   `json:"studyGuideId" gorm:"column:studyGuideId"`
	FlashcardSetID       *string   `json:"flashcardSetId" gorm:"column:flashcardSetId"`
	SimulationID         *string   `json:"simulationId" gorm:"column:simulationId"`
	MagazineID           *string   `json:"magazineId" gorm:"column:magazineId"`
	ConceptID            *string   `json:"conceptId" gorm:"column:conceptId"`
	Status               string    `json:"status" gorm:"column:status"`
	CompletionPercentage int       `json:"completionPercentage" gorm:"column:completionPercentage"`
	TimeSpent            int       `json:"timeSpent" gorm:"column:timeSpent"`
	LastAccessedAt       time.Time `json:"lastAccessedAt" gorm:"column:lastAccessedAt"`
	CompletedAt          *time.Time `json:"completedAt" gorm:"column:completedAt"`
	CreatedAt            time.Time `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt            time.Time `json:"updatedAt" gorm:"column:updatedAt"`
	User                 *User     `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

func (Progress) TableName() string {
	return "progress"
}

type ChatMessage struct {
	ID        string    `json:"id" gorm:"column:id;primaryKey"`
	UserID    string    `json:"userId" gorm:"column:userId"`
	ChannelID *string   `json:"channelId" gorm:"column:channelId"`
	Message   string    `json:"message" gorm:"column:message"`
	Response  *string   `json:"response" gorm:"column:response"`
	Role      string    `json:"role" gorm:"column:role"`
	CreatedAt time.Time `json:"createdAt" gorm:"column:createdAt"`
	User      *User     `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

func (ChatMessage) TableName() string {
	return "chat_messages"
}

type Badge struct {
	ID             string    `json:"id" gorm:"column:id;primaryKey"`
	Name           string    `json:"name" gorm:"column:name"`
	Description    *string   `json:"description" gorm:"column:description"`
	Icon           *string   `json:"icon" gorm:"column:icon"`
	Color          *string   `json:"color" gorm:"column:color"`
	Category       *string   `json:"category" gorm:"column:category"`
	Criteria       *string   `json:"criteria" gorm:"column:criteria"`
	PointsRequired *int      `json:"pointsRequired" gorm:"column:pointsRequired"`
	IsActive       bool      `json:"isActive" gorm:"column:isActive"`
	CreatedAt      time.Time `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt      time.Time `json:"updatedAt" gorm:"column:updatedAt"`
}

func (Badge) TableName() string {
	return "badges"
}

type UserBadge struct {
	ID       string    `json:"id" gorm:"column:id;primaryKey"`
	UserID   string    `json:"userId" gorm:"column:userId"`
	BadgeID  string    `json:"badgeId" gorm:"column:badgeId"`
	EarnedAt time.Time `json:"earnedAt" gorm:"column:earnedAt"`
	Badge    *Badge    `json:"badge,omitempty" gorm:"foreignKey:BadgeID"`
	User     *User     `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

func (UserBadge) TableName() string {
	return "user_badges"
}

type Challenge struct {
	ID           string    `json:"id" gorm:"column:id;primaryKey"`
	Title        string    `json:"title" gorm:"column:title"`
	Description  string    `json:"description" gorm:"column:description"`
	Type         string    `json:"type" gorm:"column:type"`
	Difficulty   string    `json:"difficulty" gorm:"column:difficulty"`
	Category     *string   `json:"category" gorm:"column:category"`
	PointsReward int       `json:"pointsReward" gorm:"column:pointsReward"`
	BadgeReward  *string   `json:"badgeReward" gorm:"column:badgeReward"`
	StartDate    time.Time `json:"startDate" gorm:"column:startDate"`
	EndDate      time.Time `json:"endDate" gorm:"column:endDate"`
	IsActive     bool      `json:"isActive" gorm:"column:isActive"`
	CreatedAt    time.Time `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt    time.Time `json:"updatedAt" gorm:"column:updatedAt"`
}

func (Challenge) TableName() string {
	return "challenges"
}

type UserChallenge struct {
	ID          string     `json:"id" gorm:"column:id;primaryKey"`
	UserID      string     `json:"userId" gorm:"column:userId"`
	ChallengeID string     `json:"challengeId" gorm:"column:challengeId"`
	Status      string     `json:"status" gorm:"column:status"`
	Progress    int        `json:"progress" gorm:"column:progress"`
	CompletedAt *time.Time `json:"completedAt" gorm:"column:completedAt"`
	CreatedAt   time.Time  `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt" gorm:"column:updatedAt"`
	Challenge   *Challenge `json:"challenge,omitempty" gorm:"foreignKey:ChallengeID"`
	User        *User      `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

func (UserChallenge) TableName() string {
	return "user_challenges"
}

type Note struct {
	ID        string    `json:"id" gorm:"column:id;primaryKey"`
	UserID    string    `json:"userId" gorm:"column:userId"`
	Title     string    `json:"title" gorm:"column:title"`
	Content   string    `json:"content" gorm:"column:content"`
	Category  string    `json:"category" gorm:"column:category"`
	Tags      string    `json:"tags" gorm:"column:tags"`
	IsPinned  bool      `json:"isPinned" gorm:"column:isPinned"`
	CreatedAt time.Time `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt time.Time `json:"updatedAt" gorm:"column:updatedAt"`
	User      *User     `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

func (Note) TableName() string {
	return "notes"
}

type SpacedRepetitionCard struct {
	ID             string     `json:"id" gorm:"column:id;primaryKey"`
	UserID         string     `json:"userId" gorm:"column:userId"`
	Front          string     `json:"front" gorm:"column:front"`
	Back           string     `json:"back" gorm:"column:back"`
	Category       *string    `json:"category" gorm:"column:category"`
	Tags           string     `json:"tags" gorm:"column:tags"`
	Difficulty     string     `json:"difficulty" gorm:"column:difficulty"`
	EaseFactor     float64    `json:"easeFactor" gorm:"column:easeFactor"`
	Interval       int        `json:"interval" gorm:"column:interval"`
	Repetitions    int        `json:"repetitions" gorm:"column:repetitions"`
	NextReviewDate time.Time  `json:"nextReviewDate" gorm:"column:nextReviewDate"`
	LastReviewedAt *time.Time `json:"lastReviewedAt" gorm:"column:lastReviewedAt"`
	CreatedAt      time.Time  `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt      time.Time  `json:"updatedAt" gorm:"column:updatedAt"`
}

func (SpacedRepetitionCard) TableName() string {
	return "spaced_repetition_cards"
}
