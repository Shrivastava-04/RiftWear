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
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Globe,
  Info,
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-card/90 border-border/50 backdrop-blur-sm text-foreground p-4 sm:p-6">
        {" "}
        {/* Adjusted padding */}
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl gradient-text flex items-center gap-2">
            {" "}
            {/* Adjusted font size */}
            <UserIcon className="h-5 w-5 sm:h-6 sm:w-6" /> User Details{" "}
            {/* Adjusted icon size */}
          </DialogTitle>
          <DialogDescription className="text-foreground/70 text-sm sm:text-base">
            {" "}
            {/* Adjusted font size */}
            View comprehensive information about this user.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-3 sm:gap-4 sm:py-4">
          {" "}
          {/* Adjusted gaps and padding */}
          {/* Name */}
          <div className="flex items-center space-x-3">
            <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />{" "}
            {/* Adjusted icon size */}
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Name</p>{" "}
              {/* Adjusted font size */}
              <p className="font-semibold text-base sm:text-lg">
                {user.name}
              </p>{" "}
              {/* Adjusted font size */}
            </div>
          </div>
          {/* Email */}
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />{" "}
            {/* Adjusted icon size */}
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Email</p>{" "}
              {/* Adjusted font size */}
              <p className="font-semibold text-base sm:text-lg">
                {user.email}
              </p>{" "}
              {/* Adjusted font size */}
            </div>
          </div>
          {/* Phone Number (Conditional) */}
          {user.phoneNumber && (
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />{" "}
              {/* Adjusted icon size */}
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Phone Number
                </p>{" "}
                {/* Adjusted font size */}
                <p className="font-semibold text-base sm:text-lg">
                  {user.phoneNumber}
                </p>{" "}
                {/* Adjusted font size */}
              </div>
            </div>
          )}
          {/* Role */}
          <div className="flex items-center space-x-3">
            <Info className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />{" "}
            {/* Adjusted icon size */}
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Role</p>{" "}
              {/* Adjusted font size */}
              <p className="font-semibold text-base sm:text-lg capitalize">
                {user.role}
              </p>{" "}
              {/* Adjusted font size */}
            </div>
          </div>
          {/* Member Since */}
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />{" "}
            {/* Adjusted icon size */}
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Member Since
              </p>{" "}
              {/* Adjusted font size */}
              <p className="font-semibold text-base sm:text-lg">
                {memberSince}
              </p>{" "}
              {/* Adjusted font size */}
            </div>
          </div>
          {/* User ID (Optional, for debugging/admin reference) */}
          <div className="flex items-center space-x-3 text-xs sm:text-sm text-muted-foreground break-all">
            {" "}
            {/* Adjusted font size */}
            <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />{" "}
            {/* Adjusted icon size */}
            <p>ID: {user._id}</p>
          </div>
        </div>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-0">
          {" "}
          {/* Adjusted button layout for mobile */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {" "}
            {/* Full width on mobile, auto on sm+ */}
            Close
          </Button>
          {/* You could add more action buttons here, e.g., "Edit User", "Delete User" */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
