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

export async function createProduct(
  formData: ProductParams
): Promise<APIResponse<Product>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
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
        message: `Failed to create product: ${response.status} ${response.statusText}`,
        error: { message: "API request failed" },
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Product created successfully",
      data: data.product,
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

export async function getCategoryProducts(
  categoryId: string
): Promise<APIResponse<Product[]>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/products/category/${categoryId}`,
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

/**
 * Deletes a product by its ID.
 *
 * @param productId - The unique identifier of the product to delete.
 * @returns A promise resolving to an API response indicating whether the product was deleted.
 */
export async function deleteProduct(
  productId: string
): Promise<APIResponse<{ deleted: boolean }>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/products/${productId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to delete product: ${response.status} ${response.statusText}`,
        error: { message: "API request failed" },
      };
    }
    return {
      success: true,
      message: "Product deleted successfully",
      data: { deleted: true },
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
