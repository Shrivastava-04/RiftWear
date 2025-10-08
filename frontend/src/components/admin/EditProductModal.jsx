import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminUpdateProduct } from "../../api/apiService";

// --- Constants remain the same ---
const VARIANT_NAMES = ["Regular", "Oversized", "Polo", "Hoodie"];
const CATEGORY_TYPES = ["Fashion", "College Store"];
const FASHION_COLLECTIONS = ["Anime Collection", "Casuals", "Minimalist"];
const ANIME_SUB_COLLECTIONS = ["Naruto", "Jujutsu Kaisen", "One Piece"];
const COLLEGE_NAMES = ["IIT (ISM) Dhanbad"];
const DEPARTMENTS = [
  "None",
  "Computer Science",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Mining Engineering",
  "Chemical Engineering",
  "Electronics & Communication",
  "Petroleum Engineering",
  "Mathematics & Computing",
  "Physics",
  "Applied Geophysics",
  "Applied Geology",
];
const SIZES = ["S", "M", "L", "XL", "XXL"];
const ERROR_IMG_PLACEHOLDER = "https://placehold.co/64x64/222/fff?text=Invalid";

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  // --- UPDATED: Local state to manage the "Fashion Collection" dropdown, as it's no longer in the DB schema
  const [selectedFashionCollection, setSelectedFashionCollection] =
    useState("");

  useEffect(() => {
    if (product) {
      const productCopy = JSON.parse(JSON.stringify(product));

      // --- UPDATED: State initialization to match the new schema structure
      productCopy.variants = productCopy.variants.map((variant) => ({
        ...variant,
        // Colors now contain price, features, specs, etc.
        colors: variant.colors.map((color) => ({
          ...color,
          // Ensure these fields exist for each color
          price: color.price || 0,
          originalPrice: color.originalPrice || 0,
          features: color.features || ["Pure Fabric", "Stylish Design"],
          specifications: color.specifications || {
            Material: "100% Cotton",
            Weight: "180 GSM",
            Fit: "Round Neck, Regular Fit",
            Care: "Machine Washed",
          },
          // Pad stock array to ensure all sizes are present in the UI
          stock: SIZES.map((size) => {
            const existingStock = color.stock.find((s) => s.size === size);
            return {
              size,
              quantity: existingStock ? existingStock.quantity : 100,
            };
          }),
        })),
      }));
      product.productCard = product.productCard || {
        name: "",
        image: "",
        price: 0,
        originalPrice: 0,
        isNew: true,
        onSale: true,
        sortPriority: 999,
      };
      setFormData(productCopy);

      // --- UPDATED: Initialize the local state for the fashion collection dropdown
      if (productCopy.category.type === "Fashion") {
        if (
          ANIME_SUB_COLLECTIONS.includes(productCopy.category.subCollection)
        ) {
          setSelectedFashionCollection("Anime Collection");
        } else if (productCopy.category.subCollection) {
          // You might want to handle other collections here if they have sub-collections
          // For now, this is a placeholder.
        } else {
          // Default to a value if no sub-collection implies another collection type
          // This part is ambiguous from the schema, assuming it could be "Casuals" etc.
          setSelectedFashionCollection("Casuals");
        }
      }
    }
  }, [product]);

  const handleNestedChange = (path, value) => {
    setFormData((prev) => {
      const newFormData = JSON.parse(JSON.stringify(prev));
      let current = newFormData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newFormData;
    });
  };

  const handleProductCardChange = (field, value) => {
    const newProductCard = { ...formData.productCard, [field]: value };
    setFormData((prev) => ({ ...prev, productCard: newProductCard }));
  };

  const handleCategoryChange = (field, value) => {
    const newCategory = { ...formData.category, [field]: value };
    if (field === "type") {
      newCategory.subCollection = null;
      newCategory.college = null;
      newCategory.department = null;
      setSelectedFashionCollection(""); // Reset UI dropdown
    }
    setFormData((prev) => ({ ...prev, category: newCategory }));
  };

  // --- UPDATED: Handle the UI-only collection dropdown change
  const handleFashionCollectionChange = (value) => {
    setSelectedFashionCollection(value);
    // When collection changes, reset the sub-collection in the actual form data
    handleCategoryChange("subCollection", null);
  };

  const addItem = (path, defaultValue = "") => {
    const array = path.reduce((obj, key) => obj[key], formData) || [];
    handleNestedChange(path, [...array, defaultValue]);
  };

  const removeItem = (path, index) => {
    const array = path.reduce((obj, key) => obj[key], formData);
    handleNestedChange(
      path,
      array.filter((_, i) => i !== index)
    );
  };

  const addVariant = () => {
    // --- UPDATED: Simplified new variant, as price/features/specs are moved to color
    const newVariant = {
      name: "Regular",
      sizeChart: [],
      colors: [],
    };
    handleNestedChange(["variants"], [...formData.variants, newVariant]);
  };

  const addColor = (vIndex) => {
    // --- UPDATED: New color object now includes fields previously on the variant
    const newColor = {
      name: "New Color",
      price: 0,
      originalPrice: 0,
      images: [],
      stock: SIZES.map((s) => ({ size: s, quantity: 0 })),
      features: ["New Feature"],
      specifications: {
        Material: "Cotton",
        Weight: "180GSM",
        Fit: "Regular",
        Care: "Machine Wash",
      },
    };
    handleNestedChange(
      ["variants", vIndex, "colors"],
      [...formData.variants[vIndex].colors, newColor]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = JSON.parse(JSON.stringify(formData));

      // --- UPDATED: Data cleaning logic now iterates through colors for features/images
      payload.variants.forEach((variant) => {
        if (variant.sizeChart)
          variant.sizeChart = variant.sizeChart.filter(
            (url) => url && url.trim() !== ""
          );
        variant.colors.forEach((color) => {
          color.features = color.features.filter((f) => f && f.trim() !== "");
          color.stock = color.stock.filter((s) => s.quantity > 0);
          color.images = color.images.filter((img) => img && img.trim() !== "");
        });
      });
      [
        " _id",
        "createdAt",
        "updatedAt",
        "__v",
        "reviews",
        "rating",
        "numReviews",
      ].forEach((key) => delete payload[key]);

      await adminUpdateProduct(product._id, payload);
      toast({
        title: "Success",
        description: "Product updated successfully.",
        variant: "success",
      });
      onProductUpdated();
      onClose();
    } catch (err) {
      console.error("Update Product Error:", err);
      toast({
        title: "Error Updating",
        description: err.response?.data?.message || "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      <DialogContent className="sm:max-w-[950px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product: {formData.name}</DialogTitle>
          <DialogDescription>
            Update all product details, variants, and stock.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleNestedChange(["name"], e.target.value)}
                />
              </div>
              <div>
                <Label>Sort Priority</Label>
                <Input
                  type="number"
                  value={formData.sortPriority}
                  onChange={(e) =>
                    handleNestedChange(["sortPriority"], Number(e.target.value))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  handleNestedChange(["description"], e.target.value)
                }
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(c) => handleNestedChange(["isActive"], c)}
              />
              <Label htmlFor="isActive">Product Active</Label>
            </div>
          </div>
          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">Product Card Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  placeholder="e.g., Classic Black Tee"
                  value={formData.productCard.name}
                  onChange={(e) =>
                    handleProductCardChange("name", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Sort Priority</Label>
                <Input
                  type="number"
                  value={formData.productCard.sortPriority}
                  onChange={(e) =>
                    handleProductCardChange(
                      "sortPriority",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={formData.productCard.price}
                  onChange={(e) =>
                    handleProductCardChange("price", Number(e.target.value))
                  }
                />
              </div>
              <div>
                <Label>Original Price</Label>
                <Input
                  type="number"
                  value={formData.productCard.originalPrice}
                  onChange={(e) =>
                    handleProductCardChange(
                      "originalPrice",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Label>Image To display</Label>
              <Input
                className="flex-grow"
                value={formData.productCard.image}
                placeholder="https://..."
                onChange={(e) =>
                  handleProductCardChange("image", e.target.value)
                }
              />
              <img
                src={formData.productCard.image}
                alt="preview"
                className="w-12 h-12 object-cover rounded-md border"
                onError={(e) => (e.target.src = ERROR_IMG_PLACEHOLDER)}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="productCardOnSale"
                checked={formData.productCard.onSale}
                onCheckedChange={(c) => handleProductCardChange("onSale", c)}
              />
              <Label>On Sale</Label>
              <Switch
                id="productCardIsNew"
                checked={formData.productCard.isNew}
                onCheckedChange={(c) => handleProductCardChange("isNew", c)}
              />
              <Label>Is New</Label>
            </div>
          </div>

          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">Categorization</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select
                  value={formData.category.type || ""}
                  onValueChange={(v) => handleCategoryChange("type", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* --- UPDATED: Conditional rendering for Fashion Collection dropdown --- */}
              {formData.category.type === "Fashion" && (
                <div>
                  <Label>Collection</Label>
                  <Select
                    value={selectedFashionCollection}
                    onValueChange={handleFashionCollectionChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a collection" />
                    </SelectTrigger>
                    <SelectContent>
                      {FASHION_COLLECTIONS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {/* --- UPDATED: Condition now depends on the local UI state variable --- */}
              {selectedFashionCollection === "Anime Collection" && (
                <div>
                  <Label>Sub-Collection</Label>
                  <Select
                    value={formData.category.subCollection || ""}
                    onValueChange={(v) =>
                      handleCategoryChange("subCollection", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ANIME_SUB_COLLECTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {formData.category.type === "College Store" && (
                <>
                  <div>
                    <Label>College</Label>
                    <Select
                      value={formData.category.college || ""}
                      onValueChange={(v) => handleCategoryChange("college", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COLLEGE_NAMES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Select
                      value={formData.category.department || ""}
                      onValueChange={(v) =>
                        handleCategoryChange("department", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Variants</h3>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addVariant}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </div>
            {formData.variants.map((variant, vIndex) => (
              <div
                key={vIndex}
                className="p-4 border rounded-lg space-y-4 relative bg-muted/20"
              >
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => removeItem(["variants"], vIndex)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Variant Name</Label>
                    <Select
                      value={variant.name}
                      onValueChange={(v) =>
                        handleNestedChange(["variants", vIndex, "name"], v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VARIANT_NAMES.map((n) => (
                          <SelectItem key={n} value={n}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Size Chart URL</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        className="flex-grow"
                        placeholder="https://..."
                        value={variant.sizeChart?.[0] || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            ["variants", vIndex, "sizeChart"],
                            [e.target.value]
                          )
                        }
                      />
                      {variant.sizeChart?.[0] && (
                        <img
                          src={variant.sizeChart[0]}
                          alt="preview"
                          className="w-16 h-16 object-cover rounded-md border"
                          onError={(e) =>
                            (e.target.src = ERROR_IMG_PLACEHOLDER)
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
                {/* --- MOVED: Price and Original Price are no longer here --- */}

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Colors & Stock</h4>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addColor(vIndex)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Color
                    </Button>
                  </div>
                  {variant.colors.map((color, cIndex) => (
                    <div
                      key={cIndex}
                      className="p-3 border rounded-md bg-background relative space-y-3"
                    >
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() =>
                          removeItem(["variants", vIndex, "colors"], cIndex)
                        }
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label>Color Name</Label>
                          <Input
                            value={color.name}
                            onChange={(e) =>
                              handleNestedChange(
                                ["variants", vIndex, "colors", cIndex, "name"],
                                e.target.value
                              )
                            }
                          />
                        </div>
                        {/* --- UPDATED: Price inputs moved to the color level --- */}
                        <div>
                          <Label>Price</Label>
                          <Input
                            type="number"
                            value={color.price}
                            onChange={(e) =>
                              handleNestedChange(
                                ["variants", vIndex, "colors", cIndex, "price"],
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label>Original Price</Label>
                          <Input
                            type="number"
                            value={color.originalPrice}
                            onChange={(e) =>
                              handleNestedChange(
                                [
                                  "variants",
                                  vIndex,
                                  "colors",
                                  cIndex,
                                  "originalPrice",
                                ],
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* --- UPDATED: Features and Specs moved inside the color block --- */}
                      <div className="p-3 border rounded-md bg-muted/20 space-y-4">
                        <div>
                          <Label>Features</Label>
                          {color.features.map((feat, fIndex) => (
                            <div
                              key={fIndex}
                              className="flex items-center gap-2 mb-2"
                            >
                              <Input
                                value={feat}
                                onChange={(e) =>
                                  handleNestedChange(
                                    [
                                      "variants",
                                      vIndex,
                                      "colors",
                                      cIndex,
                                      "features",
                                      fIndex,
                                    ],
                                    e.target.value
                                  )
                                }
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  removeItem(
                                    [
                                      "variants",
                                      vIndex,
                                      "colors",
                                      cIndex,
                                      "features",
                                    ],
                                    fIndex
                                  )
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              addItem([
                                "variants",
                                vIndex,
                                "colors",
                                cIndex,
                                "features",
                              ])
                            }
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Feature
                          </Button>
                        </div>

                        <div>
                          <Label>Specifications</Label>
                          <div className="grid md:grid-cols-2 gap-2">
                            {Object.keys(color.specifications).map((key) => (
                              <div key={key}>
                                <Label className="text-xs font-normal">
                                  {key}
                                </Label>
                                <Input
                                  value={color.specifications[key]}
                                  onChange={(e) =>
                                    handleNestedChange(
                                      [
                                        "variants",
                                        vIndex,
                                        "colors",
                                        cIndex,
                                        "specifications",
                                        key,
                                      ],
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Stock Quantities</Label>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                          {color.stock.map(({ size, quantity }, sIndex) => (
                            <div key={size}>
                              <Label className="text-xs">{size}</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={quantity}
                                onChange={(e) =>
                                  handleNestedChange(
                                    [
                                      "variants",
                                      vIndex,
                                      "colors",
                                      cIndex,
                                      "stock",
                                      sIndex,
                                      "quantity",
                                    ],
                                    parseInt(e.target.value, 10) || 0
                                  )
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Images</Label>
                        {(color.images || []).map((img, iIndex) => (
                          <div
                            key={iIndex}
                            className="flex items-center gap-2 mb-2"
                          >
                            <Input
                              className="flex-grow"
                              value={img}
                              placeholder="https://..."
                              onChange={(e) =>
                                handleNestedChange(
                                  [
                                    "variants",
                                    vIndex,
                                    "colors",
                                    cIndex,
                                    "images",
                                    iIndex,
                                  ],
                                  e.target.value
                                )
                              }
                            />
                            <img
                              src={img}
                              alt="preview"
                              className="w-12 h-12 object-cover rounded-md border"
                              onError={(e) =>
                                (e.target.src = ERROR_IMG_PLACEHOLDER)
                              }
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                removeItem(
                                  [
                                    "variants",
                                    vIndex,
                                    "colors",
                                    cIndex,
                                    "images",
                                  ],
                                  iIndex
                                )
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            addItem([
                              "variants",
                              vIndex,
                              "colors",
                              cIndex,
                              "images",
                            ])
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Image URL
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">Display Settings</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isNew"
                  checked={formData.isNew}
                  onCheckedChange={(c) => handleNestedChange(["isNew"], c)}
                />
                <Label htmlFor="isNew">New Arrival</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="onSale"
                  checked={formData.onSale}
                  onCheckedChange={(c) => handleNestedChange(["onSale"], c)}
                />
                <Label htmlFor="onSale">On Sale</Label>
              </div>
              {/* --- UPDATED: Removed the 'forHomePage' switch as it's not in the new schema --- */}
            </div>
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
                Saving...
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
