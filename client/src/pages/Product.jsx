// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ShoppingCart,
//   ArrowLeft,
//   Plus,
//   Minus,
//   ImageIcon,
//   Truck,
//   RotateCcw,
//   Shield,
//   Pencil,
//   Check,
//   X,
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useToast } from "@/hooks/use-toast";
// import axios from "axios";
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// const Product = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { id } = useParams();
//   const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
//   const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedSize, setSelectedSize] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [isSizeChartModalOpen, setIsSizeChartModalOpen] = useState(false);
//   const [userCart, setUserCart] = useState([]);
//   const [nameToPrint, setNameToPrint] = useState("");
//   const [showNameInput, setShowNameInput] = useState(false);
//   const [editingItemId, setEditingItemId] = useState(null);

//   const selectedVariant = product?.variants?.[selectedVariantIndex];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const productResponse = await axios.get(
//           `${API_BASE_URL}/product/productbyid`,
//           { params: { id } }
//         );
//         const fetchedProduct = productResponse.data.product;

//         if (
//           !fetchedProduct ||
//           !fetchedProduct.variants ||
//           fetchedProduct.variants.length === 0
//         ) {
//           setError("Product or its variants not found.");
//           return;
//         }

//         fetchedProduct.variants.forEach((variant) => {
//           if (variant.colors && variant.colors.length > 0) {
//             variant.colors.sort((a, b) => {
//               const aIsBlack = a.name.toLowerCase() === "black";
//               const bIsBlack = b.name.toLowerCase() === "black";

//               if (aIsBlack) return -1;
//               if (bIsBlack) return 1;

//               return a.name.localeCompare(b.name);
//             });
//           }
//         });

//         setProduct(fetchedProduct);

//         const initialVariant = fetchedProduct.variants[0];
//         const initialColor = initialVariant.colors?.[0] || null;
//         const initialSize =
//           Object.keys(fetchedProduct.sizes).find(
//             (s) => fetchedProduct.sizes[s]
//           ) || "";

//         setSelectedVariantIndex(0);
//         setSelectedColor(initialColor);
//         setSelectedSize(initialSize);

//         if (userId) {
//           const cartResponse = await axios.get(
//             `${API_BASE_URL}/user/getCartDetails`,
//             { params: { userId } }
//           );
//           setUserCart(cartResponse.data.cart);
//         }
//       } catch (err) {
//         setError(
//           err.response?.data?.message || "Failed to fetch product details."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [API_BASE_URL, id, userId]);

//   // Logic to find the current item in the cart
//   const currentItemInCart = userCart.find((item) => {
//     const productIdString =
//       typeof item.productId === "string"
//         ? item.productId
//         : item.productId?._id?.toString();
//     const variantIdString = item.variantId?.toString();
//     const selectedVariantIdString = selectedVariant?._id?.toString();
//     return (
//       productIdString === id &&
//       variantIdString === selectedVariantIdString &&
//       item.size === selectedSize &&
//       item.colorName === selectedColor?.name
//     );
//   });

//   // Effect to sync state when `currentItemInCart` changes
//   useEffect(() => {
//     if (currentItemInCart) {
//       setNameToPrint(currentItemInCart.nameToPrint || "");
//       setShowNameInput(!!currentItemInCart.nameToPrint);
//       setEditingItemId(currentItemInCart._id);
//     } else {
//       setNameToPrint("");
//       setShowNameInput(false);
//       setEditingItemId(null);
//     }
//   }, [currentItemInCart]);

//   const handleVariantSelect = (index) => {
//     setSelectedVariantIndex(index);
//     const newVariant = product.variants[index];
//     setSelectedColor(newVariant.colors?.[0] || null);
//     setSelectedImage(0);
//     setQuantity(1);
//     // Resetting name-related state on variant change
//     setNameToPrint("");
//     setShowNameInput(false);
//     setEditingItemId(null);
//   };

//   const handleColorSelect = (color) => {
//     setSelectedColor(color);
//     setSelectedImage(0);
//   };

//   const handleAddToCart = async () => {
//     if (!selectedSize || !selectedVariant || !selectedColor) {
//       toast({ title: "Please select all options", variant: "destructive" });
//       return;
//     }
//     if (!userId) {
//       navigate("/login");
//       return;
//     }
//     try {
//       const payload = {
//         userId,
//         productId: product._id,
//         variantId: selectedVariant._id,
//         size: selectedSize,
//         colorName: selectedColor.name,
//         quantity: quantity,
//       };

//       if (nameToPrint.trim() !== "") {
//         payload.nameToPrint = nameToPrint.trim();
//       }

//       const response = await axios.post(
//         `${API_BASE_URL}/user/addToCart`,
//         payload
//       );

//       setUserCart(response.data.cart);
//       toast({ title: "Added to cart!", variant: "success" });
//       window.dispatchEvent(new Event("cartUpdated"));
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.response?.data?.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleUpdateName = async (newName) => {
//     if (!userId || !editingItemId) {
//       navigate("/login");
//       return;
//     }

//     try {
//       const payload = {
//         userId,
//         cartItemId: editingItemId,
//         nameToPrint: newName.trim(),
//       };

//       const response = await axios.put(
//         `${API_BASE_URL}/user/updateCartDetails`,
//         payload
//       );
//       setUserCart(response.data.cartItem);
//       setNameToPrint(newName.trim());
//       setShowNameInput(!!newName.trim()); // Hide if name is empty, show if not
//       toast({ title: "Name updated successfully!", variant: "success" });
//       window.dispatchEvent(new Event("cartUpdated"));
//     } catch (error) {
//       console.error("Error updating cart:", error);
//       toast({
//         title: "Error",
//         description: error.response?.data?.message,
//         variant: "destructive",
//       });
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error)
//     return (
//       <div className="text-destructive text-center p-10">Error: {error}</div>
//     );
//   if (!product) return <div>Product not found.</div>;

//   const displayedImages = selectedColor?.images || product.images || [];

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
//               {displayedImages.length > 0 ? (
//                 <img
//                   src={displayedImages[selectedImage]}
//                   alt={product.name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-muted-foreground">
//                   <ImageIcon className="h-10 w-10 mr-2" /> No Images Available
//                 </div>
//               )}
//             </div>
//             <div className="grid grid-cols-4 gap-4">
//               {displayedImages.map((image, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
//                   className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
//                     selectedImage === index
//                       ? "border-accent"
//                       : "border-border/50 hover:border-accent/50"
//                   }`}
//                 >
//                   <img
//                     src={image}
//                     alt={`View ${index + 1}`}
//                     className="w-full h-full object-cover "
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
//               {selectedVariant && (
//                 <div className="flex items-center gap-4 mb-4">
//                   <span className="text-2xl font-bold text-accent">
//                     ₹{selectedVariant.price.toFixed(2)}
//                   </span>
//                   {selectedVariant.originalPrice > selectedVariant.price && (
//                     <span className="text-lg text-muted-foreground line-through">
//                       ₹{selectedVariant.originalPrice.toFixed(2)}
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
// className={`aspect-square border rounded-md text-sm font-medium transition-all ${
//   selectedVariantIndex === index
//     ? "border-accent bg-accent text-accent-foreground"
//     : "border-border hover:border-accent/50 hover:bg-accent/10"
// }`}
//                     onClick={() => handleVariantSelect(index)}
//                   >
//                     {variant.name}
//                   </Button>
//                 ))}
//               </div>
//             </div>

//             <div className="flex items-start gap-2 justify-between mb-3 flex-col">
//               <h3 className="font-semibold">Size</h3>
//               <div className="flex flex-wrap gap-2">
//                 {Object.keys(product.sizes).map(
//                   (size) =>
//                     product.sizes[size] && (
//                       <Button
//                         key={size}
//                         variant={selectedSize === size ? "default" : "outline"}
//                         onClick={() => setSelectedSize(size)}
//                         className={`aspect-square border rounded-md text-sm font-medium transition-all ${
//                           selectedSize === size
//                             ? "border-accent bg-accent text-accent-foreground"
//                             : "border-border hover:border-accent/50 hover:bg-accent/10"
//                         }`}
//                       >
//                         {size}
//                       </Button>
//                     )
//                 )}
//               </div>
//               <div className="items-center">
//                 <span>Unsure about your size? Check our </span>
//                 {selectedVariant?.sizeChart?.length > 0 && (
//                   <Button
//                     variant="link"
//                     className="text-sm text-accent p-0 h-auto underline"
//                     onClick={() => setIsSizeChartModalOpen(true)}
//                   >
//                     Size Chart
//                   </Button>
//                 )}
//               </div>
//             </div>

//             <div>
//               <h3 className="font-semibold mb-3">
//                 Color: {selectedColor?.name || "None"}
//               </h3>
//               <div className="flex flex-wrap gap-3">
//                 {selectedVariant?.colors.map((color, index) => (
//                   <div key={index} className="relative group cursor-pointer">
//                     <button
//                       onClick={() => handleColorSelect(color)}
//                       className={`w-10 h-10 rounded-full border-2 transition-all ${
//                         selectedColor?.name === color.name
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
//                     <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
//                       {color.name}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="flex items-start justify-start gap-20">
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
//               <div className="">
//                 <h3 className="font-semibold">Custom Name</h3>
//                 {currentItemInCart && currentItemInCart.nameToPrint ? (
//                   // Case 1: Item is in cart with a name
//                   <div className="mt-2 flex items-center">
//                     {showNameInput ? (
//                       <>
//                         <input
//                           type="text"
//                           value={nameToPrint}
//                           onChange={(e) => setNameToPrint(e.target.value)}
//                           className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500/50 text-foreground bg-input/70"
//                           placeholder="Your Name"
//                         />
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="h-8 w-8 ml-2 text-green-500 hover:text-green-600"
//                           onClick={() => handleUpdateName(nameToPrint)}
//                         >
//                           <Check className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="h-8 w-8 ml-2 text-destructive hover:text-red-500"
//                           onClick={() => handleUpdateName("")}
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </>
//                     ) : (
//                       <>
//                         <span className="text-foreground/70 text-sm mr-2">
//                           Custom Name:
//                         </span>
//                         <span className="font-bold text-accent">
//                           {currentItemInCart.nameToPrint}
//                         </span>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="h-8 w-8 ml-2 text-gray-500 hover:text-gray-700"
//                           onClick={() => setShowNameInput(true)}
//                         >
//                           <Pencil className="h-4 w-4" />
//                         </Button>
//                       </>
//                     )}
//                   </div>
//                 ) : currentItemInCart && !currentItemInCart.nameToPrint ? (
//                   // Case 2: Item is in cart without a name
//                   <div className="mt-2 flex items-center">
//                     {showNameInput ? (
//                       <>
//                         <Input
//                           type="text"
//                           value={nameToPrint}
//                           onChange={(e) => setNameToPrint(e.target.value)}
//                           className="bg-secondary/50"
//                           placeholder="Your Name"
//                         />
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="h-8 w-8 ml-2 text-green-500 hover:text-green-600"
//                           onClick={() => handleUpdateName(nameToPrint)}
//                         >
//                           <Check className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="h-8 w-8 ml-2 text-destructive hover:text-red-500"
//                           onClick={() => {
//                             setShowNameInput(false);
//                             setNameToPrint("");
//                           }}
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </>
//                     ) : (
//                       <Button
//                         variant="outline"
//                         onClick={() => setShowNameInput(true)}
//                         className="w-fit"
//                       >
//                         Add Custom Name
//                       </Button>
//                     )}
//                   </div>
//                 ) : (
//                   // Case 3: Product is not in the cart
//                   <div className="input-group mt-2 flex">
//                     <label
//                       htmlFor="nameToPrint"
//                       className="font-semibold text-sm block"
//                     >
//                       Name to Print :
//                       <span className="text-destructive">
//                         (Additional Charges)
//                       </span>
//                     </label>
//                     <Input
//                       type="text"
//                       id="nameToPrint"
//                       name="nameToPrint"
//                       placeholder="Your Name"
//                       value={nameToPrint}
//                       className="bg-secondary/50"
//                       onChange={(e) => setNameToPrint(e.target.value)}
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="space-y-4">
//               {currentItemInCart ? (
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   onClick={() => navigate("/cart")}
//                   className="w-full"
//                 >
//                   <ShoppingCart className="h-4 w-4 mr-2" /> Go to Cart
//                 </Button>
//               ) : (
//                 <Button
//                   variant="cta"
//                   size="lg"
//                   onClick={handleAddToCart}
//                   className="w-full"
//                 >
//                   <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
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
//               <Card>
//                 <CardContent className="p-6">
//                   <h3 className="font-semibold text-lg mb-4">
//                     Product Features
//                   </h3>
//                   <ul className="space-y-2">
//                     {selectedVariant?.features.map((feature, index) => (
//                       <li key={index} className="flex items-center">
//                         <span className="w-2 h-2 bg-accent rounded-full mr-3" />
//                         {feature}
//                       </li>
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
//                     {selectedVariant &&
//                       Object.entries(selectedVariant.specifications).map(
//                         ([key, value]) => (
//                           <div
//                             key={key}
//                             className="flex justify-between py-2 border-b last:border-b-0"
//                           >
//                             <span className="font-medium">{key}:</span>
//                             <span className="text-foreground/80">{value}</span>
//                           </div>
//                         )
//                       )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//       <Footer />
//       {isSizeChartModalOpen && selectedVariant?.sizeChart?.length > 0 && (
//         <Dialog
//           open={isSizeChartModalOpen}
//           onOpenChange={setIsSizeChartModalOpen}
//         >
//           <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-y-auto bg-card border-border">
//             <DialogTitle className="hidden">Hello</DialogTitle>
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

// export default Product;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import {
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  ImageIcon,
  Truck,
  RotateCcw,
  Shield,
  Pencil,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const [nameToPrint, setNameToPrint] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  const selectedVariant = product?.variants?.[selectedVariantIndex];
  const displayedImages = selectedColor?.images || product?.images || [];

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

        fetchedProduct.variants.forEach((variant) => {
          if (variant.colors && variant.colors.length > 0) {
            variant.colors.sort((a, b) => {
              const aIsBlack = a.name.toLowerCase() === "black";
              const bIsBlack = b.name.toLowerCase() === "black";
              if (aIsBlack) return -1;
              if (bIsBlack) return 1;
              return a.name.localeCompare(b.name);
            });
          }
        });

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

  const currentItemInCart = userCart.find((item) => {
    const productIdString =
      typeof item.productId === "string"
        ? item.productId
        : item.productId?._id?.toString();
    const variantIdString = item.variantId?.toString();
    const selectedVariantIdString = selectedVariant?._id?.toString();
    return (
      productIdString === id &&
      variantIdString === selectedVariantIdString &&
      item.size === selectedSize &&
      item.colorName === selectedColor?.name
    );
  });

  useEffect(() => {
    if (currentItemInCart) {
      setNameToPrint(currentItemInCart.nameToPrint || "");
      setShowNameInput(!!currentItemInCart.nameToPrint);
      setEditingItemId(currentItemInCart._id);
    } else {
      setNameToPrint("");
      setShowNameInput(false);
      setEditingItemId(null);
    }
  }, [currentItemInCart]);

  const nextImage = () => {
    if (displayedImages.length > 1) {
      setSelectedImage((prev) => (prev + 1) % displayedImages.length);
    }
  };

  const prevImage = () => {
    if (displayedImages.length > 1) {
      setSelectedImage(
        (prev) => (prev - 1 + displayedImages.length) % displayedImages.length
      );
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextImage(),
    onSwipedRight: () => prevImage(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleVariantSelect = (index) => {
    setSelectedVariantIndex(index);
    const newVariant = product.variants[index];
    setSelectedColor(newVariant.colors?.[0] || null);
    setSelectedImage(0);
    setQuantity(1);
    setNameToPrint("");
    setShowNameInput(false);
    setEditingItemId(null);
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

      if (nameToPrint.trim() !== "") {
        payload.nameToPrint = nameToPrint.trim();
      }

      const response = await axios.post(
        `${API_BASE_URL}/user/addToCart`,
        payload
      );

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

  const handleUpdateName = async (newName) => {
    if (!userId || !editingItemId) {
      navigate("/login");
      return;
    }

    try {
      const payload = {
        userId,
        cartItemId: editingItemId,
        nameToPrint: newName.trim(),
      };

      const response = await axios.put(
        `${API_BASE_URL}/user/updateCartDetails`,
        payload
      );
      setUserCart(response.data.cartItem);
      setNameToPrint(newName.trim());
      setShowNameInput(!!newName.trim());
      toast({ title: "Name updated successfully!", variant: "success" });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error updating cart:", error);
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
                  src={displayedImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-10 w-10 mr-2" /> No Images Available
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
              <div className="flex flex-wrap gap-2 ">
                {product.variants.map((variant, index) => (
                  <Button
                    key={index}
                    variant={
                      selectedVariantIndex === index ? "default" : "outline"
                    }
                    className={`aspect-square border rounded-md text-sm font-medium transition-all ${
                      selectedVariantIndex === index
                        ? "border-accent bg-accent hover:text-white text-accent-foreground"
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
                        className={`aspect-square border rounded-md text-sm font-medium transition-all ${
                          selectedSize === size
                            ? "border-accent bg-accent hover:text-white text-accent-foreground"
                            : "border-border hover:border-accent/50 hover:bg-accent/10"
                        }`}
                        onClick={() => setSelectedSize(size)}
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

            <div className="flex items-start justify-start gap-20">
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
              <div className="">
                <h3 className="font-semibold mb-3">Custom Name</h3>
                {currentItemInCart && currentItemInCart.nameToPrint ? (
                  <div className="flex items-center">
                    {showNameInput ? (
                      <>
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
                          onClick={() => handleUpdateName("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-accent">
                          {currentItemInCart.nameToPrint}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ml-2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowNameInput(true)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ) : currentItemInCart && !currentItemInCart.nameToPrint ? (
                  <div className="flex items-center">
                    {showNameInput ? (
                      <>
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
                            setShowNameInput(false);
                            setNameToPrint("");
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setShowNameInput(true)}
                      >
                        Add Custom Name
                      </Button>
                    )}
                  </div>
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
                      Additional charges apply
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {currentItemInCart ? (
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

export default Product;
