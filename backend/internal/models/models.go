package models

import (
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
	gorm.Model
	Title       string `json:"title"`
	DueDate     string `json:"dueDate"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Tags        string `json:"tags"`      // 用逗号分隔的标签
	IsDeleted   bool   `json:"isDeleted"` // 软删除标记
	Completed   bool   `json:"completed"` // 新增：任务完成状态
	UserID      uint   `json:"userId"`
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
