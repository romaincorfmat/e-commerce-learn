interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUserData: () => Promise<void>;
}
