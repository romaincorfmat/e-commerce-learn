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
import Link from "next/link";
import React from "react";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z, ZodType } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

interface Props<T extends FieldValues> {
  type: "SIGN_IN" | "SIGN_UP";
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<AuthResponse>;
}

export function AuthForm<T extends FieldValues>({
  type,
  defaultValues,
  schema,
  onSubmit,
}: Props<T>) {
  const { fetchUserData } = useUser();
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    try {
      console.log("Form data Submitted", data);
      const response = await onSubmit(data);

      // Check response and show appropriate toast
      if (response.success) {
        toast.success(
          response.message ||
            (type === "SIGN_IN"
              ? "Signed in successfully!"
              : "Account created successfully!")
        );

        await fetchUserData();
        router.push("/dashboard");
      } else {
        toast.error(
          response.message || "Authentication failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Authentication failed. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div>
          <h1 className="text-xl font-bold">
            {type === "SIGN_IN"
              ? "Welcome to ShopOnline"
              : "Welcome back to ShopOnline"}
          </h1>
          <p className="text-muted-foreground">
            {type === "SIGN_IN"
              ? "Log back in to manage your orders"
              : "Create an account to get started"}
          </p>
        </div>
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={`Enter your ${field.name}`}
                    type={field.name === "password" ? "password" : "text"}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button className="w-full">Submit</Button>
        {type === "SIGN_IN" ? (
          <>
            <p>
              Don&apos;t have an account ?{" "}
              <Link
                href={"/auth/sign-up"}
                className="font-semibold text-blue-400 hover:text-blue-500"
              >
                Sign Up
              </Link>
            </p>
          </>
        ) : (
          <>
            <p>
              Already have an account?{" "}
              <Link
                href={"/auth/sign-in"}
                className="font-semibold text-blue-400 hover:text-blue-500"
              >
                Sign In
              </Link>
            </p>
          </>
        )}
      </form>
    </Form>
  );
}

export default AuthForm;
