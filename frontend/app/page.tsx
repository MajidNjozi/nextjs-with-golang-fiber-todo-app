'use client';

import { useEffect, useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
import Task from '@/components/ui/task';
import TaskForm from '@/components/ui/taskform';

interface TaskType {
  id: number;
  title: string;
  description: string;
  done: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch('http://localhost:8080/api/tasks', {
          cache: 'no-store', // Avoid caching in development
        });

        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []); // Runs only once on component mount

  return (
    <section className="flex flex-col items-center justify-center min-h-screen py-2 bg-white mx-auto max-w-2xl">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Pineapple - Just Do It
      </h1>
      <h3 className="scroll-m-20 text-2xl mt-4 font-semibold tracking-tight">
        Built with Next.js and Golang
      </h3>

      <br />
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Manage your Tasks
      </h2>
      <br />
      {/* <Form
        action="/search"
        className="flex flex-col gap-2 w-full max-w-sm items-center"
      >
        <Input type="text" placeholder="Title?" />
        <Input type="text" placeholder="Description?" />
        <Button
          className="bg-zinc-900 text-white hover:bg-zinc-900 hover:font-medium hover:text-white"
          type="submit"
        >
          Record
        </Button>
      </Form> */}
      <TaskForm />

      <br className="my-4" />
      <p className="text-sm text-muted-foreground my-4">
        Today is: {new Date().toDateString()}
      </p>

      {loading ? (
        <p className="text-gray-500">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No tasks found.</p>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          {tasks.map((task) => (
            <Task
              key={task.id}
              id={tasks.indexOf(task) + 1}
              title={task.title}
              description={task.description}
              done={task.done}
            />
          ))}
        </div>
      )}
    </section>
  );
}
