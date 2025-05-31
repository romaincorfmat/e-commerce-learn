import { Product } from "@/types/global";
import Link from "next/link";
import React from "react";

const ProductsPage = async () => {
  const response = await fetch(`${process.env.API_BASE_URL}/api/v1/products`);
  const data = await response.json();
  const products = data.products;
  console.log("data", products);
  return (
    <div className="px-8">
      <h1 className="text-5xl">All</h1>
      {products.map((product: Product) => (
        <Link key={product._id} href={`/products/${product._id}`}>
          <div className="border p-4 mb-4 bg-gray-50 mx-auto rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="italic text-gray-700">{product.price} A$</p>
            </div>
            <p>{product.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductsPage;
