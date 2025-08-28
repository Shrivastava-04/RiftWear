import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";
import axios from "axios";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [user, setUser] = useState(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const navItems = [];
  const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchUserProfile = async () => {
    if (!userId) {
      setCartItemCount(0);
      setUser(null);
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
        const newCartLength = response.data.user.cartItem.length || 0;
        setCartItemCount(newCartLength);
        setIsUserAuthenticated(true);
      } else {
        setUser(null);
        setIsUserAuthenticated(false);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
      setIsUserAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();

    // Set up a listener for the custom 'cartUpdated' event
    const handleCartUpdateEvent = () => {
      console.log("Cart updated event received. Fetching new cart data...");
      fetchUserProfile();
    };

    window.addEventListener("cartUpdated", handleCartUpdateEvent);

    return () => {
      // Clean up the event listener on component unmount
      window.removeEventListener("cartUpdated", handleCartUpdateEvent);
    };
  }, [userId, API_BASE_URL]);

  const handleLogo = () => {
    return window.location.pathname === "/" ? "" : "/";
  };

  const handleProfileClick = () => {
    if (isUserAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to={handleLogo()} className="flex items-center space-x-2">
            <img src={logo} alt="Rift" className="h-8 w-8 rounded-md" />
            <span className="text-xl font-extrabold gradient-text">RIFT</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/cart")}
              className="flex items-center relative p-1"
            >
              <ShoppingCart className="h-4 w-4" />
              {isUserAuthenticated && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-black bg-accent rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleProfileClick}>
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
