import { API_BASE_URL } from "@/config/env";

export async function getLoggedInUser(): Promise<APIResponse<User>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch user:",
        response.status,
        response.statusText
      );
      return {
        success: false,
        message: `Failed to fetch user: ${response.status} ${response.statusText}`,
        error: "API request failed",
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Logged-in user fetched successfully",
      data: data.data || data,
    };
  } catch (error) {
    console.error("Error fetching logged-in user:", error);
    return {
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getAllUsers(): Promise<APIResponse<User[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
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
        message: `Failed to fetch users: ${response.status} ${response.statusText}`,
        error: "API request failed",
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "All users fetched successfully",
      data: data.data || data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createUser({
  formData,
}: {
  formData: { name: string; role: string };
}): Promise<APIResponse<User>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      console.error(
        "Failed to create user:",
        response.status,
        response.statusText
      );
      throw new Error(
        `Failed to create user: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      success: true,
      message: "User created successfully",
      data: data.data || data,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
}
