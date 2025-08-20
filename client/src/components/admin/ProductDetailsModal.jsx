// // import React, { useState } from "react";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import {
// //   Star,
// //   Tag,
// //   Layers,
// //   Palette,
// //   CheckCircle2,
// //   XCircle,
// //   ChevronLeft,
// //   ChevronRight,
// //   Image as ImageIcon,
// // } from "lucide-react";

// // // Modal component to display a single product's details
// // const ProductDetailsModal = ({ isOpen, onClose, product }) => {
// //   const [activeImageIndex, setActiveImageIndex] = useState(0);

// //   if (!product) {
// //     return null;
// //   }

// //   const nextImage = () => {
// //     setActiveImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
// //   };

// //   const prevImage = () => {
// //     setActiveImageIndex(
// //       (prevIndex) =>
// //         (prevIndex - 1 + product.images.length) % product.images.length
// //     );
// //   };

// //   // A helper function to map color names to their CSS values for display
// //   const getColorValue = (colorName) => {
// //     const colorMap = {
// //       Black: "#000000",
// //       White: "#FFFFFF",
// //       Gray: "#808080",
// //     };
// //     return colorMap[colorName] || colorName; // Fallback to name if not in map
// //   };

// //   // Keep renderListSection for features, which are still an array
// //   const renderListSection = (title, items) => {
// //     if (!items || items.length === 0) return null;
// //     return (
// //       <div className="space-y-2">
// //         <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
// //         <div className="flex flex-wrap gap-2">
// //           {items.map((item, index) => (
// //             <Badge
// //               key={index}
// //               className="bg-primary/20 text-accent hover:bg-primary/30"
// //             >
// //               {item}
// //             </Badge>
// //           ))}
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <Dialog open={isOpen} onOpenChange={onClose}>
// //       <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-card border-border">
// //         <DialogHeader>
// //           <DialogTitle className="text-xl md:text-2xl font-bold gradient-text">
// //             {product.name}
// //           </DialogTitle>
// //           <DialogDescription>
// //             Detailed view of the product and its specifications.
// //           </DialogDescription>
// //         </DialogHeader>

// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 py-4">
// //           {/* Product Image Gallery */}
// //           <div className="relative aspect-square rounded-md overflow-hidden border border-border/50 bg-secondary/50">
// //             {product.images && product.images.length > 0 ? (
// //               <>
// //                 <img
// //                   src={product.images[activeImageIndex]}
// //                   alt={product.name}
// //                   className="w-full h-full object-cover transition-opacity duration-300"
// //                 />
// //                 {product.images.length > 1 && (
// //                   <>
// //                     <Button
// //                       variant="ghost"
// //                       size="icon"
// //                       className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
// //                       onClick={prevImage}
// //                     >
// //                       <ChevronLeft className="h-6 w-6 text-foreground/80" />
// //                     </Button>
// //                     <Button
// //                       variant="ghost"
// //                       size="icon"
// //                       className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
// //                       onClick={nextImage}
// //                     >
// //                       <ChevronRight className="h-6 w-6 text-foreground/80" />
// //                     </Button>
// //                   </>
// //                 )}
// //                 <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
// //                   {product.images.map((image, index) => (
// //                     <img
// //                       key={index}
// //                       src={image}
// //                       alt={`Thumbnail ${index + 1}`}
// //                       className={`w-10 h-10 object-cover rounded-sm cursor-pointer border-2 transition-all duration-200 ${
// //                         index === activeImageIndex
// //                           ? "border-accent"
// //                           : "border-transparent opacity-60"
// //                       }`}
// //                       onClick={() => setActiveImageIndex(index)}
// //                     />
// //                   ))}
// //                 </div>
// //               </>
// //             ) : (
// //               <div className="flex items-center justify-center h-full text-muted-foreground">
// //                 <ImageIcon className="h-10 w-10 mr-2" /> No Image
// //               </div>
// //             )}
// //           </div>

// //           {/* Product Details */}
// //           <div className="space-y-4">
// //             <h3 className="text-2xl md:text-3xl font-bold text-accent">
// //               ₹{product.price.toFixed(2)}
// //               {product.originalPrice > product.price && (
// //                 <span className="text-base text-muted-foreground line-through ml-2">
// //                   ₹{product.originalPrice.toFixed(2)}
// //                 </span>
// //               )}
// //             </h3>

// //             <p className="text-sm text-foreground/70">{product.description}</p>

// //             <div className="flex flex-wrap gap-2">
// //               {product.isNew && (
// //                 <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">
// //                   NEW
// //                 </Badge>
// //               )}
// //               {product.onSale && (
// //                 <Badge className="bg-red-500/20 text-red-300 hover:bg-red-500/30">
// //                   SALE
// //                 </Badge>
// //               )}
// //               {product.rating > 0 && (
// //                 <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30">
// //                   <Star className="h-3 w-3 mr-1" />
// //                   {product.rating.toFixed(1)}
// //                 </Badge>
// //               )}
// //               {product.reviews > 0 && (
// //                 <Badge className="bg-foreground/10 text-foreground/70 hover:bg-foreground/20">
// //                   {product.reviews} Reviews
// //                 </Badge>
// //               )}
// //             </div>

// //             {/* Sizes */}
// //             <div className="space-y-2">
// //               <h4 className="text-sm font-medium text-muted-foreground">
// //                 Sizes
// //               </h4>
// //               <div className="flex flex-wrap gap-2">
// //                 {Object.entries(product.sizes || {}).map(
// //                   ([size, available]) =>
// //                     available && (
// //                       <Badge key={size} className="bg-primary/20 text-accent">
// //                         {size}
// //                       </Badge>
// //                     )
// //                 )}
// //               </div>
// //             </div>

// //             {/* Varieties */}
// //             <div className="space-y-2">
// //               <h4 className="text-sm font-medium text-muted-foreground">
// //                 Varieties
// //               </h4>
// //               <div className="flex flex-wrap gap-2">
// //                 {Object.entries(product.varietyOfProduct || {}).map(
// //                   ([variety, available]) =>
// //                     available && (
// //                       <Badge
// //                         key={variety}
// //                         className="bg-primary/20 text-accent"
// //                       >
// //                         {variety}
// //                       </Badge>
// //                     )
// //                 )}
// //               </div>
// //             </div>

// //             {/* Colors */}
// //             <div className="space-y-2">
// //               <h4 className="text-sm font-medium text-muted-foreground">
// //                 Colors
// //               </h4>
// //               <div className="flex flex-wrap gap-2">
// //                 {Object.entries(product.colors || {}).map(
// //                   ([color, available]) =>
// //                     available && (
// //                       <div
// //                         key={color}
// //                         className="flex items-center gap-1.5 p-1 px-2 rounded-full bg-primary/20 text-xs text-white border border-border/50"
// //                       >
// //                         <span
// //                           className="h-3 w-3 rounded-full border border-border"
// //                           style={{ backgroundColor: getColorValue(color) }}
// //                         />
// //                         <span>{color}</span>
// //                       </div>
// //                     )
// //                 )}
// //               </div>
// //             </div>

// //             {/* Features */}
// //             {renderListSection("Features", product.features)}

// //             {/* Specifications */}
// //             <div className="space-y-2">
// //               <h4 className="text-sm font-medium text-muted-foreground">
// //                 Specifications
// //               </h4>
// //               {product.specifications && (
// //                 <CardContent className="space-y-2 p-4 bg-primary/10 rounded-md">
// //                   {Object.entries(product.specifications).map(
// //                     ([key, value]) => (
// //                       <div key={key} className="flex justify-between text-sm">
// //                         <span>{key}:</span>
// //                         <span className="font-medium text-foreground">
// //                           {value}
// //                         </span>
// //                       </div>
// //                     )
// //                   )}
// //                 </CardContent>
// //               )}
// //             </div>

// //             {/* Department Details */}
// //             {product.forDepartment && (
// //               <div className="space-y-2">
// //                 <h4 className="text-sm font-medium text-muted-foreground">
// //                   Department
// //                 </h4>
// //                 <CardContent className="p-4 bg-primary/10 rounded-md">
// //                   <span className="font-medium text-foreground">
// //                     {product.departmentName}
// //                   </span>
// //                 </CardContent>
// //               </div>
// //             )}

// //             {/* Size Chart Images */}
// //             {product.sizeChart && product.sizeChart.length > 0 && (
// //               <div className="space-y-2">
// //                 <h4 className="text-sm font-medium text-muted-foreground">
// //                   Size Chart
// //                 </h4>
// //                 <div className="grid grid-cols-2 gap-4">
// //                   {product.sizeChart.map((url, index) => (
// //                     <img
// //                       key={index}
// //                       src={url}
// //                       alt={`Size Chart ${index + 1}`}
// //                       className="w-full h-auto object-cover rounded-md border border-border/50"
// //                     />
// //                   ))}
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // };

// // export default ProductDetailsModal;
// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Star,
//   Tag,
//   Layers,
//   Palette,
//   CheckCircle2,
//   XCircle,
//   ChevronLeft,
//   ChevronRight,
//   Image as ImageIcon,
// } from "lucide-react";

// const ProductDetailsModal = ({ isOpen, onClose, product }) => {
//   // State for image gallery navigation
//   const [activeImageIndex, setActiveImageIndex] = useState(0);
//   // State for color variant selection
//   const [selectedColor, setSelectedColor] = useState(null);

//   useEffect(() => {
//     if (product) {
//       // Set the first color as selected and reset image index when the modal opens
//       if (product.colors && product.colors.length > 0) {
//         setSelectedColor(product.colors[0]);
//       } else {
//         setSelectedColor(null);
//       }
//       setActiveImageIndex(0);
//     }
//   }, [product]);

//   if (!product) {
//     return null;
//   }

//   // Determine which images to display based on the selected color
//   const displayedImages = selectedColor ? selectedColor.images : product.images;

//   const nextImage = () => {
//     setActiveImageIndex(
//       (prevIndex) => (prevIndex + 1) % displayedImages.length
//     );
//   };

//   const prevImage = () => {
//     setActiveImageIndex(
//       (prevIndex) =>
//         (prevIndex - 1 + displayedImages.length) % displayedImages.length
//     );
//   };

//   const handleColorSelect = (color) => {
//     setSelectedColor(color);
//     setActiveImageIndex(0); // Reset to the first image of the new color
//   };

//   const renderListSection = (title, items) => {
//     if (!items || items.length === 0) return null;
//     return (
//       <div className="space-y-2">
//         <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
//         <div className="flex flex-wrap gap-2">
//           {items.map((item, index) => (
//             <Badge
//               key={index}
//               className="bg-primary/20 text-accent hover:bg-primary/30"
//             >
//               {item}
//             </Badge>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-card border-border">
//         <DialogHeader>
//           <DialogTitle className="text-xl md:text-2xl font-bold gradient-text">
//             {product.name}
//           </DialogTitle>
//           <DialogDescription>
//             Detailed view of the product and its specifications.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 py-4">
//           {/* Product Image Gallery */}
//           <div className="relative aspect-square rounded-md overflow-hidden border border-border/50 bg-secondary/50">
//             {displayedImages && displayedImages.length > 0 ? (
//               <>
//                 <img
//                   src={displayedImages[activeImageIndex]}
//                   alt={product.name}
//                   className="w-full h-full object-cover transition-opacity duration-300"
//                 />
//                 {displayedImages.length > 1 && (
//                   <>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
//                       onClick={prevImage}
//                     >
//                       <ChevronLeft className="h-6 w-6 text-foreground/80" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
//                       onClick={nextImage}
//                     >
//                       <ChevronRight className="h-6 w-6 text-foreground/80" />
//                     </Button>
//                   </>
//                 )}
//                 <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
//                   {displayedImages.map((image, index) => (
//                     <img
//                       key={index}
//                       src={image}
//                       alt={`Thumbnail ${index + 1}`}
//                       className={`w-10 h-10 object-cover rounded-sm cursor-pointer border-2 transition-all duration-200 ${
//                         index === activeImageIndex
//                           ? "border-accent"
//                           : "border-transparent opacity-60"
//                       }`}
//                       onClick={() => setActiveImageIndex(index)}
//                     />
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <div className="flex items-center justify-center h-full text-muted-foreground">
//                 <ImageIcon className="h-10 w-10 mr-2" /> No Image
//               </div>
//             )}
//           </div>

//           {/* Product Details */}
//           <div className="space-y-4">
//             <h3 className="text-2xl md:text-3xl font-bold text-accent">
//               ₹{product.price.toFixed(2)}
//               {product.originalPrice > product.price && (
//                 <span className="text-base text-muted-foreground line-through ml-2">
//                   ₹{product.originalPrice.toFixed(2)}
//                 </span>
//               )}
//             </h3>

//             <p className="text-sm text-foreground/70">{product.description}</p>

//             <div className="flex flex-wrap gap-2">
//               {product.isNew && (
//                 <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">
//                   NEW
//                 </Badge>
//               )}
//               {product.onSale && (
//                 <Badge className="bg-red-500/20 text-red-300 hover:bg-red-500/30">
//                   SALE
//                 </Badge>
//               )}
//               {product.rating > 0 && (
//                 <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30">
//                   <Star className="h-3 w-3 mr-1" />
//                   {product.rating.toFixed(1)}
//                 </Badge>
//               )}
//               {product.reviews > 0 && (
//                 <Badge className="bg-foreground/10 text-foreground/70 hover:bg-foreground/20">
//                   {product.reviews} Reviews
//                 </Badge>
//               )}
//             </div>

//             {/* Sizes */}
//             <div className="space-y-2">
//               <h4 className="text-sm font-medium text-muted-foreground">
//                 Sizes
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 {Object.entries(product.sizes || {}).map(
//                   ([size, available]) =>
//                     available && (
//                       <Badge key={size} className="bg-primary/20 text-accent">
//                         {size}
//                       </Badge>
//                     )
//                 )}
//               </div>
//             </div>

//             {/* Varieties */}
//             <div className="space-y-2">
//               <h4 className="text-sm font-medium text-muted-foreground">
//                 Varieties
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 {Object.entries(product.varietyOfProduct || {}).map(
//                   ([variety, available]) =>
//                     available && (
//                       <Badge
//                         key={variety}
//                         className="bg-primary/20 text-accent"
//                       >
//                         {variety}
//                       </Badge>
//                     )
//                 )}
//               </div>
//             </div>

//             {/* --- UPDATED: Colors and Image Selection --- */}
//             <div className="space-y-2">
//               <h4 className="text-sm font-medium text-muted-foreground">
//                 Colors
//               </h4>
//               {product.colors && product.colors.length > 0 ? (
//                 <div className="flex flex-wrap gap-2">
//                   {product.colors.map((color, index) => (
//                     <div
//                       key={index}
//                       className={`relative group cursor-pointer border-2 rounded-full transition-all duration-200 ${
//                         selectedColor?.name === color.name
//                           ? "border-accent"
//                           : "border-transparent"
//                       }`}
//                       onClick={() => handleColorSelect(color)}
//                     >
//                       <img
//                         src={color.images[0]} // Show first image as swatch
//                         alt={color.name}
//                         title={color.name}
//                         className="w-10 h-10 object-cover rounded-full"
//                       />
//                       <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
//                         {color.name}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <span className="text-sm text-muted-foreground">N/A</span>
//               )}
//             </div>
//             {/* --- END OF UPDATED SECTION --- */}

//             {/* Features */}
//             {renderListSection("Features", product.features)}

//             {/* Specifications */}
//             <div className="space-y-2">
//               <h4 className="text-sm font-medium text-muted-foreground">
//                 Specifications
//               </h4>
//               {product.specifications && (
//                 <CardContent className="space-y-2 p-4 bg-primary/10 rounded-md">
//                   {Object.entries(product.specifications).map(
//                     ([key, value]) => (
//                       <div key={key} className="flex justify-between text-sm">
//                         <span>{key}:</span>
//                         <span className="font-medium text-foreground">
//                           {value}
//                         </span>
//                       </div>
//                     )
//                   )}
//                 </CardContent>
//               )}
//             </div>

//             {/* Department Details */}
//             {product.forDepartment && (
//               <div className="space-y-2">
//                 <h4 className="text-sm font-medium text-muted-foreground">
//                   Department
//                 </h4>
//                 <CardContent className="p-4 bg-primary/10 rounded-md">
//                   <span className="font-medium text-foreground">
//                     {product.departmentName}
//                   </span>
//                 </CardContent>
//               </div>
//             )}

//             {/* Size Chart Images */}
//             {product.sizeChart && product.sizeChart.length > 0 && (
//               <div className="space-y-2">
//                 <h4 className="text-sm font-medium text-muted-foreground">
//                   Size Chart
//                 </h4>
//                 <div className="grid grid-cols-2 gap-4">
//                   {product.sizeChart.map((url, index) => (
//                     <img
//                       key={index}
//                       src={url}
//                       alt={`Size Chart ${index + 1}`}
//                       className="w-full h-auto object-cover rounded-md border border-border/50"
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ProductDetailsModal;
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Tag,
  Layers,
  Palette,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isMainImagesSelected, setIsMainImagesSelected] = useState(true); // NEW state

  useEffect(() => {
    if (product) {
      setIsMainImagesSelected(true);
      setSelectedColor(null);
      setActiveImageIndex(0);
    }
  }, [product]);

  if (!product) {
    return null;
  }

  // Determine which images to display based on the selected color or main images
  const displayedImages = isMainImagesSelected
    ? product.images
    : selectedColor.images;

  const nextImage = () => {
    setActiveImageIndex(
      (prevIndex) => (prevIndex + 1) % displayedImages.length
    );
  };

  const prevImage = () => {
    setActiveImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + displayedImages.length) % displayedImages.length
    );
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setIsMainImagesSelected(false);
    setActiveImageIndex(0);
  };

  const handleMainImagesSelect = () => {
    setIsMainImagesSelected(true);
    setSelectedColor(null);
    setActiveImageIndex(0);
  };

  const renderListSection = (title, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge
              key={index}
              className="bg-primary/20 text-accent hover:bg-primary/30"
            >
              {item}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold gradient-text">
            {product.name}
          </DialogTitle>
          <DialogDescription>
            Detailed view of the product and its specifications.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 py-4">
          {/* Product Image Gallery */}
          <div className="relative aspect-square rounded-md overflow-hidden border border-border/50 bg-secondary/50">
            {displayedImages && displayedImages.length > 0 ? (
              <>
                <img
                  src={displayedImages[activeImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                {displayedImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-6 w-6 text-foreground/80" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-6 w-6 text-foreground/80" />
                    </Button>
                  </>
                )}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {displayedImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-10 h-10 object-cover rounded-sm cursor-pointer border-2 transition-all duration-200 ${
                        index === activeImageIndex
                          ? "border-accent"
                          : "border-transparent opacity-60"
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <ImageIcon className="h-10 w-10 mr-2" /> No Image
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold text-accent">
              ₹{product.price.toFixed(2)}
              {product.originalPrice > product.price && (
                <span className="text-base text-muted-foreground line-through ml-2">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              )}
            </h3>

            <p className="text-sm text-foreground/70">{product.description}</p>

            <div className="flex flex-wrap gap-2">
              {product.isNew && (
                <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">
                  NEW
                </Badge>
              )}
              {product.onSale && (
                <Badge className="bg-red-500/20 text-red-300 hover:bg-red-500/30">
                  SALE
                </Badge>
              )}
              {product.rating > 0 && (
                <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30">
                  <Star className="h-3 w-3 mr-1" />
                  {product.rating.toFixed(1)}
                </Badge>
              )}
              {product.reviews > 0 && (
                <Badge className="bg-foreground/10 text-foreground/70 hover:bg-foreground/20">
                  {product.reviews} Reviews
                </Badge>
              )}
            </div>

            {/* Sizes */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Sizes
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(product.sizes || {}).map(
                  ([size, available]) =>
                    available && (
                      <Badge key={size} className="bg-primary/20 text-accent">
                        {size}
                      </Badge>
                    )
                )}
              </div>
            </div>

            {/* Varieties */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Varieties
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(product.varietyOfProduct || {}).map(
                  ([variety, available]) =>
                    available && (
                      <Badge
                        key={variety}
                        className="bg-primary/20 text-accent"
                      >
                        {variety}
                      </Badge>
                    )
                )}
              </div>
            </div>

            {/* UPDATED: Colors and Image Selection */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Colors
              </h4>
              <div className="flex flex-wrap gap-2">
                {/* Button to select main product images */}
                {product.images && product.images.length > 0 && (
                  <div
                    className={`relative group cursor-pointer border-2 rounded-full transition-all duration-200 ${
                      isMainImagesSelected
                        ? "border-accent"
                        : "border-transparent"
                    }`}
                    onClick={handleMainImagesSelect}
                  >
                    <img
                      src={product.images[0]}
                      alt="Main Images"
                      title="Main Images"
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                      Main Images
                    </span>
                  </div>
                )}
                {/* Mapping over colors array */}
                {product.colors && product.colors.length > 0 ? (
                  product.colors.map((color, index) => (
                    <div
                      key={index}
                      className={`relative group cursor-pointer border-2 rounded-full transition-all duration-200 ${
                        selectedColor?.name === color.name
                          ? "border-accent"
                          : "border-transparent"
                      }`}
                      onClick={() => handleColorSelect(color)}
                    >
                      <img
                        src={color.images[0]}
                        alt={color.name}
                        title={color.name}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                        {color.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">N/A</span>
                )}
              </div>
            </div>
            {/* END OF UPDATED SECTION */}

            {/* Features */}
            {renderListSection("Features", product.features)}

            {/* Specifications */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Specifications
              </h4>
              {product.specifications && (
                <CardContent className="space-y-2 p-4 bg-primary/10 rounded-md">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span>{key}:</span>
                        <span className="font-medium text-foreground">
                          {value}
                        </span>
                      </div>
                    )
                  )}
                </CardContent>
              )}
            </div>

            {/* Department Details */}
            {product.forDepartment && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Department
                </h4>
                <CardContent className="p-4 bg-primary/10 rounded-md">
                  <span className="font-medium text-foreground">
                    {product.departmentName}
                  </span>
                </CardContent>
              </div>
            )}

            {/* Size Chart Images */}
            {product.sizeChart && product.sizeChart.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Size Chart
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {product.sizeChart.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Size Chart ${index + 1}`}
                      className="w-full h-auto object-cover rounded-md border border-border/50"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
