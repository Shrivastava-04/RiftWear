// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Loader2, Package, Eye } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// const AdminOrderHistory = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortBy, setSortBy] = useState("-createdAt"); // Default sort: most recent
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   useEffect(() => {
//     const fetchAllOrders = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Build query parameters for sorting and filtering
//         const params = {};
//         if (sortBy) params.sort = sortBy;
//         if (startDate) params.startDate = startDate;
//         if (endDate) params.endDate = endDate;

//         const response = await axios.get(`${API_BASE_URL}/admin/orders`, {
//           params,
//         });
//         setOrders(response.data.orders);
//       } catch (err) {
//         console.error("Error fetching all orders:", err);
//         setError(err.response?.data?.message || "Failed to fetch orders.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllOrders();
//   }, [API_BASE_URL, sortBy, startDate, endDate]); // Re-fetch data whenever these values change

//   if (loading) {
//     return (
//       <Card className="bg-card/50 border-border/50 p-6 flex items-center justify-center">
//         <Loader2 className="h-6 w-6 animate-spin mr-2" />
//         <p>Loading orders...</p>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="bg-card/50 border-destructive/50 p-6 text-destructive">
//         <p>Error: {error}</p>
//       </Card>
//     );
//   }

//   return (
//     <Card className="bg-card/50 border-border/50">
//       <CardHeader className="flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-6 space-y-4 md:space-y-0">
//         <CardTitle className="text-xl sm:text-2xl gradient-text">
//           All Orders ({orders.length})
//         </CardTitle>
//         {/* Filter and Sort Controls */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
//           <div className="flex items-center space-x-2">
//             <Label htmlFor="startDate">From</Label>
//             <Input
//               id="startDate"
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="w-auto"
//             />
//           </div>
//           <div className="flex items-center space-x-2">
//             <Label htmlFor="endDate">To</Label>
//             <Input
//               id="endDate"
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="w-auto"
//             />
//           </div>
//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Sort by" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="-createdAt">Newest First</SelectItem>
//               <SelectItem value="createdAt">Oldest First</SelectItem>
//               <SelectItem value="-amount">Highest Total</SelectItem>
//               <SelectItem value="amount">Lowest Total</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </CardHeader>
//       <CardContent className="p-4 sm:p-6">
//         {orders.length === 0 ? (
//           <p className="text-foreground/70 text-center py-4">
//             No orders found matching the criteria.
//           </p>
//         ) : (
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Order #</TableHead>
//                   <TableHead>Customer</TableHead>
//                   <TableHead>Total</TableHead>
//                   <TableHead>Date</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {orders.map((order) => {
//                   const orderDate = new Date(order.createdAt);
//                   const day = String(orderDate.getDate()).padStart(2, "0");
//                   const month = String(orderDate.getMonth() + 1).padStart(
//                     2,
//                     "0"
//                   ); // Month is 0-indexed
//                   const year = orderDate.getFullYear();
//                   const formattedDate = `${day}-${month}-${year}`;

//                   return (
//                     <TableRow key={order._id}>
//                       <TableCell className="font-medium">
//                         {order.orderNumber}
//                       </TableCell>
//                       <TableCell>
//                         {order.detailsOfCustomer?.name || "N/A"}
//                         <br />
//                         <span className="text-sm text-muted-foreground">
//                           {order.detailsOfCustomer?.email || "N/A"}
//                         </span>
//                       </TableCell>
//                       <TableCell>₹{order.amount.toFixed(2)}</TableCell>
//                       <TableCell>
//                         {formattedDate} {/* Display the formatted date */}
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <Button variant="ghost" size="icon" asChild>
//                           <Link to={`/order-confirmation/${order._id}`}>
//                             <Eye className="h-4 w-4" />
//                           </Link>
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default AdminOrderHistory;
// src/components/admin/AdminOrderHistory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Package, Eye, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const AdminOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = {};
        if (sortBy) params.sort = sortBy;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await axios.get(`${API_BASE_URL}/admin/orders`, {
          params,
        });
        setOrders(response.data.orders);
      } catch (err) {
        console.error("Error fetching all orders:", err);
        setError(err.response?.data?.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [API_BASE_URL, sortBy, startDate, endDate]);

  const handleExport = () => {
    // Navigate to the export endpoint to trigger the download
    window.location.href = `${API_BASE_URL}/admin/orders/export`;
  };

  if (loading) {
    return (
      <Card className="bg-card/50 border-border/50 p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Loading orders...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card/50 border-destructive/50 p-6 text-destructive">
        <p>Error: {error}</p>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-6 space-y-4 md:space-y-0">
        <CardTitle className="text-xl sm:text-2xl gradient-text">
          All Orders ({orders.length})
        </CardTitle>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Button
            onClick={handleExport}
            size="sm"
            className="whitespace-nowrap"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
          <div className="flex items-center space-x-2">
            <Label htmlFor="startDate">From</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-auto"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="endDate">To</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-auto"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-createdAt">Newest First</SelectItem>
              <SelectItem value="createdAt">Oldest First</SelectItem>
              <SelectItem value="-amount">Highest Total</SelectItem>
              <SelectItem value="amount">Lowest Total</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {orders.length === 0 ? (
          <p className="text-foreground/70 text-center py-4">
            No orders found matching the criteria.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const orderDate = new Date(order.createdAt);
                  const day = String(orderDate.getDate()).padStart(2, "0");
                  const month = String(orderDate.getMonth() + 1).padStart(
                    2,
                    "0"
                  );
                  const year = orderDate.getFullYear();
                  const formattedDate = `${day}-${month}-${year}`;

                  return (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        {order.detailsOfCustomer?.name || "N/A"}
                        <br />
                        <span className="text-sm text-muted-foreground">
                          {order.detailsOfCustomer?.email || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>₹{order.amount.toFixed(2)}</TableCell>
                      <TableCell>{formattedDate}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/order-confirmation/${order._id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminOrderHistory;
