"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateCategoryFormSchema } from "@/lib/validation";
import { toast } from "sonner";
import useCreateCategory from "@/hooks/categories/useCreateCategory";

interface Props {
  onSuccess: () => void;
}

export function CreateCategoryForm({ onSuccess }: Props) {
  const form = useForm<z.infer<typeof CreateCategoryFormSchema>>({
    resolver: zodResolver(CreateCategoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const createCategoryMutation = useCreateCategory();

  const handleSubmit = async (
    data: z.infer<typeof CreateCategoryFormSchema>
  ) => {
    console.log("Form data Submitted", data);
    try {
      createCategoryMutation.mutate(
        { name: data.name },
        {
          onSuccess: () => {
            toast.success("Category created successfully");
            form.reset();
            onSuccess();
          },
          onError: (error) => {
            toast.error("Failed to create category");
            console.error("Error creating category:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Create Category</h2>
          <p className="text-sm text-muted-foreground">
            Fill out the form below to create a new category.
          </p>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full">Submit</Button>
      </form>
    </Form>
  );
}

export default CreateCategoryForm;
