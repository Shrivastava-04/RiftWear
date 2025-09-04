import React, { use } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  ShoppingCart,
  MapPin,
  Package, // For orders
  Shield, // For role
  RefreshCw, // For last updated
  Key, // For Google ID (optional)
} from "lucide-react";

// Helper sub-component for consistent info display
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

const UserDetailsModal = ({ user, isOpen, onClose }) => {
  if (!user) {
    return null;
  }

  console.log(user);
  // Helper for formatting dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper for formatting the single address object
  const formatAddress = (address) => {
    if (!address || Object.values(address).every((val) => !val)) {
      return null;
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

  const memberSince = formatDate(user.createdAt);
  const lastUpdated = formatDate(user.updatedAt);
  const formattedAddress = formatAddress(user.address);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <UserIcon className="h-6 w-6" /> User Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* PERSONAL & ACCOUNT INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold border-b pb-1">
                Contact Information
              </h3>
              <InfoItem icon={<UserIcon />} label="Name" value={user.name} />
              <InfoItem icon={<Mail />} label="Email" value={user.email} />
              {user.phoneNumber && (
                <InfoItem
                  icon={<Phone />}
                  label="Phone"
                  value={user.phoneNumber}
                />
              )}
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold border-b pb-1">
                Account Information
              </h3>
              <InfoItem icon={<Shield />} label="Role">
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                >
                  {user.role || "User"}
                </Badge>
              </InfoItem>
              <InfoItem
                icon={<Calendar />}
                label="Member Since"
                value={memberSince}
              />
              <InfoItem
                icon={<RefreshCw />}
                label="Last Updated"
                value={lastUpdated}
              />
              {user.googleId && ( // This will only show if googleId exists in data
                <InfoItem
                  icon={<Key />}
                  label="Google ID"
                  value={user.googleId}
                />
              )}
            </div>
          </div>

          {/* ADDRESS */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-accent" /> Address
            </h3>
            {formattedAddress ? (
              <div className="p-3 bg-secondary/50 border rounded-lg text-sm">
                {formattedAddress}
              </div>
            ) : (
              <p className="text-sm text-foreground/70 italic">
                No address on file.
              </p>
            )}
          </div>

          {/* ORDER HISTORY */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <Package className="h-5 w-5 text-accent" /> Order History (
              {user.order?.length || 0})
            </h3>
            {user.order && user.order.length > 0 ? (
              <div className="space-y-3">
                {user.order.map((order) => (
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
                      ₹{order.totalAmount.toLocaleString()}
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

          {/* CART ITEMS */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold">
                Cart Items ({user.cartItem?.length || 0})
              </h3>
            </div>
            {user.cartItem && user.cartItem.length > 0 ? (
              <div className="space-y-4">
                {user.cartItem.map((item) => {
                  if (!item.productId) {
                    return (
                      <div
                        key={item._id}
                        className="flex p-3 bg-destructive/10 border rounded-lg items-center"
                      >
                        <p className="text-destructive font-semibold">
                          This product is no longer available.
                        </p>
                      </div>
                    );
                  }
                  // Assuming productId is populated and contains a variants array
                  const variant = item.productId.variants?.find(
                    (v) => v._id.toString() === item.variantId.toString()
                  );
                  const color = variant?.colors.find(
                    (c) => c.name === item.colorName
                  );
                  const imageUrl =
                    color?.images?.[0] || item.productId.images?.[0] || "";

                  return (
                    <div
                      key={item._id}
                      className="flex p-3 bg-secondary/50 border rounded-lg items-center"
                    >
                      <img
                        src={imageUrl}
                        alt={item.productId.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-semibold">{item.productId.name}</p>
                        <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground mt-1">
                          <Badge variant="secondary">
                            Qty: {item.quantity}
                          </Badge>
                          <Badge variant="secondary">Size: {item.size}</Badge>
                          <Badge variant="secondary">
                            {variant?.name || "N/A"}
                          </Badge>
                          <Badge variant="secondary">{item.colorName}</Badge>
                        </div>
                      </div>
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
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
