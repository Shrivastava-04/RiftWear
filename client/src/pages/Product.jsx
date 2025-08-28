// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Heart,
//   Share,
//   ShoppingCart,
//   ArrowLeft,
//   Plus,
//   Minus,
//   Star,
//   Truck,
//   RotateCcw,
//   Shield,
//   X,
//   Image as ImageIcon,
// } from "lucide-react";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useToast } from "@/hooks/use-toast";
// import axios from "axios";
// import { Dialog, DialogContent } from "@/components/ui/dialog";

// const Product = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { id } = useParams();
//   const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
//   const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedVariety, setSelectedVariety] = useState("");
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedImage, setSelectedImage] = useState(0);

//   const [isSizeChartModalOpen, setIsSizeChartModalOpen] = useState(false);
//   const [userCart, setUserCart] = useState([]);
//   const isInitialLoadComplete = useRef(false); // NEW: Ref to track initial load state

//   const isCurrentVariantInCart = userCart.some(
//     (item) =>
//       item.productId?._id === id &&
//       item.size === selectedSize &&
//       item.variety === selectedVariety &&
//       item.color?.name === selectedColor?.name
//   );

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!id) {
//         setError("Product ID is missing.");
//         setLoading(false);
//         return;
//       }
//       try {
//         setLoading(true);
//         setError(null);
//         const productResponse = await axios.get(
//           `${API_BASE_URL}/product/productbyid`,
//           { params: { id } }
//         );
//         const fetchedProduct = productResponse.data.product;

//         if (fetchedProduct.images && fetchedProduct.images.length > 0) {
//           // const mainImage = fetchedProduct.images[0];
//           // const newColors = fetchedProduct.colors.map((color) => ({
//           //   ...color,
//           //   images: [mainImage, ...color.images],
//           const newColors = fetchedProduct.colors.sort((a, b) => {
//             return a.name.localeCompare(b.name);
//           });
//           fetchedProduct.colors = newColors;
//         }

//         setProduct(fetchedProduct);

//         const initialSize =
//           Object.keys(fetchedProduct.sizes).find(
//             (s) => fetchedProduct.sizes[s]
//           ) || "";
//         setSelectedSize(initialSize);

//         const initialVariety =
//           Object.keys(fetchedProduct.varietyOfProduct).find(
//             (v) => fetchedProduct.varietyOfProduct[v]
//           ) || "";
//         setSelectedVariety(initialVariety);

//         if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
//           setSelectedColor(fetchedProduct.colors[0]);
//         } else {
//           setSelectedColor(null);
//         }

//         if (userId) {
//           const cartResponse = await axios.get(
//             `${API_BASE_URL}/user/getCartDetails`,
//             { params: { userId } }
//           );
//           setUserCart(cartResponse.data.cart);
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError(
//           err.response?.data?.message || "Failed to fetch product details."
//         );
//       } finally {
//         setLoading(false);
//         isInitialLoadComplete.current = true; // Set flag to true after all initial data is loaded
//       }
//     };
//     fetchData();
//   }, [API_BASE_URL, id, userId]);

//   useEffect(() => {
//     // Only run this effect after the initial data has been fetched
//     if (!isInitialLoadComplete.current) {
//       return;
//     }

//     if (isCurrentVariantInCart && userId) {
//       const updateCartQuantity = async () => {
//         try {
//           await axios.put(`${API_BASE_URL}/user/updateCartDetails`, {
//             userId,
//             productId: product._id,
//             quantity: quantity,
//             size: selectedSize,
//             variety: selectedVariety,
//             color: selectedColor,
//           });
//           toast({
//             title: "Cart Updated",
//             description: "Product quantity updated successfully.",
//             variant: "success",
//           });
//         } catch (error) {
//           console.error("Error updating cart quantity:", error);
//           toast({
//             title: "Failed to Update Cart",
//             description: "An error occurred while updating the quantity.",
//             variant: "destructive",
//           });
//         }
//       };
//       updateCartQuantity();
//     }
//   }, [
//     quantity,
//     // isCurrentVariantInCart,
//     userId,
//     // product,
//     // selectedSize,
//     // selectedVariety,
//     // selectedColor,
//     // API_BASE_URL,
//     // toast,
//   ]);

//   const displayedImages = selectedColor ? selectedColor.images : [];

//   const handleAddToCart = async () => {
//     if (!selectedSize || !selectedVariety || !selectedColor) {
//       toast({
//         title: "Please select all options",
//         description: "Choose a size, variety, and color before adding to cart.",
//         variant: "destructive",
//       });
//       return;
//     }
//     if (!userId) {
//       navigate("/login");
//       return;
//     }
//     try {
//       const response = await axios.post(`${API_BASE_URL}/user/addToCart`, {
//         userId,
//         productId: product._id,
//         quantity: quantity,
//         size: selectedSize,
//         variety: selectedVariety,
//         color: selectedColor,
//       });
//       if (response.status === 200) {
//         toast({
//           title: "Added to cart!",
//           description: `${product.name} (${selectedSize}, ${selectedVariety}, ${selectedColor.name}) has been added.`,
//           variant: "success",
//         });
//         // navigate("/cart");
//         const newCartItem = {
//           _id: response.data.cart.find((item) => item.productId === product._id)
//             ?._id,
//           productId: product,
//           quantity: quantity,
//           size: selectedSize,
//           variety: selectedVariety,
//           color: selectedColor,
//         };
//         setUserCart((prevCart) => [...prevCart, newCartItem]);
//         window.dispatchEvent(new Event("cartUpdated"));
//       }
//     } catch (error) {
//       console.log(error);
//       toast({
//         title: error.response?.statusText || "Error",
//         description: error.response?.data?.message || "An error occurred.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleGoToCart = () => {
//     navigate("/cart");
//   };

//   const handleColorSelect = (color) => {
//     setSelectedColor(color);
//     // setSelectedImage(0);
//     // setSelectedSize("");
//     // setSelectedVariety("");
//     // setQuantity(1);
//   };

//   if (loading) {
//     return <div>Loading product details...</div>;
//   }
//   if (error) {
//     return <div className="text-destructive">Error: {error}</div>;
//   }
//   if (!product) {
//     return <div>No product found.</div>;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />
//       <div className="container mx-auto px-4 py-8">
//         <Button
//           variant="ghost"
//           onClick={() => navigate(-1)}
//           className="mb-6 text-foreground/70 hover:text-accent"
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back
//         </Button>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
//           <div className="space-y-4">
//             <div className="aspect-square overflow-hidden rounded-lg bg-card/50 border border-border/50">
//               {displayedImages && displayedImages.length > 0 ? (
//                 <img
//                   src={displayedImages[selectedImage]}
//                   alt={product.name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-muted-foreground">
//                   <ImageIcon className="h-10 w-10 mr-2" />
//                   No Images Available
//                 </div>
//               )}
//             </div>
//             <div className="grid grid-cols-4 gap-4">
//               {displayedImages?.map((image, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
// className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
//   selectedImage === index
//     ? "border-accent"
//     : "border-border/50 hover:border-accent/50"
// }`}
//                 >
//                   <img
//                     src={image}
//                     alt={`${product.name} view ${index + 1}`}
//                     className="w-full h-full object-cover"
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="space-y-6">
//             <div>
//               <div className="flex items-center gap-2 mb-2">
//                 {product.isNew && (
//                   <Badge className="bg-accent text-accent-foreground text-xs">
//                     NEW
//                   </Badge>
//                 )}
//                 {product.onSale && (
//                   <Badge variant="destructive" className="text-xs">
//                     SALE
//                   </Badge>
//                 )}
//               </div>
//               <h1 className="text-3xl font-bold text-foreground mb-2">
//                 {product.name}
//               </h1>
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="flex items-center gap-2">
//                   <span className="text-2xl font-bold text-accent">
//                     ₹{product.price.toFixed(2)}
//                   </span>
//                   {product.originalPrice && (
//                     <span className="text-lg text-muted-foreground line-through">
//                       ₹{product.originalPrice.toFixed(2)}
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <p className="text-foreground/70 leading-relaxed">
//                 {product.description}
//               </p>
//             </div>
//             <div>
//               <h3 className="font-semibold mb-3">Type</h3>
//               <div className="flex flex-wrap gap-2">
//                 {Object.keys(product.varietyOfProduct).map((variety) => {
//                   const isAvailable = product.varietyOfProduct[variety];
//                   const isSelected = selectedVariety === variety;
//                   if (!isAvailable) {
//                     return (
//                       <div
//                         key={variety}
//                         className="relative group cursor-not-allowed"
//                       >
//                         <Button
//                           variant="outline"
//                           className="aspect-square border rounded-md text-sm font-medium transition-all opacity-50 cursor-not-allowed"
//                           disabled={true}
//                         >
//                           {variety}
//                         </Button>
//                         <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
//                           This type is not currently available.
//                         </span>
//                       </div>
//                     );
//                   }
//                   return (
//                     <Button
//                       key={variety}
//                       variant="outline"
//                       className={`aspect-square border rounded-md text-sm font-medium transition-all ${
//                         isSelected
//                           ? "border-accent bg-accent text-accent-foreground"
//                           : "border-border hover:border-accent/50 hover:bg-accent/10"
//                       }`}
//                       onClick={() => setSelectedVariety(variety)}
//                     >
//                       {variety}
//                     </Button>
//                   );
//                 })}
//               </div>
//             </div>
//             {/* <div>
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="font-semibold">Size</h3>
//                 {product.sizeChart && product.sizeChart.length > 0 && (
//                   <Button
//                     variant="link"
//                     className="text-sm text-accent p-0 h-auto"
//                     onClick={() => setIsSizeChartModalOpen(true)}
//                   >
//                     Size Chart
//                   </Button>
//                 )}
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {Object.keys(product.sizes).map((size) => {
//                   const isAvailable = product.sizes[size];
//                   const isSelected = selectedSize === size;
//                   if (!isAvailable) {
//                     return (
//                       <div
//                         key={size}
//                         className="relative group cursor-not-allowed"
//                       >
//                         <Button
//                           variant="outline"
//                           className="aspect-square border rounded-md text-sm font-medium transition-all opacity-50 cursor-not-allowed"
//                           disabled={true}
//                         >
//                           {size}
//                         </Button>
//                         <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
//                           This size is not currently available.
//                         </span>
//                       </div>
//                     );
//                   }
//                   return (
//                     <Button
//                       key={size}
//                       variant="outline"
// className={`aspect-square border rounded-md text-sm font-medium transition-all ${
//   isSelected
//     ? "border-accent bg-accent text-accent-foreground"
//     : "border-border hover:border-accent/50 hover:bg-accent/10"
// }`}
//                       onClick={() => setSelectedSize(size)}
//                     >
//                       {size}
//                     </Button>
//                   );
//                 })}
//               </div>
//             </div> */}
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="font-semibold">Size</h3>
//               </div>
//               <div className="flex flex-col gap-4">
//                 <div className="flex flex-wrap gap-2">
//                   {Object.keys(product.sizes).map((size) => {
//                     const isAvailable = product.sizes[size];
//                     const isSelected = selectedSize === size;
//                     if (!isAvailable) {
//                       return (
//                         <div
//                           key={size}
//                           className="relative group cursor-not-allowed"
//                         >
//                           <Button
//                             variant="outline"
//                             className="aspect-square border rounded-md text-sm font-medium transition-all opacity-50 cursor-not-allowed"
//                             disabled={true}
//                           >
//                             {size}
//                           </Button>
//                           <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
//                             This size is not currently available.
//                           </span>
//                         </div>
//                       );
//                     }
//                     return (
//                       <Button
//                         key={size}
//                         variant="outline"
//                         className={`aspect-square border rounded-md text-sm font-medium transition-all ${
//                           isSelected
//                             ? "border-accent bg-accent text-accent-foreground"
//                             : "border-border hover:border-accent/50 hover:bg-accent/10"
//                         }`}
//                         onClick={() => setSelectedSize(size)}
//                       >
//                         {size}
//                       </Button>
//                     );
//                   })}
//                 </div>
//                 <div className="items-center">
//                   <span>Unsure about your size? Check our </span>
//                   {product.sizeChart && product.sizeChart.length > 0 && (
//                     <>
//                       <Button
//                         variant="link"
//                         onClick={() => setIsSizeChartModalOpen(true)}
//                         className="text-sm text-accent p-0 h-auto underline"
//                       >
//                         Size Chart
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div>
//               <h3 className="font-semibold mb-3">
//                 Color: {selectedColor?.name || "None"}
//               </h3>
//               <div className="flex flex-wrap gap-3">
//                 {product.colors?.map((color, index) => {
//                   const isSelected = selectedColor?.name === color.name;
//                   return (
//                     <div key={index} className="relative group cursor-pointer">
//                       <button
//                         onClick={() => handleColorSelect(color)}
//                         className={`w-10 h-10 rounded-full border-2 transition-all ${
//                           isSelected
//                             ? "border-accent scale-110"
//                             : "border-border hover:border-accent/50"
//                         }`}
//                       >
//                         <img
//                           src={color.images?.[1]}
//                           alt={color.name}
//                           title={color.name}
//                           className="w-full h-full object-cover rounded-full"
//                         />
//                       </button>
//                       <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
//                         {color.name}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//             <div>
//               <h3 className="font-semibold mb-3">Quantity</h3>
//               <div className="flex items-center border border-border rounded-md w-fit">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   disabled={quantity <= 1}
//                 >
//                   <Minus className="h-4 w-4" />
//                 </Button>
//                 <span className="px-4 py-2 font-medium">{quantity}</span>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setQuantity(quantity + 1)}
//                 >
//                   <Plus className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//             <div className="space-y-4">
//               {isCurrentVariantInCart ? (
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   onClick={handleGoToCart}
//                   className="w-full"
//                 >
//                   <ShoppingCart className="h-4 w-4 mr-2" />
//                   Go to Cart
//                 </Button>
//               ) : (
//                 <Button
//                   variant="cta"
//                   size="lg"
//                   onClick={handleAddToCart}
//                   className="w-full"
//                 >
//                   <ShoppingCart className="h-4 w-4 mr-2" />
//                   Add to Cart
//                 </Button>
//               )}
//             </div>
//             <Card className="bg-card/50 border-border/50">
//               <CardContent className="p-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
//                   <div className="flex flex-col items-center space-y-2">
//                     <Truck className="h-5 w-5 text-accent" />
//                     <div>
//                       <p className="font-medium text-sm">Free Shipping</p>
//                     </div>
//                   </div>
//                   <div className="flex flex-col items-center space-y-2">
//                     <RotateCcw className="h-5 w-5 text-accent" />
//                     <div>
//                       <p className="font-medium text-sm">Easy Returns</p>
//                       <p className="text-xs text-muted-foreground">
//                         30-day return policy <br /> "On manufacturing defects"
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex flex-col items-center space-y-2">
//                     <Shield className="h-5 w-5 text-accent" />
//                     <div>
//                       <p className="font-medium text-sm">Secure Payment</p>
//                       <p className="text-xs text-muted-foreground">
//                         256-bit SSL encryption
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//         <div className="mb-16">
//           <Tabs defaultValue="details" className="w-full">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="details">Details</TabsTrigger>
//               <TabsTrigger value="specs">Specifications</TabsTrigger>
//             </TabsList>
//             <TabsContent value="details" className="mt-6">
//               <Card className="bg-card/50 border-border/50">
//                 <CardContent className="p-6">
//                   <h3 className="font-semibold text-lg mb-4">
//                     Product Features
//                   </h3>
//                   <ul className="space-y-2">
//                     {product.features.map((feature, index) => (
//                       <li
//                         key={index}
//                         className="flex items-center text-foreground/80"
//                       >
//                         <span className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0" />
//                         {feature}
//                       </li>
//                     ))}
//                   </ul>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//             <TabsContent value="specs" className="mt-6">
//               <Card className="bg-card/50 border-border/50">
//                 <CardContent className="p-6">
//                   <h3 className="font-semibold text-lg mb-4">Specifications</h3>
//                   <div className="space-y-3">
//                     {Object.entries(product.specifications).map(
//                       ([key, value]) => (
//                         <div
//                           key={key}
//                           className="flex justify-between py-2 border-b border-border/30 last:border-b-0"
//                         >
//                           <span className="font-medium">{key}:</span>
//                           <span className="text-foreground/80">{value}</span>
//                         </div>
//                       )
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//       <Footer />

//       {isSizeChartModalOpen && product.sizeChart.length > 0 && (
//         <Dialog
//           open={isSizeChartModalOpen}
//           onOpenChange={setIsSizeChartModalOpen}
//         >
//           <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-y-auto bg-card border-border">
// <div className="flex flex-col items-center justify-center p-4">
//   <h3 className="text-2xl font-bold mb-4">
//     Size Chart for {product.name}
//   </h3>
//   {product.sizeChart.map((url, index) => (
//     <img
//       key={index}
//       src={url}
//       alt={`Size Chart ${index + 1}`}
//       className="max-w-full h-auto rounded-md mb-4"
//     />
//   ))}
// </div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default Product;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  ImageIcon,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const Product = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSizeChartModalOpen, setIsSizeChartModalOpen] = useState(false);
  const [userCart, setUserCart] = useState([]);

  const selectedVariant = product?.variants?.[selectedVariantIndex];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productResponse = await axios.get(
          `${API_BASE_URL}/product/productbyid`,
          { params: { id } }
        );
        const fetchedProduct = productResponse.data.product;

        if (
          !fetchedProduct ||
          !fetchedProduct.variants ||
          fetchedProduct.variants.length === 0
        ) {
          setError("Product or its variants not found.");
          return;
        }

        setProduct(fetchedProduct);
        const initialVariant = fetchedProduct.variants[0];
        const initialColor = initialVariant.colors?.[0] || null;
        const initialSize =
          Object.keys(fetchedProduct.sizes).find(
            (s) => fetchedProduct.sizes[s]
          ) || "";

        setSelectedVariantIndex(0);
        setSelectedColor(initialColor);
        setSelectedSize(initialSize);

        if (userId) {
          const cartResponse = await axios.get(
            `${API_BASE_URL}/user/getCartDetails`,
            { params: { userId } }
          );
          setUserCart(cartResponse.data.cart);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch product details."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_BASE_URL, id, userId]);

  // --- CORRECTED & ROBUST: Logic to check if the current selection is in the cart ---
  const isCurrentVariantInCart = userCart.some((item) => {
    // Handle both populated (object) and unpopulated (string) productId
    const productIdString =
      typeof item.productId === "string"
        ? item.productId
        : item.productId?._id?.toString();

    return (
      productIdString === id &&
      item.variantId.toString() === selectedVariant?._id?.toString() &&
      item.size === selectedSize &&
      item.colorName === selectedColor?.name
    );
  });

  const handleVariantSelect = (index) => {
    setSelectedVariantIndex(index);
    const newVariant = product.variants[index];
    setSelectedColor(newVariant.colors?.[0] || null);
    setSelectedImage(0);
    setQuantity(1);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedImage(0);
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedVariant || !selectedColor) {
      toast({ title: "Please select all options", variant: "destructive" });
      return;
    }
    if (!userId) {
      navigate("/login");
      return;
    }
    try {
      const payload = {
        userId,
        productId: product._id,
        variantId: selectedVariant._id,
        size: selectedSize,
        colorName: selectedColor.name,
        quantity: quantity,
      };

      const response = await axios.post(
        `${API_BASE_URL}/user/addToCart`,
        payload
      );

      // Use the updated cart from the response to set the local state
      setUserCart(response.data.cart);

      toast({ title: "Added to cart!", variant: "success" });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="text-destructive text-center p-10">Error: {error}</div>
    );
  if (!product) return <div>Product not found.</div>;

  const displayedImages = selectedColor?.images || product.images || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* The rest of your JSX remains the same as the last version */}
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
              {displayedImages.length > 0 ? (
                <img
                  src={displayedImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-10 w-10 mr-2" /> No Images Available
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {displayedImages.map((image, index) => (
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
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover "
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.isNew && (
                  <Badge className="bg-accent text-accent-foreground text-xs">
                    NEW
                  </Badge>
                )}
                {product.onSale && (
                  <Badge variant="destructive" className="text-xs">
                    SALE
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              {selectedVariant && (
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold text-accent">
                    ₹{selectedVariant.price.toFixed(2)}
                  </span>
                  {selectedVariant.originalPrice > selectedVariant.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{selectedVariant.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              )}
              <p className="text-foreground/70 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Type</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, index) => (
                  <Button
                    key={index}
                    variant={
                      selectedVariantIndex === index ? "default" : "outline"
                    }
                    className={`aspect-square border rounded-md text-sm font-medium transition-all ${
                      selectedVariantIndex === index
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border hover:border-accent/50 hover:bg-accent/10"
                    }`}
                    onClick={() => handleVariantSelect(index)}
                  >
                    {variant.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 justify-between mb-3 flex-col">
              <h3 className="font-semibold">Size</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(product.sizes).map(
                  (size) =>
                    product.sizes[size] && (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        onClick={() => setSelectedSize(size)}
                        className={`aspect-square border rounded-md text-sm font-medium transition-all ${
                          selectedSize === size
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-border hover:border-accent/50 hover:bg-accent/10"
                        }`}
                      >
                        {size}
                      </Button>
                    )
                )}
              </div>
              <div className="items-center">
                <span>Unsure about your size? Check our </span>
                {selectedVariant?.sizeChart?.length > 0 && (
                  <Button
                    variant="link"
                    className="text-sm text-accent p-0 h-auto underline"
                    onClick={() => setIsSizeChartModalOpen(true)}
                  >
                    Size Chart
                  </Button>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">
                Color: {selectedColor?.name || "None"}
              </h3>
              <div className="flex flex-wrap gap-3">
                {selectedVariant?.colors.map((color, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <button
                      // key={index}
                      onClick={() => handleColorSelect(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor?.name === color.name
                          ? "border-accent scale-110"
                          : "border-border"
                      }`}
                    >
                      <img
                        src={color.images?.[0]}
                        alt={color.name}
                        title={color.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </button>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                      {color.name}
                    </span>
                  </div>
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
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 font-medium">{quantity}</span>
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
              {isCurrentVariantInCart ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/cart")}
                  className="w-full"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" /> Go to Cart
                </Button>
              ) : (
                <Button
                  variant="cta"
                  size="lg"
                  onClick={handleAddToCart}
                  className="w-full"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                </Button>
              )}
            </div>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <Truck className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-sm">Free Shipping</p>
                      <p className="text-xs text-muted-foreground text-red-500">
                        Inside IIT(ISM) campus only
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <RotateCcw className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-sm">Easy Returns</p>
                      <p className="text-xs text-muted-foreground">
                        30-day return policy <br /> "On manufacturing defects"
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Product Features
                  </h3>
                  <ul className="space-y-2">
                    {selectedVariant?.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-accent rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specs" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Specifications</h3>
                  <div className="space-y-3">
                    {selectedVariant &&
                      Object.entries(selectedVariant.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-2 border-b last:border-b-0"
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
          </Tabs>
        </div>
      </div>
      <Footer />
      {isSizeChartModalOpen && selectedVariant?.sizeChart?.length > 0 && (
        <Dialog
          open={isSizeChartModalOpen}
          onOpenChange={setIsSizeChartModalOpen}
        >
          <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-y-auto bg-card border-border">
            <DialogTitle className="hidden">Hello</DialogTitle>
            <div className="flex flex-col items-center justify-center p-4">
              <h3 className="text-2xl font-bold mb-4">
                Size Chart for {product.name}
              </h3>
              <img
                src={selectedVariant.sizeChart[0]}
                alt="Size Chart"
                className="max-w-full h-auto rounded-md mb-4"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Product;
