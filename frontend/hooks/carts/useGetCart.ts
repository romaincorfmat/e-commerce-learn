import { getShoppingCartByUserId } from "@/app/api/carts/route";
import { useQuery } from "@tanstack/react-query";

const useGetCart = (userId: string) => {
  const query = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => getShoppingCartByUserId(userId),
  });
  return query;
};

export default useGetCart;
