import { getCategoryProducts } from "@/app/api/products/route";
import { useQuery } from "@tanstack/react-query";

const useGetCategoryProducts = (categoryId: string) => {
  const query = useQuery({
    queryKey: ["categoryProducts", categoryId],
    queryFn: () => getCategoryProducts(categoryId),
  });

  return query;
};

export default useGetCategoryProducts;
