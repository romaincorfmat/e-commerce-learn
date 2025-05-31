interface AuthResponse {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>;
  error?: string;
}

interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
