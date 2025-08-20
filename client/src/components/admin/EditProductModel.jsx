import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X, Image as ImageIcon, Plus } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(product);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFileForSizeChart, setSelectedFileForSizeChart] =
    useState(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setSelectedFiles([]);
      setSelectedFileForSizeChart(null);
    }
  }, [product]);

  // Handle regular inputs and nested fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        return {
          ...prevData,
          [parent]: {
            ...prevData[parent],
            [child]: type === "checkbox" ? checked : value,
          },
        };
      }
      return { ...prevData, [name]: type === "checkbox" ? checked : value };
    });
  };

  // Handle dynamic array inputs (e.g., features)
  const handleArrayChange = (arrayName, index, value) => {
    setFormData((prevData) => {
      const newArray = [...prevData[arrayName]];
      newArray[index] = value;
      return { ...prevData, [arrayName]: newArray };
    });
  };

  const handleAddArrayItem = (arrayName) => {
    setFormData((prevData) => ({
      ...prevData,
      [arrayName]: [...prevData[arrayName], ""],
    }));
  };

  const handleRemoveArrayItem = (arrayName, index) => {
    setFormData((prevData) => ({
      ...prevData,
      [arrayName]: prevData[arrayName].filter((_, i) => i !== index),
    }));
  };

  // Handle new product image files
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  // Handle removing a newly selected local file
  const handleRemoveSelectedFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  // Handle removing an existing product image URL from the form data
  const handleRemoveExistingImage = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Handle new size chart image upload
  const handleSizeChartFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileForSizeChart(file);
    }
  };

  const handleRemoveSizeChartFile = () => {
    setSelectedFileForSizeChart(null);
  };

  // Reusable image upload function
  const uploadSingleImage = async (file) => {
    if (!file) return null;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      console.error("Cloudinary credentials not set.");
      return null;
    }
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadFormData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.secure_url;
      }
      return null;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Save changes handler
  const handleSave = async () => {
    setLoading(true);
    let updatedSizeChart = formData.sizeChart;
    let finalImageUrls = [...formData.images];

    // Handle new product images upload
    if (selectedFiles.length > 0) {
      setIsUploading(true);
      const imageUploadPromises = selectedFiles.map((file) =>
        uploadSingleImage(file)
      );
      const newImageUrls = (await Promise.all(imageUploadPromises)).filter(
        (url) => url !== null
      );
      setIsUploading(false);
      finalImageUrls = [...finalImageUrls, ...newImageUrls];
    }

    // Handle new size chart image upload
    if (selectedFileForSizeChart) {
      setIsUploading(true);
      const newSizeChartUrl = await uploadSingleImage(selectedFileForSizeChart);
      setIsUploading(false);
      if (newSizeChartUrl) {
        updatedSizeChart = [newSizeChartUrl]; // Replace old URL with new one
      } else {
        toast({
          title: "Image Upload Failed",
          description: "The new size chart image could not be uploaded.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    try {
      const sanitizedData = {
        ...formData,
        images: finalImageUrls.filter((url) => url.trim() !== ""),
        features: formData.features.filter((feature) => feature.trim() !== ""),
        sizeChart: updatedSizeChart,
      };

      const response = await axios.put(`${API_BASE_URL}/admin/updateProduct`, {
        _id: product._id,
        updatedProduct: sanitizedData,
      });

      toast({
        title: "Product Updated",
        description: `The product "${response.data.product.name}" was updated successfully.`,
        variant: "success",
      });
      onProductUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating product:", err);
      toast({
        title: "Failed to Update",
        description: err.response?.data?.message || "Server error.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to the product here. All fields will be pre-filled.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* General Fields */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price || 0}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="originalPrice" className="text-right">
              Original Price
            </Label>
            <Input
              id="originalPrice"
              name="originalPrice"
              type="number"
              value={formData.originalPrice || 0}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rating" className="text-right">
              Rating
            </Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              value={formData.rating || 0}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reviews" className="text-right">
              Reviews
            </Label>
            <Input
              id="reviews"
              name="reviews"
              type="number"
              value={formData.reviews || 0}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          {/* Boolean Fields */}
          <div className="flex flex-col space-y-2 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isNew"
                name="isNew"
                checked={formData.isNew}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isNew: checked }))
                }
              />
              <Label htmlFor="isNew">New Product</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="onSale"
                name="onSale"
                checked={formData.onSale}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, onSale: checked }))
                }
              />
              <Label htmlFor="onSale">On Sale</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="forDepartment"
                name="forDepartment"
                checked={formData.forDepartment}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, forDepartment: checked }))
                }
              />
              <Label htmlFor="forDepartment">For Department</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="forHomePage"
                name="forHomePage"
                checked={formData.forHomePage}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, forHomePage: checked }))
                }
              />
              <Label htmlFor="forHomePage">Display on Home Page</Label>
            </div>
            {formData.forDepartment && (
              <div className="grid grid-cols-4 items-center gap-4 mt-2">
                <Label htmlFor="departmentName" className="text-right">
                  Department Name
                </Label>
                <Input
                  id="departmentName"
                  name="departmentName"
                  value={formData.departmentName || ""}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
            )}
          </div>

          {/* Nested Objects (Sizes, Variety, Colors) */}
          <h3 className="font-semibold mt-4">Options</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Sizes */}
            <div>
              <Label className="font-medium">Sizes</Label>
              {Object.keys(formData.sizes || {}).map((size) => (
                <div key={size} className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id={`size-${size}`}
                    name={`sizes.${size}`}
                    checked={formData.sizes[size]}
                    onCheckedChange={(checked) =>
                      handleChange({
                        target: {
                          name: `sizes.${size}`,
                          type: "checkbox",
                          checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor={`size-${size}`}>{size}</Label>
                </div>
              ))}
            </div>
            {/* Variety of Product */}
            <div>
              <Label className="font-medium">Variety</Label>
              {Object.keys(formData.varietyOfProduct || {}).map((variety) => (
                <div key={variety} className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id={`variety-${variety}`}
                    name={`varietyOfProduct.${variety}`}
                    checked={formData.varietyOfProduct[variety]}
                    onCheckedChange={(checked) =>
                      handleChange({
                        target: {
                          name: `varietyOfProduct.${variety}`,
                          type: "checkbox",
                          checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor={`variety-${variety}`}>{variety}</Label>
                </div>
              ))}
            </div>
            {/* Colors */}
            <div>
              <Label className="font-medium">Colors</Label>
              {Object.keys(formData.colors || {}).map((color) => (
                <div key={color} className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id={`color-${color}`}
                    name={`colors.${color}`}
                    checked={formData.colors[color]}
                    onCheckedChange={(checked) =>
                      handleChange({
                        target: {
                          name: `colors.${color}`,
                          type: "checkbox",
                          checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor={`color-${color}`}>{color}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <h3 className="font-semibold mt-4">Specifications</h3>
          {Object.keys(formData.specifications || {}).map((spec) => (
            <div key={spec} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={`spec-${spec}`} className="text-right">
                {spec}
              </Label>
              <Input
                id={`spec-${spec}`}
                name={`specifications.${spec}`}
                value={formData.specifications[spec] || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          ))}

          {/* Product Images */}
          <h3 className="font-semibold mt-4">Product Images</h3>
          <p className="text-sm text-muted-foreground">
            Add new images or remove existing ones.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Display existing images */}
            {formData.images.map((image, index) => (
              <div
                key={`existing-${index}`}
                className="relative w-24 h-24 rounded-md overflow-hidden border border-border/50"
              >
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/70 text-foreground/80 hover:bg-background"
                  onClick={() => handleRemoveExistingImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {/* Display newly selected images (previews) */}
            {selectedFiles.map((file, index) => (
              <div
                key={`new-${index}`}
                className="relative w-24 h-24 rounded-md overflow-hidden border border-border/50"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`New Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/70 text-foreground/80 hover:bg-background"
                  onClick={() => handleRemoveSelectedFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUpload" className="text-right">
              Add Images
            </Label>
            <Input
              id="imageUpload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="col-span-3 file:text-foreground"
              disabled={isUploading}
            />
          </div>

          {/* Features */}
          <h3 className="font-semibold mt-4">Features</h3>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={feature}
                onChange={(e) =>
                  handleArrayChange("features", index, e.target.value)
                }
                placeholder="Feature"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleRemoveArrayItem("features", index)}
              >
                <X />
              </Button>
            </div>
          ))}
          <Button
            onClick={() => handleAddArrayItem("features")}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Feature
          </Button>

          {/* Size Chart Image Upload */}
          <h3 className="font-semibold mt-4">Size Chart Image</h3>
          <p className="text-sm text-muted-foreground">
            Upload a new image to replace the existing one.
          </p>
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleSizeChartFileChange}
              className="flex-1"
            />
            {selectedFileForSizeChart && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleRemoveSizeChartFile}
              >
                <X />
              </Button>
            )}
          </div>
          {isUploading && selectedFileForSizeChart && (
            <div className="flex items-center text-accent mt-2">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span>Uploading size chart...</span>
            </div>
          )}
          {/* Display current or new size chart image preview */}
          {(selectedFileForSizeChart || formData.sizeChart?.length > 0) && (
            <div className="mt-2 relative w-32 h-32 rounded-md overflow-hidden border">
              <img
                src={
                  selectedFileForSizeChart
                    ? URL.createObjectURL(selectedFileForSizeChart)
                    : formData.sizeChart[0]
                }
                alt="Size Chart"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || isUploading}>
            {loading || isUploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
