import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// This custom hook is a shortcut to access the AuthContext.
// Instead of importing and using useContext(AuthContext) everywhere,
// you can just call useAuth().
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
