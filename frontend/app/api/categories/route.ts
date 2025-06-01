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
