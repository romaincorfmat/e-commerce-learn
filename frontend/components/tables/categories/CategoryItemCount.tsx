import useCategoryItemCount from "@/hooks/categories/useGetCategoriesCount";
import React from "react";

interface CategoryItemCountProps {
  categoryId: string;
}

const CategoryItemCount = ({ categoryId }: CategoryItemCountProps) => {
  const {
    data: categoryItemCount,
    isError,
    isLoading,
  } = useCategoryItemCount();

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error</span>;
  }

  const count = categoryItemCount[categoryId] || 0;

  return <span className="font-semibold">{count}</span>;
};

export default CategoryItemCount;
