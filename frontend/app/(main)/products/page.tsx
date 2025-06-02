"use client";

import ProductCard from "@/components/cards/ProductCard";
import useGetCategoryProducts from "@/hooks/products/useGetCategoryProducts";
import useGetProducts from "@/hooks/products/useGetProducts";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const ProductsPage = () => {
  const { data: techData } = useGetCategoryProducts("6831ab597a58cb2893e1e377");
  const { data: furnitureData } = useGetCategoryProducts(
    "6831aca654046728d655af99"
  );
  const { data: allProductsData } = useGetProducts();

  const techProducts = techData?.data || [];
  const furnitureProducts = furnitureData?.data || [];
  const allProducts = allProductsData?.data || [];

  // Just a check for products with an image.
  // I do  not want to display products without images.
  const allProductsToDisplay = allProducts.filter(
    (product) => product.imageUrl
  );

  return (
    <div className="flex flex-col  justify-center max-w-7xl mx-auto px-4 gap-8">
      <h1 className="h1-title-page">Browse Products</h1>
      <section className="flex flex-col gap-3">
        <Link
          href={"/products/category/6831ab597a58cb2893e1e377"}
          className="flex items-center gap-2"
        >
          <div className=" text-md flex gap-2 items-center">
            <h2 className="text-muted-foreground">Technology</h2>
            <ChevronRight className="text-muted-foreground h-4 w-4 mt-1" />
          </div>
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
          {techProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Link
          href={"/products/category/6831aca654046728d655af99"}
          className="flex items-center gap-2"
        >
          <div className=" text-md flex gap-2 items-center">
            <h2 className="text-muted-foreground">Furnitures</h2>
            <ChevronRight className="text-muted-foreground h-4 w-4 mt-1" />
          </div>
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
          {furnitureProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Link
          href={"/products/category/6831aca654046728d655af99"}
          className="flex items-center gap-2"
        >
          <div className=" text-md flex gap-2 items-center">
            <h2 className="text-muted-foreground">All</h2>
            <ChevronRight className="text-muted-foreground h-4 w-4 mt-1" />
          </div>
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
          {allProductsToDisplay.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
