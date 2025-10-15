import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";

// Import all your page components
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Explore from "./pages/Explore";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderFailure from "./pages/OrderFailure";
import OrderDetail from "./pages/OrderDetail";
import AdminRoute from "./components/common/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
// We'll create placeholder files for these next
import UserManagement from "./pages/admin/UserManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import DepartmentManagement from "./pages/admin/DepartmentManagement";
import DropManagement from "./pages/admin/DropManagement";
import SiteSettings from "./pages/admin/SiteSetting";
import ShippingPolicy from "./pages/Shipping";
import CancellationRefundPolicy from "./pages/Return";
import TermsConditions from "./pages/TermsAndCondition";
import PrivacyPolicy from "./pages/Privacy-Policy";
// We'll create layout components like the Header next
// import Header from './components/layout/Header';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* We no longer need the Header and Footer directly here if Admin has its own layout */}
        <Routes>
          {/* --- 2. Keep all your public and user routes inside a separate layout --- */}
          <Route path="/*" element={<MainLayout />} />

          {/* --- 3. THIS IS THE NEW ADMIN ROUTING STRUCTURE --- */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="departments" element={<DepartmentManagement />} />
              <Route path="drops" element={<DropManagement />} />
              <Route path="settings" element={<SiteSettings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

const MainLayout = () => (
  <>
    {/* <Header /> */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element={<Profile />} />
      <Route
        path="/order-confirmation/:orderId"
        element={<OrderConfirmation />}
      />
      <Route path="/order/:orderId" element={<OrderDetail />} />
      <Route path="/order-failure" element={<OrderFailure />} />
      <Route path="/shipping-policy" element={<ShippingPolicy />} />
      <Route
        path="/cancellation-refund-policy"
        element={<CancellationRefundPolicy />}
      />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsConditions />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    {/* <Footer /> */}
  </>
);

export default App;
