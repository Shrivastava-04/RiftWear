import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  UserIcon,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUserProfileAndCart = async () => {
      if (!userId) {
        setLoading(false);
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        // This fetches the user details (needed for address/phone check)
        const userResponse = await axios.get(`${API_BASE_URL}/user/userById`, {
          params: { id: userId },
        });
        setUser(userResponse.data.user);

        // This fetches the cart with populated product details
        const cartResponse = await axios.get(
          `${API_BASE_URL}/user/getCartDetails`,
          { params: { userId } }
        );
        setCartItems(
          Array.isArray(cartResponse.data.cart) ? cartResponse.data.cart : []
        );
      } catch (error) {
        console.error("Error fetching user profile or cart:", error);
        localStorage.removeItem("userId");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfileAndCart();
  }, [API_BASE_URL, userId, navigate]);

  // --- UPDATED: Correctly calculate total amount from variants ---
  const shippingFee = user?.address?.postalCode !== "826004" ? 90 : 0;

  const subTotal = useMemo(() => {
    return (cartItems ?? []).reduce((total, item) => {
      if (!item.productId || !item.productId.variants) {
        return total;
      }
      // Find the specific variant in the product that matches the one in the cart
      const variant = item.productId.variants.find(
        (v) => v._id.toString() === item.variantId.toString()
      );
      // // Use the variant's price for the calculation
      // return user?.address?.postalCode !== "826004"
      //   ? total + (variant ? variant.price * item.quantity : 0) + 90
      return total + (variant ? variant.price * item.quantity : 0);
    }, 0);
  }, [cartItems]);

  const totalAmount = useMemo(() => {
    return subTotal + shippingFee;
  }, [cartItems]);

  // const totalAmount = useMemo(() => {
  //   return (cartItems ?? []).reduce((total, item) => {
  //     if (!item.productId || !item.productId.variants) {
  //       return total;
  //     }
  //     // Find the specific variant in the product that matches the one in the cart
  //     const variant = item.productId.variants.find(
  //       (v) => v._id.toString() === item.variantId.toString()
  //     );
  //     // Use the variant's price for the calculation
  //     return user?.address?.postalCode !== "826004"
  //       ? total + (variant ? variant.price * item.quantity : 0) + 90
  //       : total + (variant ? variant.price * item.quantity : 0);
  //   }, 0);
  // }, [cartItems]);

  const handleQuantityChange = async (cartItemId, delta) => {
    const currentItem = cartItems.find((item) => item._id === cartItemId);
    const newQuantity = currentItem.quantity + delta;
    if (newQuantity < 1) {
      handleRemoveItem(cartItemId);
      return;
    }
    try {
      const response = await axios.put(
        `${API_BASE_URL}/user/updateCartDetails`,
        { userId, cartItemId, quantity: newQuantity }
      );
      setCartItems(response.data.cartItem);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      toast({ title: "Failed to Update Cart", variant: "destructive" });
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/user/deleteFromCart`, {
        userId,
        cartItemId,
      });
      setCartItems(res.data.cartItem);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.log(error);
    }
  };

  const handleMakePayment = async () => {
    // This logic correctly checks for address and phone number before proceeding.
    if (!user || !user.address) {
      toast({
        title: "Please Enter your address",
        description:
          "Please update your profile and enter your address to proceed.",
        variant: "destructive",
      });
      navigate("/profile");
      return;
    }

    // Check if any of the address fields are empty strings
    const addressFields = ["street", "city", "postalCode", "state", "country"];
    const isAddressIncomplete = addressFields.some(
      (field) => !user.address[field]
    );

    if (isAddressIncomplete) {
      toast({
        title: "Incomplete Address",
        description: "Please fill in all address fields in your profile.",
        variant: "destructive",
      });
      navigate("/profile");
      return;
    }

    // Check for missing phone number
    if (!user.phoneNumber) {
      toast({
        title: "Please Enter Phone Number",
        description: "Please update your profile and enter your Phone Number",
        variant: "destructive",
      });
      navigate("/profile");
      return;
    }

    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const orderResponse = await axios.post(
        `${API_BASE_URL}/payment/razorpay/create-order`,
        {
          amount: totalAmount,
          cartItems: cartItems,
          userId: userId,
        }
      );

      const { id, currency, amount } = orderResponse.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "Rift Wear",
        description: "Payment for your order",
        order_id: id,
        handler: async (response) => {
          try {
            const finalOrderResponse = await axios.post(
              `${API_BASE_URL}/orders/create`,
              {
                userId: userId,
                cartItems: cartItems,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                totalAmount: totalAmount,
                shippingFee: shippingFee,
                subTotal: subTotal,
              }
            );
            setCartItems([]);
            window.dispatchEvent(new Event("cartUpdated"));
            navigate(
              `/order-confirmation/${finalOrderResponse.data.order._id}`
            );
          } catch (error) {
            navigate("/order-failure");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phoneNumber,
        },
        theme: { color: "#3399cc" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      paymentObject.on("payment.failed", () => navigate("/order-failure"));
    } catch (error) {
      navigate("/order-failure");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading Your Cart...
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
              Your cart is empty. Start shopping now!
            </p>
            <Button variant="cta" size="lg" asChild>
              <Link to="/">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                // --- UPDATED: Logic to find correct variant and color details ---
                const variant = item.productId?.variants.find(
                  (v) => v._id.toString() === item.variantId.toString()
                );
                const color = variant?.colors.find(
                  (c) => c.name === item.colorName
                );
                const imageUrl =
                  color?.images?.[0] || item.productId?.images?.[0] || "";

                return (
                  <Card
                    key={item._id}
                    className="flex flex-col sm:flex-row items-center p-4"
                  >
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
                        {/* UPDATED: Display price and details from the specific variant */}
                        <p className="text-accent font-bold">
                          ₹{variant?.price?.toFixed(2) || "N/A"}
                        </p>
                        <p className="text-foreground/70 text-sm mt-1">
                          {`Size: ${item.size}, ${variant?.name}, ${item.colorName}`}
                        </p>
                      </div>
                      <div className="flex items-center justify-start md:justify-end gap-3 mt-4 md:mt-0">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item._id, -1)}
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
                            onClick={() => handleQuantityChange(item._id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shippingFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span className="text-accent">₹{totalAmount.toFixed(2)}</span>
                </div>
                <Button
                  variant="cta"
                  size="lg"
                  className="w-full"
                  onClick={handleMakePayment}
                >
                  Make Payment
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/">Continue Shopping</Link>
                </Button>
                <span className="w-full text-center text-sm text-red-500 mt-2 block">
                  *Free Shipping is available only inside IIT(ISM) campus
                </span>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
