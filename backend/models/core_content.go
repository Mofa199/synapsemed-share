package models

import "time"

type Module struct {
	ID           string     `json:"id" gorm:"column:id;primaryKey"`
	Name         string     `json:"name" gorm:"column:name"`
	Description  *string    `json:"description" gorm:"column:description"`
	CurriculumID string     `json:"curriculumId" gorm:"column:curriculumId"`
	Order        int        `json:"order" gorm:"column:order"`
	IsActive     bool       `json:"isActive" gorm:"column:isActive"`
	CreatedAt    time.Time  `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt    time.Time  `json:"updatedAt" gorm:"column:updatedAt"`
	Curriculum   Curriculum `json:"curriculum,omitempty" gorm:"foreignKey:CurriculumID"`
}

func (Module) TableName() string {
	return "modules"
}

type Topic struct {
	ID           string      `json:"id" gorm:"column:id;primaryKey"`
	Title        string      `json:"title" gorm:"column:title"`
	Description  string      `json:"description" gorm:"column:description"`
	Content      string      `json:"content" gorm:"column:content"`
	Type         string      `json:"type" gorm:"column:type"`
	Difficulty   string      `json:"difficulty" gorm:"column:difficulty"`
	Duration     *string     `json:"duration" gorm:"column:duration"`
	Category     *string     `json:"category" gorm:"column:category"`
	Tags         string      `json:"tags" gorm:"column:tags"`
	IsPublished  bool        `json:"isPublished" gorm:"column:isPublished"`
	Views        int         `json:"views" gorm:"column:views"`
	CurriculumID *string     `json:"curriculumId" gorm:"column:curriculumId"`
	ModuleID     *string     `json:"moduleId" gorm:"column:moduleId"`
	CreatedAt    time.Time   `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt    time.Time   `json:"updatedAt" gorm:"column:updatedAt"`
	Curriculum   *Curriculum `json:"curriculum,omitempty" gorm:"foreignKey:CurriculumID"`
	Module       *Module     `json:"module,omitempty" gorm:"foreignKey:ModuleID"`
}

func (Topic) TableName() string {
	return "topics"
}

type Book struct {
	ID              string      `json:"id" gorm:"column:id;primaryKey"`
	Title           string      `json:"title" gorm:"column:title"`
	Author          string      `json:"author" gorm:"column:author"`
	Isbn            *string     `json:"isbn" gorm:"column:isbn"`
	Publisher       *string     `json:"publisher" gorm:"column:publisher"`
	PublicationYear *int        `json:"publicationYear" gorm:"column:publicationYear"`
	Edition         *string     `json:"edition" gorm:"column:edition"`
	Pages           *int        `json:"pages" gorm:"column:pages"`
	Language        string      `json:"language" gorm:"column:language"`
	Format          string      `json:"format" gorm:"column:format"`
	Description     *string     `json:"description" gorm:"column:description"`
	CoverUrl        *string     `json:"coverUrl" gorm:"column:coverUrl"`
	FileUrl         *string     `json:"fileUrl" gorm:"column:fileUrl"`
	Category        *string     `json:"category" gorm:"column:category"`
	Tags            string      `json:"tags" gorm:"column:tags"`
	IsPublished     bool        `json:"isPublished" gorm:"column:isPublished"`
	Views           int         `json:"views" gorm:"column:views"`
	CurriculumID    *string     `json:"curriculumId" gorm:"column:curriculumId"`
	ModuleID        *string     `json:"moduleId" gorm:"column:moduleId"`
	CreatedAt       time.Time   `json:"createdAt" gorm:"column:createdAt"`
	UpdatedAt       time.Time   `json:"updatedAt" gorm:"column:updatedAt"`
	Curriculum      *Curriculum `json:"curriculum,omitempty" gorm:"foreignKey:CurriculumID"`
	Module          *Module     `json:"module,omitempty" gorm:"foreignKey:ModuleID"`
}

func (Book) TableName() string {
	return "books"
}
