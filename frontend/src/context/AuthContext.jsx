import { createContext, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLoggedInUserProfile, logoutUser } from "../api/apiService";
import Spinner from "../components/common/Spinner";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getLoggedInUserProfile,
    retry: false,
  });

  const login = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.setQueryData(["user"], { data: { user: userData } });
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    await logoutUser();
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  // --- FIX APPLIED HERE ---
  // The useMemo hook is now called on every render, BEFORE the early return.
  // This satisfies the Rules of Hooks.
  const value = useMemo(
    () => ({
      user: user?.data.user || null,
      isAuthenticated: !isError && !!user,
      login,
      logout,
    }),
    [user, isError]
  );

  // The conditional loading check now happens AFTER all hooks have been called.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Spinner />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
