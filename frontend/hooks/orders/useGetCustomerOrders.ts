import { getCustomerOrders } from "@/app/api/orders/route";
import { useQuery } from "@tanstack/react-query";

export const useGetCustomerOrders = (customerId: string) => {
  const query = useQuery({
    queryKey: ["customer-order", customerId],
    queryFn: () => getCustomerOrders(customerId),
  });

  return query;
};

export default useGetCustomerOrders;
