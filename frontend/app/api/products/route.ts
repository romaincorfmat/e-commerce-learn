import { API_BASE_URL } from "@/config/env";

export async function GetAllProducts(): Promise<APIResponse<Product[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch users:",
        response.status,
        response.statusText
      );
      return {
        success: false,
        message: `Failed to fetch products: ${response.status} ${response.statusText}`,
        error: { message: "API request failed" },
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Products fetched successfully",
      data: data.products,
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}
