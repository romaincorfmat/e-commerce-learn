import { API_BASE_URL } from "@/config/env";

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
