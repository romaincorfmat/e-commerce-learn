import { getOrders } from "@/app/api/orders/route";
import { useQuery } from "@tanstack/react-query";

const useGetOrders = () => {
  const query = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  return query;
};

export default useGetOrders;
