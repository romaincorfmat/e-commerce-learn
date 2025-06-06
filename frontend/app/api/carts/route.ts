import { API_BASE_URL } from "@/config/env";

/**
 * Creates a new shopping cart using the provided parameters.
 *
 * Sends a POST request to the shopping cart API to create a cart with the specified details.
 *
 * @param formData - The parameters for the new shopping cart.
 * @returns An API response containing the created cart data on success, or an error message on failure.
 */
export async function createShoppingCart(
  formData: ShoppingCartParams
): Promise<APIResponse<Cart>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/shopping-carts`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to create shopping cart: ${response.status} ${response.statusText}`,
        error: { message: "API request failed" },
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Shopping cart created successfully",
      data: data.cart,
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
 * Retrieves the shopping cart associated with the specified user ID.
 *
 * @param userId - The unique identifier of the user whose shopping cart is to be fetched.
 * @returns An {@link APIResponse} containing the cart data if successful, or an error message if the request fails.
 */
export async function getShoppingCartByUserId(
  userId: string
): Promise<APIResponse<Cart>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/shopping-carts/${userId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to fetch shopping cart: ${response.status} ${response.statusText}`,
        error: { message: "API request failed" },
      };
    }

    const data = await response.json();

    console.log("Fetched Shopping Cart Data:", data);

    return {
      success: true,
      message: "Shopping cart fetched successfully",
      data: data.cart,
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

export async function createAndUpdateShoppingCart(
  formData: ShoppingCartParams
): Promise<APIResponse<Cart>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/shopping-carts`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
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
      message: "Shopping cart created or updated successfully",
      data: data.cart,
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

export async function getCartStats(
  userId: string
): Promise<
  APIResponse<{ totalItems: number; totalPrice: number; totalProducts: number }>
> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/shopping-carts/stats/${userId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to fetch cart stats: ${response.status} ${response.statusText}`,
        error: { message: "API request failed" },
      };
    }

    const data = await response.json();
    console.log("Cart Stats Data:", data);
    return {
      success: true,
      message: "Cart stats fetched successfully",
      data: data,
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
