import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Trash2,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Package,
  MapPin,
  ShoppingCart,
  X,
  Shield,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  adminGetAllUsers,
  adminGetUserById,
  adminDeleteUser,
  adminRemoveCartItem,
} from "@/api/apiService";
import Spinner from "@/components/common/Spinner";

// --- Main Component ---
const UserManagement = () => {
  // --- FIX: Initial state now uses 'all' instead of '' ---
  const [filters, setFilters] = useState({
    role: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [selectedUserId, setSelectedUserId] = useState(null);

  const {
    data: usersData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-users", filters],
    queryFn: () => adminGetAllUsers(filters),
    keepPreviousData: true,
  });
  const users = usersData?.data?.users || [];

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const resetFilters = () =>
    setFilters({ role: "all", sortBy: "createdAt", sortOrder: "desc" });

  if (isLoading && !usersData)
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  if (isError)
    return <p className="text-destructive p-4">Error: {error.message}</p>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Filter, sort, and manage all registered users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FilterControls
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="mt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      ₹{user.totalSpent?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell>{user.totalOrders || 0}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedUserId(user._id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {users.length === 0 && (
              <p className="text-center text-muted-foreground p-8">
                No users found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      {selectedUserId && (
        <UserDetailsModal
          userId={selectedUserId}
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
};

// --- Sub-Component for Filter Controls (UPDATED) ---
const FilterControls = ({ filters, onFilterChange, onReset }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-muted/50 rounded-lg">
    <div className="flex items-center gap-2">
      <Label htmlFor="role-filter" className="text-sm">
        Role
      </Label>
      <Select
        value={filters.role}
        onValueChange={(value) => onFilterChange("role", value)}
      >
        <SelectTrigger id="role-filter" className="w-full sm:w-[120px]">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          {/* --- FIX: Using 'all' instead of '' for the value --- */}
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="flex items-center gap-2">
      <Label htmlFor="sort-by" className="text-sm">
        Sort By
      </Label>
      <Select
        value={filters.sortBy}
        onValueChange={(value) => onFilterChange("sortBy", value)}
      >
        <SelectTrigger id="sort-by" className="w-full sm:w-[180px]">
          <SelectValue placeholder="Date Joined" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Date Joined</SelectItem>
          <SelectItem value="name">Name (A-Z)</SelectItem>
          <SelectItem value="totalSpent">Total Spent</SelectItem>
          <SelectItem value="totalOrders">Total Orders</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="flex items-center gap-2">
      <Label htmlFor="sort-order" className="text-sm">
        Order
      </Label>
      <Select
        value={filters.sortOrder}
        onValueChange={(value) => onFilterChange("sortOrder", value)}
      >
        <SelectTrigger id="sort-order" className="w-full sm:w-[120px]">
          <SelectValue placeholder="Descending" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Descending</SelectItem>
          <SelectItem value="asc">Ascending</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <Button
      variant="ghost"
      onClick={onReset}
      className="flex items-center gap-2 text-sm ml-auto"
    >
      <X className="h-4 w-4" /> Reset Filters
    </Button>
  </div>
);

// --- Sub-Component for the Details Modal ---
const UserDetailsModal = ({ userId, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: userData, isFetching } = useQuery({
    queryKey: ["admin-user", userId],
    queryFn: () => adminGetUserById(userId),
    enabled: !!userId,
  });
  const user = userData?.data?.user;

  const removeCartItemMutation = useMutation({
    mutationFn: ({ userId, cartItemId }) =>
      adminRemoveCartItem(userId, cartItemId),
    onSuccess: () => {
      toast({
        title: "Item Removed",
        description: "The item has been removed from the user's cart.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-user", userId] });
    },
    onError: (err) =>
      toast({
        title: "Error",
        description: err.response?.data?.message,
        variant: "destructive",
      }),
  });

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <UserIcon className="h-6 w-6" /> User Details
          </DialogTitle>
        </DialogHeader>
        {isFetching || !user ? (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold border-b pb-1">
                  Contact Information
                </h3>
                <InfoItem icon={<UserIcon />} label="Name" value={user.name} />
                <InfoItem icon={<Mail />} label="Email" value={user.email} />
                <InfoItem
                  icon={<Phone />}
                  label="Phone"
                  value={user.phoneNumber || "N/A"}
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold border-b pb-1">
                  Account Information
                </h3>
                <InfoItem icon={<Shield />} label="Role">
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </InfoItem>
                <InfoItem
                  icon={<Calendar />}
                  label="Member Since"
                  value={formatDate(user.createdAt)}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-accent" /> Addresses (
                {user.addresses.length})
              </h3>
              {user.addresses.length > 0 ? (
                <div className="space-y-2">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className="p-3 bg-secondary/50 border rounded-lg text-sm"
                    >
                      <p className="font-semibold">
                        {addr.firstName} {addr.lastName}{" "}
                        {addr.isDefault && (
                          <Badge className="ml-2">Default</Badge>
                        )}
                      </p>
                      <p>
                        {addr.street}, {addr.city}, {addr.state} -{" "}
                        {addr.postalCode}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground/70 italic">
                  No addresses on file.
                </p>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <ShoppingCart className="h-5 w-5 text-accent" /> Cart Items (
                {user.cart?.length || 0})
              </h3>
              {user.cart && user.cart.length > 0 ? (
                <div className="space-y-3">
                  {user.cart.map((item) => {
                    const variant = item.productId?.variants?.find(
                      (v) => v._id.toString() === item.variantId.toString()
                    );
                    return (
                      <div
                        key={item._id}
                        className="flex justify-between items-center p-3 bg-secondary/50 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.product.image ||
                              "https://placehold.co/48x48?text=N/A"
                            }
                            alt={item.product.productName}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <div>
                            <p className="font-semibold">
                              {item.product.productName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {`Qty: ${item.quantity} | Size: ${item.size} | ${item.product.variantName} | ${item.product.colorName}`}
                            </p>
                          </div>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              disabled={removeCartItemMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Item?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove this item from{" "}
                                {user.name}'s cart.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  removeCartItemMutation.mutate({
                                    userId: user._id,
                                    cartItemId: item._id,
                                  })
                                }
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-foreground/70 italic">
                  User's cart is empty.
                </p>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <Package className="h-5 w-5 text-accent" /> Order History (
                {user.orders.length})
              </h3>
              {user.orders.length > 0 ? (
                <div className="space-y-3">
                  {user.orders.map((order) => (
                    <div
                      key={order._id}
                      className="flex justify-between items-center p-3 bg-secondary/50 border rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">#{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <p className="font-bold text-base">
                        ₹{order.pricingInfo.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground/70 italic">
                  User has no past orders.
                </p>
              )}
            </div>
          </div>
        )}
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const InfoItem = ({ icon, label, value, children }) => (
  <div className="flex items-start space-x-3">
    <div className="text-accent mt-1">
      {React.cloneElement(icon, { className: "h-5 w-5" })}
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      {value ? (
        <p className="font-semibold text-sm">{value}</p>
      ) : (
        <div className="font-semibold text-sm">{children}</div>
      )}
    </div>
  </div>
);

export default UserManagement;
