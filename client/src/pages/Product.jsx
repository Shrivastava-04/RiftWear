import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  Share,
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  Star,
  Truck,
  RotateCcw,
  Shield,
  X,
  Image as ImageIcon,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Product = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariety, setSelectedVariety] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const [isSizeChartModalOpen, setIsSizeChartModalOpen] = useState(false);
  const [isProductInTheCart, setIsProductInTheCart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const productResponse = await axios.get(
          `${API_BASE_URL}/product/productbyid`,
          { params: { id } }
        );
        const fetchedProduct = productResponse.data.product;
        setProduct(fetchedProduct);

        setSelectedSize(
          Object.keys(fetchedProduct.sizes).find(
            (s) => fetchedProduct.sizes[s]
          ) || ""
        );
        setSelectedVariety(
          Object.keys(fetchedProduct.varietyOfProduct).find(
            (v) => fetchedProduct.varietyOfProduct[v]
          ) || ""
        );
        setSelectedColor(
          Object.keys(fetchedProduct.colors).find(
            (c) => fetchedProduct.colors[c]
          ) || ""
        );

        if (userId) {
          const cartResponse = await axios.get(
            `${API_BASE_URL}/user/getCartDetails`,
            { params: { userId } }
          );
          const cartItems = cartResponse.data.cart;
          const existingItem = cartItems.find(
            (item) => item.productId?._id === id
          );
          if (existingItem) {
            setIsProductInTheCart(true);
            setSelectedSize(existingItem.size);
            setQuantity(existingItem.quantity);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err.response?.data?.message || "Failed to fetch product details."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_BASE_URL, id, userId]);

  // --- CORRECTED: handleAddToCart function ---
  const handleAddToCart = async () => {
    if (!selectedSize || !selectedVariety || !selectedColor) {
      toast({
        title: "Please select all options",
        description: "Choose a size, variety, and color before adding to cart.",
        variant: "destructive",
      });
      return;
    }
    if (!userId) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/user/addToCart`, {
        userId,
        productId: product._id,
        quantity: quantity,
        size: selectedSize,
        variety: selectedVariety, // <-- NEW: Send variety
        color: selectedColor, // <-- NEW: Send color
      });
      if (response.status === 200) {
        toast({
          title: "Added to cart!",
          description: `${product.name} (${selectedSize}, ${selectedVariety}, ${selectedColor}) has been added.`,
          variant: "success",
        });
        navigate("/cart");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: error.response?.statusText || "Error",
        description: error.response?.data?.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedVariety || !selectedColor) {
      toast({
        title: "Please select all options",
        description: "Choose a size, variety, and color before purchasing.",
        variant: "destructive",
      });
      return;
    }
    if (!userId) {
      navigate("/login");
      return;
    }
    toast({
      title: "Redirecting to checkout",
      description: "Taking you to secure checkout...",
    });
  };

  if (loading) {
    return <div>Loading product details...</div>;
  }
  if (error) {
    return <div className="text-destructive">Error: {error}</div>;
  }
  if (!product) {
    return <div>No product found.</div>;
  }

  // --- Map of common color names to CSS values for display
  const colorMap = {
    Black: "#000000",
    White: "#FFFFFF",
    Gray: "#808080",
    // Add other colors here as needed
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-foreground/70 hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-card/50 border border-border/50">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index
                      ? "border-accent"
                      : "border-border/50 hover:border-accent/50"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
                {product.isNew && (
                  <Badge className="bg-accent text-accent-foreground text-xs">
                    {" "}
                    NEW{" "}
                  </Badge>
                )}
                {product.onSale && (
                  <Badge variant="destructive" className="text-xs">
                    {" "}
                    SALE{" "}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-accent">
                    ₹{product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-accent text-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>
              </div>
              <p className="text-foreground/70 leading-relaxed">
                {product.description}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Type</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(product.varietyOfProduct).map((variety) => (
                  <Button
                    key={variety}
                    variant="outline"
                    className={`aspect-square border rounded-md text-sm font-medium transition-all ${
                      product.varietyOfProduct[variety]
                        ? selectedVariety === variety
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border hover:border-accent/50 hover:bg-accent/10"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() =>
                      product.varietyOfProduct[variety] &&
                      setSelectedVariety(variety)
                    }
                    disabled={!product.varietyOfProduct[variety]}
                  >
                    {variety}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Size</h3>
                {product.sizeChart && product.sizeChart.length > 0 && (
                  <Button
                    variant="link"
                    className="text-sm text-accent p-0 h-auto"
                    onClick={() => setIsSizeChartModalOpen(true)}
                  >
                    Size Chart
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(product.sizes).map((size) => (
                  <Button
                    key={size}
                    variant="outline"
                    className={`aspect-square border rounded-md text-sm font-medium transition-all ${
                      product.sizes[size]
                        ? selectedSize === size
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border hover:border-accent/50 hover:bg-accent/10"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => product.sizes[size] && setSelectedSize(size)}
                    disabled={!product.sizes[size]}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Color: {selectedColor}</h3>
              <div className="flex flex-wrap gap-3">
                {Object.keys(product.colors).map((color) => (
                  <button
                    key={color}
                    onClick={() =>
                      product.colors[color] && setSelectedColor(color)
                    }
                    disabled={!product.colors[color]}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      product.colors[color]
                        ? selectedColor === color
                          ? "border-accent scale-110"
                          : "border-border hover:border-accent/50"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    // Use a color map or hardcode common colors for styling
                    style={{
                      backgroundColor: colorMap[color] || color,
                      cursor: product.colors[color] ? "pointer" : "not-allowed",
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center border border-border rounded-md w-fit">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {!isProductInTheCart && (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    {/* <Button
                      variant="cta"
                      size="lg"
                      onClick={() => navigate("/cart")}
                    >
                      Buy Now
                    </Button> */}
                  </>
                )}
                {isProductInTheCart && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate("/cart")}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Go to Cart
                  </Button>
                )}
              </div>
              <div className="flex justify-center gap-4">
                <Button variant="ghost" size="icon">
                  {" "}
                  <Heart className="h-4 w-4" />{" "}
                </Button>
                <Button variant="ghost" size="icon">
                  {" "}
                  <Share className="h-4 w-4" />{" "}
                </Button>
              </div>
            </div>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <Truck className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-sm">Free Shipping</p>
                      <p className="text-xs text-muted-foreground">
                        On orders over $75
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <RotateCcw className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-sm">Easy Returns</p>
                      <p className="text-xs text-muted-foreground">
                        30-day return policy
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Shield className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-sm">Secure Payment</p>
                      <p className="text-xs text-muted-foreground">
                        256-bit SSL encryption
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mb-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Product Features
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-foreground/80"
                      >
                        <span className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specs" className="mt-6">
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Specifications</h3>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-2 border-b border-border/30 last:border-b-0"
                        >
                          <span className="font-medium">{key}:</span>
                          <span className="text-foreground/80">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <h3 className="font-semibold text-lg mb-2">
                      Customer Reviews
                    </h3>
                    <p className="text-foreground/70 mb-4">
                      {product.rating} out of 5 stars ({product.reviews}{" "}
                      reviews)
                    </p>
                    <Button variant="outline">Write a Review</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />

      {isSizeChartModalOpen && product.sizeChart.length > 0 && (
        <Dialog
          open={isSizeChartModalOpen}
          onOpenChange={setIsSizeChartModalOpen}
        >
          <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-y-auto bg-card border-border">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-foreground/70 hover:text-accent"
              onClick={() => setIsSizeChartModalOpen(false)}
            ></Button>
            <div className="flex flex-col items-center justify-center p-4">
              <h3 className="text-2xl font-bold mb-4">
                Size Chart for {product.name}
              </h3>
              {product.sizeChart.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Size Chart ${index + 1}`}
                  className="max-w-full h-auto rounded-md mb-4"
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Product;
