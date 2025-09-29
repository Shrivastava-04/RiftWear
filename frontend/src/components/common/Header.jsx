import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // For the user profile icon
import logo from "@/assets/logo.png"; // Make sure path is correct

// --- NEW IMPORTS ---
import { useAuth } from "@/hooks/useAuth"; // Our single source of truth for user data
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // 1. Get everything we need from our central AuthContext
  //    No more useState, useEffect, or axios!
  const { user, isAuthenticated, logout } = useAuth();

  // 2. The cart count is now derived directly from the user object
  //    It will automatically update whenever the user's cart changes.
  const cartItemCount = user?.cart?.length || 0;

  const handleLogout = async () => {
    try {
      await logout(); // This calls the backend and clears the context
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate("/"); // Redirect to home after logout
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Rift" className="h-8 w-8 rounded-md" />
            <span className="text-xl font-extrabold gradient-text">RIFT</span>
          </Link>

          {/* Navigation Links can be added here if needed */}
          {/* <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/explore"
              className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
            >
              Explore
            </Link>
          </nav> */}

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/cart")}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {isAuthenticated && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs font-bold text-black">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* --- NEW: Dynamic User Icon --- */}
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/profile")}
              >
                <UserIcon className="h-5 w-5" />
              </Button>
            ) : (
              // If you want a dropdown menu instead of direct navigation, uncomment below:
              // <DropdownMenu>
              //   <DropdownMenuTrigger asChild>
              //     <Button variant="ghost" size="icon">
              //       <UserIcon className="h-5 w-5" />
              //     </Button>
              //   </DropdownMenuTrigger>
              //   <DropdownMenuContent align="end">
              //     <DropdownMenuLabel>My Account</DropdownMenuLabel>
              //     <DropdownMenuSeparator />
              //     <DropdownMenuItem onClick={() => navigate("/profile")}>
              //       Profile
              //     </DropdownMenuItem>
              //     <DropdownMenuItem onClick={() => navigate("/profile/orders")}>
              //       My Orders
              //     </DropdownMenuItem>
              //     <DropdownMenuSeparator />
              //     <DropdownMenuItem
              //       onClick={handleLogout}
              //       className="text-red-500"
              //     >
              //       Logout
              //     </DropdownMenuItem>
              //   </DropdownMenuContent>
              // </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/login")}
              >
                <UserIcon className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
