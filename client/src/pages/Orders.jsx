// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Loader2,
//   Home,
//   User as UserIcon,
//   Package,
//   AlertTriangle,
// } from "lucide-react";

// const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!userId) {
//         setLoading(false);
//         navigate("/login");
//         return;
//       }
//       try {
//         setLoading(true);
//         const response = await axios.get(`${API_BASE_URL}/user/order`, {
//           params: { userId },
//         });

//         // The key change is here: check if the 'orders' array is empty.
//         // The backend returns a 200 status code even when no orders are found,
//         // so we must handle this case in the 'try' block.
//         if (!response.data.orders || response.data.orders.length === 0) {
//           setOrders([]); // Set orders to an empty array
//         } else {
//           setOrders(response.data.orders);
//         }
//       } catch (err) {
//         console.error("Error fetching orders:", err);
//         // The backend's `orderLength: 0` response is not an error,
//         // so we will only hit this block for actual server errors (e.g., 500).
//         setError("Failed to fetch orders. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, [userId, API_BASE_URL, navigate]);

//   // Rest of your component remains the same, but the 'if (error)' block
//   // will now only be triggered for genuine errors. The `if (orders.length === 0)`
//   // block will handle the case of no orders found.

//   if (loading) {
//     return (
//       <>
//         <Header />
//         <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
//           <Loader2 className="h-8 w-8 animate-spin mr-3" />
//           <p className="text-lg">Loading your orders...</p>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   if (orders.length === 0) {
//     return (
//       <>
//         <Header />
//         <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground text-center p-4">
//           <Package className="h-16 w-16 text-muted-foreground mb-4" />
//           <p className="text-xl font-semibold mb-2">No Orders Found</p>
//           <p className="text-foreground/70 mb-6">
//             It looks like you haven't placed any orders yet.
//           </p>
//           <Button asChild variant="cta" size="lg">
//             <Link to="/">Start Shopping</Link>
//           </Button>
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
//                 Error Loading Orders
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
//         <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-8 text-center">
//           My Orders
//         </h1>
//         <div className="max-w-4xl mx-auto space-y-6">
//           {orders.map((order) => (
//             <Card
//               key={order._id}
//               className="bg-card/50 border-border/50 shadow-lg"
//             >
//               <CardHeader className="border-b border-border/50 p-4">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="text-sm text-muted-foreground">
//                       Order Placed
//                     </p>
//                     <p className="font-semibold">
//                       {new Date(order.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Total</p>
//                     <p className="font-semibold text-accent">
//                       ₹{order.amount.toFixed(2)}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm text-muted-foreground">Order #</p>
//                     <p className="font-semibold">{order.orderNumber}</p>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="p-4 space-y-4">
//                 {order.detailsOfProduct.map((item, index) => (
//                   <div key={index} className="flex items-start space-x-4">
//                     <img
//                       src={
//                         item.productId?.images?.[0] ||
//                         "https://placehold.co/80x80/cccccc/333333?text=No+Image"
//                       }
//                       alt={item.productId?.name || "Product"}
//                       className="w-20 h-20 object-cover rounded-md border border-border/50"
//                     />
//                     <div className="flex-1">
//                       <p className="font-medium">
//                         {item.productId?.name || "Unknown Product"}
//                       </p>
//                       <p className="text-sm text-foreground/70">
//                         Qty: {item.quantity} | Size: {item.size}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//                 <div className="border-t border-border/50 pt-4 text-right">
//                   <Button asChild variant="outline">
//                     <Link to={`/order-confirmation/${order._id}`}>
//                       View Order Details
//                     </Link>
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Orders;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Home,
  User as UserIcon,
  Package,
  AlertTriangle,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setLoading(false);
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/user/order`, {
          params: { userId },
        });

        if (!response.data.orders || response.data.orders.length === 0) {
          setOrders([]);
        } else {
          setOrders(response.data.orders);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId, API_BASE_URL, navigate]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <p className="text-lg">Loading your orders...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (orders.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground text-center p-4">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl font-semibold mb-2">No Orders Found</p>
          <p className="text-foreground/70 mb-6">
            It looks like you haven't placed any orders yet.
          </p>
          <Button asChild variant="cta" size="lg">
            <Link to="/">Start Shopping</Link>
          </Button>
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
                Error Loading Orders
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-8 text-center">
          My Orders
        </h1>
        <div className="max-w-4xl mx-auto space-y-6">
          {orders.map((order) => (
            <Card
              key={order._id}
              className="bg-card/50 border-border/50 shadow-lg"
            >
              <CardHeader className="border-b border-border/50 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Order Placed
                    </p>
                    <p className="font-semibold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-semibold text-accent">
                      ₹{order.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Order #</p>
                    <p className="font-semibold">{order.orderNumber}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {order.detailsOfProduct.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 border-b border-border/50 pb-3 last:border-b-0 last:pb-0"
                  >
                    <img
                      src={
                        item.color?.images?.[0] || // Prioritize color-specific image
                        item.productId?.images?.[0] || // Fallback to main product image
                        "https://placehold.co/80x80/cccccc/333333?text=No+Image" // Final fallback
                      }
                      alt={item.productId?.name || "Product"}
                      className="w-20 h-20 object-cover rounded-md border border-border/50"
                    />
                    <div className="flex-1">
                      <p className="font-medium">
                        {item.productId?.name || "Unknown Product"}
                      </p>
                      <p className="text-sm text-foreground/70">
                        Qty: {item.quantity} | Size: {item.size}
                        {item.variety && ` | Variety: ${item.variety}`}
                        {item.color?.name && ` | Color: ${item.color.name}`}
                      </p>
                      <p className="text-sm text-accent">
                        ₹{(item.productId?.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="border-t border-border/50 pt-4 text-right">
                  <Button asChild variant="outline">
                    <Link to={`/order-confirmation/${order._id}`}>
                      View Order Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
