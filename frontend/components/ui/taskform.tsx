'use client';
// import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).min(5).max(50),
});

export default function TaskForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      title: '',
      description: '',
    },
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('http://localhost:8080/api/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the form');
      }

      toast('Task submitted successfully!');

      // Reset form fields
      form.reset();

      // Refresh API (replace with better revalidation if using Next.js)
      window.location.reload();
    } catch (error) {
      console.error('Form submission error', error);
      toast('Failed to submit the form. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-3xl mx-auto py-1 w-full"
      >
        <div className="w-full gap-4">
          <div className="">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task name</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" type="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task description</FormLabel>
              <FormControl>
                <Input
                  placeholder="What needs to be done?"
                  type="text"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="bg-zinc-800 font-medium text-white hover:text-white hover:bg-zinc-800"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
