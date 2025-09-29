import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Tag,
  Zap,
  X,
} from "lucide-react";
import logo from "@/assets/logo.png";

const AdminSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Departments", href: "/admin/departments", icon: Tag },
    { name: "Drops", href: "/admin/drops", icon: Zap },
    { name: "Site Settings", href: "/admin/settings", icon: Zap },
  ];

  const baseClasses =
    "flex items-center px-4 py-3 rounded-lg transition-colors duration-200";
  const inactiveClasses =
    "text-foreground/70 hover:bg-muted hover:text-foreground";
  const activeClasses = "bg-primary text-primary-foreground font-semibold";

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-card border-r border-border/50 transition-transform md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <NavLink to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Rift" className="h-8 w-8 rounded-md" />
            <span className="text-xl font-extrabold gradient-text">
              RIFT ADMIN
            </span>
          </NavLink>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-1 rounded-md hover:bg-muted"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end // 'end' prop ensures only the exact URL is matched for the active style
              className={({ isActive }) =>
                `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
              }
              onClick={() => isSidebarOpen && toggleSidebar()} // Close sidebar on mobile after click
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
    </>
  );
};

export default AdminSidebar;
