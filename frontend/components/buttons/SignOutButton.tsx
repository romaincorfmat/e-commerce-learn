"use client";
import React from "react";
import { Button } from "../ui/button";
import { signOut } from "@/app/api/auth/route";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      const response = await signOut();

      if (response.success) {
        toast.success(response.message || "Signed out successfully!");
        router.push("/auth/sign-in");
      } else {
        toast.error(response.message || "Sign out failed. Please try again.");
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Sign out failed. Please try again.");
    }
  };
  return <Button onClick={handleSignOut}>Sign Out</Button>;
};

export default SignOutButton;
