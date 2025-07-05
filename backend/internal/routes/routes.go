package routes

import (
	"backend/internal/controllers"
	"backend/internal/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.Engine, db *gorm.DB, jwtSecret string) {
	authController := controllers.NewAuthController(db, jwtSecret)
	taskController := controllers.NewTaskController(db)

	api := r.Group("/api")
	{
		api.POST("/register", authController.Register)
		api.POST("/login", authController.Login)

		// 需要鉴权的接口
		auth := api.Group("/")
		auth.Use(middleware.JWTAuth(jwtSecret))
		{
			auth.GET("/tasks", taskController.GetTasks)
			auth.POST("/tasks", taskController.CreateTask)
			auth.PUT("/tasks/:id", taskController.UpdateTask)
			auth.DELETE("/tasks/:id", taskController.DeleteTask)
			auth.DELETE("/tasks/permanent/:id", taskController.RemoveTaskPermanently)
		}
	}
}

func RegisterTaskRoutes(r *gin.Engine, db *gorm.DB) {
	tc := &controllers.TaskController{DB: db}
	task := r.Group("/api/tasks")
	{
		task.GET("", tc.ListTasks)
		task.POST("", tc.CreateTask)
		task.PUT("/:id", tc.UpdateTask)
		task.DELETE("/:id", tc.DeleteTask)                      // 软删除
		task.DELETE("/permanent/:id", tc.RemoveTaskPermanently) // 彻底删除
	}
}
