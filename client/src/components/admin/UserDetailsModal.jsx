// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import {
//   User as UserIcon,
//   Mail,
//   Phone,
//   Calendar,
//   Globe,
//   Info,
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

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-card/90 border-border/50 backdrop-blur-sm text-foreground p-4 sm:p-6">
//         {" "}
//         {/* Adjusted padding */}
//         <DialogHeader>
//           <DialogTitle className="text-xl sm:text-2xl gradient-text flex items-center gap-2">
//             {" "}
//             {/* Adjusted font size */}
//             <UserIcon className="h-5 w-5 sm:h-6 sm:w-6" /> User Details{" "}
//             {/* Adjusted icon size */}
//           </DialogTitle>
//           <DialogDescription className="text-foreground/70 text-sm sm:text-base">
//             {" "}
//             {/* Adjusted font size */}
//             View comprehensive information about this user.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-3 py-3 sm:gap-4 sm:py-4">
//           {" "}
//           {/* Adjusted gaps and padding */}
//           {/* Name */}
//           <div className="flex items-center space-x-3">
//             <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />{" "}
//             {/* Adjusted icon size */}
//             <div>
//               <p className="text-xs sm:text-sm text-muted-foreground">Name</p>{" "}
//               {/* Adjusted font size */}
//               <p className="font-semibold text-base sm:text-lg">
//                 {user.name}
//               </p>{" "}
//               {/* Adjusted font size */}
//             </div>
//           </div>
//           {/* Email */}
//           <div className="flex items-center space-x-3">
//             <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />{" "}
//             {/* Adjusted icon size */}
//             <div>
//               <p className="text-xs sm:text-sm text-muted-foreground">Email</p>{" "}
//               {/* Adjusted font size */}
//               <p className="font-semibold text-base sm:text-lg">
//                 {user.email}
//               </p>{" "}
//               {/* Adjusted font size */}
//             </div>
//           </div>
//           {/* Phone Number (Conditional) */}
//           {user.phoneNumber && (
//             <div className="flex items-center space-x-3">
//               <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />{" "}
//               {/* Adjusted icon size */}
//               <div>
//                 <p className="text-xs sm:text-sm text-muted-foreground">
//                   Phone Number
//                 </p>{" "}
//                 {/* Adjusted font size */}
//                 <p className="font-semibold text-base sm:text-lg">
//                   {user.phoneNumber}
//                 </p>{" "}
//                 {/* Adjusted font size */}
//               </div>
//             </div>
//           )}
//           {/* Role */}
//           <div className="flex items-center space-x-3">
//             <Info className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />{" "}
//             {/* Adjusted icon size */}
//             <div>
//               <p className="text-xs sm:text-sm text-muted-foreground">Role</p>{" "}
//               {/* Adjusted font size */}
//               <p className="font-semibold text-base sm:text-lg capitalize">
//                 {user.role}
//               </p>{" "}
//               {/* Adjusted font size */}
//             </div>
//           </div>
//           {/* Member Since */}
//           <div className="flex items-center space-x-3">
//             <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />{" "}
//             {/* Adjusted icon size */}
//             <div>
//               <p className="text-xs sm:text-sm text-muted-foreground">
//                 Member Since
//               </p>{" "}
//               {/* Adjusted font size */}
//               <p className="font-semibold text-base sm:text-lg">
//                 {memberSince}
//               </p>{" "}
//               {/* Adjusted font size */}
//             </div>
//           </div>
//           {/* User ID (Optional, for debugging/admin reference) */}
//           <div className="flex items-center space-x-3 text-xs sm:text-sm text-muted-foreground break-all">
//             {" "}
//             {/* Adjusted font size */}
//             <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />{" "}
//             {/* Adjusted icon size */}
//             <p>ID: {user._id}</p>
//           </div>
//         </div>
//         <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-0">
//           {" "}
//           {/* Adjusted button layout for mobile */}
//           <Button
//             onClick={onClose}
//             variant="outline"
//             className="w-full sm:w-auto"
//           >
//             {" "}
//             {/* Full width on mobile, auto on sm+ */}
//             Close
//           </Button>
//           {/* You could add more action buttons here, e.g., "Edit User", "Delete User" */}
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Globe,
  Info,
  ShoppingCart,
  MapPin,
  Package,
  Ruler,
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

  const renderAddress = (address) => {
    if (!address || Object.values(address).every((val) => !val)) {
      return <p className="text-sm text-foreground/70">No address on file.</p>;
    }
    return (
      <p className="text-base sm:text-lg">
        {address.street ? `${address.street}, ` : ""}
        {address.city ? `${address.city}, ` : ""}
        {address.state ? `${address.state}, ` : ""}
        {address.postalCode ? `${address.postalCode}, ` : ""}
        {address.country ? `${address.country}` : ""}
      </p>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card/90 border-border/50 backdrop-blur-sm text-foreground p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl gradient-text flex items-center gap-2">
            <UserIcon className="h-5 w-5 sm:h-6 sm:w-6" /> User Details
          </DialogTitle>
          <DialogDescription className="text-foreground/70 text-sm sm:text-base">
            View comprehensive information about this user.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-semibold text-base">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-semibold text-base">{user.email}</p>
                </div>
              </div>
              {user.phoneNumber && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-semibold text-base">
                      {user.phoneNumber}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Info className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="font-semibold text-base capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="font-semibold text-base">{memberSince}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-xs text-muted-foreground break-all">
                <Globe className="h-4 w-4" />
                <p>ID: {user._id}</p>
              </div>
            </div>
            {/* Address Info */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent mt-1" />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  {renderAddress(user.address)}
                </div>
              </div>
            </div>
          </div>

          {/* Cart Items Section */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="h-6 w-6 text-accent" />
              <h3 className="text-xl font-semibold">
                Cart Items ({user.cartItem?.length || 0})
              </h3>
            </div>
            {user.cartItem && user.cartItem.length > 0 ? (
              <div className="space-y-4">
                {user.cartItem.map((item, index) => (
                  <Card
                    key={index}
                    className="flex p-3 bg-secondary/50 border-border/50"
                  >
                    <img
                      src={item.color?.images?.[0]} // Use the first image from the color object
                      alt={item.productId?.name}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-lg">
                        {item.productId?.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary">{item.size}</Badge>
                        <Badge variant="secondary">{item.variety}</Badge>
                        <div className="flex items-center">
                          <span
                            className="h-3 w-3 rounded-full mr-1"
                            style={{ backgroundColor: item.color?.name }}
                            title={item.color?.name} // Use the color name for tooltip
                          />
                          {item.color?.name}
                        </div>
                        <p>Qty: {item.quantity}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-foreground/70 italic">
                User's cart is empty.
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
