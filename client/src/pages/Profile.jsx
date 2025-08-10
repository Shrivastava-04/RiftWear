import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// Import icons for UI
import {
  User as UserIcon,
  Mail,
  Phone,
  Edit,
  LogOut,
  MapPin,
} from "lucide-react"; // Added MapPin icon
// Import Shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Import Shadcn Dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Using useAuth ONLY for its logout function here, as requested
import { useAuth } from "@/context/AuthCotext.jsx";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for modal visibility
  const { toast } = useToast();
  const [editFormData, setEditFormData] = useState({
    // State for form inputs
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });
  const navigate = useNavigate();

  const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const { logout: authContextLogout } = useAuth();

  // --- FETCH USER PROFILE LOGIC ---
  const fetchUserProfile = async () => {
    if (!userId) {
      console.warn(
        "Profile Page: No userId found in localStorage. Assuming not logged in."
      );
      setLoading(false);
      setIsUserAuthenticated(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/user/userById`, {
        params: { id: userId },
      });

      if (response.data && response.data.user) {
        setUser(response.data.user);
        setIsUserAuthenticated(true);
        // Set initial form data when user data is fetched
        setEditFormData({
          phoneNumber: response.data.user.phoneNumber || "",
          address: {
            street: response.data.user.address?.street || "",
            city: response.data.user.address?.city || "",
            state: response.data.user.address?.state || "",
            postalCode: response.data.user.address?.postalCode || "",
            country: response.data.user.address?.country || "",
          },
        });
      } else {
        console.warn(
          "Profile Page: User data not found in API response, even with 200 OK."
        );
        setUser(null);
        setIsUserAuthenticated(false);
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
      localStorage.removeItem("userId");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [API_BASE_URL, userId, navigate]);

  // --- MODAL AND FORM HANDLERS ---
  const handleEditClick = () => {
    // Open the modal
    setIsEditModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    // Check if the input field is part of the address object
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setEditFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value,
        },
      }));
    } else {
      // Otherwise, it's a top-level field like phoneNumber
      setEditFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.put(
        `${API_BASE_URL}/user/updateUser`,
        {
          userId,
          phoneNumber: editFormData.phoneNumber,
          address: editFormData.address,
        },
        {
          withCredentials: true, // Important for sending cookies (JWT token)
        }
      );

      if (response.data.message) {
        // alert(response.data.message); // Use alert for now, consider a toast/message box
        toast({
          title: "Profile Updated",
          description: "Your profile is updated successfully",
          variant: "success",
        });
        setIsEditModalOpen(false); // Close modal on success
        fetchUserProfile(); // Re-fetch user data to update UI
      }
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data?.message || error.message
      );
      alert(
        "Failed to update profile: " +
          (error.response?.data?.message || "Please try again.")
      );
    }
  };

  // --- Logout Handler ---
  const handleLogout = async () => {
    await authContextLogout();
    localStorage.removeItem("userId");
    setUser(null);
    setIsUserAuthenticated(false);
    navigate("/");
  };

  // --- RENDERING LOGIC ---
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-8 text-center">
          My Profile
        </h1>

        {user ? (
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Details Card */}
            <Card className="bg-card/50 border-border/50 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold gradient-text">
                  Personal Information
                </CardTitle>
                <Dialog
                  open={isEditModalOpen}
                  onOpenChange={setIsEditModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-foreground/70 hover:text-accent"
                      onClick={handleEditClick}
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your phone number and address here.
                        Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleSaveProfile}
                      className="grid gap-4 py-4"
                    >
                      {/* Phone Number Input */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phoneNumber" className="text-right">
                          Phone
                        </Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={editFormData.phoneNumber}
                          onChange={handleFormChange}
                          className="col-span-3"
                          placeholder="e.g., +1234567890"
                        />
                      </div>
                      <h3 className="text-lg font-semibold mt-4 mb-2">
                        Address
                      </h3>
                      {/* Address Fields */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="street" className="text-right">
                          Street
                        </Label>
                        <Input
                          id="street"
                          name="address.street"
                          value={editFormData.address.street}
                          onChange={handleFormChange}
                          className="col-span-3"
                          placeholder="e.g., 123 Main St"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="city" className="text-right">
                          City
                        </Label>
                        <Input
                          id="city"
                          name="address.city"
                          value={editFormData.address.city}
                          onChange={handleFormChange}
                          className="col-span-3"
                          placeholder="e.g., New York"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="state" className="text-right">
                          State
                        </Label>
                        <Input
                          id="state"
                          name="address.state"
                          value={editFormData.address.state}
                          onChange={handleFormChange}
                          className="col-span-3"
                          placeholder="e.g., NY"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="postalCode" className="text-right">
                          Postal Code
                        </Label>
                        <Input
                          id="postalCode"
                          name="address.postalCode"
                          value={editFormData.address.postalCode}
                          onChange={handleFormChange}
                          className="col-span-3"
                          placeholder="e.g., 10001"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="country" className="text-right">
                          Country
                        </Label>
                        <Input
                          id="country"
                          name="address.country"
                          value={editFormData.address.country}
                          onChange={handleFormChange}
                          className="col-span-3"
                          placeholder="e.g., USA"
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
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
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Phone Number
                    </p>
                    <p className="font-semibold">{user.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-semibold">
                      {user.address.street}
                      {user.address.street && user.address.city && ", "}
                      {user.address.city}
                      {user.address.city && user.address.state && ", "}
                      {user.address.state}
                      {user.address.state && user.address.postalCode && " "}
                      {user.address.postalCode}
                      {user.address.country &&
                      (user.address.city || user.address.state)
                        ? `, ${user.address.country}`
                        : user.address.country}
                    </p>
                  </div>
                </div>
                {user.role === "admin" && (
                  <Button>
                    <Link to="/admin">Admin Panel</Link>
                  </Button>
                )}
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
                {/* <Button variant="outline" className="w-full">
                  Addresses
                </Button> */}
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
