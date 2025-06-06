interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Variant {
  sku: string;
  stockLevel: number;
  attributes: {
    color: string;
    size: string;
  };
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId?: Category;
  variants: Variant[];
  deleted: boolean; // Soft delete flag
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "customer";
}

interface Cart {
  _id: string;
  user: { _id: string; name: string; email: string };
  items: CartItem[];
  totalPrice?: number; // Optional, can be calculated
}

interface CartItem {
  product: {
    _id: string;
    name: string;
    imageUrl: string;
  };
  productVariant: {
    productSku: string;
    quantity: number;
    unitPrice: number;
  };
  totalPrice: number;
}
