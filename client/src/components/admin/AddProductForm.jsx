import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Image as ImageIcon, Loader2 } from "lucide-react";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    description: "",
    images: [],
    sizes: { S: false, M: false, L: false, XL: false, XXL: false },
    varietyOfProduct: {
      Regular: false,
      Oversized: false,
      Polo: false,
      Hoodie: false,
    },
    colors: { Black: false, White: false },
    forDepartment: false,
    departmentName: "",
    sizeChart: [
      "https://res.cloudinary.com/dfvxh7p8p/image/upload/v1755197834/dm2c0vwy9juwjrl8to5r.png",
    ],
    category: "",
    isNew: true,
    onSale: false,
    rating: 0,
    reviews: 0,
    features: ["Pure Fabric", "Stylish Design"],
    specifications: {
      Material: "100% Cotton",
      Weight: "180 GSM",
      Fit: "Round Neck, Regular Fit",
      Care: "Machine Washed",
    },
    forHomePage: false, // New field for home page display
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFileForSizeChart, setSelectedFileForSizeChart] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [uploadedImageUrlForSizeChart, setUploadedImageUrlForSizeChart] =
    useState([
      "https://res.cloudinary.com/dfvxh7p8p/image/upload/v1755197834/dm2c0vwy9juwjrl8to5r.png",
    ]); // Default size chart image URL

  // Combine image upload states for cleaner logic
  const [isUploading, setIsUploading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;

  // --- Handlers for regular form fields ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleCheckboxChange = (field, key, checked) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        [key]: checked,
      },
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  const handleFeatureChange = (index, value) => {
    setFormData((prevData) => {
      const newFeatures = [...prevData.features];
      newFeatures[index] = value;
      return { ...prevData, features: newFeatures };
    });
    setErrors((prevErrors) => ({ ...prevErrors, features: "" }));
  };

  const handleAddFeature = () => {
    setFormData((prevData) => ({
      ...prevData,
      features: [...prevData.features, ""],
    }));
  };

  const handleRemoveFeature = (index) => {
    setFormData((prevData) => {
      const newFeatures = prevData.features.filter((_, i) => i !== index);
      if (newFeatures.length === 0) {
        return { ...prevData, features: [""] };
      }
      return { ...prevData, features: newFeatures };
    });
  };

  const handleSpecificationChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      specifications: {
        ...prevData.specifications,
        [field]: value,
      },
    }));
  };

  // --- NEW: A reusable function to upload a single file ---
  const uploadSingleImage = async (file) => {
    if (!file) return null;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      console.error("Cloudinary credentials not set.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
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

  // --- NEW: Handlers for product images ---
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setUploadedImageUrls([]);
    setErrors((prevErrors) => ({ ...prevErrors, images: "" }));
  };

  const handleRemoveSelectedFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  // --- NEW: Handlers for size chart image ---
  const handleFileChangeForSizeChart = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFileForSizeChart(files);
    setUploadedImageUrlForSizeChart([
      "https://res.cloudinary.com/dfvxh7p8p/image/upload/v1755197834/dm2c0vwy9juwjrl8to5r.png",
    ]);
    setErrors((prevErrors) => ({ ...prevErrors, sizeChart: "" }));
  };

  const handleRemoveSelectedFileforSizeChart = (indexToRemove) => {
    setSelectedFileForSizeChart((prevFile) =>
      prevFile.filter((_, index) => index !== indexToRemove)
    );
  };

  // const validateForm = () => {
  //   let newErrors = {};
  //   if (!formData.name.trim()) newErrors.name = "Name is required.";
  //   if (!formData.price || formData.price <= 0)
  //     newErrors.price = "Price must be a positive number.";
  //   if (!formData.originalPrice || formData.originalPrice <= 0)
  //     newErrors.originalPrice = "Original price must be a positive number.";
  //   if (!formData.description.trim())
  //     newErrors.description = "Description is required.";
  //   if (!formData.category.trim()) newErrors.category = "Category is required.";

  //   if (selectedFiles.length === 0 && uploadedImageUrls.length === 0) {
  //     newErrors.images = "At least one product image is required.";
  //   }

  //   // Removed the following validation checks because the fields now have default values in the backend schema
  //   /*
  //   if (selectedFileForSizeChart.length === 0 && uploadedImageUrlForSizeChart.length === 0) {
  //     newErrors.sizeChart = "A size chart image is required.";
  //   }
  //   if (!formData.specifications.Material.trim()) newErrors.Material = "Material is required.";
  //   if (!formData.specifications.Weight.trim()) newErrors.Weight = "Weight is required.";
  //   if (!formData.specifications.Fit.trim()) newErrors.Fit = "Fit is required.";
  //   if (!formData.specifications.Care.trim()) newErrors.Care = "Care instructions are required.";
  //   */

  //   if (!Object.values(formData.sizes).some(Boolean)) {
  //     newErrors.sizes = "At least one size must be selected.";
  //   }
  //   if (!Object.values(formData.varietyOfProduct).some(Boolean)) {
  //     newErrors.varietyOfProduct = "At least one variety must be selected.";
  //   }
  //   if (!Object.values(formData.colors).some(Boolean)) {
  //     newErrors.colors = "At least one color must be selected.";
  //   }
  //   if (
  //     formData.features.length === 0 ||
  //     formData.features.every((f) => !f.trim())
  //   ) {
  //     newErrors.features = "At least one feature is required.";
  //   }

  //   if (formData.forDepartment && !formData.departmentName.trim()) {
  //     newErrors.departmentName = "Department name is required.";
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Price must be a positive number.";
    if (!formData.originalPrice || formData.originalPrice <= 0)
      newErrors.originalPrice = "Original price must be a positive number.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.category.trim()) newErrors.category = "Category is required.";
    if (selectedFiles.length === 0 && uploadedImageUrls.length === 0) {
      newErrors.images = "At least one product image is required.";
    }
    // Removed the following validation checks because the fields now have default values in the backend schema
    /*
    if (
      selectedFileForSizeChart.length === 0 &&
      uploadedImageUrlForSizeChart.length === 0
    ) {
      newErrors.sizeChart = "A size chart image is required.";
    }
    if (!formData.specifications.Material.trim())
      newErrors.Material = "Material is required.";
    if (!formData.specifications.Weight.trim())
      newErrors.Weight = "Weight is required.";
    if (!formData.specifications.Fit.trim()) newErrors.Fit = "Fit is required.";
    if (!formData.specifications.Care.trim())
      newErrors.Care = "Care instructions are required.";
    */

    if (!Object.values(formData.sizes).some(Boolean))
      newErrors.sizes = "At least one size must be selected.";
    if (!Object.values(formData.varietyOfProduct).some(Boolean))
      newErrors.varietyOfProduct = "At least one variety must be selected.";
    if (!Object.values(formData.colors).some(Boolean)) {
      newErrors.colors = "At least one color must be selected.";
    }
    // if (
    //   formData.features.length === 0 ||
    //   formData.features.every((f) => !f.trim())
    // ) {
    //   newErrors.features = "At least one feature is required.";
    // }

    if (formData.forDepartment && !formData.departmentName.trim()) {
      newErrors.departmentName = "Department name is required.";
    }
    setErrors(newErrors);
    console.log(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Form submission handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      console.log(validateForm);
      setIsLoading(false);
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and correct errors.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    let finalImageUrls = uploadedImageUrls;
    let finalSizeChartUrl = uploadedImageUrlForSizeChart;

    if (selectedFiles.length > 0 || selectedFileForSizeChart.length > 0) {
      setIsUploading(true);

      const imageUploadPromises = selectedFiles.map((file) =>
        uploadSingleImage(file)
      );
      const sizeChartUploadPromises = selectedFileForSizeChart.map((file) =>
        uploadSingleImage(file)
      );

      const [imageResults, sizeChartResults] = await Promise.all([
        Promise.all(imageUploadPromises),
        Promise.all(sizeChartUploadPromises),
      ]);

      setIsUploading(false);

      finalImageUrls = imageResults.filter((url) => url !== null);
      finalSizeChartUrl = sizeChartResults.filter((url) => url !== null);

      if (finalImageUrls.length === 0 && selectedFiles.length > 0) {
        toast({
          title: "Image Upload Failed",
          description: "Product images could not be uploaded.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Removed validation for size chart URL to align with backend changes
      /*
      if (
        finalSizeChartUrl.length === 0 &&
        selectedFileForSizeChart.length > 0
      ) {
        toast({
          title: "Image Upload Failed",
          description: "Size chart image could not be uploaded.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      */

      setUploadedImageUrls(finalImageUrls);
      setUploadedImageUrlForSizeChart(finalSizeChartUrl);
    }

    try {
      const dataToSend = {
        ...formData,
        images: finalImageUrls,
        sizeChart: formData.sizeChart, // change this to finalSizeChartUrl for uploading custom size chart images and also change the default value in the formData state
        features: formData.features.filter((f) => f.trim()),
      };

      const response = await axios.post(
        `${API_BASE_URL}/admin/products`,
        dataToSend
      );

      toast({
        title: "Product Added!",
        description: response.data.message,
        variant: "success",
      });
      setFormData({
        name: "",
        price: "",
        originalPrice: "",
        description: "",
        images: [],
        sizes: { S: false, M: false, L: false, XL: false, XXL: false },
        varietyOfProduct: {
          Regular: false,
          Oversized: false,
          Polo: false,
          Hoodie: false,
        },
        colors: { Black: false, White: false },
        forDepartment: false,
        departmentName: "",
        sizeChart: [
          "https://res.cloudinary.com/dfvxh7p8p/image/upload/v1755197834/dm2c0vwy9juwjrl8to5r.png",
        ],
        category: "",
        isNew: true,
        onSale: false,
        rating: 0,
        reviews: 0,
        features: ["Pure Fabric", "Stylish Design"],
        specifications: {
          Material: "100% Cotton",
          Weight: "180 GSM",
          Fit: "Round Neck, Regular Fit",
          Care: "Machine Washed",
        },
        forHomePage: false, // Reset the new field
      });
      setSelectedFiles([]);
      setSelectedFileForSizeChart([]);
      setUploadedImageUrls([]);
      setUploadedImageUrlForSizeChart([
        "https://res.cloudinary.com/dfvxh7p8p/image/upload/v1755197834/dm2c0vwy9juwjrl8to5r.png",
      ]);
    } catch (err) {
      console.error("Error adding product:", err);
      toast({
        title: "Failed to Add Product",
        description:
          err.response?.data?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card/50 border-border/50 p-4 sm:p-6 md:p-8">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-bold gradient-text">
          Add New Product
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground/80">
              Basic Information
            </h3>
            <div>
              <label htmlFor="name">Name *</label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-secondary/50"
                placeholder="Product Name"
              />
              {errors.name && <p>{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="category">Category *</label>
              <Input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="bg-secondary/50"
                placeholder="e.g., Hoodies, T-Shirts"
              />
              {errors.category && <p>{errors.category}</p>}
            </div>
            <div>
              <label htmlFor="description">Description *</label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="bg-secondary/50"
                placeholder="Detailed product description"
                rows={4}
              />
              {errors.description && <p>{errors.description}</p>}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground/80">
              Pricing
            </h3>
            <div>
              <label htmlFor="price">Price *</label>
              <Input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="bg-secondary/50"
                placeholder="Current price"
                min="0"
                step="0.01"
              />
              {errors.price && <p>{errors.price}</p>}
            </div>
            <div>
              <label htmlFor="originalPrice">Original Price *</label>
              <Input
                type="number"
                id="originalPrice"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                className="bg-secondary/50"
                placeholder="Original price (for discounts)"
                min="0"
                step="0.01"
              />
              {errors.originalPrice && <p>{errors.originalPrice}</p>}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground/80">
              Product Images *
            </h3>
            <div>
              <label htmlFor="imageUpload">Upload Images</label>
              <Input
                type="file"
                id="imageUpload"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="bg-secondary/50 file:text-foreground"
                disabled={isUploading}
              />
              {errors.images && <p>{errors.images}</p>}
            </div>

            {isUploading && selectedFiles.length > 0 && (
              <div className="flex items-center text-accent">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Uploading images...</span>
              </div>
            )}

            {selectedFiles.length > 0 && (
              <div>
                <p>Selected Images (Local Preview):</p>
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 rounded-md overflow-hidden border border-border/50 flex items-center justify-center bg-card"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${file.name}`}
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
              </div>
            )}
            {uploadedImageUrls.length > 0 && (
              <div>
                <p>Successfully Uploaded Images:</p>
                <div className="flex flex-wrap gap-2">
                  {uploadedImageUrls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-24 h-24 rounded-md overflow-hidden border border-accent/50 flex items-center justify-center bg-primary/20 text-xs text-accent"
                    >
                      <ImageIcon className="h-8 w-8 absolute z-0 text-accent/50" />
                      <img
                        src={url}
                        alt={`Cloudinary ${index}`}
                        className="w-full h-full object-cover opacity-70"
                      />
                      <span className="absolute bottom-0 bg-background/80 w-full text-center py-0.5 text-ellipsis overflow-hidden whitespace-nowrap px-1">{`Img ${
                        index + 1
                      }`}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground/80">
              Visuals & Variants
            </h3>
            <div>
              <label className="block text-sm font-medium mb-2">
                Available Sizes *
              </label>
              <div className="grid grid-cols-3 sm:flex flex-wrap gap-2">
                {Object.keys(formData.sizes).map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={formData.sizes[size]}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("sizes", size, checked)
                      }
                    />
                    <label htmlFor={`size-${size}`}>{size}</label>
                  </div>
                ))}
              </div>
              {errors.sizes && <p>{errors.sizes}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Varieties *
              </label>
              <div className="grid grid-cols-2 sm:flex flex-wrap gap-2">
                {Object.keys(formData.varietyOfProduct).map((variety) => (
                  <div key={variety} className="flex items-center space-x-2">
                    <Checkbox
                      id={`variety-${variety}`}
                      checked={formData.varietyOfProduct[variety]}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "varietyOfProduct",
                          variety,
                          checked
                        )
                      }
                    />
                    <label htmlFor={`variety-${variety}`}>{variety}</label>
                  </div>
                ))}
              </div>
              {errors.varietyOfProduct && <p>{errors.varietyOfProduct}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Colors *</label>
              <div className="grid grid-cols-2 sm:flex flex-wrap gap-2">
                {Object.keys(formData.colors).map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={formData.colors[color]}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("colors", color, checked)
                      }
                    />
                    <label htmlFor={`color-${color}`}>{color}</label>
                  </div>
                ))}
              </div>
              {errors.colors && <p>{errors.colors}</p>}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground/80">
              Status & Ratings
            </h3>
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isNew"
                  name="isNew"
                  checked={formData.isNew}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isNew: checked })
                  }
                />
                <label htmlFor="isNew">New Arrival</label>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="onSale"
                  name="onSale"
                  checked={formData.onSale}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, onSale: checked })
                  }
                />
                <label htmlFor="onSale">On Sale</label>
              </div>
            </div>
            {/* NEW FIELD: forHomePage */}
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="forHomePage"
                  name="forHomePage"
                  checked={formData.forHomePage}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, forHomePage: checked })
                  }
                />
                <label htmlFor="forHomePage">Display on Home Page</label>
              </div>
            </div>
            <div>
              <label htmlFor="rating">Rating</label>
              <Input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
              />
              {errors.rating && <p>{errors.rating}</p>}
            </div>
            <div>
              <label htmlFor="reviews">Number of Reviews</label>
              <Input
                type="number"
                id="reviews"
                name="reviews"
                value={formData.reviews}
                onChange={handleChange}
                min="0"
                step="1"
              />
              {errors.reviews && <p>{errors.reviews}</p>}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground/80">
              Features *
            </h3>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 bg-secondary/50"
                  placeholder={`Feature ${index + 1}`}
                />
                {formData.features.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFeature(index)}
                  >
                    <X />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddFeature}
              className="w-full sm:w-auto"
            >
              <Plus /> Add Feature
            </Button>
            {errors.features && <p>{errors.features}</p>}
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground/80">
              Specifications
            </h3>
            <div>
              <label htmlFor="specMaterial">Material</label>
              <Input
                type="text"
                id="specMaterial"
                name="specifications.Material"
                value={formData.specifications.Material}
                onChange={(e) =>
                  handleSpecificationChange("Material", e.target.value)
                }
                className="bg-secondary/50"
                placeholder="e.g., 100% Cotton"
              />
              {errors.Material && <p>{errors.Material}</p>}
            </div>
            <div>
              <label htmlFor="specWeight">Weight</label>
              <Input
                type="text"
                id="specWeight"
                name="specifications.Weight"
                value={formData.specifications.Weight}
                onChange={(e) =>
                  handleSpecificationChange("Weight", e.target.value)
                }
                className="bg-secondary/50"
                placeholder="e.g., 300 GSM"
              />
              {errors.Weight && <p>{errors.Weight}</p>}
            </div>
            <div>
              <label htmlFor="specFit">Fit</label>
              <Input
                type="text"
                id="specFit"
                name="specifications.Fit"
                value={formData.specifications.Fit}
                onChange={(e) =>
                  handleSpecificationChange("Fit", e.target.value)
                }
                className="bg-secondary/50"
                placeholder="e.g., Oversized, Regular"
              />
              {errors.Fit && <p>{errors.Fit}</p>}
            </div>
            <div>
              <label htmlFor="specCare">Care Instructions</label>
              <Input
                type="text"
                id="specCare"
                name="specifications.Care"
                value={formData.specifications.Care}
                onChange={(e) =>
                  handleSpecificationChange("Care", e.target.value)
                }
                className="bg-secondary/50"
                placeholder="e.g., Machine wash cold"
              />
              {errors.Care && <p>{errors.Care}</p>}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground/80">
              Department & Size Chart
            </h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="forDepartment"
                name="forDepartment"
                checked={formData.forDepartment}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, forDepartment: checked })
                }
              />
              <label htmlFor="forDepartment">For Department Store</label>
            </div>
            {formData.forDepartment && (
              <>
                <div>
                  <label htmlFor="departmentName">Department Name *</label>
                  <Input
                    type="text"
                    id="departmentName"
                    name="departmentName"
                    value={formData.departmentName}
                    onChange={handleChange}
                    className="bg-secondary/50"
                    placeholder="e.g., Men's Clothing"
                  />
                  {errors.departmentName && <p>{errors.departmentName}</p>}
                </div>
              </>
            )}
            <div>
              <label
                htmlFor="sizeChartUpload"
                className="block text-sm font-medium mb-2"
              >
                Size Chart Image
              </label>
              {/* <Input
                type="file"
                id="sizeChartUpload"
                accept="image/*"
                onChange={handleFileChangeForSizeChart}
                className="bg-secondary/50 file:text-foreground file:bg-primary file:rounded-md file:border-0 file:px-3 file:py-1.5"
                disabled={isUploading}
              /> */}
              {errors.sizeChart && <p>{errors.sizeChart}</p>}
            </div>
            {isUploading && selectedFileForSizeChart.length > 0 && (
              <div className="flex items-center text-accent">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Uploading images...</span>
              </div>
            )}
            {selectedFileForSizeChart.length > 0 && (
              <div className="mt-2 relative w-32 h-32 rounded-md overflow-hidden border border-border/50">
                <img
                  src={URL.createObjectURL(selectedFileForSizeChart[0])}
                  alt="Size Chart Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/70 text-foreground/80 hover:bg-background"
                  onClick={() => handleRemoveSelectedFileforSizeChart(0)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {uploadedImageUrlForSizeChart.length > 0 && (
              <div className="mt-4 relative w-32 h-32 rounded-md overflow-hidden border border-accent/50">
                <a
                  href={uploadedImageUrlForSizeChart[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={uploadedImageUrlForSizeChart[0]}
                    alt="Uploaded Size Chart"
                    className="w-full h-full object-cover"
                  />
                </a>
              </div>
            )}
          </div>
          <Button
            type="submit"
            variant="cta"
            size="lg"
            className="w-full"
            disabled={isLoading || isUploading}
          >
            {isLoading || isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isUploading ? "Uploading Images..." : "Adding Product..."}
              </>
            ) : (
              "Add Product"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
