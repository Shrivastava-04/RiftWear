import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  Pencil,
  Check,
  X,
} from "lucide-react";

// --- Core Hooks & API ---
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  getCart,
  updateCartItem,
  deleteCartItem,
  getActiveDropDetails, // --- UPDATED API CALL ---
  createRazorpayOrder,
  verifyPayment,
} from "@/api/apiService";

// --- UI Components ---
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loadScript = (src) =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Cart = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: cartData, isLoading: isCartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!isAuthenticated,
  });
  const cartItems = cartData?.data?.cart || [];

  // --- UPDATED: Fetch the single active drop, not a specific one ---
  const { data: activeDropData } = useQuery({
    queryKey: ["activeDrop"],
    queryFn: getActiveDropDetails,
  });

  // --- NEW: Logic to determine if the drop is currently live ---
  const isDropLive = useMemo(() => {
    const drop = activeDropData?.data?.activeDrop;
    if (!drop) return false;
    const now = new Date();
    const startDate = new Date(drop.startDate);
    const endDate = new Date(drop.endDate);
    return now >= startDate && now <= endDate;
  }, [activeDropData]);

  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddress =
        user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedAddressId(defaultAddress._id);
    } else {
      setSelectedAddressId("");
    }
  }, [user?.addresses]);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  const selectedAddress = user?.addresses.find(
    (a) => a._id === selectedAddressId
  );

  const PRINTING_CHARGE_PER_ITEM = 30;
  const shippingFee = useMemo(
    () => (selectedAddress?.postalCode === "826004" ? 0 : 90),
    [selectedAddress]
  );
  const printingFee = useMemo(
    () =>
      cartItems.filter((item) => item.nameToPrint).length *
      PRINTING_CHARGE_PER_ITEM,
    [cartItems]
  );
  const itemsTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const variant = item.productId?.variants.find(
        (v) => v._id.toString() === item.variantId.toString()
      );
      return total + (variant?.price || 0) * item.quantity;
    }, 0);
  }, [cartItems]);
  const totalAmount = itemsTotal + printingFee + shippingFee;

  const handleMakePayment = async () => {
    if (!selectedAddress) {
      toast({
        title: "Please select a shipping address.",
        variant: "destructive",
      });
      return;
    }
    setIsProcessing(true);
    const scriptLoaded = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!scriptLoaded) {
      toast({
        title: "Payment gateway failed to load.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }
    try {
      const razorpayOrderResponse = await createRazorpayOrder(totalAmount);
      const {
        id: order_id,
        amount,
        currency,
      } = razorpayOrderResponse.data.order;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        order_id,
        name: "Rift Wear",
        description: "Payment for your order",
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phoneNumber,
        },
        handler: async (response) => {
          try {
            const orderPayload = {
              user: { id: user._id, name: user.name },
              shippingAddress: selectedAddress,
              cartItems: cartItems.map((item) => ({
                ...item,
                productId: {
                  _id: item.productId._id,
                  name: item.productId.name,
                  variants: item.productId.variants,
                },
              })),
              pricingInfo: {
                itemsPrice: itemsTotal,
                shippingPrice: shippingFee,
                taxPrice: printingFee,
                totalAmount,
              },
            };
            const verificationResponse = await verifyPayment({
              ...response,
              orderPayload,
            });
            queryClient.invalidateQueries({ queryKey: ["user"] });
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            navigate(
              `/order-confirmation/${verificationResponse.data.orderId}`
            );
          } catch (err) {
            navigate("/order-failure");
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not initiate payment.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  if (isCartLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-8 text-center">
          Your Shopping Cart
        </h1>
        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-card/50 border border-border/50 rounded-lg shadow-lg">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground/70 text-lg mb-6">
              Your cart is empty. Let's find something for you!
            </p>
            <Button variant="cta" size="lg" asChild>
              <Link to="/">
                Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
            <Card className="h-fit sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span>₹{itemsTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custom Name Printing</span>
                    <span>₹{printingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span className="text-accent">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="address-select">Shipping Address</Label>
                  {user.addresses.length > 0 ? (
                    <select
                      id="address-select"
                      value={selectedAddressId}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md bg-secondary border-border/50"
                    >
                      {user.addresses.map((addr) => (
                        <option key={addr._id} value={addr._id}>
                          {addr.firstName} - {addr.street}, {addr.city}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-center p-3 mt-2 bg-destructive/10 border border-destructive/50 rounded-md">
                      <p className="text-sm text-destructive/90">
                        You have no saved addresses.
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-accent"
                        asChild
                      >
                        <Link to="/profile">Add an Address</Link>
                      </Button>
                    </div>
                  )}
                </div>
                {isDropLive ? (
                  <Button
                    variant="cta"
                    size="lg"
                    className="w-full"
                    onClick={handleMakePayment}
                    disabled={
                      !selectedAddress ||
                      user.addresses.length === 0 ||
                      isProcessing
                    }
                  >
                    {isProcessing ? "Processing..." : "Make Payment"}
                  </Button>
                ) : (
                  <div className="text-center p-3 bg-destructive/10 border border-destructive/50 rounded-md">
                    <p className="font-semibold text-destructive">
                      The Drop Has Ended
                    </p>
                  </div>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

// CartItem sub-component remains the same as it was not the source of the error.
const CartItem = ({ item }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.nameToPrint || "");

  const updateMutation = useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err) =>
      toast({
        title: "Update Failed",
        description: err.response?.data?.message,
        variant: "destructive",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      toast({ title: "Item Removed", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err) =>
      toast({
        title: "Remove Failed",
        description: err.response?.data?.message,
        variant: "destructive",
      }),
  });

  const handleQuantityChange = (delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) {
      deleteMutation.mutate(item._id);
      return;
    }
    updateMutation.mutate({ cartItemId: item._id, quantity: newQuantity });
  };

  const handleSaveName = () => {
    updateMutation.mutate({
      cartItemId: item._id,
      nameToPrint: editedName.trim(),
    });
    setIsEditing(false);
  };

  const variant = item.productId?.variants.find(
    (v) => v._id.toString() === item.variantId.toString()
  );
  const color = variant?.colors.find((c) => c.name === item.colorName);
  const imageUrl = color?.images?.[0] || "";

  return (
    <Card className="flex flex-col sm:flex-row items-center p-4">
      <img
        src={imageUrl}
        alt={item.productId?.name}
        className="w-24 h-24 object-cover rounded-md sm:mr-4 mb-4 sm:mb-0"
      />
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
        <div>
          <h3 className="font-semibold text-lg">
            <Link to={`/product/${item.productId?._id}`}>
              {item.productId?.name}
            </Link>
          </h3>
          <p className="text-accent font-bold">
            ₹{variant?.price?.toFixed(2) || "N/A"}
          </p>
          <p className="text-foreground/70 text-sm mt-1">{`Size: ${
            item.size
          }, ${variant?.name || "N/A"}, ${item.colorName}`}</p>
          <div className="mt-2 flex items-center">
            {isEditing ? (
              <>
                <Input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Enter custom name"
                  className="bg-secondary/50 h-8"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-green-500 hover:text-green-600"
                  onClick={handleSaveName}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-red-600"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : item.nameToPrint ? (
              <>
                <span className="text-primary-600 font-medium text-sm mr-2">
                  Custom Name: {item.nameToPrint}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                className="h-8 w-fit px-2 py-1 text-sm text-primary-600"
                onClick={() => setIsEditing(true)}
              >
                Add Custom Name
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-start md:justify-end gap-3 mt-4 md:mt-0">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(-1)}
              disabled={updateMutation.isPending}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(1)}
              disabled={updateMutation.isPending}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => deleteMutation.mutate(item._id)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Cart;
