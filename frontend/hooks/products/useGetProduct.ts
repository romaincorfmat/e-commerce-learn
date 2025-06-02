import { getProductById } from "@/app/api/products/route";
import { useQuery } from "@tanstack/react-query";

const useGetProduct = (productId: string) => {
  const query = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => getProductById(productId),
  });

  return query;
};

export default useGetProduct;
