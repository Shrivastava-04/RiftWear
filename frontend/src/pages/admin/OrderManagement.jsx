// import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
// --- UPDATED: Swapped Lucide-React Badge for the correct UI component ---
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, Truck, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import {
  adminGetAllOrders,
  adminUpdateOrderStatus,
} from "../../api/apiService";
import OrderDetailsModal from "../../components/admin/OrderDetailsModal";
import { useEffect, useMemo, useState } from "react";

const ORDER_STATUSES = [
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "Processing":
      return "secondary";
    case "Packed":
      return "default";
    case "Shipped":
      return "info";
    case "Delivered":
      return "success";
    case "Cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const BulkUpdateModal = ({
  isOpen,
  onClose,
  status,
  orderCount,
  onConfirm,
}) => {
  const [details, setDetails] = useState({
    batchNumber: "",
    location: "",
    timings: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await onConfirm(status, details);
    setLoading(false);
    onClose();
  };

  const isShipped = status === "Shipped";
  const isPacked = status === "Packed";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Update {orderCount} Order(s) to "{status}"
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p>Please provide the necessary details for this bulk update.</p>
          {(isPacked || isShipped) && (
            <div>
              <Label htmlFor="batchNumber">Batch Number</Label>
              <Input
                id="batchNumber"
                value={details.batchNumber}
                onChange={(e) =>
                  setDetails((p) => ({ ...p, batchNumber: e.target.value }))
                }
              />
            </div>
          )}
          {isShipped && (
            <div className="space-y-2">
              <Label>Pickup Details</Label>
              <Input
                placeholder="Location (e.g., SAC)"
                value={details.location}
                onChange={(e) =>
                  setDetails((p) => ({ ...p, location: e.target.value }))
                }
              />
              <Input
                placeholder="Timings (e.g., 5-7 PM)"
                value={details.timings}
                onChange={(e) =>
                  setDetails((p) => ({ ...p, timings: e.target.value }))
                }
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const initialFilters = {
    status: "all",
    sortBy: "-createdAt",
    dateFrom: "",
    dateTo: "",
  };

  const [statusFilter, setStatusFilter] = useState(initialFilters.status);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy);
  const [dateFilter, setDateFilter] = useState({
    from: initialFilters.dateFrom,
    to: initialFilters.dateTo,
  });

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);

  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkUpdateStatus, setBulkUpdateStatus] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminGetAllOrders();
      setOrders(response.data.orders);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch orders.";
      setError(errorMsg);
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredAndSortedOrders = useMemo(() => {
    return orders
      .filter((order) => {
        if (statusFilter !== "all" && order.orderStatus !== statusFilter)
          return false;
        const orderDate = new Date(order.createdAt);
        if (dateFilter.from && orderDate < new Date(dateFilter.from))
          return false;
        if (
          dateFilter.to &&
          orderDate > new Date(dateFilter.to).setHours(23, 59, 59, 999)
        )
          return false;
        return true;
      })
      .sort((a, b) => {
        const field = sortBy.replace("-", "");
        const order = sortBy.startsWith("-") ? 1 : -1; // Corrected sorting direction
        if (field === "createdAt")
          return (
            (new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1) * order
          );
        if (field === "totalAmount")
          return (
            (a.pricingInfo.totalAmount - b.pricingInfo.totalAmount) * order
          );
        return 0;
      });
  }, [orders, statusFilter, sortBy, dateFilter]);

  const handleSelectAll = (checked) => {
    setSelectedOrders(checked ? filteredAndSortedOrders.map((o) => o._id) : []);
  };

  const handleSelectOne = (orderId, checked) => {
    setSelectedOrders((prev) =>
      checked ? [...prev, orderId] : prev.filter((id) => id !== orderId)
    );
  };

  const handleResetFilters = () => {
    setStatusFilter(initialFilters.status);
    setSortBy(initialFilters.sortBy);
    setDateFilter({ from: initialFilters.dateFrom, to: initialFilters.dateTo });
  };

  const openOrderDetails = (order) => {
    setViewingOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleBulkActionClick = (status) => {
    if (
      status === "Processing" ||
      status === "Delivered" ||
      status === "Cancelled"
    ) {
      handleBulkStatusUpdate(status);
    } else {
      setBulkUpdateStatus(status);
      setIsBulkModalOpen(true);
    }
  };

  const handleBulkStatusUpdate = async (status, details) => {
    let statusData = { status };
    if (status === "Packed" && details?.batchNumber)
      statusData.details = { batchNumber: details.batchNumber };
    else if (status === "Shipped" && details)
      statusData.details = {
        batchNumber: details.batchNumber,
        pickupDetails: { location: details.location, timings: details.timings },
      };

    try {
      await Promise.all(
        selectedOrders.map((orderId) =>
          adminUpdateOrderStatus(orderId, statusData)
        )
      );
      toast({
        title: "Bulk Update Successful",
        description: `${selectedOrders.length} order(s) updated to "${status}".`,
        variant: "success",
      });
      fetchOrders();
      setSelectedOrders([]);
    } catch (err) {
      toast({
        title: "Bulk Update Failed",
        description:
          err.response?.data?.message || "Some orders could not be updated.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="bg-card/50 border-border/50 shadow-lg">
        <CardHeader>
          {/* --- UPDATED: Added order count --- */}
          <CardTitle className="text-2xl font-bold gradient-text">
            Order Management ({filteredAndSortedOrders.length})
          </CardTitle>
          <CardDescription>
            View, track, and update customer orders.
          </CardDescription>
        </CardHeader>

        <div className="p-4 sm:p-6 border-t border-b border-border/50 bg-background/20">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {ORDER_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium mb-1 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-createdAt">Newest First</SelectItem>
                  <SelectItem value="createdAt">Oldest First</SelectItem>
                  <SelectItem value="-totalAmount">Highest Total</SelectItem>
                  <SelectItem value="totalAmount">Lowest Total</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium mb-1 block">
                From Date
              </label>
              <Input
                type="date"
                value={dateFilter.from}
                onChange={(e) =>
                  setDateFilter((p) => ({ ...p, from: e.target.value }))
                }
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium mb-1 block">To Date</label>
              <Input
                type="date"
                value={dateFilter.to}
                onChange={(e) =>
                  setDateFilter((p) => ({ ...p, to: e.target.value }))
                }
              />
            </div>
            {/* --- NEW: Reset Filters Button --- */}
            <Button variant="ghost" onClick={handleResetFilters}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {selectedOrders.length > 0 && (
          <div className="p-4 bg-primary/10 border-b border-border/50">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {selectedOrders.length} order(s) selected
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Bulk Actions <Truck className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {ORDER_STATUSES.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onSelect={() => handleBulkActionClick(status)}
                    >
                      Mark as {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        <CardContent className="p-4 sm:p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-10">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead padding="checkbox">
                      <Checkbox
                        onCheckedChange={handleSelectAll}
                        checked={
                          selectedOrders.length ===
                            filteredAndSortedOrders.length &&
                          filteredAndSortedOrders.length > 0
                        }
                      />
                    </TableHead>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedOrders.map((order) => (
                    <TableRow key={order._id} className="hover:bg-muted/50">
                      <TableCell padding="checkbox">
                        <Checkbox
                          onCheckedChange={(checked) =>
                            handleSelectOne(order._id, checked)
                          }
                          checked={selectedOrders.includes(order._id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>{order.customer?.name || "N/A"}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        ₹{order.pricingInfo.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.paymentInfo.status === "paid"
                              ? "success"
                              : "destructive"
                          }
                        >
                          {order.paymentInfo.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(order.orderStatus)}
                        >
                          {order.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openOrderDetails(order)}
                        >
                          <Eye className="h-4 w-4" />
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
      {isDetailsModalOpen && viewingOrder && (
        <OrderDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          order={viewingOrder}
          onStatusUpdate={fetchOrders}
        />
      )}
      {isBulkModalOpen && (
        <BulkUpdateModal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          status={bulkUpdateStatus}
          orderCount={selectedOrders.length}
          onConfirm={handleBulkStatusUpdate}
        />
      )}
    </>
  );
};

export default OrderManagement;
