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
import { Loader2, Eye, FileSpreadsheet } from "lucide-react";
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
    // This function remains correct
    let exportUrl = `${API_BASE_URL}/admin/orders/export`;
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const queryString = params.toString();
    if (queryString) {
      exportUrl += `?${queryString}`;
    }
    window.location.href = exportUrl;
  };

  if (loading) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />{" "}
        <p>Loading orders...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-destructive">
        <p>Error: {error}</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-6 space-y-4 md:space-y-0">
        <CardTitle className="text-xl sm:text-2xl gradient-text">
          All Orders ({orders.length})
        </CardTitle>
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={handleExport} size="sm">
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Export
          </Button>
          <div className="flex items-center space-x-2">
            <Label htmlFor="startDate">From</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="endDate">To</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-createdAt">Newest First</SelectItem>
              <SelectItem value="createdAt">Oldest First</SelectItem>
              {/* UPDATED: Changed 'amount' to 'totalAmount' to match schema */}
              <SelectItem value="-totalAmount">Highest Total</SelectItem>
              <SelectItem value="totalAmount">Lowest Total</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {orders.length === 0 ? (
          <p className="text-center py-4">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      {/* UPDATED: Changed order.detailsOfCustomer to order.customer */}
                      {order.customer?.name || "N/A"}
                      <br />
                      <span className="text-sm text-muted-foreground">
                        {order.customer?.email || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {/* UPDATED: Changed to use 'items' and snapshot data */}
                      {order.items && order.items.length > 0 ? (
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <img
                                src={item.image} // Use snapshot image
                                alt={item.productName} // Use snapshot name
                                className="w-10 h-10 object-cover rounded-md border"
                              />
                              <div className="text-sm">
                                <p className="font-medium">
                                  {item.productName}
                                </p>
                                <p className="text-muted-foreground">
                                  {`${item.variantName}, ${item.size}, ${item.colorName} x${item.quantity}`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No items</span>
                      )}
                    </TableCell>
                    {/* UPDATED: Changed order.amount to order.totalAmount */}
                    <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/order-confirmation/${order._id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminOrderHistory;
