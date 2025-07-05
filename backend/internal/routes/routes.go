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
	userController := controllers.NewUserController(db) // ★新增这一行

	// 公共路由
	r.POST("/api/auth/login", authController.Login)
	r.POST("/api/auth/register", authController.Register)

	// 需要鉴权的路由
	auth := r.Group("/api")
	auth.Use(middleware.JWTAuth(jwtSecret))
	{
		// 这里写需要登录才能访问的接口
		auth.GET("/user/profile", userController.Profile)

		auth.GET("/tasks", taskController.GetTasks)
		auth.POST("/tasks", taskController.CreateTask)
		auth.PUT("/tasks/:id", taskController.UpdateTask)
		auth.DELETE("/tasks/:id", taskController.DeleteTask)
		auth.DELETE("/tasks/permanent/:id", taskController.RemoveTaskPermanently)
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
