import { CircleCheck, Trash2 } from 'lucide-react';

interface TaskProps {
  id: number;
  title: string;
  description: string;
  done: boolean;
}

export default function Task({ id, title, description, done }: TaskProps) {
  return (
    <section className="flex p-3 w-[600px] border border-black justify-between">
      <p className="font-black">{id}</p>
      <div>
        <p
          className={`mx-2 w-[400px] font-semibold ${
            done ? 'line-through text-gray-500' : ''
          }`}
        >
          {title}
        </p>
        <p className="mx-2 w-[400px] text-gray-500">{description}</p>
      </div>
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
