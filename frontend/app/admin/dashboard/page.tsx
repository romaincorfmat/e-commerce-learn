"use client";

import MetricCard from "@/components/adminComponents/MetricCard";
import useGetAdminStats from "@/hooks/admin/useGetAdminStats";
import { DollarSign, List, Package, ShoppingCart, Users } from "lucide-react";
import React from "react";

const dailyRevenueTarget = 50000;
const monthlyRevenueTarget = 100000;

const AdminDashboardPage = () => {
  const { data, isLoading, error } = useGetAdminStats();

  const stats = data?.stats;

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-destructive">
          <p>
            Error: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3  gap-4">
      <MetricCard
        title="Total Orders"
        value={stats?.totalOrders}
        icon={<ShoppingCart />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Total Revenue"
        value={stats?.totalRevenue.toFixed(2)}
        icon={<DollarSign />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Total Customers"
        value={stats?.totalCustomers}
        icon={<Users />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Total Products"
        value={stats?.totalProducts}
        icon={<Package />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Total Categories"
        value={stats?.totalCategories}
        icon={<List />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Today's Sales"
        value={stats?.todayRevenue.toFixed(2)}
        target={dailyRevenueTarget}
        icon={<List />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Yesterday's Sales"
        value={stats?.yesterdayRevenue.toFixed(2)}
        target={dailyRevenueTarget}
        icon={<List />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Last 30 days Sales"
        value={stats?.monthlyRevenue.toFixed(2)}
        target={monthlyRevenueTarget}
        icon={<List />}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminDashboardPage;
