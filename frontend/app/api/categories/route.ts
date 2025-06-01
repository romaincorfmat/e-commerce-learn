import { API_BASE_URL } from "@/config/env";

export async function getALlCategories(): Promise<APIResponse<Category[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch categories:",
        response.status,
        response.statusText
      );
      return {
        success: false,
        message: `Failed to fetch categories: ${response.status} ${response.statusText}`,
        error: { message: "API request failed" },
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Categories fetched successfully",
      data: data.categories,
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

export async function createCategory(formData: {
  name: string;
}): Promise<APIResponse<Category>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      console.error(
        "Failed to create category:",
        response.status,
        response.statusText
      );
      return {
        success: false,
        message: `Failed to create category: ${response.status} ${response.statusText}`,
        error: { message: "API request failed" },
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Category created successfully",
      data: data.category,
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
