import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Users,
  Package,
  ShoppingCart,
  ArrowRight,
  IndianRupee,
  ShoppingBag,
  Heart,
  TrendingUp,
  Truck,
  Clock,
  Calendar,
} from "lucide-react";

// --- Core Hooks & API ---
import { useAuth } from "@/hooks/useAuth";
import { fetchDashboardStats } from "@/api/apiService";

// --- UI Components ---
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Spinner from "@/components/common/Spinner";

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// --- Main Dashboard Component ---
const AdminDashboard = () => {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["adminDashboardData"],
    queryFn: fetchDashboardStats,
  });

  const stats = data?.data?.stats;
  const recentOrders = data?.data?.recentOrders || [];
  const topSellingProducts = data?.data?.topSellingProducts || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <p className="text-foreground/70 mt-1">
          Welcome back, {user?.name}! Here's a summary of your store's
          performance.
        </p>
      </div>

      {/* --- UPDATED & EXPANDED Stat Cards --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Financial Stats */}
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.revenue || 0)}
          icon={IndianRupee}
          description="All-time sales"
        />
        <StatCard
          title="Revenue Today"
          value={formatCurrency(stats?.revenueToday || 0)}
          icon={Calendar}
          description="Sales since midnight"
        />
        <StatCard
          title="Avg. Order Value"
          value={formatCurrency(stats?.averageOrderValue || 0)}
          icon={ShoppingCart}
          description="Average sale amount"
        />
        <StatCard
          title="Products Sold"
          value={stats?.productsSold || 0}
          icon={ShoppingBag}
          description="Total items sold"
        />

        {/* Operational Stats */}
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={TrendingUp}
          description="All-time orders"
        />
        <StatCard
          title="Pending Shipments"
          value={stats?.pendingShipments || 0}
          icon={Truck}
          description="Not yet Delivered or Cancelled"
        />
        <StatCard
          title="Processing Orders"
          value={stats?.processingOrders || 0}
          icon={Clock}
          description="New orders needing action"
        />

        {/* Growth Stats */}
        <StatCard
          title="Unique Customers"
          value={stats?.uniqueCustomers || 0}
          icon={Heart}
          description="Count of distinct buyers"
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          description="Total signed-up users"
        />
        <StatCard
          title="Live Products"
          value={stats?.liveProducts || 0}
          icon={Package}
          description="Products marked as active"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2">
          <RecentOrders orders={recentOrders} />
        </div>
        <div>
          <TopSellingProducts products={topSellingProducts} />
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---
const StatCard = ({ title, value, icon: Icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const RecentOrders = ({ orders }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Orders</CardTitle>
      <CardDescription>A list of the 5 most recent orders.</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="px-6 py-4 font-medium">
                  {order.customer?.name || "N/A"}
                </td>
                <td className="px-6 py-4">
                  <Badge>{order.orderStatus}</Badge>
                </td>
                <td className="px-6 py-4">
                  {formatCurrency(order.pricingInfo.totalAmount)}
                </td>
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
    <CardFooter className="justify-center">
      <Button asChild variant="ghost" className="text-accent">
        <Link to="/admin/orders">
          View All Orders <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </Button>
    </CardFooter>
  </Card>
);

const TopSellingProducts = ({ products }) => (
  <Card>
    <CardHeader>
      <CardTitle>Top Selling Products</CardTitle>
      <CardDescription>Your 5 most popular items.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {products.map((product) => (
        <div key={product._id} className="flex items-center gap-4">
          <img
            src={product.image}
            alt={product.productName}
            className="w-12 h-12 object-cover rounded-md"
          />
          <div className="flex-1">
            <p className="font-semibold text-sm line-clamp-1">
              {product.productName}
            </p>
            <p className="text-xs text-muted-foreground">
              {product.totalSold} units sold
            </p>
          </div>
          <div className="font-bold text-lg">{product.totalSold}</div>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default AdminDashboard;
