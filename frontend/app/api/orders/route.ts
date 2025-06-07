import { API_BASE_URL } from "@/config/env";

/**
 * Creates a new order using the specified shopping cart ID.
 *
 * Sends a POST request to the orders API to create an order associated with the given shopping cart.
 *
 * @param cartId - The identifier of the shopping cart to create an order from.
 * @returns An object indicating success or failure. On success, includes the created order data; on failure, includes an error message and details.
 */
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

/**
 * Retrieves a list of orders from the API.
 *
 * Sends a GET request to the orders endpoint and returns a structured result indicating success or failure, including the list of orders on success.
 *
 * @returns An object with a `success` flag, a message, and either the list of orders (`data`) or error details (`error`).
 */
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

export async function getCustomerOrders(
  userId: string
): Promise<APIResponse<Order[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/${userId}`, {
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

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<APIResponse<Order>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/orders/update-status/${orderId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to update order status: ${response.status} ${response.statusText}`,
        error: { message: "API request failed" },
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Order status updated successfully",
      data: data.order,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update order status",
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}
