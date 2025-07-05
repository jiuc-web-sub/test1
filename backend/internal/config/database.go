package config

import (
	"time"

	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
)

// InitDB 初始化数据库连接
func InitDB(cfg *Config) (*gorm.DB, error) {
	dsn := "sqlserver://" + cfg.DBUser + ":" + cfg.DBPassword + "@" + cfg.DBHost + ":" + cfg.DBPort + "?database=" + cfg.DBName

	db, err := gorm.Open(sqlserver.Open(dsn), &gorm.Config{
		// 禁用外键约束（根据需求可选）
		DisableForeignKeyConstraintWhenMigrating: true,
	})

	if err != nil {
		return nil, err
	}

	// 配置连接池
	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	return db, nil
}
