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
import { CreateUserFormSchema } from "@/lib/validation";
import { toast } from "sonner";
import useCreateUser from "@/hooks/users/useCreateUser";

interface Props {
  onSuccess: () => void;
}

export function CreateUserForm({ onSuccess }: Props) {
  const form = useForm<z.infer<typeof CreateUserFormSchema>>({
    resolver: zodResolver(CreateUserFormSchema),
    defaultValues: {
      name: "",
      role: "",
    },
  });

  const createUserMutation = useCreateUser();

  const handleSubmit = async (data: z.infer<typeof CreateUserFormSchema>) => {
    try {
      createUserMutation.mutate(
        { formData: { name: data.name, role: data.role } },
        {
          onSuccess: () => {
            toast.success("User created successfully");
            form.reset();
            onSuccess();
          },
          onError: (error) => {
            toast.error("Failed to create user");
            console.error("Error creating user:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Create User</h2>
          <p className="text-sm text-muted-foreground">
            Fill out the form below to create a new user.
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
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full"
                  placeholder="admin or user"
                />
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

export default CreateUserForm;
