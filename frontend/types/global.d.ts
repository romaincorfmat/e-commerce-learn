interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: Category;
  variants: {
    sku: string;
    stockLevel?: number;
    attributes: {
      color?: string;
      size?: string;
    };
  }[];
  deleted: boolean; // Soft delete flag
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "customer";
}
