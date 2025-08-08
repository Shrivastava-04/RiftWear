// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { CheckCircle, Loader2, Home, Package } from "lucide-react";

// const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// const OrderConfirmation = () => {
//   const { orderId } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       if (!orderId) {
//         setError("No order ID provided.");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
//         setOrder(response.data.order);
//         console.log(response.data.order);
//       } catch (err) {
//         console.error("Error fetching order details:", err);
//         setError(
//           err.response?.data?.message || "Failed to load order details."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrderDetails();
//   }, [orderId, API_BASE_URL]);

//   if (loading) {
//     return (
//       <>
//         <Header />
//         <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
//           <Loader2 className="h-8 w-8 animate-spin mr-3" />
//           <p className="text-lg">Loading order details...</p>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <Header />
//         <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
//           <Card className="w-full max-w-md text-center bg-card/50 border-destructive/50 shadow-lg">
//             <CardHeader>
//               <CardTitle className="text-destructive text-2xl">
//                 Order Not Found
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <p className="text-foreground/70">{error}</p>
//               <Button asChild variant="outline" className="w-full">
//                 <Link to="/">
//                   <Home className="h-4 w-4 mr-2" /> Go to Homepage
//                 </Link>
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground flex flex-col">
//       <Header />
//       <main className="flex-grow container mx-auto px-4 py-8">
//         <Card className="max-w-3xl mx-auto bg-card/50 border-border/50 shadow-lg">
//           <CardHeader className="text-center">
//             <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
//             <CardTitle className="text-3xl font-bold gradient-text">
//               Order Confirmed!
//             </CardTitle>
//             <p className="text-foreground/70 mt-2">
//               Thank you for your purchase. Your order has been placed
//               successfully.
//             </p>
//           </CardHeader>
//           <CardContent className="space-y-6 p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <h3 className="font-semibold text-lg mb-2">Order Details</h3>
//                 <p>
//                   <strong>Order Number:</strong> {order.orderNumber}
//                 </p>
//                 <p>
//                   <strong>Total Amount:</strong> ₹{order.amount.toFixed(2)}
//                 </p>
//                 <p>
//                   <strong>Payment ID:</strong> {order.razorpayId || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Order Date:</strong>{" "}
//                   {new Date(order.createdAt).toLocaleDateString()}
//                 </p>
//               </div>
//               {order.detailsOfCustomer && (
//                 <div>
//                   <h3 className="font-semibold text-lg mb-2">
//                     Customer Information
//                   </h3>
//                   <p>
//                     <strong>Name:</strong> {order.detailsOfCustomer.name}
//                   </p>
//                   <p>
//                     <strong>Email:</strong> {order.detailsOfCustomer.email}
//                   </p>
//                   <p>
//                     <strong>Phone:</strong>{" "}
//                     {order.detailsOfCustomer.phoneNumber || "N/A"}
//                   </p>
//                 </div>
//               )}
//             </div>
//             <h3 className="font-semibold text-lg mb-3 border-t border-border/50 pt-4">
//               Items Ordered
//             </h3>
//             <div className="space-y-3">
//               {order.detailsOfProduct &&
//                 order.detailsOfProduct.map((item, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center space-x-4 border-b border-border/50 pb-3 last:border-b-0 last:pb-0"
//                   >
//                     <img
//                       src={
//                         item.productId?.images?.[0] ||
//                         "https://placehold.co/60x60/cccccc/333333?text=No+Image"
//                       }
//                       alt={item.productId?.name || "Product"}
//                       className="w-16 h-16 object-cover rounded-md"
//                     />
//                     <div className="flex-1">
//                       <p className="font-medium">
//                         {item.productId?.name || "Unknown Product"}
//                       </p>
//                       <p className="text-sm text-foreground/70">
//                         Size: {item.size} | Quantity: {item.quantity} | Color:{" "}
//                         {item.color}
//                         {item.variety && ` | Variety: ${item.variety}`}
//                       </p>
//                       <p className="text-sm text-accent">
//                         ₹{(item.productId?.price * item.quantity).toFixed(2)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//             <div className="flex flex-col sm:flex-row gap-4 mt-6">
//               <Button asChild variant="cta" className="flex-1">
//                 <Link to="/">
//                   <Home className="h-4 w-4 mr-2" /> Continue Shopping
//                 </Link>
//               </Button>
//               <Button asChild variant="outline" className="flex-1">
//                 <Link to="/order">
//                   <Package className="h-4 w-4 mr-2" /> View My Orders
//                 </Link>
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default OrderConfirmation;
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
  // const [user, setUser] = useState(null); // This state is not used here, can be removed if not needed elsewhere

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("No order ID provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/order/${orderId}`);
        setOrder(response.data.order);
        console.log(response.data.order);
      } catch (err) {
        console.error("Error fetching order details:", err);
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
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <p className="text-lg">Loading order details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
          <Card className="w-full max-w-md text-center bg-card/50 border-destructive/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-destructive text-2xl">
                Order Not Found
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/70">{error}</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" /> Go to Homepage
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  // Add an early return if order is null after loading, to prevent errors
  if (!order) {
    return null; // Or a fallback component if you prefer
  }

  // Format the date
  const orderDate = new Date(order.createdAt);
  const day = String(orderDate.getDate()).padStart(2, "0");
  const month = String(orderDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = orderDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto bg-card/50 border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold gradient-text">
              Order Confirmed!
            </CardTitle>
            <p className="text-foreground/70 mt-2">
              Thank you for your purchase. Your order has been placed
              successfully.
            </p>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Order Details</h3>
                <p>
                  <strong>Order Number:</strong> {order.orderNumber}
                </p>
                <p>
                  <strong>Total Amount:</strong> ₹{order.amount.toFixed(2)}
                </p>
                <p>
                  <strong>Payment ID:</strong> {order.razorpayId || "N/A"}
                </p>
                <p>
                  <strong>Order Date:</strong> {formattedDate}{" "}
                  {/* Display the formatted date */}
                </p>
              </div>
              {order.detailsOfCustomer && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Customer Information
                  </h3>
                  <p>
                    <strong>Name:</strong> {order.detailsOfCustomer.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.detailsOfCustomer.email}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {order.detailsOfCustomer.phoneNumber || "N/A"}
                  </p>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-3 border-t border-border/50 pt-4">
              Items Ordered
            </h3>
            <div className="space-y-3">
              {order.detailsOfProduct &&
                order.detailsOfProduct.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 border-b border-border/50 pb-3 last:border-b-0 last:pb-0"
                  >
                    <img
                      src={
                        item.productId?.images?.[0] ||
                        "https://placehold.co/60x60/cccccc/333333?text=No+Image"
                      }
                      alt={item.productId?.name || "Product"}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <p className="font-medium">
                        {item.productId?.name || "Unknown Product"}
                      </p>
                      <p className="text-sm text-foreground/70">
                        Size: {item.size} | Quantity: {item.quantity} | Color:{" "}
                        {item.color}
                        {item.variety && ` | Variety: ${item.variety}`}
                      </p>
                      <p className="text-sm text-accent">
                        ₹{(item.productId?.price * item.quantity).toFixed(2)}
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
                <Link to="/user/orders">
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
