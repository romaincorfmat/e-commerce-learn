"use client";

import { getAdminStats } from "@/actions/admin/admin.stats.action";
import { useQuery } from "@tanstack/react-query";

const useGetAdminStats = () => {
  const query = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
    // Refetch every 5 minutes
    refetchInterval: 1000 * 60 * 5,
  });

  return query;
};

export default useGetAdminStats;
