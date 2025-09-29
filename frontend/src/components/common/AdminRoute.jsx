import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Spinner from "./Spinner";

/**
 * A gatekeeper component that protects routes meant only for admin users.
 * It checks for authentication and the user's role.
 */
const AdminRoute = () => {
  // 1. Get the user's status from our central AuthContext
  const { user, isAuthenticated, isLoading } = useAuth();

  // 2. Show a spinner while the initial user data is being loaded.
  //    This prevents a flicker where the user is momentarily seen as "logged out".
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // 3. Check the conditions. Is the user logged in AND is their role 'admin'?
  if (isAuthenticated && user?.role === "admin") {
    // If yes, render the actual admin page the user was trying to access.
    // The <Outlet /> component is a placeholder for the real page (e.g., AdminDashboard).
    return <Outlet />;
  } else {
    // If no, redirect the user away. The Navigate component handles this.
    // We send them to a 404 page to avoid revealing that an admin page even exists.
    return <Navigate to="/not-found" replace />;
  }
};

export default AdminRoute;
