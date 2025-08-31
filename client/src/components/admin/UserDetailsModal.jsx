import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
} from "lucide-react";

const UserDetailsModal = ({ user, isOpen, onClose }) => {
  if (!user) {
    return null;
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  // --- UPDATED: Function to render a single address object ---
  const renderAddress = (address) => {
    if (!address || Object.values(address).every((val) => !val)) {
      return <p className="text-sm text-foreground/70">No address on file.</p>;
    }
    const addressParts = [
      address.street,
      address.city,
      address.state,
      address.postalCode,
      address.country,
    ].filter(Boolean); // Filter out empty or null parts
    return <p className="text-base">{addressParts.join(", ")}</p>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <UserIcon className="h-6 w-6" /> User Details
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Contact & Info</h3>
              <div className="flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-semibold">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-semibold">{user.email}</p>
                </div>
              </div>
              {user.phoneNumber && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-semibold">{user.phoneNumber}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="font-semibold">{memberSince}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Address</h3>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  {/* This now calls the corrected render function */}
                  {renderAddress(user.address)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="h-6 w-6 text-accent" />
              <h3 className="text-xl font-semibold">
                Cart Items ({user.cartItem?.length || 0})
              </h3>
            </div>
            {user.cartItem && user.cartItem.length > 0 ? (
              <div className="space-y-4">
                {user.cartItem.map((item, index) => {
                  if (!item.productId) {
                    return (
                      <div
                        key={index}
                        className="flex p-3 bg-destructive/10 border rounded-lg items-center"
                      >
                        <p className="text-destructive font-semibold">
                          This product is no longer available.
                        </p>
                      </div>
                    );
                  }

                  const variant = item.productId.variants.find(
                    (v) => v._id.toString() === item.variantId.toString()
                  );
                  const color = variant?.colors.find(
                    (c) => c.name === item.colorName
                  );
                  const imageUrl =
                    color?.images?.[0] || item.productId.images?.[0] || "";

                  return (
                    <div
                      key={index}
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
