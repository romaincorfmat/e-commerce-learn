import RoleGuard from "@/components/auth/RoleGuard";
import AdminHeader from "@/components/navigation/AdminHeader";
import LeftSidebar from "@/components/navigation/LeftSidebar";
import React, { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const layout = ({ children }: AdminLayoutProps) => {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="relative bg-gray-50 dark:bg-gray-900 ">
        <AdminHeader />
        <div className="flex min-h-screen">
          <LeftSidebar />
          <div className="mx-auto  py-8 pt-20 w-full px-12 max-md:px-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default layout;
