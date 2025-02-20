import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Task from '@/components/ui/task';

interface TaskType {
  id: number;
  title: string;
  description: string;
  done: boolean;
}

async function getTasks(): Promise<TaskType[]> {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/task', {
      cache: 'no-store', // Avoid caching in development
    });

    if (!res.ok) {
      throw new Error('Failed to fetch tasks');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export default async function Home() {
  const tasks = await getTasks();

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
      <section className="flex w-full max-w-sm items-center space-x-2">
        <Input type="text" placeholder="What needs to be done?" />
        <Button type="submit">Record</Button>
      </section>
      <br className="my-4" />
      <p className="text-sm text-muted-foreground my-4">
        Today is: {new Date().toDateString()}
      </p>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks found.</p>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          {tasks.map((task) => (
            <Task key={task.id} title={task.title} done={task.done} />
          ))}
        </div>
      )}
    </section>
  );
}
