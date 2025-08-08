import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  PlusCircle,
  LogOut,
  X,
  ListOrdered, // Import X icon for the close button
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useAuth } from "@/context/AuthCotext";

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  toggleSidebar,
}) => {
  const { logout } = useAuth();

  const navLinks = [
    { name: "Dashboard", icon: LayoutDashboard, tab: "dashboard" },
    { name: "Users", icon: Users, tab: "users" },
    { name: "Products", icon: Package, tab: "products" },
    { name: "Add Product", icon: PlusCircle, tab: "addProduct" },
    { name: "Order History", icon: ListOrdered, tab: "orderHistory" },
  ];

  return (
    <>
      {/* Mobile Overlay (appears when sidebar is open on small screens) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar} // Close sidebar when clicking outside overlay
        ></div>
      )}

      {/* Sidebar itself */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card/80 border-r border-border/50 p-6 flex flex-col transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex-shrink-0`} // Always visible and takes space on md and up
      >
        {/* Sidebar Header (Logo and Close Button for mobile) */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={toggleSidebar}
          >
            {" "}
            {/* Toggle on logo click */}
            <img src={logo} alt="Arrasté" className="h-8 w-8" />
            <span className="text-xl font-bold gradient-text">
              Rift Wear Admin
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground/70 hover:text-accent"
            onClick={toggleSidebar} // Close button for mobile
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => (
            <Button
              key={link.tab}
              variant={activeTab === link.tab ? "secondary" : "ghost"}
              className={`w-full justify-start text-lg font-medium ${
                activeTab === link.tab
                  ? "bg-accent/20 text-accent"
                  : "text-foreground/80 hover:text-accent"
              }`}
              onClick={() => {
                setActiveTab(link.tab);
                toggleSidebar(); // Close sidebar on navigation item click
              }}
            >
              <link.icon className="h-5 w-5 mr-3" />
              {link.name}
            </Button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-border/40">
          <Button
            variant="destructive"
            className="w-full text-lg"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
