"use client";

import CreateCategoryModal from "@/components/modal/categories/CreateCategoryModal";
import CategoriesTable from "@/components/tables/categories/CategoriesTable";
import { useGetCategories } from "@/hooks/categories/useGetCategories";
import React from "react";

const ManageCategoriesPage = () => {
  const { data, isPending } = useGetCategories();
  const categories = data?.data || [];

  if (isPending) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <div className="flex max-md:flex-col md:items-center justify-between gap-4 mb-4">
        <h1 className="h1-title-page">All Categories</h1>
        <CreateCategoryModal />
      </div>
      <CategoriesTable data={categories} />
    </div>
  );
};

export default ManageCategoriesPage;
