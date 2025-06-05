import { API_BASE_URL } from "@/config/env";

export async function createOrder(cartId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ shoppingCartId: cartId }),
    });

    console.log("Order Response:", response);

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to create order: ${response.status} ${response.statusText}`,
        error: { message: "API request failed" },
      };
    }

    const data = await response.json();

    console.log("Order Data:", data);

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

export async function getOrders() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/orders`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to fetch orders: ${response.status} ${response.statusText}`,
        error: { message: "API request failed" },
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Orders fetched successfully",
      data: data.orders,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch orders",
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}
