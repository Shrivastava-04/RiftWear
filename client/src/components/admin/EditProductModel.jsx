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
import { Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(product);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure form data is updated if the product prop changes
    setFormData(product);
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => {
      // Handle nested fields (e.g., sizes, colors, specifications)
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

      // Handle boolean checkboxes
      if (type === "checkbox") {
        return { ...prevData, [name]: checked };
      }

      // Handle regular inputs
      return { ...prevData, [name]: value };
    });
  };

  // Helper function to handle dynamic array inputs (e.g., images, features, sizeChart)
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
      [arrayName]: [...prevData[arrayName], ""], // Add a new empty string
    }));
  };

  const handleRemoveArrayItem = (arrayName, index) => {
    setFormData((prevData) => ({
      ...prevData,
      [arrayName]: prevData[arrayName].filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Clean up the data before sending (e.g., remove empty array items)
      const sanitizedData = {
        ...formData,
        images: formData.images.filter((url) => url.trim() !== ""),
        features: formData.features.filter((feature) => feature.trim() !== ""),
        sizeChart: formData.sizeChart.filter((url) => url.trim() !== ""),
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

          {/* Array Inputs (Images, Features, Size Chart) */}
          <h3 className="font-semibold mt-4">Images</h3>
          {formData.images.map((image, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={image}
                onChange={(e) =>
                  handleArrayChange("images", index, e.target.value)
                }
                placeholder="Image URL"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleRemoveArrayItem("images", index)}
              >
                {" "}
                -{" "}
              </Button>
            </div>
          ))}
          <Button
            onClick={() => handleAddArrayItem("images")}
            variant="outline"
            size="sm"
          >
            Add Image
          </Button>

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
                {" "}
                -{" "}
              </Button>
            </div>
          ))}
          <Button
            onClick={() => handleAddArrayItem("features")}
            variant="outline"
            size="sm"
          >
            Add Feature
          </Button>

          <h3 className="font-semibold mt-4">Size Chart Images</h3>
          {formData.sizeChart.map((url, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={url}
                onChange={(e) =>
                  handleArrayChange("sizeChart", index, e.target.value)
                }
                placeholder="Size Chart URL"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleRemoveArrayItem("sizeChart", index)}
              >
                {" "}
                -{" "}
              </Button>
            </div>
          ))}
          <Button
            onClick={() => handleAddArrayItem("sizeChart")}
            variant="outline"
            size="sm"
          >
            Add Size Chart
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
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
