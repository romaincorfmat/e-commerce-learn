import { getAdminStats } from "@/app/api/admin/route";
import { useQuery } from "@tanstack/react-query";

const useGetAdminStats = () => {
  const query = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  });

  return query;
};

export default useGetAdminStats;
