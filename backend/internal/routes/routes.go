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
			auth.DELETE("/tasks/permanent/:id", taskController.PermanentlyDeleteTask)
		}
	}
}
