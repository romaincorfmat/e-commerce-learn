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
      if (response.status === 401) {
        return {
          success: false,
          message: "Unauthorized",
          error: { message: "Unauthorized" },
        };
      }

      console.error(
        "Failed to fetch user:",
        response.status,
        response.statusText
      );
      return {
        success: false,
        message: `Failed to fetch user: ${response.status} ${response.statusText}`,
        error: { message: "API request failed" },
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Logged-in user fetched successfully",
      data: data.user || data, // Handle both possible API response structures
    };
  } catch (error) {
    console.error("Error fetching logged-in user:", error);
    return {
      success: false,
      message: "Internal server error",
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
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
        error: { message: "API request failed" },
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "All users fetched successfully",
      data: data.users || data,
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
      data: data.user || data,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
}

export async function deleteUser(
  userId: string
): Promise<APIResponse<{ deleted: boolean }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-type": "application/json" },
    });

    if (!response.ok) {
      console.error(
        "Failed to delete user:",
        response.status,
        response.statusText
      );
      throw new Error(
        `Failed to delete user: ${response.status} ${response.statusText}`
      );
    }

    // const data = await response.json();

    return {
      success: true,
      message: "User deleted successfully",
      data: {
        deleted: true,
      },
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
}
