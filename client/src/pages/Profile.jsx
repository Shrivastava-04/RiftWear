import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  User as UserIcon,
  Mail,
  Phone,
  Edit,
  LogOut,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthCotext.jsx";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();
  const [editFormData, setEditFormData] = useState({
    phoneNumber: "",
    address: { street: "", city: "", state: "", postalCode: "", country: "" },
  });
  const navigate = useNavigate();

  const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { logout: authContextLogout } = useAuth();

  const fetchUserProfile = async () => {
    if (!userId) {
      setLoading(false);
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/user/userById`, {
        params: { id: userId },
      });
      const userData = response.data.user;
      setUser(userData);
      setEditFormData({
        phoneNumber: userData.phoneNumber || "",
        address: userData.address || {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
      });
    } catch (error) {
      console.error("Profile Page: Error fetching user profile:", error);
      localStorage.removeItem("userId");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [API_BASE_URL, userId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setEditFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // UPDATED: Added validation to this function
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    // Destructure for easier access
    const { phoneNumber, address } = editFormData;

    // VALIDATION: Check if any field is empty (or just contains whitespace)
    const isAnyFieldEmpty =
      !phoneNumber.trim() ||
      !address.street.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.postalCode.trim() ||
      !address.country.trim();

    if (isAnyFieldEmpty) {
      toast({
        title: "Validation Error",
        description: "Please fill out all fields before saving.",
        variant: "destructive",
      });
      return; // Stop the function from proceeding if validation fails
    }

    // If validation passes, proceed with the API call
    try {
      await axios.put(`${API_BASE_URL}/user/updateUser`, {
        userId,
        phoneNumber: editFormData.phoneNumber,
        address: editFormData.address,
      });
      toast({ title: "Profile Updated", variant: "success" });
      setIsEditModalOpen(false);
      fetchUserProfile();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const displayAddress = (address) => {
    if (!address || Object.values(address).every((field) => !field)) {
      return "No address on file.";
    }
    return [
      address.street,
      address.city,
      address.state,
      address.postalCode,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-8 text-center">
          My Profile
        </h1>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold">
                    {user.phoneNumber || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 pt-2">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-semibold">
                    {displayAddress(user.address)}
                  </p>
                </div>
              </div>
              {user.role === "admin" && (
                <Button asChild>
                  <Link to="/admin">Admin Panel</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="outline" className="w-full">
                <Link to="/order">Order History</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/cart">Go to Cart</Link>
              </Button>
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
      </main>
      <Footer />

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your contact information and address.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveProfile} className="grid gap-4 py-4">
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
              />
            </div>
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
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
