import { API_BASE_URL } from "@/config/env";

export async function createOrder(cartId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ cartId }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to create or update shopping cart: ${response.status} ${response.statusText}`,
        error: { message: "API request failed" },
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Order created successfully",
      data: data.order,
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
