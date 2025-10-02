import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User as UserIcon,
  Mail,
  Phone,
  Edit,
  LogOut,
  MapPin,
  Trash2,
  PlusCircle,
  ShoppingCart,
  Package,
} from "lucide-react";

// --- Core Hooks & API ---
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  updateUserProfile,
  addAddress,
  deleteAddress,
  fetchMyOrders,
} from "@/api/apiService";

// --- UI Components ---
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated or on initial load
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Show a loading spinner while the user object is being fetched by the context
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-8 text-center">
          My Account
        </h1>
        <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="addresses">My Addresses</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileInfoTab />
          </TabsContent>
          <TabsContent value="addresses">
            <AddressesTab />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

// --- Profile Info Tab Component ---
const ProfileInfoTab = () => {
  const { user, logout } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    phoneNumber: user.phoneNumber || "",
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({ title: "Profile Updated", variant: "success" });
      setIsEditModalOpen(false);
    },
    onError: (err) =>
      toast({
        title: "Update Failed",
        description: err.response?.data?.message,
        variant: "destructive",
      }),
  });

  const handleSave = () => {
    mutation.mutate(formData);
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
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
          <Button asChild variant="outline" className="w-full justify-start">
            <Link to="/cart">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Go to Cart
            </Link>
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- Addresses Tab Component ---
const AddressesTab = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mt-6">
      <div className="text-right mb-4">
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
        </Button>
      </div>
      <div className="space-y-4">
        {user?.addresses?.length > 0 ? (
          user.addresses.map((address) => (
            <AddressCard key={address._id} address={address} />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">
            You have no saved addresses.
          </p>
        )}
      </div>
      <AddressForm isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
};

// --- Address Card Sub-Component ---
const AddressCard = ({ address }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({ title: "Address Deleted", variant: "success" });
    },
    onError: (err) =>
      toast({
        title: "Delete Failed",
        description: err.response?.data?.message,
        variant: "destructive",
      }),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>
            {address.firstName} {address.lastName}{" "}
            {address.isDefault && <Badge className="ml-2">Default</Badge>}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{address.addressType}</p>
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this address.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate(address._id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>
          {address.street}
          {address.landmark ? `, ${address.landmark}` : ""}
        </p>
        <p>
          {address.city}, {address.state} - {address.postalCode}
        </p>
        <p>{address.country}</p>
        <p>Phone: {address.phoneNumber}</p>
      </CardContent>
    </Card>
  );
};

// --- Address Form Modal Component ---
const AddressForm = ({ isOpen, setIsOpen }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const initialFormState = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    addressType: "Home",
    isDefault: false,
  };
  const [formData, setFormData] = useState(initialFormState);

  const mutation = useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({ title: "Address Saved", variant: "success" });
      setIsOpen(false);
      setFormData(initialFormState);
    },
    onError: (err) =>
      toast({
        title: "Save Failed",
        description: err.response?.data?.message,
        variant: "destructive",
      }),
  });

  const handleSave = () => {
    for (const key in formData) {
      if (key !== "landmark" && !formData[key]) {
        toast({
          title: "Validation Error",
          description: `Please fill out all required fields.`,
          variant: "destructive",
        });
        return;
      }
    }
    mutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSwitchChange = (checked) => {
    setFormData({ ...formData, isDefault: checked });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="street">Street</Label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="landmark">Landmark (Optional)</Label>
            <Input
              id="landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="addressType">Address Type</Label>
            <select
              name="addressType"
              id="addressType"
              value={formData.addressType}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isDefault">Set as default address</Label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save Address"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- Orders Tab Component ---
const OrdersTab = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ["myOrders"],
    queryFn: fetchMyOrders,
  });
  const orders = response?.data?.orders || [];

  if (isLoading)
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );

  return (
    <div className="mt-6 space-y-4">
      {orders.length > 0 ? (
        orders.map((order) => (
          <Card key={order._id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Order #{order.orderNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge>{order.orderStatus}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 my-2">
                {order.items.slice(0, 5).map((item) => (
                  <img
                    key={item._id}
                    src={item.image}
                    alt={item.productName}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                ))}
                {order.items.length > 5 && (
                  <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center text-xs">
                    +{order.items.length - 5}
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="font-bold">
                  Total: ₹{order.pricingInfo.totalAmount.toFixed(2)}
                </p>
                <Button asChild variant="outline">
                  <Link to={`/order/${order._id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-muted-foreground py-8">
          You haven't placed any orders yet.
        </p>
      )}
    </div>
  );
};

export default Profile;
