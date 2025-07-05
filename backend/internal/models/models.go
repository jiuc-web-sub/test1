package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint   `gorm:"primaryKey"`
	Username  string `gorm:"unique;not null"`
	Password  string `gorm:"not null"`
	Nickname  string `gorm:"size:100"` // 新增昵称字段
	Email     string `gorm:"size:100"` // 不加not null
	AvatarURL string `gorm:"size:255"`
}

type Task struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	DueDate     time.Time `json:"dueDate"`
	UserID      uint      `json:"userId"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	Category    string    `json:"category"`
	Tags        string    `json:"tags"`
	IsDeleted   bool      `json:"isDeleted" gorm:"default:false"`
}

type TaskResource struct {
	gorm.Model
	TaskID   uint   `gorm:"not null"`
	FileName string `gorm:"size:255;not null"`
	FilePath string `gorm:"size:255;not null"`
	FileSize int64  `gorm:"not null"`
	Task     Task   `gorm:"foreignKey:TaskID"`
}

type UserSetting struct {
	gorm.Model
	UserID          uint   `gorm:"not null;unique"`
	FontFamily      string `gorm:"size:50;default:'Arial'"`
	FontSize        int    `gorm:"default:14"`
	BackgroundImage string `gorm:"size:255"`
	Theme           string `gorm:"size:20;default:'light'"`
	User            User   `gorm:"foreignKey:UserID"`
}
