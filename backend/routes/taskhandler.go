package routes

import (
	"errors"
	"go-to-do-app/database"
	"go-to-do-app/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
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

func MarkTaskAsDone(c *fiber.Ctx) error {
	taskID := c.Params("id")

	// Ensure taskID is a valid integer
	id, err := strconv.Atoi(taskID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid task ID",
		})
	}

	// Try fetching the task
	var task models.Task
	if err := database.Database.First(&task, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Task not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to retrieve task",
		})
	}

	// Toggle the task's done status
	task.Done = !task.Done

	// Save the updated task
	if err := database.Database.Save(&task).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update task",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Task updated successfully",
		"done":    task.Done, // Return the new status
	})
}
