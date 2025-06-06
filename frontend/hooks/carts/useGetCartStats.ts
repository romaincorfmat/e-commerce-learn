import { getCartStats } from "@/app/api/carts/route";
import { useQuery } from "@tanstack/react-query";

const useGetCartStats = (userId: string) => {
  const query = useQuery({
    queryKey: ["cart-stats", userId],
    queryFn: () => getCartStats(userId),
    enabled: Boolean(userId),
  });

  return query;
};

export default useGetCartStats;
