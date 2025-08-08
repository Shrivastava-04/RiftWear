import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// Import icons for UI
import { User as UserIcon, Mail, Phone, Edit, LogOut } from "lucide-react";
// Import Shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Using useAuth ONLY for its logout function here, as requested
import { useAuth } from "@/context/AuthCotext.jsx";
import Header from "@/components/Header"; // Ensure Header is imported
import Footer from "@/components/Footer"; // Ensure Footer is imported
// import axios from "axios";

const Profile = () => {
  // --- LOCAL STATE (as per your current preference) ---
  const [user, setUser] = useState(null); // Local state for user data
  const [loading, setLoading] = useState(true); // Local loading state
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false); // Local authentication status
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  // Get userId from localStorage (as per your current preference)
  const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; // Get API base URL

  // Get logout function from AuthContext to clear server-side session
  const { logout: authContextLogout } = useAuth(); // Renamed to avoid conflict with local handleLogout

  // --- FETCH USER PROFILE LOGIC (as per your current preference) ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      // If userId is missing, assume not authenticated
      if (!userId) {
        console.warn(
          "Profile Page: No userId found in localStorage. Assuming not logged in."
        );
        setLoading(false);
        setIsUserAuthenticated(false);
        // Consider navigating to login immediately here if no userId
        // navigate('/login');
        return;
      }

      try {
        setLoading(true); // Set loading to true while fetching
        // This makes the GET request to your backend to fetch user details by ID
        const response = await axios.get(`${API_BASE_URL}/user/userById`, {
          params: { id: userId }, // Sending userId as a query parameter
        });

        // Check for response data and user object within it
        if (response.data && response.data.user) {
          setUser(response.data.user);
          setIsUserAuthenticated(true);
        } else {
          // If API returns 200 but no user data (e.g., user deleted from DB)
          console.warn(
            "Profile Page: User data not found in API response, even with 200 OK."
          );
          setUser(null);
          setIsUserAuthenticated(false);
          // Also clear localStorage userId if it's invalid/user not found
          localStorage.removeItem("userId");
        }
      } catch (error) {
        console.error(
          "Profile Page: Error fetching user profile:",
          error.response?.status,
          error.response?.data?.message || error.message
        );
        setUser(null);
        setIsUserAuthenticated(false);
        // Clear userId in localStorage on API fetch error (e.g., 404, 500)
        localStorage.removeItem("userId");
        // Optionally show a toast message here for the error
      } finally {
        setLoading(false); // Always set loading to false
      }
    };

    fetchUserProfile(); // Call the function to fetch user profile
  }, [API_BASE_URL, userId, navigate]); // Dependencies for useEffect (include navigate if used in callback)

  // --- RENDERING LOGIC (UI / Styling as requested) ---

  // Show loading state while fetching user data
  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen w-full flex-col">
          <p className="text-foreground/70 text-lg">Loading user profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  // If not authenticated, display login required message
  if (!isUserAuthenticated) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen w-full flex-col text-center p-4">
          <UserIcon className="h-16 w-16 text-destructive mb-4" />
          <p className="text-destructive text-lg font-semibold mb-6">
            You need to be logged in to view this page.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="mt-4"
            variant="cta"
            size="lg"
          >
            Go to Login
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  // --- Logout Handler ---
  const handleLogout = async () => {
    // IMPORTANT: Call AuthContext's logout to clear the HTTP-only cookie on the backend
    await authContextLogout();
    // Then clear local storage and redirect (consistent with your current logic)
    localStorage.removeItem("userId"); // Clear userId from localStorage (as this page relies on it)
    setUser(null); // Reset local user state for immediate UI update
    setIsUserAuthenticated(false); // Update local auth status
    navigate("/"); // Redirect to home page
  };

  // Render profile content if user data is available and authenticated
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-8 text-center">
          My Profile
        </h1>

        {user ? ( // Ensure user object exists before trying to access its properties
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Details Card */}
            <Card className="bg-card/50 border-border/50 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold gradient-text">
                  Personal Information
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground/70 hover:text-accent"
                >
                  <Edit className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                </div>
                {user.phoneNumber && ( // Only display if phoneNumber exists
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Phone Number
                      </p>
                      <p className="font-semibold">{user.phoneNumber}</p>
                    </div>
                  </div>
                )}
                {user.role === "admin" && (
                  <Button>
                    <Link to="/admin">Admin Panel</Link>
                  </Button>
                )}
                {/* Add other user details here (e.g., date joined from timestamps) */}
                {/* {user.createdAt && (
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-semibold">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )} */}
              </CardContent>
            </Card>

            {/* Account Management Card */}
            <Card className="bg-card/50 border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold gradient-text">
                  Account Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/order">Order History</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Addresses
                </Button>
                {/* Logout Button */}
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // This fallback should ideally be caught by !isUserAuthenticated,
          // but good for defensive programming if user is null for some other reason.
          <div className="text-center py-12">
            <p className="text-foreground/60 mb-4">
              User data could not be displayed.
            </p>
            <Button variant="outline" onClick={() => navigate("/login")}>
              Go to Login
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
