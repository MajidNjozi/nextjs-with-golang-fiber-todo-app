package routes

import (
	"go-to-do-app/database"
	"go-to-do-app/models"

	"github.com/gofiber/fiber/v2"
)

// GetAllTasks fetches all tasks from the database
func GetAllTasks(c *fiber.Ctx) error {
	var tasks []models.Task

	// Fetch all tasks
	result := database.Database.Find(&tasks)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch tasks",
		})
	}

	return c.JSON(tasks)

}

func CreateTask(c *fiber.Ctx) error {
	var task models.Task
	if err := c.BodyParser(&task); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Save task to database
	result := database.Database.Create(&task)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create task",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"id":          task.ID,
		"title":       task.Title,
		"description": task.Description,
		"done":        task.Done,
	})
}

func UpdateTask(c *fiber.Ctx) error {
	var task models.Task

	// Parse request body
	if err := c.BodyParser(&task); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Ensure the task exists before updating
	existingTask := models.Task{}
	if err := database.Database.First(&existingTask, task.ID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Task not found",
		})
	}

	// Update only the fields that are provided in the request
	result := database.Database.Model(&existingTask).Updates(task)

	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(existingTask)
}

func DeleteTask(c *fiber.Ctx) error {
	id := c.Params("id") // Get the ID from URL parameter

	// Check if task exists
	var task models.Task
	if err := database.Database.First(&task, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Task not found",
		})
	}

	// Delete the task
	if err := database.Database.Delete(&task).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete task",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Task deleted successfully",
	})
}
