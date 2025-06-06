interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
  };
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
}

// interface APIResponse<T> {
//   success: boolean;
//   message: string;
//   data?: T;
//   error?: string;
// }

type APIResponse<T = null> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};
