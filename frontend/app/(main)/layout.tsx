import RoleGuard from "@/components/auth/RoleGuard";
import CustomerHeader from "@/components/navigation/customer/CustomerHeader";
import CustomerLeftSidebar from "@/components/navigation/customer/CustomerLeftSidebar";
import React, { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const layout = ({ children }: AdminLayoutProps) => {
  return (
    <RoleGuard allowedRoles={["customer", "admin"]}>
      <div className="relative bg-gray-50 dark:bg-gray-900">
        <CustomerHeader />
        <div className="flex min-h-screen">
          <CustomerLeftSidebar />
          <div className="mx-auto py-14 w-full px-12 max-md:px-4">
            <div>{children}</div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default layout;
