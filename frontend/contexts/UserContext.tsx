"use client";
import { getLoggedInUser } from "@/app/api/user/route";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const defaultContextValue: UserContextType = {
  user: null,
  isLoading: false,
  error: null,
  fetchUserData: async () => null,
};

const UserContext = createContext<UserContextType>(defaultContextValue);

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    setIsLoading(true);

    try {
      const result = await getLoggedInUser();
      if (result.success) {
        setUser(result.data || null);
        console.log("Fetched user data:", result.data);
        setError(null);
        return result.data || null;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        fetchUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
