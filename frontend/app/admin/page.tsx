import { getAdminStats } from "@/actions/admin/admin.stats.action";

export default async function AdminDashboard() {
  // Call the server action to fetch admin stats
  const { success, stats, message } = await getAdminStats();

  console.log("Stats", stats);

  if (!success) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          {message || "Failed to load admin statistics"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Orders" value={stats?.totalOrders || 0} />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toFixed(2) || "0.00"}`}
        />
        <StatCard title="Total Customers" value={stats?.totalCustomers || 0} />
        <StatCard title="Total Products" value={stats?.totalProducts || 0} />
        <StatCard
          title="Total Categories"
          value={stats?.totalCategories || 0}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
        {title}
      </h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
