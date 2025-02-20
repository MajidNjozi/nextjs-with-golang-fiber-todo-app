import { CircleCheck, Trash2 } from 'lucide-react';

interface TaskProps {
  title: string;
  done: boolean;
}

export default function Task({ title, done }: TaskProps) {
  return (
    <section className="flex p-3 w-[600px] border border-black justify-between">
      <p
        className={`mx-2 w-[400px] ${done ? 'line-through text-gray-500' : ''}`}
      >
        {title}
      </p>
      <div className="flex gap-2">
        <button>
          <CircleCheck className={done ? 'text-green-500' : 'text-gray-500'} />
        </button>
        <button>
          <Trash2 className="text-red-500" />
        </button>
      </div>
    </section>
  );
}
