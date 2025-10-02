import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

// Helper function to format the new category object for display
const formatCategory = (category) => {
  if (!category || !category.type) return "Uncategorized";
  const parts = [category.type];
  if (category.collection) parts.push(category.collection);
  if (category.subCollection) parts.push(category.subCollection);
  if (category.college) parts.push(category.college);
  if (category.department) parts.push(category.department);
  return parts.join(" / ");
};

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset state when the product prop changes
  useEffect(() => {
    if (product) {
      setSelectedVariantIndex(0);
      setSelectedColorIndex(0);
      setActiveImageIndex(0);
    }
  }, [product]);

  if (!product || !product.variants || product.variants.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Not Available</DialogTitle>
            <DialogDescription>
              The details for this product could not be loaded or it has no
              variants defined.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex];
  const selectedColor = selectedVariant?.colors?.[selectedColorIndex];
  const displayedImages = selectedColor?.images || [];
  console.log(selectedVariant);
  console.log(selectedColor);
  // Handlers for navigation
  const handleVariantSelect = (index) => {
    setSelectedVariantIndex(index);
    setSelectedColorIndex(0); // Reset to the first color of the new variant
    setActiveImageIndex(0);
  };

  const handleColorSelect = (index) => {
    setSelectedColorIndex(index);
    setActiveImageIndex(0); // Reset to the first image of the new color
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % displayedImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex(
      (prev) => (prev - 1 + displayedImages.length) % displayedImages.length
    );
  };

  // Render star ratings
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.round(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold gradient-text">
            {product.name}
          </DialogTitle>
          <DialogDescription>
            {formatCategory(product.category)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* LEFT COLUMN: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square rounded-lg overflow-hidden border bg-secondary/50 flex items-center justify-center">
              {displayedImages.length > 0 ? (
                <>
                  <img
                    src={displayedImages[activeImageIndex]}
                    alt={`${selectedColor?.name} - ${activeImageIndex + 1}`}
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
                        <ChevronLeft />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
                        onClick={nextImage}
                      >
                        <ChevronRight />
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground flex flex-col items-center">
                  <ImageIcon className="h-12 w-12" />
                  <p>No images for this color.</p>
                </div>
              )}
            </div>
            <div className="flex justify-center flex-wrap gap-2">
              {selectedVariant?.colors?.map((color, index) => (
                <div
                  key={index}
                  className={`relative group cursor-pointer border-2 rounded-md p-0.5 transition-all ${
                    selectedColorIndex === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => handleColorSelect(index)}
                >
                  <img
                    src={
                      color.images?.[0] ||
                      "https://placehold.co/64x64/222/fff?text=?"
                    }
                    alt={color.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    {color.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Product Details */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-start gap-2">
              <Badge variant={product.isActive ? "success" : "secondary"}>
                {product.isActive ? "Active" : "Archived"}
              </Badge>
              {product.isNew && (
                <Badge className="bg-blue-500/20 text-blue-300">
                  New Arrival
                </Badge>
              )}
              {product.onSale && (
                <Badge className="bg-red-500/20 text-red-300">On Sale</Badge>
              )}
              {product.forHomePage && (
                <Badge className="bg-purple-500/20 text-purple-300">
                  On Home Page
                </Badge>
              )}
              <Badge variant="outline">Priority: {product.sortPriority}</Badge>
            </div>

            {/* Variant Selector */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Variant</h4>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, index) => (
                  <Button
                    key={index}
                    variant={
                      selectedVariantIndex === index ? "default" : "outline"
                    }
                    onClick={() => handleVariantSelect(index)}
                  >
                    {variant.name}
                  </Button>
                ))}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-accent">
              ₹{selectedColor.price?.toFixed(2)}
              {selectedColor.originalPrice > selectedColor.price && (
                <span className="text-base text-muted-foreground line-through ml-2">
                  ₹{selectedColor.originalPrice?.toFixed(2)}
                </span>
              )}
            </h3>

            {/* Stock Information */}
            <div>
              <h4 className="text-sm font-medium mb-2">
                Stock for:{" "}
                <span className="font-bold text-white">
                  {selectedColor?.name || "N/A"}
                </span>
              </h4>
              {selectedColor && selectedColor.stock.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
                  {selectedColor.stock.map(({ size, quantity }) => (
                    <div
                      key={size}
                      className="p-2 border rounded-md bg-muted/50"
                    >
                      <p className="font-bold">{size}</p>
                      <p className="text-sm">{quantity} left</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No stock information for this color.
                </p>
              )}
            </div>

            {/* Details Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specs">Specs</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({product.numReviews || 0})
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="description"
                className="text-sm text-foreground/80 mt-2"
              >
                {product.description}
              </TabsContent>
              <TabsContent value="specs">
                <ul className="text-sm space-y-1">
                  {selectedColor.specifications &&
                    Object.entries(selectedColor.specifications).map(
                      ([key, value]) => (
                        <li key={key} className="flex justify-between">
                          <span>{key}:</span>
                          <span className="font-medium text-foreground">
                            {value}
                          </span>
                        </li>
                      )
                    )}
                </ul>
              </TabsContent>
              <TabsContent value="features">
                <div className="flex flex-wrap gap-2">
                  {selectedColor.features?.map((feature, i) => (
                    <Badge key={i} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reviews">
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-bold text-lg">
                    {product.rating?.toFixed(1) || "0.0"}
                  </span>
                  <div className="flex">{renderStars(product.rating)}</div>
                  <span className="text-sm text-muted-foreground">
                    ({product.numReviews || 0} reviews)
                  </span>
                </div>
                <div className="space-y-4 max-h-40 overflow-y-auto pr-2">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review) => (
                      <div key={review._id} className="border-b pb-2">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{review.name}</p>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {review.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No reviews yet.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            <div className="space-y-2">
              <img
                src={selectedVariant.sizeChart}
                alt="Size Chart"
                className="w-80"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
