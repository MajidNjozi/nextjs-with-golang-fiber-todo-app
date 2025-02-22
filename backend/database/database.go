package database

import (
	"go-to-do-app/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var Database *gorm.DB // ✅ Change from DBInstance to *gorm.DB

func ConnectDB() {
	db, err := gorm.Open(sqlite.Open("todolist.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(&models.Task{})

	Database = db // ✅ Assign the direct *gorm.DB instance
}
