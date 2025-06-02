"use client";

import useGetProduct from "@/hooks/products/useGetProduct";
import { useParams } from "next/navigation";
import React from "react";
import Image from "next/image";
import VariantCard from "@/components/cards/VariantCard";

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params.productId as string;

  const { data } = useGetProduct(productId);

  if (!productId) {
    return <div>Product not found</div>;
  }

  const product = data?.data;

  if (!product) {
    return <div>Loading product details...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="font-semibold text-2xl">$ {product.price}</p>
      </div>
      <p className="text-muted-foreground text-md mt-4">
        {product.description}
      </p>
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={500}
        height={500}
        className="rounded-lg w-full max-w-xl mx-auto my-6"
      />

      <section className="flex items-center flex-wrap gap-8">
        {product.variants.map((variant) => (
          <VariantCard
            key={variant.sku}
            variant={variant}
            name={product.name}
          />
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Reviews</h2>
        <p>TODO: Implement a section for users to leave reviews</p>
      </section>
    </div>
  );
};

export default ProductDetailPage;
