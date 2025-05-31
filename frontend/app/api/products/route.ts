import { API_BASE_URL } from "@/config/env";

export async function GET() {
  const data = await fetch(`${API_BASE_URL}/api/v1/products`);

  if (!data.ok) {
    throw new Error("Failed to fetch products");
  }

  const products = await data.json();

  return Response.json(products);
}
