package main

import (
	"go-to-do-app/database"
	"go-to-do-app/routes"

	"github.com/gofiber/fiber/v2"
)

func main() {

database.ConnectDB()

	appConfig := fiber.Config{
		Immutable: true,
		CaseSensitive: false,
		StrictRouting: false,
	}
	app := fiber.New(appConfig)

	app.Get("/api/welcome", func(c *fiber.Ctx) error {
		return c.SendString("Welcome to TO DO APP APIs")
	})


	app.Get("/api/tasks", routes.GetAllTasks)
	app.Post("/api/task", routes.CreateTask)
	app.Put("/api/task", routes.UpdateTask)
	app.Delete("/api/task/:id<int>", routes.DeleteTask)

	app.Listen(":8080")
}