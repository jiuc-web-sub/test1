package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UserController struct {
	DB *gorm.DB
}

func NewUserController(db *gorm.DB) *UserController {
	return &UserController{DB: db}
}

// 用户信息接口示例
func (uc *UserController) Profile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"code": 1, "msg": "未授权"})
		return
	}
	// 假设有 User 模型
	var user struct {
		ID        uint
		Username  string
		Nickname  string
		Email     string
		AvatarURL string
	}
	if err := uc.DB.Table("users").Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 1, "msg": "用户不存在"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 0, "data": user})
}
