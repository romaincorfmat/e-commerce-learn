import { GetAllProducts } from "@/app/api/products/route";
import { useQuery } from "@tanstack/react-query";

function useGetProducts() {
  const query = useQuery({ queryKey: ["products"], queryFn: GetAllProducts });
  return query;
}

export default useGetProducts;
