// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   User as UserIcon,
//   Mail,
//   Phone,
//   Calendar,
//   Globe,
//   Info,
//   ShoppingCart,
//   MapPin,
//   Package,
//   Ruler,
// } from "lucide-react";

// const UserDetailsModal = ({ user, isOpen, onClose }) => {
//   if (!user) {
//     return null;
//   }

//   const memberSince = user.createdAt
//     ? new Date(user.createdAt).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       })
//     : "N/A";

//   const renderAddress = (address) => {
//     if (!address || Object.values(address).every((val) => !val)) {
//       return <p className="text-sm text-foreground/70">No address on file.</p>;
//     }
//     return (
//       <p className="text-base sm:text-lg">
//         {address.street ? `${address.street}, ` : ""}
//         {address.city ? `${address.city}, ` : ""}
//         {address.state ? `${address.state}, ` : ""}
//         {address.postalCode ? `${address.postalCode}, ` : ""}
//         {address.country ? `${address.country}` : ""}
//       </p>
//     );
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card/90 border-border/50 backdrop-blur-sm text-foreground p-4 sm:p-6">
//         <DialogHeader>
//           <DialogTitle className="text-xl sm:text-2xl gradient-text flex items-center gap-2">
//             <UserIcon className="h-5 w-5 sm:h-6 sm:w-6" /> User Details
//           </DialogTitle>
//           <DialogDescription className="text-foreground/70 text-sm sm:text-base">
//             View comprehensive information about this user.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Basic Info */}
//             <div className="space-y-4">
//               <div className="flex items-center space-x-3">
//                 <UserIcon className="h-5 w-5 text-accent" />
//                 <div>
//                   <p className="text-xs text-muted-foreground">Name</p>
//                   <p className="font-semibold text-base">{user.name}</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <Mail className="h-5 w-5 text-accent" />
//                 <div>
//                   <p className="text-xs text-muted-foreground">Email</p>
//                   <p className="font-semibold text-base">{user.email}</p>
//                 </div>
//               </div>
//               {user.phoneNumber && (
//                 <div className="flex items-center space-x-3">
//                   <Phone className="h-5 w-5 text-accent" />
//                   <div>
//                     <p className="text-xs text-muted-foreground">Phone</p>
//                     <p className="font-semibold text-base">
//                       {user.phoneNumber}
//                     </p>
//                   </div>
//                 </div>
//               )}
//               <div className="flex items-center space-x-3">
//                 <Info className="h-5 w-5 text-accent" />
//                 <div>
//                   <p className="text-xs text-muted-foreground">Role</p>
//                   <p className="font-semibold text-base capitalize">
//                     {user.role}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <Calendar className="h-5 w-5 text-accent" />
//                 <div>
//                   <p className="text-xs text-muted-foreground">Member Since</p>
//                   <p className="font-semibold text-base">{memberSince}</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3 text-xs text-muted-foreground break-all">
//                 <Globe className="h-4 w-4" />
//                 <p>ID: {user._id}</p>
//               </div>
//             </div>
//             {/* Address Info */}
//             <div className="space-y-4">
//               <div className="flex items-start space-x-3">
//                 <MapPin className="h-5 w-5 text-accent mt-1" />
//                 <div>
//                   <p className="text-xs text-muted-foreground">Address</p>
//                   {renderAddress(user.address)}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Cart Items Section */}
//           <div className="mt-6">
//             <div className="flex items-center gap-2 mb-4">
//               <ShoppingCart className="h-6 w-6 text-accent" />
//               <h3 className="text-xl font-semibold">
//                 Cart Items ({user.cartItem?.length || 0})
//               </h3>
//             </div>
//             {user.cartItem && user.cartItem.length > 0 ? (
//               <div className="space-y-4">
//                 {user.cartItem.map((item, index) => (
//                   <Card
//                     key={index}
//                     className="flex p-3 bg-secondary/50 border-border/50"
//                   >
//                     <img
//                       src={item.color?.images?.[0]} // Use the first image from the color object
//                       alt={item.productId?.name}
//                       className="w-16 h-16 object-cover rounded-md border"
//                     />
//                     <div className="ml-4 flex-1">
//                       <p className="font-semibold text-lg">
//                         {item.productId?.name}
//                       </p>
//                       <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                         <Badge variant="secondary">{item.size}</Badge>
//                         <Badge variant="secondary">{item.variety}</Badge>
//                         <div className="flex items-center">
//                           <span
//                             className="h-3 w-3 rounded-full mr-1"
//                             style={{ backgroundColor: item.color?.name }}
//                             title={item.color?.name} // Use the color name for tooltip
//                           />
//                           {item.color?.name}
//                         </div>
//                         <p>Qty: {item.quantity}</p>
//                       </div>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-foreground/70 italic">
//                 User's cart is empty.
//               </p>
//             )}
//           </div>
//         </div>
//         <DialogFooter>
//           <Button
//             onClick={onClose}
//             variant="outline"
//             className="w-full sm:w-auto"
//           >
//             Close
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default UserDetailsModal;
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
