import { CircleCheck, PenBox, Trash2 } from 'lucide-react';

interface TaskProps {
  id: number;
  id2: number;
  title: string;
  description: string;
  done: boolean;
  markTaskAsDone: (id: number) => void;
  deleteTask: (id: number) => void;
}

export default function Task({
  id,
  id2,
  title,
  description,
  done,
  markTaskAsDone,
  deleteTask,
}: TaskProps) {
  return (
    <section className="flex p-3 w-[680px] border border-black justify-between">
      <p className="font-black">{id2}</p>
      <div>
        <p
          className={`mx-2 w-[400px] font-semibold ${
            done ? 'line-through text-gray-500' : ''
          }`}
        >
          {title}
        </p>
        <p
          className={`mx-2 w-[400px] ${
            done ? 'line-through text-gray-500' : ''
          }`}
        >
          {description}
        </p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => markTaskAsDone(id)}>
          <CircleCheck className={done ? 'text-green-600' : 'text-gray-500'} />
        </button>
        <button>
          <PenBox className="text-zinc-500" />
        </button>
        <button onClick={() => deleteTask(id)}>
          <Trash2 className="text-red-500" />
        </button>
      </div>
    </section>
  );
}
