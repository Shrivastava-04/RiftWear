import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Home, Package } from "lucide-react";

// --- Core Hooks & API ---
import { fetchOrderById } from "@/api/apiService";

// --- UI Components ---
import Header from "@/components/common/Header"; // Corrected Path
import Footer from "@/components/common/Footer"; // Corrected Path
import Spinner from "@/components/common/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OrderConfirmation = () => {
  const { orderId } = useParams();

  // --- Data Fetching with React Query ---
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId, // Only run the query if an orderId exists in the URL
  });

  const order = response?.data?.order;

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
        <p className="ml-3">Loading order details...</p>
      </div>
    );
  }

  // --- Error State ---
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive text-2xl">
              Order Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              {error.response?.data?.message || "Failed to load order details."}
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" /> Go to Homepage
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) return null; // Should not happen if isLoading/isError are handled

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const { shippingInfo, pricingInfo, paymentInfo } = order;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold gradient-text">
              Order Confirmed!
            </CardTitle>
            <p className="text-foreground/70 mt-2">
              Thank you for your purchase, {shippingInfo.firstName}.
            </p>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Order Details</h3>
                <p>
                  <strong>Order Number:</strong> {order.orderNumber}
                </p>
                <p>
                  <strong>Total Amount:</strong> ₹
                  {pricingInfo.totalAmount.toFixed(2)}
                </p>
                <p>
                  <strong>Payment ID:</strong>{" "}
                  {paymentInfo.razorpay.paymentId || "N/A"}
                </p>
                <p>
                  <strong>Order Date:</strong> {formattedDate}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Shipping To</h3>
                <p>
                  <strong>
                    {shippingInfo.firstName} {shippingInfo.lastName}
                  </strong>
                </p>
                <p>
                  {shippingInfo.street}, {shippingInfo.landmark}
                </p>
                <p>
                  {shippingInfo.city}, {shippingInfo.state} -{" "}
                  {shippingInfo.postalCode}
                </p>
                <p>Phone: {shippingInfo.phoneNumber}</p>
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-3 border-t pt-4">
              Items Ordered
            </h3>
            <div className="space-y-4">
              {order.items &&
                order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 border-b pb-3 last:border-b-0"
                  >
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-foreground/70">{`Size: ${item.size} | ${item.variantName} | ${item.colorName} | Qty: ${item.quantity}`}</p>
                      {item.nameToPrint && (
                        <p className="text-sm text-accent">
                          Custom Name: {item.nameToPrint}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-accent font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button asChild variant="cta" className="flex-1">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" /> Continue Shopping
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/profile">
                  <Package className="h-4 w-4 mr-2" /> View My Orders
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
