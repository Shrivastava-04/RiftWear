// import React, { useState, useEffect, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
// import { useSwipeable } from "react-swipeable";
// import {
//   ShoppingCart,
//   ArrowLeft,
//   Plus,
//   Minus,
//   ImageIcon,
//   ChevronLeft,
//   ChevronRight,
//   Pencil,
//   Check,
//   X,
//   Truck,
//   RotateCcw,
//   Shield,
//   Star,
// } from "lucide-react";

// // --- Core Hooks & API ---
// import { useAuth } from "@/hooks/useAuth";
// import { useToast } from "@/hooks/use-toast";
// import { fetchProductById, addToCart, updateCartItem } from "@/api/apiService";

// // --- UI Components ---
// import Header from "@/components/common/Header";
// import Footer from "@/components/common/Footer";
// import Spinner from "@/components/common/Spinner";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import StarRating from "@/components/reviews/StarRating";

// const ProductDetail = () => {
//   const { id: productId } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
//   const { user, isAuthenticated } = useAuth();

//   // --- State for User Selections ---
//   const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
//   const [selectedColorName, setSelectedColorName] = useState("Black");
//   const [selectedSize, setSelectedSize] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [nameToPrint, setNameToPrint] = useState("");
//   const [isEditingName, setIsEditingName] = useState(false);
//   const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
//   const [justAddedToCart, setJustAddedToCart] = useState(false);

//   // --- Data Fetching with React Query ---
//   const {
//     data: productData,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["product", productId],
//     queryFn: () => fetchProductById(productId),
//   });
//   const product = productData?.data?.product;
//   // --- Derived State (Calculated from selections and data) ---
//   const selectedVariant = product?.variants?.[selectedVariantIndex];
//   const selectedColor = selectedVariant?.colors?.find(
//     (c) => c.name === selectedColorName
//   );
//   const availableSizes =
//     selectedColor?.stock?.filter((s) => s.quantity > 0).map((s) => s.size) ||
//     [];
//   const displayedImages =
//     selectedColor?.images || product?.variants?.[0]?.colors?.[0]?.images || [];

//   // --- Set Initial Selections when Product Loads ---
//   useEffect(() => {
//     if (product && product.variants?.length > 0) {
//       const initialVariant = product.variants[0];
//       const initialColor = initialVariant.colors?.[0];
//       if (initialColor) {
//         setSelectedColorName(initialColor.name);
//         const firstAvailableSize = initialColor.stock?.find(
//           (s) => s.quantity > 0
//         )?.size;
//         setSelectedSize(firstAvailableSize || "");
//       }
//     }
//   }, [product]);

//   // --- Check if the currently selected item is in the user's cart ---
//   const currentItemInCart = useMemo(() => {
//     if (!user?.cart || !selectedVariant?._id) return null;
//     return user.cart.find((item) => {
//       const isProductMatch =
//         String(item.product.productId._id) === String(productId);
//       const isVariantMatch =
//         String(item.product.variantId) === String(selectedVariant._id);
//       const isSizeMatch = String(item.size) === String(selectedSize);
//       const isColorMatch =
//         String(item.product.colorId) === String(selectedColor._id);
//       return isProductMatch && isVariantMatch && isSizeMatch && isColorMatch;
//     });
//   }, [user, productId, selectedVariant, selectedSize, selectedColorName]);

//   useEffect(() => {
//     if (currentItemInCart && justAddedToCart) {
//       setJustAddedToCart(false);
//     }
//   }, [currentItemInCart, justAddedToCart]);

//   useEffect(() => {
//     setJustAddedToCart(false);
//   }, [selectedSize, selectedColorName, selectedVariantIndex]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       queryClient.invalidateQueries({ queryKey: ["user"] });
//     }
//   }, [isAuthenticated, queryClient]);

//   const isItemInCart = currentItemInCart || justAddedToCart;

//   useEffect(() => {
//     if (currentItemInCart) {
//       setNameToPrint(currentItemInCart.nameToPrint || "");
//     } else {
//       setNameToPrint("");
//       setIsEditingName(false);
//     }
//   }, [
//     currentItemInCart,
//     selectedSize,
//     selectedColorName,
//     selectedVariantIndex,
//   ]);

//   // --- Mutations for Cart Actions ---
//   const cartMutation = useMutation({
//     mutationFn: addToCart,
//     onSuccess: () => {
//       toast({ title: "Added to cart!", variant: "success" });
//       setJustAddedToCart(true);
//       queryClient.invalidateQueries({ queryKey: ["user"] });
//       queryClient.invalidateQueries({ queryKey: ["cart"] });
//       queryClient.refetchQueries({ queryKey: ["user"] });
//     },
//     onError: (err) => {
//       setJustAddedToCart(false);
//       toast({
//         title: "Error",
//         description: err.response?.data?.message,
//         variant: "destructive",
//       });
//     },
//   });

//   const updateNameMutation = useMutation({
//     mutationFn: updateCartItem,
//     onSuccess: () => {
//       toast({ title: "Name updated!", variant: "success" });
//       queryClient.invalidateQueries({ queryKey: ["user"] });
//       setIsEditingName(false);
//     },
//     onError: (err) => {
//       toast({
//         title: "Error",
//         description: err.response?.data?.message,
//         variant: "destructive",
//       });
//     },
//   });

//   // --- Event Handlers ---
//   const handleAddToCart = () => {
//     if (!selectedSize) {
//       toast({ title: "Please select a size.", variant: "destructive" });
//       return;
//     }
//     if (!isAuthenticated) {
//       navigate("/login");
//       return;
//     }

//     cartMutation.mutate({
//       productId,
//       variantId: selectedVariant._id,
//       colorId: selectedColor._id,
//       size: selectedSize,
//       quantity,
//       nameToPrint: nameToPrint.trim(),
//     });
//   };

//   const handleUpdateName = (newName) => {
//     updateNameMutation.mutate({
//       cartItemId: currentItemInCart._id,
//       nameToPrint: newName.trim(),
//     });
//   };

//   const handleVariantSelect = (index) => {
//     setSelectedVariantIndex(index);
//     const newVariant = product.variants[index];
//     const firstColor = newVariant.colors?.[0];
//     if (firstColor) {
//       setSelectedColorName(firstColor.name);
//       setSelectedSize(
//         firstColor.stock?.find((s) => s.quantity > 0)?.size || ""
//       );
//     }
//     setSelectedImageIndex(0);
//     setQuantity(1);
//   };

//   const handleColorSelect = (color) => {
//     setSelectedColorName(color.name);
//     setSelectedSize(color.stock?.find((s) => s.quantity > 0)?.size || "");
//     setSelectedImageIndex(0);
//   };

//   const nextImage = () =>
//     displayedImages.length > 1 &&
//     setSelectedImageIndex((prev) => (prev + 1) % displayedImages.length);
//   const prevImage = () =>
//     displayedImages.length > 1 &&
//     setSelectedImageIndex(
//       (prev) => (prev - 1 + displayedImages.length) % displayedImages.length
//     );
//   const swipeHandlers = useSwipeable({
//     onSwipedLeft: nextImage,
//     onSwipedRight: prevImage,
//     preventDefaultTouchmoveEvent: true,
//     trackMouse: true,
//   });

//   // --- Render Logic ---
//   if (isLoading)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Spinner />
//       </div>
//     );
//   if (isError)
//     return (
//       <div className="text-destructive text-center p-10">
//         Error: {error.response?.data?.message || error.message}
//       </div>
//     );
//   if (!product) return <div>Product not found.</div>;

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />
//       <div className="container mx-auto px-4 py-2">
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
//             <div
//               className="relative aspect-square overflow-hidden rounded-lg bg-card/50 border border-border/50 group"
//               {...swipeHandlers}
//             >
//               {displayedImages.length > 0 ? (
//                 <img
//                   src={displayedImages[selectedImageIndex]}
//                   alt={product.name}
//                   className="w-full h-full object-cover transition-opacity duration-300"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-muted-foreground">
//                   <ImageIcon className="h-10 w-10 mr-2" /> No Images
//                 </div>
//               )}
//               {displayedImages.length > 1 && (
//                 <>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={prevImage}
//                     className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/40 hidden lg:inline-flex opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     <ChevronLeft className="h-6 w-6" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={nextImage}
//                     className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/40 hidden lg:inline-flex opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     <ChevronRight className="h-6 w-6" />
//                   </Button>
//                 </>
//               )}
//             </div>
//             <div className="grid grid-cols-4 gap-4">
//               {displayedImages.map((image, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImageIndex(index)}
//                   className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
//                     selectedImageIndex === index
//                       ? "border-accent"
//                       : "border-border/50 hover:border-accent/50"
//                   }`}
//                 >
//                   <img
//                     src={image}
//                     alt={`View ${index + 1}`}
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
//               {product.numReviews > 0 && (
//                 <div className="flex items-center gap-2 mb-4">
//                   <StarRating rating={product.rating} />
//                   <span className="text-sm text-muted-foreground">
//                     ({product.numReviews} review
//                     {product.numReviews > 1 ? "s" : ""})
//                   </span>
//                 </div>
//               )}
//               {selectedColor && (
//                 <div className="flex items-center gap-4 mb-4">
//                   <span className="text-2xl font-bold text-accent">
//                     ₹{selectedColor.price.toFixed(2)}
//                   </span>
//                   {selectedColor.originalPrice > selectedColor.price && (
//                     <span className="text-lg text-muted-foreground line-through">
//                       ₹{selectedColor.originalPrice.toFixed(2)}
//                     </span>
//                   )}
//                 </div>
//               )}
//               <p className="text-foreground/70 leading-relaxed">
//                 {product.description}
//               </p>
//             </div>

//             <div>
//               <h3 className="font-semibold mb-3">Type</h3>
//               <div className="flex flex-wrap gap-2">
//                 {product.variants.map((variant, index) => (
//                   <Button
//                     key={index}
//                     variant={
//                       selectedVariantIndex === index ? "default" : "outline"
//                     }
//                     className={`border rounded-md text-sm font-medium transition-all
//                       ${
//                         selectedVariantIndex === index
//                           ? "border-accent bg-accent hover:text-white text-accent-foreground"
//                           : "border-border hover:border-accent/50 hover:bg-accent/10"
//                       }
//                       `}
//                     onClick={() => handleVariantSelect(index)}
//                   >
//                     {variant.name}
//                   </Button>
//                 ))}
//               </div>
//             </div>
//             <div className="flex items-start gap-2 justify-between mb-3 flex-col">
//               <div className="flex justify-between items-center w-full mb-1">
//                 <h3 className="font-semibold">Size</h3>
//                 {selectedVariant?.sizeChart?.length > 0 && (
//                   <Button
//                     variant="link"
//                     className="text-sm text-accent p-0 h-auto underline"
//                     onClick={() => setIsSizeChartOpen(true)}
//                   >
//                     Size Chart
//                   </Button>
//                 )}
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {availableSizes.length > 0 ? (
//                   availableSizes.map((size) => (
//                     <Button
//                       key={size}
//                       variant={selectedSize === size ? "default" : "outline"}
//                       className={`border rounded-md text-sm font-medium transition-all
//                         ${
//                           selectedSize === size
//                             ? "border-accent bg-accent hover:text-white text-accent-foreground"
//                             : "border-border hover:border-accent/50 hover:bg-accent/10"
//                         }
//                         `}
//                       onClick={() => setSelectedSize(size)}
//                     >
//                       {size}
//                     </Button>
//                   ))
//                 ) : (
//                   <p className="text-sm text-muted-foreground">
//                     Select a color to see available sizes.
//                   </p>
//                 )}
//               </div>
//             </div>
//             <div>
//               <h3 className="font-semibold mb-3">Color: {selectedColorName}</h3>
//               <div className="flex flex-wrap gap-3">
//                 {selectedVariant?.colors
//                   // .sort((e, f) => {
//                   //   if (e.name === "Black") return -1;
//                   //   else return e.name.localeCompare(f.name);
//                   // })
//                   .map((color) => (
//                     <button
//                       key={color.name}
//                       onClick={() => handleColorSelect(color)}
//                       className={`w-10 h-10 rounded-full border-2 transition-all ${
//                         selectedColorName === color.name
//                           ? "border-accent scale-110"
//                           : "border-border"
//                       }`}
//                     >
//                       <img
//                         src={color.images?.[0]}
//                         alt={color.name}
//                         title={color.name}
//                         className="w-full h-full object-cover rounded-full"
//                       />
//                     </button>
//                   ))}
//               </div>
//             </div>

//             <div className="flex items-start justify-start gap-8 md:gap-20">
//               <div>
//                 <h3 className="font-semibold mb-3">Quantity</h3>
//                 <div className="flex items-center border border-border rounded-md w-fit">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   >
//                     <Minus className="h-4 w-4" />
//                   </Button>
//                   <span className="px-4 font-medium">{quantity}</span>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => setQuantity(quantity + 1)}
//                   >
//                     <Plus className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//               <div>
//                 <h3 className="font-semibold mb-3">Custom Name</h3>
//                 {currentItemInCart ? (
//                   isEditingName || !currentItemInCart.nameToPrint ? (
//                     <div className="flex items-center">
//                       <Input
//                         type="text"
//                         value={nameToPrint}
//                         onChange={(e) => setNameToPrint(e.target.value)}
//                         className="bg-secondary/50"
//                         placeholder="Your Name"
//                       />
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8 ml-2 text-green-500 hover:text-green-600"
//                         onClick={() => handleUpdateName(nameToPrint)}
//                       >
//                         <Check className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8 text-destructive hover:text-red-500"
//                         onClick={() => {
//                           setIsEditingName(false);
//                           setNameToPrint(currentItemInCart.nameToPrint || "");
//                         }}
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="flex items-center">
//                       <span className="font-bold text-accent">
//                         {currentItemInCart.nameToPrint}
//                       </span>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8 ml-2 text-gray-500 hover:text-gray-700"
//                         onClick={() => setIsEditingName(true)}
//                       >
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   )
//                 ) : (
//                   <div>
//                     <Input
//                       type="text"
//                       id="nameToPrint"
//                       name="nameToPrint"
//                       placeholder="Your Name (optional)"
//                       value={nameToPrint}
//                       className="bg-secondary/50"
//                       onChange={(e) => setNameToPrint(e.target.value)}
//                     />
//                     <p className="text-xs text-destructive mt-1">
//                       Additional charges may apply
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="space-y-4 pt-4">
//               {isItemInCart ? (
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   onClick={() => navigate("/cart")}
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
//                   disabled={cartMutation.isPending}
//                 >
//                   <ShoppingCart className="h-4 w-4 mr-2" />
//                   Add to Cart
//                 </Button>
//               )}
//             </div>

//             <Card>
//               <CardContent className="p-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
//                   <div className="flex flex-col items-center space-y-2">
//                     <Truck className="h-5 w-5 text-accent" />
//                     <div>
//                       <p className="font-medium text-sm">Free Shipping</p>
//                       <p className="text-xs text-muted-foreground text-red-500">
//                         Inside IIT(ISM) campus only
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex flex-col items-center space-y-2">
//                     <RotateCcw className="h-5 w-5 text-accent" />
//                     <div>
//                       <p className="font-medium text-sm">Easy Returns</p>
//                       <p className="text-xs text-muted-foreground">
//                         On manufacturing defects
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
//             <TabsList
//               className={`grid w-full ${
//                 product.numReviews > 0 ? "grid-cols-3" : "grid-cols-2"
//               }`}
//             >
//               <TabsTrigger value="details">Details</TabsTrigger>
//               <TabsTrigger value="specs">Specifications</TabsTrigger>
//               {product.numReviews > 0 && (
//                 <TabsTrigger value="reviews">
//                   Reviews ({product.numReviews})
//                 </TabsTrigger>
//               )}
//             </TabsList>
//             <TabsContent value="details" className="mt-6">
//               <Card>
//                 <CardContent className="p-6">
//                   <h3 className="font-semibold text-lg mb-4">
//                     Product Features
//                   </h3>
//                   <ul className="space-y-2 list-disc list-inside text-foreground/80">
//                     {(selectedColor?.features || []).map((feature, index) => (
//                       <li key={index}>{feature}</li>
//                     ))}
//                   </ul>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//             <TabsContent value="specs" className="mt-6">
//               <Card>
//                 <CardContent className="p-6">
//                   <h3 className="font-semibold text-lg mb-4">Specifications</h3>
//                   <div className="space-y-3">
//                     {Object.entries(selectedColor?.specifications || {}).map(
//                       ([key, value]) => (
//                         <div
//                           key={key}
//                           className="flex justify-between py-2 border-b last:border-b-0"
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

//             {product.numReviews > 0 && (
//               <TabsContent value="reviews" className="mt-6">
//                 <Card>
//                   <CardContent className="p-6 md:p-8">
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8 pb-6 border-b">
//                       <div className="text-center sm:text-left">
//                         <p className="text-4xl font-bold">
//                           {product.rating.toFixed(1)}
//                         </p>
//                         <StarRating rating={product.rating} />
//                         <p className="text-sm text-muted-foreground mt-1">
//                           Based on {product.numReviews} reviews
//                         </p>
//                       </div>
//                     </div>

//                     <div className="space-y-8">
//                       {product.reviews.map((review) => (
//                         <div key={review._id} className="flex gap-4">
//                           <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground flex-shrink-0">
//                             {review.name.charAt(0).toUpperCase()}
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex items-center justify-between mb-1">
//                               <p className="font-semibold text-foreground">
//                                 {review.name}
//                               </p>
//                               <span className="text-xs text-muted-foreground">
//                                 {new Date(review.createdAt).toLocaleDateString(
//                                   "en-GB",
//                                   {
//                                     day: "numeric",
//                                     month: "short",
//                                     year: "numeric",
//                                   }
//                                 )}
//                               </span>
//                             </div>
//                             <StarRating rating={review.rating} size="h-4 w-4" />
//                             <p className="mt-3 text-foreground/80 leading-relaxed">
//                               {review.comment}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>
//             )}
//           </Tabs>
//         </div>
//       </div>
//       <Footer />
//       {isSizeChartOpen && selectedVariant?.sizeChart?.length > 0 && (
//         <Dialog open={isSizeChartOpen} onOpenChange={setIsSizeChartOpen}>
//           <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-y-auto bg-card border-border">
//             <DialogTitle className="hidden">Size Chart</DialogTitle>
//             <div className="flex flex-col items-center justify-center p-4">
//               <h3 className="text-2xl font-bold mb-4">
//                 Size Chart for {product.name}
//               </h3>
//               <img
//                 src={selectedVariant.sizeChart[0]}
//                 alt="Size Chart"
//                 className="max-w-full h-auto rounded-md mb-4"
//               />
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default ProductDetail;

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useSwipeable } from "react-swipeable";
import {
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Check,
  X,
  Truck,
  RotateCcw,
  Shield,
  Star,
  CheckCircle,
} from "lucide-react";

// --- Core Hooks & API ---
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { fetchProductById, addToCart, updateCartItem } from "@/api/apiService";

// --- UI Components ---
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import StarRating from "@/components/reviews/StarRating";

const ProductDetail = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  // --- State for User Selections ---
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedColorName, setSelectedColorName] = useState("Black");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [nameToPrint, setNameToPrint] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [justAddedToCart, setJustAddedToCart] = useState(false);

  // --- Data Fetching with React Query ---
  const {
    data: productData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
  });
  const product = productData?.data?.product;

  // --- Derived State (Calculated from selections and data) ---
  const selectedVariant = product?.variants?.[selectedVariantIndex];
  const selectedColor = selectedVariant?.colors?.find(
    (c) => c.name === selectedColorName
  );
  const availableSizes =
    selectedColor?.stock?.filter((s) => s.quantity > 0).map((s) => s.size) ||
    [];
  const displayedImages =
    selectedColor?.images || product?.variants?.[0]?.colors?.[0]?.images || [];

  // --- Memoized calculations for reviews ---
  const sortedReviews = useMemo(() => {
    if (!product?.reviews) return [];
    // Sort reviews by most recent first
    return [...product.reviews].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [product?.reviews]);

  const displayedReviews = sortedReviews.slice(0, 5);

  const ratingBreakdown = useMemo(() => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (!product?.reviews) return [];
    product.reviews.forEach((review) => {
      if (breakdown[review.rating] !== undefined) {
        breakdown[review.rating]++;
      }
    });
    return Object.entries(breakdown)
      .map(([stars, count]) => ({
        stars: parseInt(stars),
        count,
        percentage:
          product.numReviews > 0 ? (count / product.numReviews) * 100 : 0,
      }))
      .reverse();
  }, [product?.reviews, product?.numReviews]);

  // --- Set Initial Selections when Product Loads ---
  useEffect(() => {
    if (product && product.variants?.length > 0) {
      const initialVariant = product.variants[0];
      const initialColor = initialVariant.colors?.[0];
      if (initialColor) {
        setSelectedColorName(initialColor.name);
        const firstAvailableSize = initialColor.stock?.find(
          (s) => s.quantity > 0
        )?.size;
        setSelectedSize(firstAvailableSize || "");
      }
    }
  }, [product]);

  // --- Check if the currently selected item is in the user's cart ---
  const currentItemInCart = useMemo(() => {
    if (!user?.cart || !selectedVariant?._id) return null;
    return user.cart.find((item) => {
      const isProductMatch =
        String(item.product.productId._id) === String(productId);
      const isVariantMatch =
        String(item.product.variantId) === String(selectedVariant._id);
      const isSizeMatch = String(item.size) === String(selectedSize);
      const isColorMatch =
        String(item.product.colorId) === String(selectedColor._id);
      return isProductMatch && isVariantMatch && isSizeMatch && isColorMatch;
    });
  }, [user, productId, selectedVariant, selectedSize, selectedColorName]);

  useEffect(() => {
    if (currentItemInCart && justAddedToCart) {
      setJustAddedToCart(false);
    }
  }, [currentItemInCart, justAddedToCart]);

  useEffect(() => {
    setJustAddedToCart(false);
  }, [selectedSize, selectedColorName, selectedVariantIndex]);

  useEffect(() => {
    if (isAuthenticated) {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    }
  }, [isAuthenticated, queryClient]);

  const isItemInCart = currentItemInCart || justAddedToCart;

  useEffect(() => {
    if (currentItemInCart) {
      setNameToPrint(currentItemInCart.nameToPrint || "");
    } else {
      setNameToPrint("");
      setIsEditingName(false);
    }
  }, [
    currentItemInCart,
    selectedSize,
    selectedColorName,
    selectedVariantIndex,
  ]);

  // --- Mutations for Cart Actions ---
  const cartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast({ title: "Added to cart!", variant: "success" });
      setJustAddedToCart(true);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.refetchQueries({ queryKey: ["user"] });
    },
    onError: (err) => {
      setJustAddedToCart(false);
      toast({
        title: "Error",
        description: err.response?.data?.message,
        variant: "destructive",
      });
    },
  });

  const updateNameMutation = useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      toast({ title: "Name updated!", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setIsEditingName(false);
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.response?.data?.message,
        variant: "destructive",
      });
    },
  });

  // --- Event Handlers ---
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({ title: "Please select a size.", variant: "destructive" });
      return;
    }
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    cartMutation.mutate({
      productId,
      variantId: selectedVariant._id,
      colorId: selectedColor._id,
      size: selectedSize,
      quantity,
      nameToPrint: nameToPrint.trim(),
    });
  };

  const handleUpdateName = (newName) => {
    updateNameMutation.mutate({
      cartItemId: currentItemInCart._id,
      nameToPrint: newName.trim(),
    });
  };

  const handleVariantSelect = (index) => {
    setSelectedVariantIndex(index);
    const newVariant = product.variants[index];
    const firstColor = newVariant.colors?.[0];
    if (firstColor) {
      setSelectedColorName(firstColor.name);
      setSelectedSize(
        firstColor.stock?.find((s) => s.quantity > 0)?.size || ""
      );
    }
    setSelectedImageIndex(0);
    setQuantity(1);
  };

  const handleColorSelect = (color) => {
    setSelectedColorName(color.name);
    setSelectedSize(color.stock?.find((s) => s.quantity > 0)?.size || "");
    setSelectedImageIndex(0);
  };

  const nextImage = () =>
    displayedImages.length > 1 &&
    setSelectedImageIndex((prev) => (prev + 1) % displayedImages.length);
  const prevImage = () =>
    displayedImages.length > 1 &&
    setSelectedImageIndex(
      (prev) => (prev - 1 + displayedImages.length) % displayedImages.length
    );
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  // --- Render Logic ---
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  if (isError)
    return (
      <div className="text-destructive text-center p-10">
        Error: {error.response?.data?.message || error.message}
      </div>
    );
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-2">
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
            <div
              className="relative aspect-square overflow-hidden rounded-lg bg-card/50 border border-border/50 group"
              {...swipeHandlers}
            >
              {displayedImages.length > 0 ? (
                <img
                  src={displayedImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-10 w-10 mr-2" /> No Images
                </div>
              )}
              {displayedImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevImage}
                    className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/40 hidden lg:inline-flex opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/40 hidden lg:inline-flex opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {displayedImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-accent"
                      : "border-border/50 hover:border-accent/50"
                  }`}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
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
              {product.numReviews > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={product.rating} />
                  <span className="text-sm text-muted-foreground">
                    ({product.numReviews} review
                    {product.numReviews > 1 ? "s" : ""})
                  </span>
                </div>
              )}
              {selectedColor && (
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold text-accent">
                    ₹{selectedColor.price.toFixed(2)}
                  </span>
                  {selectedColor.originalPrice > selectedColor.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{selectedColor.originalPrice.toFixed(2)}
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
                    className={`border rounded-md text-sm font-medium transition-all
                      ${
                        selectedVariantIndex === index
                          ? "border-accent bg-accent hover:text-white text-accent-foreground"
                          : "border-border hover:border-accent/50 hover:bg-accent/10"
                      }
                      `}
                    onClick={() => handleVariantSelect(index)}
                  >
                    {variant.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-2 justify-between mb-3 flex-col">
              <div className="flex justify-between items-center w-full mb-1">
                <h3 className="font-semibold">Size</h3>
                {selectedVariant?.sizeChart?.length > 0 && (
                  <Button
                    variant="link"
                    className="text-sm text-accent p-0 h-auto underline"
                    onClick={() => setIsSizeChartOpen(true)}
                  >
                    Size Chart
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.length > 0 ? (
                  availableSizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      className={`border rounded-md text-sm font-medium transition-all
                        ${
                          selectedSize === size
                            ? "border-accent bg-accent hover:text-white text-accent-foreground"
                            : "border-border hover:border-accent/50 hover:bg-accent/10"
                        }
                        `}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select a color to see available sizes.
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Color: {selectedColorName}</h3>
              <div className="flex flex-wrap gap-3">
                {selectedVariant?.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorSelect(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColorName === color.name
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
                ))}
              </div>
            </div>

            <div className="flex items-start justify-start gap-8 md:gap-20">
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
              <div>
                <h3 className="font-semibold mb-3">Custom Name</h3>
                {currentItemInCart ? (
                  isEditingName || !currentItemInCart.nameToPrint ? (
                    <div className="flex items-center">
                      <Input
                        type="text"
                        value={nameToPrint}
                        onChange={(e) => setNameToPrint(e.target.value)}
                        className="bg-secondary/50"
                        placeholder="Your Name"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-2 text-green-500 hover:text-green-600"
                        onClick={() => handleUpdateName(nameToPrint)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-red-500"
                        onClick={() => {
                          setIsEditingName(false);
                          setNameToPrint(currentItemInCart.nameToPrint || "");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="font-bold text-accent">
                        {currentItemInCart.nameToPrint}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setIsEditingName(true)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                ) : (
                  <div>
                    <Input
                      type="text"
                      id="nameToPrint"
                      name="nameToPrint"
                      placeholder="Your Name (optional)"
                      value={nameToPrint}
                      className="bg-secondary/50"
                      onChange={(e) => setNameToPrint(e.target.value)}
                    />
                    <p className="text-xs text-destructive mt-1">
                      Additional charges may apply
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              {isItemInCart ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/cart")}
                  className="w-full"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Go to Cart
                </Button>
              ) : (
                <Button
                  variant="cta"
                  size="lg"
                  onClick={handleAddToCart}
                  className="w-full"
                  disabled={cartMutation.isPending}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
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
                        On manufacturing defects
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
            <TabsList
              className={`grid w-full ${
                product.numReviews > 0 ? "grid-cols-3" : "grid-cols-2"
              }`}
            >
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              {product.numReviews > 0 && (
                <TabsTrigger value="reviews">
                  Reviews ({product.numReviews})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="details" className="mt-8">
              <Card className="bg-card/30 border-border/30">
                <CardContent className="p-6 md:p-8">
                  <h3 className="font-semibold text-xl mb-6">
                    Product Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-foreground/80">
                    {(selectedColor?.features || []).map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specs" className="mt-8">
              <Card className="bg-card/30 border-border/30">
                <CardContent className="p-6 md:p-8">
                  <h3 className="font-semibold text-xl mb-6">Specifications</h3>
                  <div className="space-y-4">
                    {Object.entries(selectedColor?.specifications || {}).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center pb-3 border-b border-border/30 last:border-b-0"
                        >
                          <span className="font-medium text-foreground/70">
                            {key}:
                          </span>
                          <span className="text-foreground text-right">
                            {value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {product.numReviews > 0 && (
              <TabsContent value="reviews" className="mt-8">
                <Card className="bg-card/30 border-border/30">
                  <CardContent className="p-6 md:p-8">
                    <h3 className="font-semibold text-xl mb-6">
                      Customer Reviews
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-border/30 pb-8 mb-8">
                      <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <p className="text-5xl font-bold">
                          {product.rating.toFixed(1)}
                        </p>
                        <StarRating rating={product.rating} />
                        <p className="text-sm text-muted-foreground mt-1">
                          Based on {product.numReviews} reviews
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <div className="space-y-2">
                          {ratingBreakdown.map(
                            ({ stars, count, percentage }) => (
                              <div
                                key={stars}
                                className="flex items-center gap-3"
                              >
                                <span className="text-sm text-muted-foreground whitespace-nowrap">
                                  {stars} star{stars > 1 ? "s" : ""}
                                </span>
                                <div className="w-full bg-muted rounded-full h-2.5">
                                  <div
                                    className="bg-accent h-2.5 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-muted-foreground w-12 text-right">
                                  {count}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-8">
                      {displayedReviews.map((review) => (
                        <div key={review._id} className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground flex-shrink-0">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-foreground">
                                {review.name}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <StarRating rating={review.rating} size="h-4 w-4" />
                            <p className="mt-3 text-foreground/80 leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {sortedReviews.length > 5 && (
                      <div className="text-center mt-8 pt-6 border-t border-border/30">
                        <p className="text-sm text-muted-foreground mb-3">
                          Showing the 5 most recent reviews.
                        </p>
                        <Button variant="outline">
                          View All {sortedReviews.length} Reviews
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
      <Footer />
      {isSizeChartOpen && selectedVariant?.sizeChart?.length > 0 && (
        <Dialog open={isSizeChartOpen} onOpenChange={setIsSizeChartOpen}>
          <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-y-auto bg-card border-border">
            <DialogTitle className="hidden">Size Chart</DialogTitle>
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

export default ProductDetail;
