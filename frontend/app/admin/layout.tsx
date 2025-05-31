import RoleGuard from "@/components/auth/RoleGuard";
import React, { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const layout = ({ children }: AdminLayoutProps) => {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Admin Only</h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            {children}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default layout;
