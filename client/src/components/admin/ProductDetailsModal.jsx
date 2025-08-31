import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  // NEW STATE: To track which set of images is currently active (main or a specific color)
  const [activeImageSet, setActiveImageSet] = useState("main"); // 'main' or a color object
  const [displayedImages, setDisplayedImages] = useState([]);

  // Reset state when a new product is passed in or when the selected variant changes
  useEffect(() => {
    if (product) {
      setSelectedVariantIndex(0); // Default to the first variant
      setActiveImageSet("main"); // Default to main images
      setActiveImageIndex(0); // Reset image gallery to the first picture
    }
  }, [product]);

  // Update displayed images whenever activeImageSet or selectedVariantIndex changes
  useEffect(() => {
    if (!product || !product.variants || product.variants.length === 0) {
      setDisplayedImages([]);
      return;
    }

    const currentVariant = product.variants[selectedVariantIndex];

    if (activeImageSet === "main") {
      setDisplayedImages(product.images || []);
    } else if (activeImageSet && activeImageSet.images) {
      // activeImageSet is a color object, use its images
      setDisplayedImages(activeImageSet.images);
    } else {
      // Fallback or initial state: combine main images and all variant color images
      // This is a more robust default for the initial load
      const allVariantColorImages =
        currentVariant.colors?.flatMap((color) => color.images) || [];
      setDisplayedImages([...(product.images || []), ...allVariantColorImages]);
    }
    setActiveImageIndex(0); // Reset to first image of the new set
  }, [product, selectedVariantIndex, activeImageSet]);

  if (!product || !product.variants || product.variants.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogTitle>Product Not Available</DialogTitle>
          <DialogDescription>
            The details for this product could not be loaded. It may not have
            any variants defined.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex];

  const handleVariantSelect = (index) => {
    setSelectedVariantIndex(index);
    setActiveImageSet("main"); // Reset to main images for the new variant
    setActiveImageIndex(0);
  };

  const handleColorSelect = (color) => {
    setActiveImageSet(color); // Set activeImageSet to the selected color object
    setActiveImageIndex(0); // Reset to the first image of the selected color
  };

  const handleMainImagesSelect = () => {
    setActiveImageSet("main"); // Switch to main product images
    setActiveImageIndex(0); // Reset to the first main image
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold gradient-text">
            {product.name}
          </DialogTitle>
          <DialogDescription>
            Detailed view of the product and its variants.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 py-4">
          {/* Product Image Gallery */}
          <div className="relative aspect-square rounded-md overflow-hidden border bg-secondary/50">
            {displayedImages.length > 0 ? (
              <>
                <img
                  src={displayedImages[activeImageIndex]}
                  alt={`${product.name} - ${selectedVariant.name} - Image ${
                    activeImageIndex + 1
                  }`}
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
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {displayedImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-10 h-10 object-cover rounded-sm cursor-pointer border-2 ${
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

          {/* General Product Badges (isNew, onSale, rating, reviews) */}
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

            {/* Product Details - Now driven by the selected variant */}
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-accent">
                ₹{selectedVariant.price.toFixed(2)}
                {selectedVariant.originalPrice > selectedVariant.price && (
                  <span className="text-base text-muted-foreground line-through ml-2">
                    ₹{selectedVariant.originalPrice.toFixed(2)}
                  </span>
                )}
              </h3>

              <p className="text-sm text-foreground/70">
                {product.description}
              </p>

              {/* Variant Selector */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Select Variant
                </h4>
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

              {/* Sizes (from main product, assuming sizes are consistent across variants for now) */}
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

              {/* NEW: Color Image Selection */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  View by Color
                </h4>
                <div className="flex flex-wrap gap-2">
                  {/* Button for Main Product Images */}
                  {product.images && product.images.length > 0 && (
                    <div
                      className={`relative group cursor-pointer border-2 rounded-full transition-all duration-200 ${
                        activeImageSet === "main"
                          ? "border-accent"
                          : "border-transparent"
                      }`}
                      onClick={handleMainImagesSelect}
                    >
                      <img
                        src={product.images[0]} // Use the first main image as thumbnail
                        alt="Main Images"
                        title="Main Product Images"
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                        Main Images
                      </span>
                    </div>
                  )}

                  {/* Color Swatches/Thumbnails from selected variant */}
                  {selectedVariant.colors &&
                  selectedVariant.colors.length > 0 ? (
                    selectedVariant.colors.map(
                      (color, index) =>
                        color.images &&
                        color.images.length > 0 && (
                          <div
                            key={index}
                            className={`relative group cursor-pointer border-2 rounded-full transition-all duration-200 ${
                              activeImageSet === color
                                ? "border-accent"
                                : "border-transparent"
                            }`}
                            onClick={() => handleColorSelect(color)}
                          >
                            <img
                              src={color.images[0]} // Use the first image of the color as thumbnail
                              alt={color.name}
                              title={color.name}
                              className="w-10 h-10 object-cover rounded-full"
                            />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                              {color.name}
                            </span>
                          </div>
                        )
                    )
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No colors defined for this variant.
                    </span>
                  )}
                </div>
              </div>

              {/* Features (from selected variant) */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Features
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVariant.features &&
                  selectedVariant.features.length > 0 ? (
                    selectedVariant.features.map((feature, i) => (
                      <Badge key={i} className="bg-primary/20 text-accent">
                        {feature}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No features defined.
                    </span>
                  )}
                </div>
              </div>

              {/* Specifications (from selected variant) */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Specifications
                </h4>
                {selectedVariant.specifications &&
                Object.keys(selectedVariant.specifications).length > 0 ? (
                  <div className="text-sm space-y-1 p-3 border rounded-md bg-primary/5">
                    {Object.entries(selectedVariant.specifications).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span>{key}:</span>
                          <span className="font-medium text-foreground">
                            {value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No specifications defined.
                  </span>
                )}
              </div>

              {/* Size Chart Images (from selected variant) */}
              {selectedVariant.sizeChart &&
                selectedVariant.sizeChart.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Size Chart
                    </h4>
                    <img
                      src={selectedVariant.sizeChart[0]}
                      alt="Size Chart"
                      className="w-full h-auto object-cover rounded-md border"
                    />
                  </div>
                )}
            </div>

            {/* Department Details (from main product) */}
            {product.forDepartment && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Department
                </h4>
                <div className="p-3 border rounded-md bg-primary/5">
                  <span className="font-medium text-foreground">
                    {product.departmentName}
                  </span>
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
