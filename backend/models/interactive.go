package models

import "time"

type QuestionBank struct {
	ID             string     `json:"id" gorm:"column:id;primaryKey"`
	Title          string     `json:"title" gorm:"column:title"`
	Description    *string    `json:"description" gorm:"column:description"`
	Category       string     `json:"category" gorm:"column:category"`
	Difficulty     string     `json:"difficulty" gorm:"column:difficulty"`
	TotalQuestions int        `json:"totalQuestions" gorm:"column:totalQuestions"`
	EstimatedTime  *string    `json:"estimatedTime" gorm:"column:estimatedTime"`
	Tags           string     `json:"tags" gorm:"column:tags"`
	IsPublished    bool       `json:"isPublished" gorm:"column:isPublished"`
	CreatedAt      time.Time  `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt      time.Time  `json:"updatedAt" gorm:"column:updatedAt"`
	Questions      []Question `json:"questions,omitempty" gorm:"foreignKey:QuestionBankID"`
}

func (QuestionBank) TableName() string {
	return "question_banks"
}

type Question struct {
	ID             string        `json:"id" gorm:"column:id;primaryKey"`
	QuestionBankID string        `json:"questionBankId" gorm:"column:questionBankId"`
	Question       string        `json:"question" gorm:"column:question"`
	Options        string        `json:"options" gorm:"column:options"`
	CorrectAnswer  int           `json:"correctAnswer" gorm:"column:correctAnswer"`
	Explanation    *string       `json:"explanation" gorm:"column:explanation"`
	Difficulty     string        `json:"difficulty" gorm:"column:difficulty"`
	Tags           string        `json:"tags" gorm:"column:tags"`
	CreatedAt      time.Time     `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt      time.Time     `json:"updatedAt" gorm:"column:updatedAt"`
	QuestionBank   *QuestionBank `json:"questionBank,omitempty" gorm:"foreignKey:QuestionBankID"`
}

func (Question) TableName() string {
	return "questions"
}

type StudyGuide struct {
	ID            string    `json:"id" gorm:"column:id;primaryKey"`
	Title         string    `json:"title" gorm:"column:title"`
	Description   *string   `json:"description" gorm:"column:description"`
	Content       string    `json:"content" gorm:"column:content"`
	Category      string    `json:"category" gorm:"column:category"`
	Difficulty    string    `json:"difficulty" gorm:"column:difficulty"`
	EstimatedTime *string   `json:"estimatedTime" gorm:"column:estimatedTime"`
	Tags          string    `json:"tags" gorm:"column:tags"`
	IsPublished   bool      `json:"isPublished" gorm:"column:isPublished"`
	Views         int       `json:"views" gorm:"column:views"`
	CreatedAt     time.Time `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt     time.Time `json:"updatedAt" gorm:"column:updatedAt"`
}

func (StudyGuide) TableName() string {
	return "study_guides"
}

type Magazine struct {
	ID          string            `json:"id" gorm:"column:id;primaryKey"`
	Title       string            `json:"title" gorm:"column:title"`
	Issue       *string           `json:"issue" gorm:"column:issue"`
	Volume      *string           `json:"volume" gorm:"column:volume"`
	Description *string           `json:"description" gorm:"column:description"`
	CoverUrl    *string           `json:"coverUrl" gorm:"column:coverUrl"`
	PublishedAt *time.Time        `json:"publishedAt" gorm:"column:publishedAt"`
	Category    *string           `json:"category" gorm:"column:category"`
	Tags        string            `json:"tags" gorm:"column:tags"`
	IsPublished bool              `json:"isPublished" gorm:"column:isPublished"`
	Views       int               `json:"views" gorm:"column:views"`
	CreatedAt   time.Time         `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt   time.Time         `json:"updatedAt" gorm:"column:updatedAt"`
	Articles    []MagazineArticle `json:"articles,omitempty" gorm:"foreignKey:MagazineID"`
}

func (Magazine) TableName() string {
	return "magazines"
}

type MagazineArticle struct {
	ID         string    `json:"id" gorm:"column:id;primaryKey"`
	MagazineID string    `json:"magazineId" gorm:"column:magazineId"`
	Title      string    `json:"title" gorm:"column:title"`
	Author     string    `json:"author" gorm:"column:author"`
	Content    string    `json:"content" gorm:"column:content"`
	PageNumber *int      `json:"pageNumber" gorm:"column:pageNumber"`
	Order      int       `json:"order" gorm:"column:order"`
	CreatedAt  time.Time `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt  time.Time `json:"updatedAt" gorm:"column:updatedAt"`
	Magazine   *Magazine `json:"magazine,omitempty" gorm:"foreignKey:MagazineID"`
}

func (MagazineArticle) TableName() string {
	return "magazine_articles"
}

type Video struct {
	ID           string      `json:"id" gorm:"column:id;primaryKey"`
	Title        string      `json:"title" gorm:"column:title"`
	Description  *string     `json:"description" gorm:"column:description"`
	Url          string      `json:"url" gorm:"column:url"`
	Thumbnail    *string     `json:"thumbnail" gorm:"column:thumbnail"`
	Duration     *string     `json:"duration" gorm:"column:duration"`
	Category     *string     `json:"category" gorm:"column:category"`
	Difficulty   string      `json:"difficulty" gorm:"column:difficulty"`
	Tags         string      `json:"tags" gorm:"column:tags"`
	CurriculumID *string     `json:"curriculumId" gorm:"column:curriculumId"`
	ModuleID     *string     `json:"moduleId" gorm:"column:moduleId"`
	TopicID      *string     `json:"topicId" gorm:"column:topicId"`
	IsPublished  bool        `json:"isPublished" gorm:"column:isPublished"`
	Views        int         `json:"views" gorm:"column:views"`
	CreatedAt    time.Time   `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt    time.Time   `json:"updatedAt" gorm:"column:updatedAt"`
	Curriculum   *Curriculum `json:"curriculum,omitempty" gorm:"foreignKey:CurriculumID"`
	Module       *Module     `json:"module,omitempty" gorm:"foreignKey:ModuleID"`
	Topic        *Topic      `json:"topic,omitempty" gorm:"foreignKey:TopicID"`
}

func (Video) TableName() string {
	return "videos"
}

type FlashcardSet struct {
	ID          string      `json:"id" gorm:"column:id;primaryKey"`
	Title       string      `json:"title" gorm:"column:title"`
	Description *string     `json:"description" gorm:"column:description"`
	Category    *string     `json:"category" gorm:"column:category"`
	Difficulty  string      `json:"difficulty" gorm:"column:difficulty"`
	Tags        string      `json:"tags" gorm:"column:tags"`
	IsPublished bool        `json:"isPublished" gorm:"column:isPublished"`
	CreatedAt   time.Time   `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt   time.Time   `json:"updatedAt" gorm:"column:updatedAt"`
	Flashcards  []Flashcard `json:"flashcards,omitempty" gorm:"foreignKey:FlashcardSetID"`
}

func (FlashcardSet) TableName() string {
	return "flashcard_sets"
}

type Flashcard struct {
	ID             string        `json:"id" gorm:"column:id;primaryKey"`
	FlashcardSetID string        `json:"flashcardSetId" gorm:"column:flashcardSetId"`
	Front          string        `json:"front" gorm:"column:front"`
	Back           string        `json:"back" gorm:"column:back"`
	Category       *string       `json:"category" gorm:"column:category"`
	Hint           *string       `json:"hint" gorm:"column:hint"`
	Order          int           `json:"order" gorm:"column:order"`
	CreatedAt      time.Time     `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt      time.Time     `json:"updatedAt" gorm:"column:updatedAt"`
	FlashcardSet   *FlashcardSet `json:"flashcardSet,omitempty" gorm:"foreignKey:FlashcardSetID"`
}

func (Flashcard) TableName() string {
	return "flashcards"
}

type Simulation struct {
	ID             string           `json:"id" gorm:"column:id;primaryKey"`
	Title          string           `json:"title" gorm:"column:title"`
	Description    *string          `json:"description" gorm:"column:description"`
	PatientAge     *int             `json:"patientAge" gorm:"column:patientAge"`
	PatientGender  *string          `json:"patientGender" gorm:"column:patientGender"`
	ChiefComplaint string           `json:"chiefComplaint" gorm:"column:chiefComplaint"`
	Scenario       string           `json:"scenario" gorm:"column:scenario"`
	Difficulty     string           `json:"difficulty" gorm:"column:difficulty"`
	Category       *string          `json:"category" gorm:"column:category"`
	Tags           string           `json:"tags" gorm:"column:tags"`
	EstimatedTime  *string          `json:"estimatedTime" gorm:"column:estimatedTime"`
	IsPublished    bool             `json:"isPublished" gorm:"column:isPublished"`
	CreatedAt      time.Time        `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt      time.Time        `json:"updatedAt" gorm:"column:updatedAt"`
	Steps          []SimulationStep `json:"steps,omitempty" gorm:"foreignKey:SimulationID"`
}

func (Simulation) TableName() string {
	return "simulations"
}

type SimulationStep struct {
	ID           string      `json:"id" gorm:"column:id;primaryKey"`
	SimulationID string      `json:"simulationId" gorm:"column:simulationId"`
	Title        string      `json:"title" gorm:"column:title"`
	Description  string      `json:"description" gorm:"column:description"`
	StepType     string      `json:"stepType" gorm:"column:stepType"`
	Order        int         `json:"order" gorm:"column:order"`
	Data         string      `json:"data" gorm:"column:data"`
	CreatedAt    time.Time   `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt    time.Time   `json:"updatedAt" gorm:"column:updatedAt"`
	Simulation   *Simulation `json:"simulation,omitempty" gorm:"foreignKey:SimulationID"`
}

func (SimulationStep) TableName() string {
	return "simulation_steps"
}

type Article struct {
	ID          string    `json:"id" gorm:"column:id;primaryKey"`
	Title       string    `json:"title" gorm:"column:title"`
	Author      string    `json:"author" gorm:"column:author"`
	AuthorID    *string   `json:"authorId" gorm:"column:authorId"`
	AuthorBio   *string   `json:"authorBio" gorm:"column:authorBio"`
	Journal     *string   `json:"journal" gorm:"column:journal"`
	Category    *string   `json:"category" gorm:"column:category"`
	Abstract    *string   `json:"abstract" gorm:"column:abstract"`
	Content     string    `json:"content" gorm:"column:content"`
	Keywords    string    `json:"keywords" gorm:"column:keywords"`
	References  string    `json:"references" gorm:"column:references"`
	ReadTime    *string   `json:"readTime" gorm:"column:readTime"`
	Difficulty  string    `json:"difficulty" gorm:"column:difficulty"`
	Views       int       `json:"views" gorm:"column:views"`
	IsPublished bool      `json:"isPublished" gorm:"column:isPublished"`
	PublishedAt *time.Time `json:"publishedAt" gorm:"column:publishedAt"`
	CreatedAt   time.Time `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt   time.Time `json:"updatedAt" gorm:"column:updatedAt"`
}

func (Article) TableName() string {
	return "articles"
}

type Concept struct {
	ID          string    `json:"id" gorm:"column:id;primaryKey"`
	Title       string    `json:"title" gorm:"column:title"`
	Description string    `json:"description" gorm:"column:description"`
	Content     string    `json:"content" gorm:"column:content"`
	Category    string    `json:"category" gorm:"column:category"`
	Difficulty  string    `json:"difficulty" gorm:"column:difficulty"`
	ReadTime    *string   `json:"readTime" gorm:"column:readTime"`
	Tags        string    `json:"tags" gorm:"column:tags"`
	Summary     *string   `json:"summary" gorm:"column:summary"`
	KeyPoints   *string   `json:"keyPoints" gorm:"column:keyPoints"`
	IsPublished bool      `json:"isPublished" gorm:"column:isPublished"`
	Views       int       `json:"views" gorm:"column:views"`
	CreatedAt   time.Time `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt   time.Time `json:"updatedAt" gorm:"column:updatedAt"`
}

func (Concept) TableName() string {
	return "concepts"
}

