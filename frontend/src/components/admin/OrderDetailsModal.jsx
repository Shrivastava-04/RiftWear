import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { adminUpdateOrderStatus } from "../../api/apiService";

const ORDER_STATUSES = [
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const OrderDetailsModal = ({ isOpen, onClose, order, onStatusUpdate }) => {
  const { toast } = useToast();
  const [newStatus, setNewStatus] = useState(order.orderStatus);
  const [details, setDetails] = useState({
    batchNumber: "",
    location: "",
    timings: "",
  });
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      const statusData = { status: newStatus };
      if (newStatus === "Packed" && details.batchNumber) {
        statusData.details = { batchNumber: details.batchNumber };
      } else if (
        newStatus === "Shipped" &&
        details.batchNumber &&
        details.location &&
        details.timings
      ) {
        statusData.details = {
          batchNumber: details.batchNumber,
          pickupDetails: {
            location: details.location,
            timings: details.timings,
          },
        };
      }

      const response = await adminUpdateOrderStatus(order._id, statusData);
      toast({
        title: "Success",
        description: response.data.message,
        variant: "success",
      });
      onStatusUpdate(); // This refreshes the main order list
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order #{order.orderNumber}</DialogTitle>
          <DialogDescription>
            Placed on {new Date(order.createdAt).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          {/* Customer & Shipping Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Customer Details</h4>
              <p>{order.customer.name}</p>
              <p>{order.customer.email}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Shipping Address</h4>
              <p>
                {order.shippingInfo.firstName} {order.shippingInfo.lastName}
              </p>
              <p>{order.shippingInfo.street}</p>
              <p>
                {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
                {order.shippingInfo.postalCode}
              </p>
              <p>Phone: {order.shippingInfo.phoneNumber}</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h4 className="font-semibold mb-2">Order Items</h4>
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-2 border-b last:border-b-0"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-grow">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">{`${item.variantName}, ${item.size}, ${item.colorName}`}</p>
                  {item.nameToPrint && (
                    <p className="text-xs">
                      Custom Name: <strong>{item.nameToPrint}</strong>
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p>x {item.quantity}</p>
                  <p className="font-medium">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing & Payment */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Payment Details</h4>
              <p>
                Status:{" "}
                <Badge
                  variant={
                    order.paymentInfo.status === "paid"
                      ? "success"
                      : "destructive"
                  }
                >
                  {order.paymentInfo.status}
                </Badge>
              </p>
              <p>Method: {order.paymentInfo.method}</p>
              <p className="text-xs truncate">
                Razorpay ID: {order.paymentInfo.razorpay?.paymentId}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Pricing</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{order.pricingInfo.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{order.pricingInfo.shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-1 mt-1">
                  <span>Total:</span>
                  <span>₹{order.pricingInfo.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Update Section */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <h4 className="font-semibold">Update Order Status</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {newStatus === "Packed" && (
                <div>
                  <Label>Batch Number</Label>
                  <Input
                    placeholder="e.g., 001"
                    value={details.batchNumber}
                    onChange={(e) =>
                      setDetails((p) => ({ ...p, batchNumber: e.target.value }))
                    }
                  />
                </div>
              )}
            </div>
            {newStatus === "Shipped" && (
              <div className="space-y-3 pt-2">
                <Label>Pickup Details</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Batch Number (e.g., 001)"
                    value={details.batchNumber}
                    onChange={(e) =>
                      setDetails((p) => ({ ...p, batchNumber: e.target.value }))
                    }
                  />
                  <Input
                    placeholder="Location (e.g., SAC)"
                    value={details.location}
                    onChange={(e) =>
                      setDetails((p) => ({ ...p, location: e.target.value }))
                    }
                  />
                </div>
                <Input
                  placeholder="Timings (e.g., 5 PM - 7 PM, Mon-Fri)"
                  value={details.timings}
                  onChange={(e) =>
                    setDetails((p) => ({ ...p, timings: e.target.value }))
                  }
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={handleStatusUpdate}
            disabled={loading || newStatus === order.orderStatus}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Update Status"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
