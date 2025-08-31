import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Home, Package } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("No order ID provided.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // NOTE: Ensure your backend has a route like this pointing to getOrderById
        const response = await axios.get(
          `${API_BASE_URL}/orders/current-order-details`,
          { params: { id: orderId } }
        );
        setOrder(response.data.order);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load order details."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId, API_BASE_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mr-3" />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive text-2xl">
              Order Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{error}</p>
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

  if (!order) return null;

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB");

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
              Thank you for your purchase.
            </p>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Order Details</h3>
                <p>
                  <strong>Order Number:</strong> {order.orderNumber}
                </p>
                {/* UPDATED: Changed 'amount' to 'totalAmount' */}
                <p>
                  <strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}
                </p>
                <p>
                  <strong>Payment ID:</strong> {order.razorpayId || "N/A"}
                </p>
                <p>
                  <strong>Order Date:</strong> {formattedDate}
                </p>
              </div>
              {/* UPDATED: Changed 'detailsOfCustomer' to 'customer' */}
              {order.customer && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Customer Information
                  </h3>
                  <p>
                    <strong>Name:</strong> {order.customer.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.customer.email}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {order.customer.phoneNumber || "N/A"}
                  </p>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-3 border-t pt-4">
              Items Ordered
            </h3>
            <div className="space-y-4">
              {/* UPDATED: Changed 'detailsOfProduct' to 'items' and used snapshot fields */}
              {order.items &&
                order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 border-b pb-3 last:border-b-0"
                  >
                    <img
                      src={item.image} // Use snapshot image
                      alt={item.productName} // Use snapshot name
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-foreground/70">
                        {`Size: ${item.size} | ${item.variantName} | ${item.colorName} | Qty: ${item.quantity}`}
                      </p>
                      <p className="text-sm text-accent font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
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
                <Link to="/order">
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
