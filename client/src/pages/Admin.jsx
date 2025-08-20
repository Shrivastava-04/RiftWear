// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "@/components/Header"; // Consider if you need this header for admin
// import Footer from "@/components/Footer"; // Consider if you need this footer for admin

// import AdminSidebar from "@/components/admin/AdminSidebar"; // The sidebar component
// import UserManagement from "@/components/admin/UserManagement";
// import ProductManagement from "@/components/admin/ProductManagement";
// import AddProductForm from "@/components/admin/AddProductForm";
// import DepartmentManagement from "@/components/admin/DepartmentManagement"; // Import the new DepartmentManagement component

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Users,
//   Package,
//   PlusCircle,
//   LayoutDashboard,
//   Menu,
// } from "lucide-react"; // Import Menu icon for mobile toggle
// import axios from "axios";
// import AdminOrderHistory from "../components/admin/AdminOrderHistory";

// const AdminDashboard = () => {
//   const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const navigate = useNavigate();

//   // --- NEW STATE FOR SIDEBAR VISIBILITY ---
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // --- TOGGLE FUNCTION ---
//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       if (!userId) {
//         console.warn("AdminDashboard: No userId found. Redirecting to login.");
//         setLoading(false);
//         setIsUserAuthenticated(false);
//         navigate("/login");
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await axios.get(`${API_BASE_URL}/user/userById`, {
//           params: { id: userId },
//         });

//         if (response.data && response.data.user) {
//           setUser(response.data.user);
//           setIsUserAuthenticated(true);
//         } else {
//           console.warn("AdminDashboard: User data not found. Logging out.");
//           setUser(null);
//           setIsUserAuthenticated(false);
//           localStorage.removeItem("userId");
//           navigate("/login");
//         }
//       } catch (error) {
//         console.error(
//           "AdminDashboard: Error fetching user profile:",
//           error.response?.status,
//           error.response?.data?.message || error.message
//         );
//         setUser(null);
//         setIsUserAuthenticated(false);
//         localStorage.removeItem("userId");
//         navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, [API_BASE_URL, userId, navigate]);

//   useEffect(() => {
//     if (!loading) {
//       if (!isUserAuthenticated || user.role !== "admin") {
//         alert("Access Denied: You must be an administrator to view this page.");
//         navigate("/");
//       }
//     }
//   }, [isUserAuthenticated, user, loading, navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
//         <p>Loading user data...</p>
//       </div>
//     );
//   }

//   if (!isUserAuthenticated || user.role !== "admin") {
//     return (
//       <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
//         <p className="text-destructive text-xl">
//           Access Denied: You are not authorized to view this page.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground flex">
//       {" "}
//       {/* Removed flex-col md:flex-row from here */}
//       {/* Pass sidebar state and toggle function */}
//       <AdminSidebar
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         isSidebarOpen={isSidebarOpen}
//         toggleSidebar={toggleSidebar}
//       />
//       {/* Mobile Hamburger Button (appears on small screens when sidebar is closed) */}
//       {!isSidebarOpen && (
//         <Button
//           variant="ghost"
//           size="icon"
//           className="fixed top-4 left-4 z-30 md:hidden text-foreground/70 hover:text-accent"
//           onClick={toggleSidebar} // Open sidebar
//         >
//           <Menu className="h-8 w-8" />
//         </Button>
//       )}
//       {/* Main Content Area */}
//       {/* Adjust margin-left only for medium screens and up to account for the static sidebar */}
//       <main className="flex-1 p-8 transition-all duration-300 ">
//         <h1 className="text-4xl font-bold gradient-text mb-8">
//           Admin Dashboard
//         </h1>
//         {activeTab === "dashboard" && (
//           <Card className="bg-card/50 border-border/50 p-6 text-center">
//             <h2 className="text-2xl font-semibold mb-4">
//               Welcome, {user.name}!
//             </h2>
//             <p className="text-foreground/70">
//               Manage your website's users and products from here.
//             </p>
//           </Card>
//         )}
//         {activeTab === "users" && <UserManagement />}
//         {activeTab === "products" && (
//           <ProductManagement setActiveTab={setActiveTab} />
//         )}
//         {activeTab === "addProduct" && <AddProductForm />}
//         {activeTab === "orderHistory" && <AdminOrderHistory />}
//         {activeTab === "departments" && <DepartmentManagement />}
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import AdminSidebar from "@/components/admin/AdminSidebar";
import UserManagement from "@/components/admin/UserManagement";
import ProductManagement from "@/components/admin/ProductManagement";
import AddProductForm from "@/components/admin/AddProductForm";
import DepartmentManagement from "@/components/admin/DepartmentManagement";
import DropManager from "@/components/admin/DropManager"; // NEW: Import the DropManager component

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Package,
  PlusCircle,
  LayoutDashboard,
  Menu,
  CalendarClock, // NEW: Import a suitable icon
} from "lucide-react";
import axios from "axios";
import AdminOrderHistory from "../components/admin/AdminOrderHistory";

const AdminDashboard = () => {
  const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        console.warn("AdminDashboard: No userId found. Redirecting to login.");
        setLoading(false);
        setIsUserAuthenticated(false);
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/user/userById`, {
          params: { id: userId },
        });

        if (response.data && response.data.user) {
          setUser(response.data.user);
          setIsUserAuthenticated(true);
        } else {
          console.warn("AdminDashboard: User data not found. Logging out.");
          setUser(null);
          setIsUserAuthenticated(false);
          localStorage.removeItem("userId");
          navigate("/login");
        }
      } catch (error) {
        console.error(
          "AdminDashboard: Error fetching user profile:",
          error.response?.status,
          error.response?.data?.message || error.message
        );
        setUser(null);
        setIsUserAuthenticated(false);
        localStorage.removeItem("userId");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [API_BASE_URL, userId, navigate]);

  useEffect(() => {
    if (!loading) {
      if (!isUserAuthenticated || user.role !== "admin") {
        alert("Access Denied: You must be an administrator to view this page.");
        navigate("/");
      }
    }
  }, [isUserAuthenticated, user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!isUserAuthenticated || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-destructive text-xl">
          Access Denied: You are not authorized to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {!isSidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-30 md:hidden text-foreground/70 hover:text-accent"
          onClick={toggleSidebar}
        >
          <Menu className="h-8 w-8" />
        </Button>
      )}
      <main className="flex-1 p-8 transition-all duration-300 ">
        <h1 className="text-4xl font-bold gradient-text mb-8">
          Admin Dashboard
        </h1>
        {activeTab === "dashboard" && (
          <Card className="bg-card/50 border-border/50 p-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Welcome, {user.name}!
            </h2>
            <p className="text-foreground/70">
              Manage your website's users and products from here.
            </p>
          </Card>
        )}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "products" && (
          <ProductManagement setActiveTab={setActiveTab} />
        )}
        {activeTab === "addProduct" && <AddProductForm />}
        {activeTab === "orderHistory" && <AdminOrderHistory />}
        {activeTab === "departments" && <DepartmentManagement />}
        {activeTab === "dropManager" && <DropManager />}
      </main>
    </div>
  );
};

export default AdminDashboard;
