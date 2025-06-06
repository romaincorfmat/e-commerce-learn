"use client";
import CreateProductModal from "@/components/modal/products/CreateProductModal";
import ProductTable from "@/components/tables/products/ProductTable";
import useGetProducts from "@/hooks/products/useGetProducts";
import React from "react";

const ManageProducts = () => {
  const { data, isPending } = useGetProducts();
  const products = data?.data || [];

  console.log("Products:", products);

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (!data?.success) {
    return <div>Error: {data?.message || "Failed to load products"}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex md:items-center max-md:flex-col md:justify-between gap-4 ">
        <h1 className="h1-title-page">Manage all products</h1>
        <CreateProductModal />
      </div>
      <ProductTable data={products} />
    </div>
  );
};

export default ManageProducts;
