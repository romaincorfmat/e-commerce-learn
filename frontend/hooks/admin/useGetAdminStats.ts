"use client";

import { getAdminStats } from "@/actions/admin/admin.stats.action";
import { useQuery } from "@tanstack/react-query";

const useGetAdminStats = () => {
  const query = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  });

  return query;
};

export default useGetAdminStats;
