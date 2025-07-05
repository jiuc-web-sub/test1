package controllers

import (
	"net/http"
	"time"

	"backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TaskController struct {
	DB *gorm.DB
}

func NewTaskController(db *gorm.DB) *TaskController {
	return &TaskController{DB: db}
}

// 获取任务列表
func (tc *TaskController) GetTasks(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"code": 1, "msg": "未授权"})
		return
	}

	var tasks []models.Task
	if err := tc.DB.Where("user_id = ?", userID).Order("due_date asc").Find(&tasks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 1, "msg": "获取任务失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "msg": "success", "data": tasks})
}

// 创建任务
func (tc *TaskController) CreateTask(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"code": 1, "msg": "未授权"})
		return
	}

	var input struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description"`
		DueDate     string `json:"dueDate" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 1, "msg": "参数错误"})
		return
	}

	due, err := time.Parse("2006-01-02", input.DueDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 1, "msg": "截止日期格式错误"})
		return
	}

	task := models.Task{
		Title:       input.Title,
		Description: input.Description,
		DueDate:     due,
		UserID:      userID.(uint),
	}

	if err := tc.DB.Create(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 1, "msg": "创建任务失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "msg": "创建成功", "data": task})
}

// 更新任务
func (tc *TaskController) UpdateTask(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"code": 1, "msg": "未授权"})
		return
	}

	id := c.Param("id")
	var task models.Task
	if err := tc.DB.Where("id = ? AND user_id = ?", id, userID).First(&task).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 1, "msg": "任务不存在"})
		return
	}

	var input struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		DueDate     string `json:"dueDate"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 1, "msg": "参数错误"})
		return
	}

	if input.Title != "" {
		task.Title = input.Title
	}
	if input.Description != "" {
		task.Description = input.Description
	}
	if input.DueDate != "" {
		due, err := time.Parse("2006-01-02", input.DueDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 1, "msg": "截止日期格式错误"})
			return
		}
		task.DueDate = due
	}

	if err := tc.DB.Save(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 1, "msg": "更新任务失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "msg": "更新成功", "data": task})
}

// 删除任务
func (tc *TaskController) DeleteTask(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"code": 1, "msg": "未授权"})
		return
	}

	id := c.Param("id")
	if err := tc.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Task{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 1, "msg": "删除任务失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "msg": "删除成功"})
}

// UploadTaskResource 上传任务相关资料
func (tc *TaskController) UploadTaskResource(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	taskID := c.Param("id")

	// 验证任务是否存在且属于该用户
	var task models.Task
	if err := tc.DB.Where("id = ? AND user_id = ?", taskID, userID).First(&task).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
		return
	}

	// 在实际应用中，应该将文件保存到安全的存储位置
	filePath := "uploads/" + file.Filename
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	resource := models.TaskResource{
		TaskID:   task.ID,
		FileName: file.Filename,
		FilePath: filePath,
		FileSize: file.Size,
	}

	if err := tc.DB.Create(&resource).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save resource"})
		return
	}

	c.JSON(http.StatusCreated, resource)
}

// PermanentlyDeleteTask 彻底删除任务
func (tc *TaskController) PermanentlyDeleteTask(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(401, gin.H{"code": 1, "msg": "未授权"})
		return
	}
	id := c.Param("id")
	var task models.Task
	if err := tc.DB.Where("id = ? AND user_id = ?", id, userID).First(&task).Error; err != nil {
		c.JSON(404, gin.H{"code": 1, "msg": "任务不存在"})
		return
	}
	if !task.IsDeleted {
		c.JSON(400, gin.H{"code": 1, "msg": "只能彻底删除回收站中的任务"})
		return
	}
	if err := tc.DB.Delete(&task).Error; err != nil {
		c.JSON(500, gin.H{"code": 1, "msg": "彻底删除失败"})
		return
	}
	c.JSON(200, gin.H{"code": 0, "msg": "彻底删除成功"})
}

// getColorCodeByDueDate 根据截止日期返回颜色代码
/*func getColorCodeByDueDate(dueDate time.Time) string {
	now := time.Now()
	diff := dueDate.Sub(now)

	if diff < 24*time.Hour {
		return "#ff6b6b" // 红色 - 紧急
	} else if diff < 7*24*time.Hour {
		return "#feca57" // 橙色 - 一周内到期
	} else {
		return "#1dd1a1" // 绿色 - 还有时间
	}
}*/
