import { API_BASE_URL } from "@/config/env";

export const signUp = async (formData: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/sign-up`, {
      method: "POST",
      credentials: "include", // Ensures HTTP-only cookies are sent
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: "Sign up successful!",
        data: { user: data.user },
      };
    } else {
      return {
        success: false,
        message: data.message || "Sign up failed. Please try again.",
        error: {
          message:
            typeof data.error === "string" ? data.error : "Registration failed",
        },
      };
    }
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      message: "Sign up failed. Please try again.",
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
};

export const signIn = async (formData: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/sign-in`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: "Sign in successful!",
        data: { user: data.user },
      };
    } else {
      return {
        success: false,
        message: data.message || "Sign in failed. Please try again.",
        error: {
          message:
            typeof data.error === "string"
              ? data.error
              : "Authentication failed",
        },
      };
    }
  } catch (error) {
    console.error("Signin error:", error);
    return {
      success: false,
      message: "Sign in failed. Please try again.",
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
};

export const signOut = async (): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/sign-out`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: "Sign out successful!",
        data: data.user,
      };
    } else {
      return {
        success: false,
        message: data.message || "Sign out failed. Please try again.",
        error: {
          message:
            typeof data.error === "string" ? data.error : "Sign out failed",
        },
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Sign out failed. Please try again.",
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
};
