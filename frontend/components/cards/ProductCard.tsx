import React from "react";
import { Card } from "../ui/card";
import Link from "next/link";
import Image from "next/image";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <Card className=" p-0 shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link
        href={`/products/${product._id}`}
        className="flex flex-col h-full relative"
      >
        <div className="flex flex-col  gap-4 mb-4 justify-between px-4 mt-4">
          <h1 className="h1-title-page line-clamp-2">{product.name}</h1>
          <p className="font-semibold text-gray-700">A${product.price}</p>
        </div>
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            width={500}
            height={500}
            alt={product.name}
            className="w-full h-56 object-cover rounded-b-lg"
          />
        )}
        {/* <p className="bottom-2 line-clamp-3 px-4">{product.description}</p> */}
      </Link>
    </Card>
  );
};

export default ProductCard;
