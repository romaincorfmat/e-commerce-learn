import { useQuery } from "@tanstack/react-query";
import useGetProducts from "../products/useGetProducts";
import { useGetCategories } from "./useGetCategories";

const useCategoryItemCount = () => {
  const categoriesQuery = useGetCategories();
  const productsQuery = useGetProducts();

  const countQuery = useQuery({
    queryKey: ["categoriesCount"],
    queryFn: () => {
      const categories = categoriesQuery.data?.data || [];
      const products = productsQuery.data?.data || [];

      const counts: Record<string, number> = {};

      // Initialize counts for each category
      categories.forEach((category: Category) => {
        counts[category._id] = 0;
      });

      // Count products in each category
      products.forEach((product: Product) => {
        const categoryId = product.categoryId?._id;

        if (categoryId && counts[categoryId] !== undefined) {
          counts[categoryId]++;
        }
      });

      return counts;
    },

    // Only runs when both queries are successful
    enabled: categoriesQuery.data?.success && productsQuery.data?.success,
  });

  return {
    data: countQuery.data || {},
    isLoading:
      countQuery.isLoading ||
      categoriesQuery.isLoading ||
      productsQuery.isLoading,
    isError:
      countQuery.isError || categoriesQuery.isError || productsQuery.isError,
  };
};

export default useCategoryItemCount;
