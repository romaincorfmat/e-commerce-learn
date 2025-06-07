import MetricCard from "@/components/adminComponents/MetricCard";
import { DollarSign, List, Package, ShoppingCart, Users } from "lucide-react";
import React from "react";

const AdminDashboardPage = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3  gap-4">
      <MetricCard title="Total Orders" value={100} icon={<ShoppingCart />} />
      <MetricCard title="Total Revenue" value={1000} icon={<DollarSign />} />
      <MetricCard title="Total Customers" value={100} icon={<Users />} />
      <MetricCard title="Total Products" value={100} icon={<Package />} />
      <MetricCard title="Total Categories" value={100} icon={<List />} />
    </div>
  );
};

export default AdminDashboardPage;
