import { useGetCategories } from "@/hooks/categories/useGetCategories";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DropdownCategories = () => {
  const { data, isPending } = useGetCategories();
  if (isPending) {
    return <div>Loading categories...</div>;
  }
  const categories = data?.data || [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Choose Category</DropdownMenuTrigger>
      <DropdownMenuContent>
        {categories.length > 0 ? (
          <>
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuItem key={category._id}>
                {category.name}
              </DropdownMenuItem>
            ))}
          </>
        ) : (
          <DropdownMenuItem disabled>No categories available</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownCategories;
