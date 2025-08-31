import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Reusable defaults for new variants
const defaultFeatures = ["Pure Fabric", "Stylish Design"];
const defaultSpecs = {
  Material: "100% Cotton",
  Weight: "180 GSM",
  Fit: "Round Neck, Regular Fit",
  Care: "Machine Washed",
};

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // State for new files to upload
  const [mainImagesToUpload, setMainImagesToUpload] = useState([]);
  // State for new URLs to add
  const [newMainImageUrls, setNewMainImageUrls] = useState([""]);

  useEffect(() => {
    if (product) {
      const productCopy = JSON.parse(JSON.stringify(product));

      // Prepare variants with state for new files and new URLs
      const variantsWithUploadState = productCopy.variants.map((variant) => ({
        ...variant,
        sizeChartFile: null,
        colors: variant.colors.map((color) => ({
          ...color,
          newImages: [], // For new file uploads
          newImageUrls: [""], // For new URL inputs
        })),
      }));

      setFormData({ ...productCopy, variants: variantsWithUploadState });
      setMainImagesToUpload([]);
      setNewMainImageUrls([""]); // Reset new main image URLs
    }
  }, [product]);

  const uploadSingleImage = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // --- GENERAL & TOP-LEVEL HANDLERS ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- MAIN IMAGE HANDLERS (UPDATED) ---
  const handleMainFileChange = (e) => {
    setMainImagesToUpload(Array.from(e.target.files));
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleRemoveNewMainFile = (indexToRemove) => {
    setMainImagesToUpload((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleNewMainUrlChange = (index, value) => {
    const updatedUrls = [...newMainImageUrls];
    updatedUrls[index] = value;
    setNewMainImageUrls(updatedUrls);
  };

  const addMainUrlInput = () => {
    setNewMainImageUrls((prev) => [...prev, ""]);
  };

  const removeMainUrlInput = (index) => {
    setNewMainImageUrls((prev) => prev.filter((_, i) => i !== index));
  };
  // --- END MAIN IMAGE HANDLERS ---

  // --- DYNAMIC VARIANT HANDLERS ---
  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          name: "Regular",
          price: "",
          originalPrice: "",
          features: [...defaultFeatures],
          specifications: { ...defaultSpecs },
          sizeChart: [],
          sizeChartFile: null,
          colors: [],
        },
      ],
    }));
  };
  const handleRemoveVariant = (variantIndex) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== variantIndex),
    }));
  };
  const handleVariantChange = (variantIndex, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex][name] = value;
      return { ...prev, variants: newVariants };
    });
  };
  const handleVariantNameChange = (variantIndex, newName) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex].name = newName;
      return { ...prev, variants: newVariants };
    });
  };
  const handleVariantSizeChartChange = (variantIndex, e) => {
    const file = e.target.files[0];
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex].sizeChartFile = file;
      newVariants[variantIndex].sizeChart = [];
      return { ...prev, variants: newVariants };
    });
  };

  // --- NESTED HANDLERS (Features, Specs, Colors) ---
  const handleFeatureChange = (vIndex, fIndex, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[vIndex].features[fIndex] = value;
      return { ...prev, variants: newVariants };
    });
  };
  const handleAddFeature = (variantIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex].features.push("");
      return { ...prev, variants: newVariants };
    });
  };
  const handleRemoveFeature = (vIndex, fIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[vIndex].features = newVariants[vIndex].features.filter(
        (_, i) => i !== fIndex
      );
      return { ...prev, variants: newVariants };
    });
  };
  const handleSpecificationChange = (vIndex, field, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[vIndex].specifications[field] = value;
      return { ...prev, variants: newVariants };
    });
  };
  const handleAddColor = (variantIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex].colors.push({
        name: "",
        images: [],
        newImages: [],
        newImageUrls: [""], // Initialize with one URL field
      });
      return { ...prev, variants: newVariants };
    });
  };
  const handleRemoveColor = (vIndex, cIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[vIndex].colors = newVariants[vIndex].colors.filter(
        (_, i) => i !== cIndex
      );
      return { ...prev, variants: newVariants };
    });
  };
  const handleColorNameChange = (vIndex, cIndex, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[vIndex].colors[cIndex].name = value;
      return { ...prev, variants: newVariants };
    });
  };
  const handleColorImagesChange = (vIndex, cIndex, files) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[vIndex].colors[cIndex].newImages = Array.from(files);
      return { ...prev, variants: newVariants };
    });
  };
  const handleRemoveExistingColorImage = (vIndex, cIndex, imgIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[vIndex].colors[cIndex].images = newVariants[vIndex].colors[
        cIndex
      ].images.filter((_, i) => i !== imgIndex);
      return { ...prev, variants: newVariants };
    });
  };

  // --- NEW: Handlers for Color Image URLs ---
  const handleColorUrlChange = (vIndex, cIndex, urlIndex, value) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) => {
        if (i !== vIndex) return variant;
        return {
          ...variant,
          colors: variant.colors.map((color, j) => {
            if (j !== cIndex) return color;
            const updatedUrls = [...(color.newImageUrls || [])];
            updatedUrls[urlIndex] = value;
            return { ...color, newImageUrls: updatedUrls };
          }),
        };
      }),
    }));
  };

  const addColorUrlInput = (vIndex, cIndex) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) => {
        if (i !== vIndex) return variant;
        return {
          ...variant,
          colors: variant.colors.map((color, j) => {
            if (j !== cIndex) return color;
            const updatedUrls = [...(color.newImageUrls || []), ""];
            return { ...color, newImageUrls: updatedUrls };
          }),
        };
      }),
    }));
  };

  const removeColorUrlInput = (vIndex, cIndex, urlIndex) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) => {
        if (i !== vIndex) return variant;
        return {
          ...variant,
          colors: variant.colors.map((color, j) => {
            if (j !== cIndex) return color;
            const updatedUrls = (color.newImageUrls || []).filter(
              (_, k) => k !== urlIndex
            );
            return { ...color, newImageUrls: updatedUrls };
          }),
        };
      }),
    }));
  };

  // --- NEW: Handlers for Color Image URLs ---
  // const handleColorUrlChange = (vIndex, cIndex, urlIndex, value) => {
  //   setFormData((prev) => {
  //     const newVariants = JSON.parse(JSON.stringify(prev.variants));
  //     if (!newVariants[vIndex].colors[cIndex].newImageUrls) {
  //       newVariants[vIndex].colors[cIndex].newImageUrls = [];
  //     }
  //     newVariants[vIndex].colors[cIndex].newImageUrls[urlIndex] = value;
  //     return { ...prev, variants: newVariants };
  //   });
  // };

  // const addColorUrlInput = (vIndex, cIndex) => {
  //   setFormData((prev) => {
  //     const newVariants = JSON.parse(JSON.stringify(prev.variants));
  //     if (!newVariants[vIndex].colors[cIndex].newImageUrls) {
  //       newVariants[vIndex].colors[cIndex].newImageUrls = [];
  //     }
  //     newVariants[vIndex].colors[cIndex].newImageUrls.push("");
  //     return { ...prev, variants: newVariants };
  //   });
  // };

  // const removeColorUrlInput = (vIndex, cIndex, urlIndex) => {
  //   setFormData((prev) => {
  //     const newVariants = JSON.parse(JSON.stringify(prev.variants));
  //     newVariants[vIndex].colors[cIndex].newImageUrls = newVariants[
  //       vIndex
  //     ].colors[cIndex].newImageUrls.filter((_, i) => i !== urlIndex);
  //     return { ...prev, variants: newVariants };
  //   });
  // };

  // --- SUBMISSION LOGIC (UPDATED) ---
  const handleSave = async () => {
    setLoading(true);
    setIsUploading(true);
    try {
      // 1. Process main images: combine existing, uploaded, and new URLs
      const uploadedMainImageUrls = await Promise.all(
        mainImagesToUpload.map(uploadSingleImage)
      );
      const finalMainImages = [
        ...formData.images,
        ...uploadedMainImageUrls.filter(Boolean),
        ...newMainImageUrls.filter(Boolean), // Add new URLs
      ];

      // 2. Process variants
      const finalVariantsData = await Promise.all(
        formData.variants.map(async (variant) => {
          let finalSizeChartUrl = variant.sizeChart;
          if (variant.sizeChartFile) {
            const uploadedUrl = await uploadSingleImage(variant.sizeChartFile);
            if (uploadedUrl) finalSizeChartUrl = [uploadedUrl];
          }

          const finalColors = await Promise.all(
            variant.colors.map(async (color) => {
              const uploadedColorImageUrls = await Promise.all(
                (color.newImages || []).map(uploadSingleImage)
              );
              // Combine existing, uploaded, and new URLs for each color
              const finalColorImages = [
                ...color.images,
                ...uploadedColorImageUrls.filter(Boolean),
                ...(color.newImageUrls || []).filter(Boolean),
              ];
              return {
                _id: color._id,
                name: color.name,
                images: finalColorImages,
              };
            })
          );

          return {
            _id: variant._id,
            name: variant.name,
            price: variant.price,
            originalPrice: variant.originalPrice,
            features: variant.features,
            specifications: variant.specifications,
            sizeChart: finalSizeChartUrl,
            colors: finalColors,
          };
        })
      );

      setIsUploading(false);
      const updatedProductData = {
        ...formData,
        images: finalMainImages,
        variants: finalVariantsData,
      };

      // Clean up metadata before sending
      delete updatedProductData._id;
      delete updatedProductData.createdAt;
      delete updatedProductData.updatedAt;
      delete updatedProductData.__v;

      await axios.put(`${API_BASE_URL}/admin/updateProduct`, {
        _id: product._id,
        updatedProduct: updatedProductData,
      });

      toast({ title: "Product Updated", variant: "success" });
      onProductUpdated();
      onClose();
    } catch (err) {
      toast({
        title: "Failed to Update",
        description: err.response?.data?.message || "Server error.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
  };

  if (!formData)
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        </DialogContent>
      </Dialog>
    );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit: {product.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-8">
          {/* --- Basic Information --- */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div>
              <Label>Name</Label>
              <Input
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* --- Main Product Images (UPDATED) --- */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Main Product Images</h3>
            <Label>Existing Images</Label>
            <div className="flex flex-wrap gap-4 mb-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => handleRemoveExistingImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {mainImagesToUpload.map((file, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-md border border-dashed border-primary"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => handleRemoveNewMainFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainImageUpload">Upload New Images</Label>
              <Input
                id="mainImageUpload"
                type="file"
                multiple
                onChange={handleMainFileChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Or Add New Image URLs</Label>
              {newMainImageUrls.map((url, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/image.png"
                    value={url}
                    onChange={(e) =>
                      handleNewMainUrlChange(index, e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMainUrlInput(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMainUrlInput}
              >
                <Plus className="h-4 w-4 mr-2" /> Add URL
              </Button>
            </div>
          </div>

          {/* --- Available Sizes --- */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Available Sizes</h3>
            <div className="flex flex-wrap gap-4">
              {Object.keys(formData.sizes || {}).map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={formData.sizes[size]}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("sizes", {
                        ...formData.sizes,
                        [size]: !!checked,
                      })
                    }
                  />
                  <Label htmlFor={`size-${size}`}>{size}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* --- Variants --- */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Variants</h3>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddVariant}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Variant
              </Button>
            </div>
            {formData.variants.map((variant, variantIndex) => (
              <div
                key={variant._id || `new-${variantIndex}`}
                className="p-4 border rounded-lg space-y-4 relative bg-card/40"
              >
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => handleRemoveVariant(variantIndex)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <h4 className="font-semibold text-md">
                  Variant: {variant.name || `New Variant`}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Select
                      onValueChange={(value) =>
                        handleVariantNameChange(variantIndex, value)
                      }
                      value={variant.name}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Oversized">Oversized</SelectItem>
                        <SelectItem value="Polo">Polo</SelectItem>
                        <SelectItem value="Hoodie">Hoodie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      name="price"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(variantIndex, e)}
                    />
                  </div>
                  <div>
                    <Label>Original Price</Label>
                    <Input
                      type="number"
                      name="originalPrice"
                      value={variant.originalPrice}
                      onChange={(e) => handleVariantChange(variantIndex, e)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Size Chart</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(variant.sizeChart || []).map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        className="w-20 h-20 object-cover rounded-md border"
                        alt="Size Chart"
                      />
                    ))}
                    {variant.sizeChartFile && (
                      <img
                        src={URL.createObjectURL(variant.sizeChartFile)}
                        className="w-20 h-20 object-cover rounded-md border border-dashed border-primary"
                        alt="New Preview"
                      />
                    )}
                  </div>
                  <Input
                    type="file"
                    onChange={(e) =>
                      handleVariantSizeChartChange(variantIndex, e)
                    }
                  />
                </div>

                <div>
                  <Label>Features</Label>
                  {variant.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <Input
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(
                            variantIndex,
                            featureIndex,
                            e.target.value
                          )
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleRemoveFeature(variantIndex, featureIndex)
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddFeature(variantIndex)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>

                <div>
                  <Label>Specifications</Label>
                  {Object.keys(variant.specifications).map((specKey) => (
                    <div
                      key={specKey}
                      className="grid grid-cols-4 items-center gap-2 mb-2"
                    >
                      <Label className="col-span-1 text-sm">{specKey}</Label>
                      <Input
                        className="col-span-3"
                        value={variant.specifications[specKey]}
                        onChange={(e) =>
                          handleSpecificationChange(
                            variantIndex,
                            specKey,
                            e.target.value
                          )
                        }
                      />
                    </div>
                  ))}
                </div>

                {/* --- Colors (UPDATED) --- */}
                <div>
                  <Label>Colors</Label>
                  {variant.colors.map((color, colorIndex) => (
                    <div
                      key={color._id || `new-color-${colorIndex}`}
                      className="p-3 border rounded-md mt-2 space-y-4 relative"
                    >
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() =>
                          handleRemoveColor(variantIndex, colorIndex)
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Color Name"
                        value={color.name}
                        onChange={(e) =>
                          handleColorNameChange(
                            variantIndex,
                            colorIndex,
                            e.target.value
                          )
                        }
                      />

                      {/* Existing Images */}
                      <div className="flex flex-wrap gap-2">
                        {color.images.map((imgUrl, imgIndex) => (
                          <div key={imgIndex} className="relative w-20 h-20">
                            <img
                              src={imgUrl}
                              className="w-full h-full object-cover rounded-md"
                              alt=""
                            />
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute -top-1 -right-1 h-5 w-5"
                              onClick={() =>
                                handleRemoveExistingColorImage(
                                  variantIndex,
                                  colorIndex,
                                  imgIndex
                                )
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {/* Upload New Images */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Upload New Images
                        </Label>
                        <Input
                          type="file"
                          multiple
                          onChange={(e) =>
                            handleColorImagesChange(
                              variantIndex,
                              colorIndex,
                              e.target.files
                            )
                          }
                        />
                      </div>

                      {/* Add New URLs */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Or Add New URLs
                        </Label>
                        {(color.newImageUrls || []).map((url, urlIndex) => (
                          <div
                            key={urlIndex}
                            className="flex items-center space-x-2"
                          >
                            <Input
                              type="url"
                              placeholder="https://.../image.png"
                              value={url}
                              onChange={(e) =>
                                handleColorUrlChange(
                                  variantIndex,
                                  colorIndex,
                                  urlIndex,
                                  e.target.value
                                )
                              }
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                removeColorUrlInput(
                                  variantIndex,
                                  colorIndex,
                                  urlIndex
                                )
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            addColorUrlInput(variantIndex, colorIndex)
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add URL
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={() => handleAddColor(variantIndex)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Color
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* --- Other Settings --- */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Other Settings</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isNew"
                checked={formData.isNew}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("isNew", !!checked)
                }
              />
              <Label htmlFor="isNew">New Arrival</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="onSale"
                checked={formData.onSale}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("onSale", !!checked)
                }
              />
              <Label htmlFor="onSale">On Sale</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="forHomePage"
                checked={formData.forHomePage}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("forHomePage", !!checked)
                }
              />
              <Label htmlFor="forHomePage">Display on Home Page</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="forDepartment"
                checked={formData.forDepartment}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("forDepartment", !!checked)
                }
              />
              <Label htmlFor="forDepartment">For Department Store</Label>
            </div>
            {formData.forDepartment && (
              <div>
                <Label htmlFor="departmentName">Department Name</Label>
                <Input
                  id="departmentName"
                  name="departmentName"
                  value={formData.departmentName || ""}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isUploading ? "Uploading..." : "Saving..."}
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
