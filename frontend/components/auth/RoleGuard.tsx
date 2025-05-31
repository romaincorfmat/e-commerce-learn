"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

const RoleGuard = ({
  children,
  allowedRoles,
  fallbackPath,
}: RoleGuardProps) => {
  const { user, isLoading } = useUser();
  console.log(" Role Guard: ", user);
  const router = useRouter();

  useEffect(() => {
    // If there is no user, Rediredt
    if (!isLoading && !user) {
      router.push(fallbackPath || "/auth/sign-in");
      return;
    }

    // If the user exist but does't have the required role, Redirect
    if (!isLoading && user && !allowedRoles.includes(user.role)) {
      router.push(fallbackPath || "/unauthorized");
      return;
    }
  }, [user, isLoading, allowedRoles, fallbackPath, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  //   Safety check to ensure user exists and has the required role
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default RoleGuard;
