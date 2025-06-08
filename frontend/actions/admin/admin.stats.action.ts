import { API_BASE_URL } from "@/config/env";

export async function getAdminStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/admins/stats`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("API error:", response.status, response.statusText);
      return {
        success: false,
        message: `Failed to fetch stats:: ${response.status} ${response.statusText}`,
        error: { message: "API request failed" },
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Stats fetched successfully",
      stats: data.stats,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch admin stats",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
