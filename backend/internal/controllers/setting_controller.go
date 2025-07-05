package controllers

import (
	"net/http"

	"backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type SettingController struct {
	DB *gorm.DB
}

func NewSettingController(db *gorm.DB) *SettingController {
	return &SettingController{DB: db}
}

// GetUserSettings 获取用户设置
func (sc *SettingController) GetUserSettings(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var settings models.UserSetting
	if err := sc.DB.Where("user_id = ?", userID).First(&settings).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"fontFamily":      "Arial",
			"fontSize":        14,
			"backgroundImage": "",
			"theme":           "light",
		})
		return
	}

	c.JSON(http.StatusOK, settings)
}

// UpdateUserSettings 更新用户设置
func (sc *SettingController) UpdateUserSettings(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var settingsInput struct {
		FontFamily      string `json:"fontFamily"`
		FontSize        int    `json:"fontSize"`
		BackgroundImage string `json:"backgroundImage"`
		Theme           string `json:"theme"`
	}

	if err := c.ShouldBindJSON(&settingsInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var settings models.UserSetting
	if err := sc.DB.Where("user_id = ?", userID).First(&settings).Error; err != nil {
		// 如果不存在则创建
		settings = models.UserSetting{
			UserID:          userID.(uint),
			FontFamily:      settingsInput.FontFamily,
			FontSize:        settingsInput.FontSize,
			BackgroundImage: settingsInput.BackgroundImage,
			Theme:           settingsInput.Theme,
		}
		if err := sc.DB.Create(&settings).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create settings"})
			return
		}
	} else {
		// 更新现有设置
		settings.FontFamily = settingsInput.FontFamily
		settings.FontSize = settingsInput.FontSize
		settings.BackgroundImage = settingsInput.BackgroundImage
		settings.Theme = settingsInput.Theme

		if err := sc.DB.Save(&settings).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update settings"})
			return
		}
	}

	c.JSON(http.StatusOK, settings)
}

// UploadBackgroundImage 上传背景图片
func (sc *SettingController) UploadBackgroundImage(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
		return
	}

	// 在实际应用中，应该将文件保存到安全的存储位置
	filePath := "uploads/backgrounds/" + file.Filename
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// 更新用户设置中的背景图片路径
	var settings models.UserSetting
	if err := sc.DB.Where("user_id = ?", userID).First(&settings).Error; err != nil {
		settings = models.UserSetting{
			UserID:          userID.(uint),
			BackgroundImage: filePath,
		}
		if err := sc.DB.Create(&settings).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create settings"})
			return
		}
	} else {
		settings.BackgroundImage = filePath
		if err := sc.DB.Save(&settings).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update settings"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"backgroundImage": filePath})
}
