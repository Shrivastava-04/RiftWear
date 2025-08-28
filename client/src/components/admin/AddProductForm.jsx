// import React, { useState } from "react";
// import axios from "axios";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from "@/hooks/use-toast";
// import { Label } from "@/components/ui/label";
// import { Plus, X, Image as ImageIcon, Loader2 } from "lucide-react";

// const AddProductForm = () => {
//   const defaultFeatures = ["Pure Fabric", "Stylish Design"];
//   const defaultSpecs = {
//     Material: "100% Cotton",
//     Weight: "180 GSM",
//     Fit: "Round Neck, Regular Fit",
//     Care: "Machine Washed",
//   };
//   const defaultSizeChartUrl = [
//     "https://res.cloudinary.com/dfvxh7p8p/image/upload/v1755700423/i7af6otb7qaksvobk4up.png",
//   ];

//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     originalPrice: "",
//     description: "",
//     images: [],
//     sizes: { S: false, M: false, L: false, XL: false, XXL: false },
//     varietyOfProduct: {
//       Regular: false,
//       Oversized: false,
//       Polo: false,
//       Hoodie: false,
//     },
//     colors: [],
//     forDepartment: false,
//     departmentName: "",
//     sizeChart: [],
//     category: "",
//     isNew: true,
//     onSale: false,
//     rating: 0,
//     reviews: 0,
//     features: [...defaultFeatures],
//     specifications: { ...defaultSpecs },
//     forHomePage: false,
//   });

//   const [mainProductImages, setMainProductImages] = useState([]);
//   const [selectedFileForSizeChart, setSelectedFileForSizeChart] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const { toast } = useToast();
//   const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
//   const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
//   const CLOUDINARY_UPLOAD_PRESET = import.meta.env
//     .VITE_CLOUDINARY_UPLOAD_PRESET;

//   const uploadSingleImage = async (file) => {
//     if (!file) return null;
//     if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
//       console.error("Cloudinary credentials not set.");
//       return null;
//     }
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );
//       if (response.ok) {
//         const data = await response.json();
//         return data.secure_url;
//       }
//       return null;
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       return null;
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
//   };

//   const handleCheckboxChange = (field, key, checked) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [field]: {
//         ...prevData[field],
//         [key]: checked,
//       },
//     }));
//     setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
//   };

//   const handleFeatureChange = (index, value) => {
//     setFormData((prevData) => {
//       const newFeatures = [...prevData.features];
//       newFeatures[index] = value;
//       return { ...prevData, features: newFeatures };
//     });
//   };
//   const handleAddFeature = () => {
//     setFormData((prevData) => ({
//       ...prevData,
//       features: [...prevData.features, ""],
//     }));
//   };
//   const handleRemoveFeature = (index) => {
//     setFormData((prevData) => {
//       const newFeatures = prevData.features.filter((_, i) => i !== index);
//       return { ...prevData, features: newFeatures };
//     });
//   };

//   const handleSpecificationChange = (field, value) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       specifications: {
//         ...prevData.specifications,
//         [field]: value,
//       },
//     }));
//   };

//   const handleMainFileChange = (e) => {
//     setMainProductImages(Array.from(e.target.files));
//     setErrors((prevErrors) => ({ ...prevErrors, images: "" }));
//   };
//   const handleRemoveMainFile = (indexToRemove) => {
//     setMainProductImages((prevFiles) =>
//       prevFiles.filter((_, index) => index !== indexToRemove)
//     );
//   };

//   const handleFileChangeForSizeChart = (e) => {
//     setSelectedFileForSizeChart(Array.from(e.target.files));
//     setErrors((prevErrors) => ({ ...prevErrors, sizeChart: "" }));
//   };
//   const handleRemoveSelectedFileforSizeChart = () => {
//     setSelectedFileForSizeChart([]);
//   };

//   const handleColorChange = (index, value) => {
//     const newColors = [...formData.colors];
//     newColors[index] = { ...newColors[index], name: value };
//     setFormData({ ...formData, colors: newColors });
//     setErrors((prevErrors) => ({ ...prevErrors, colors: "" }));
//   };

//   const handleColorImageChange = (colorIndex, files) => {
//     const newColors = [...formData.colors];
//     newColors[colorIndex] = {
//       ...newColors[colorIndex],
//       selectedFiles: Array.from(files),
//     };
//     setFormData({ ...formData, colors: newColors });
//   };

//   const handleRemoveColorImage = (colorIndex, imageIndex) => {
//     const newColors = [...formData.colors];
//     newColors[colorIndex].selectedFiles.splice(imageIndex, 1);
//     setFormData({ ...formData, colors: newColors });
//   };

//   const handleAddColor = () => {
//     setFormData((prevData) => ({
//       ...prevData,
//       colors: [
//         ...prevData.colors,
//         { name: "", selectedFiles: [], uploadedUrls: [] },
//       ],
//     }));
//   };

//   const handleRemoveColor = (indexToRemove) => {
//     setFormData((prevData) => {
//       const newColors = prevData.colors.filter(
//         (_, index) => index !== indexToRemove
//       );
//       return { ...prevData, colors: newColors };
//     });
//   };

//   const validateForm = () => {
//     let newErrors = {};
//     if (!formData.name.trim()) newErrors.name = "Name is required.";
//     if (!formData.price || formData.price <= 0)
//       newErrors.price = "Price must be a positive number.";
//     if (!formData.description.trim())
//       newErrors.description = "Description is required.";
//     if (mainProductImages.length === 0)
//       newErrors.images = "At least one product image is required.";
//     if (!Object.values(formData.sizes).some(Boolean))
//       newErrors.sizes = "At least one size must be selected.";
//     if (!Object.values(formData.varietyOfProduct).some(Boolean))
//       newErrors.varietyOfProduct = "At least one variety must be selected.";
//     if (formData.colors.length === 0) {
//       newErrors.colors = "At least one color variant is required.";
//     } else {
//       const hasInvalidColor = formData.colors.some(
//         (color) =>
//           !color.name.trim() ||
//           !color.selectedFiles ||
//           color.selectedFiles.length === 0
//       );
//       if (hasInvalidColor) {
//         newErrors.colors =
//           "All color variants must have a name and at least one image.";
//       }
//     }
//     if (formData.forDepartment && !formData.departmentName.trim()) {
//       newErrors.departmentName = "Department name is required.";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     if (!validateForm()) {
//       setIsLoading(false);
//       toast({
//         title: "Validation Error",
//         description: "Please fill in all required fields and correct errors.",
//         variant: "destructive",
//         duration: 5000,
//       });
//       return;
//     }

//     try {
//       setIsUploading(true);

//       const mainImageUrls = await Promise.all(
//         mainProductImages.map((file) => uploadSingleImage(file))
//       ).then((urls) => urls.filter((url) => url !== null));

//       const sizeChartUrls =
//         selectedFileForSizeChart.length > 0
//           ? await Promise.all(
//               selectedFileForSizeChart.map((file) => uploadSingleImage(file))
//             ).then((urls) => urls.filter((url) => url !== null))
//           : [...defaultSizeChartUrl];

//       const colorUploadPromises = formData.colors.map(async (color) => {
//         const uploadedColorUrls = await Promise.all(
//           color.selectedFiles.map((file) => uploadSingleImage(file))
//         ).then((urls) => urls.filter((url) => url !== null));
//         return {
//           name: color.name,
//           images: uploadedColorUrls,
//         };
//       });
//       const finalColorData = await Promise.all(colorUploadPromises);

//       setIsUploading(false);

//       if (mainImageUrls.length === 0) {
//         toast({
//           title: "Image Upload Failed",
//           description: "Main product images could not be uploaded.",
//           variant: "destructive",
//         });
//         setIsLoading(false);
//         return;
//       }

//       const dataToSend = {
//         ...formData,
//         images: mainImageUrls,
//         sizeChart: sizeChartUrls,
//         colors: finalColorData,
//         features: formData.features.filter((f) => f.trim()),
//         specifications: formData.specifications,
//       };

//       const response = await axios.post(
//         `${API_BASE_URL}/admin/products`,
//         dataToSend
//       );

//       toast({
//         title: "Product Added!",
//         description: response.data.message,
//         variant: "success",
//       });

//       setFormData({
//         name: "",
//         price: "",
//         originalPrice: "",
//         description: "",
//         images: [],
//         sizes: { S: false, M: false, L: false, XL: false, XXL: false },
//         varietyOfProduct: {
//           Regular: false,
//           Oversized: false,
//           Polo: false,
//           Hoodie: false,
//         },
//         colors: [],
//         forDepartment: false,
//         departmentName: "",
//         sizeChart: [],
//         category: "",
//         isNew: true,
//         onSale: false,
//         rating: 0,
//         reviews: 0,
//         features: [...defaultFeatures],
//         specifications: { ...defaultSpecs },
//         forHomePage: false,
//       });
//       setMainProductImages([]);
//       setSelectedFileForSizeChart([]);
//       setErrors({});
//     } catch (err) {
//       console.error("Error adding product:", err);
//       toast({
//         title: "Failed to Add Product",
//         description:
//           err.response?.data?.message || "An unexpected error occurred.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//       setIsUploading(false);
//     }
//   };

//   return (
//     <Card className="bg-card/50 border-border/50 p-4 sm:p-6 md:p-8">
//       <CardHeader>
//         <CardTitle className="text-2xl md:text-3xl font-bold gradient-text">
//           Add New Product
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold text-foreground/80">
//               Basic Information
//             </h3>
//             <div>
//               <label htmlFor="name">Name *</label>
//               <Input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="bg-secondary/50"
//                 placeholder="Product Name"
//               />
//               {errors.name && (
//                 <p className="text-red-500 text-sm mt-1">{errors.name}</p>
//               )}
//             </div>
//             <div>
//               <label htmlFor="category">Category *</label>
//               <Input
//                 type="text"
//                 id="category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="bg-secondary/50"
//                 placeholder="e.g., Hoodies, T-Shirts"
//               />
//               {errors.category && (
//                 <p className="text-red-500 text-sm mt-1">{errors.category}</p>
//               )}
//             </div>
//             <div>
//               <label htmlFor="description">Description *</label>
//               <Textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="bg-secondary/50"
//                 placeholder="Detailed product description"
//                 rows={4}
//               />
//               {errors.description && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.description}
//                 </p>
//               )}
//             </div>
//           </div>
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold text-foreground/80">
//               Pricing
//             </h3>
//             <div>
//               <label htmlFor="price">Price *</label>
//               <Input
//                 type="number"
//                 id="price"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 className="bg-secondary/50"
//                 placeholder="Current price"
//                 min="0"
//                 step="0.01"
//               />
//               {errors.price && (
//                 <p className="text-red-500 text-sm mt-1">{errors.price}</p>
//               )}
//             </div>
//             <div>
//               <label htmlFor="originalPrice">Original Price *</label>
//               <Input
//                 type="number"
//                 id="originalPrice"
//                 name="originalPrice"
//                 value={formData.originalPrice}
//                 onChange={handleChange}
//                 className="bg-secondary/50"
//                 placeholder="Original price (for discounts)"
//                 min="0"
//                 step="0.01"
//               />
//               {errors.originalPrice && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.originalPrice}
//                 </p>
//               )}
//             </div>
//           </div>
//           {/* Main Product Images */}
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold text-foreground/80">
//               Main Product Images *
//             </h3>
//             <div>
//               <label htmlFor="imageUpload">Upload Images</label>
//               <Input
//                 type="file"
//                 id="imageUpload"
//                 multiple
//                 accept="image/*"
//                 onChange={handleMainFileChange}
//                 className="bg-secondary/50 file:text-foreground"
//                 disabled={isUploading}
//               />
//               {errors.images && (
//                 <p className="text-red-500 text-sm mt-1">{errors.images}</p>
//               )}
//             </div>
//             {isUploading && mainProductImages.length > 0 && (
//               <div className="flex items-center text-accent">
//                 <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                 <span>Uploading main images...</span>
//               </div>
//             )}
//             {mainProductImages.length > 0 && (
//               <div>
//                 <p>Selected Images (Local Preview):</p>
//                 <div className="flex flex-wrap gap-2">
//                   {mainProductImages.map((file, index) => (
//                     <div
//                       key={index}
//                       className="relative w-24 h-24 rounded-md overflow-hidden border border-border/50 flex items-center justify-center bg-card"
//                     >
//                       <img
//                         src={URL.createObjectURL(file)}
//                         alt={`Preview ${file.name}`}
//                         className="w-full h-full object-cover"
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/70 text-foreground/80 hover:bg-background"
//                         onClick={() => handleRemoveMainFile(index)}
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//           {/* --- */}
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold text-foreground/80">
//               Visuals & Variants
//             </h3>
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Available Sizes *
//               </label>
//               <div className="grid grid-cols-3 sm:flex flex-wrap gap-2">
//                 {Object.keys(formData.sizes).map((size) => (
//                   <div key={size} className="flex items-center space-x-2">
//                     <Checkbox
//                       id={`size-${size}`}
//                       checked={formData.sizes[size]}
//                       onCheckedChange={(checked) =>
//                         handleCheckboxChange("sizes", size, checked)
//                       }
//                     />
//                     <label htmlFor={`size-${size}`}>{size}</label>
//                   </div>
//                 ))}
//               </div>
//               {errors.sizes && (
//                 <p className="text-red-500 text-sm mt-1">{errors.sizes}</p>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Product Varieties *
//               </label>
//               <div className="grid grid-cols-2 sm:flex flex-wrap gap-2">
//                 {Object.keys(formData.varietyOfProduct).map((variety) => (
//                   <div key={variety} className="flex items-center space-x-2">
//                     <Checkbox
//                       id={`variety-${variety}`}
//                       checked={formData.varietyOfProduct[variety]}
//                       onCheckedChange={(checked) =>
//                         handleCheckboxChange(
//                           "varietyOfProduct",
//                           variety,
//                           checked
//                         )
//                       }
//                     />
//                     <label htmlFor={`variety-${variety}`}>{variety}</label>
//                   </div>
//                 ))}
//               </div>
//               {errors.varietyOfProduct && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.varietyOfProduct}
//                 </p>
//               )}
//             </div>
//             {/* Color Variants Section */}
//             <div className="space-y-4">
//               <label className="block text-sm font-medium">
//                 Color Variants *
//               </label>
//               {formData.colors.map((color, colorIndex) => (
//                 <div
//                   key={colorIndex}
//                   className="p-4 border rounded-lg bg-card/40 relative"
//                 >
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     className="absolute top-1 right-1 h-6 w-6 rounded-full"
//                     onClick={() => handleRemoveColor(colorIndex)}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                   <div className="space-y-2">
//                     <Label htmlFor={`color-name-${colorIndex}`}>
//                       Color Name
//                     </Label>
//                     <Input
//                       type="text"
//                       id={`color-name-${colorIndex}`}
//                       value={color.name}
//                       onChange={(e) =>
//                         handleColorChange(colorIndex, e.target.value)
//                       }
//                       placeholder="e.g., Black, White"
//                       className="bg-secondary/50"
//                     />
//                     <Label htmlFor={`color-images-${colorIndex}`}>
//                       Color Images
//                     </Label>
//                     <Input
//                       type="file"
//                       id={`color-images-${colorIndex}`}
//                       multiple
//                       accept="image/*"
//                       onChange={(e) =>
//                         handleColorImageChange(colorIndex, e.target.files)
//                       }
//                       className="bg-secondary/50 file:text-foreground"
//                     />
//                     {isUploading && color.selectedFiles.length > 0 && (
//                       <div className="flex items-center text-accent">
//                         <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                         <span>Uploading {color.name} images...</span>
//                       </div>
//                     )}
//                     {color.selectedFiles.length > 0 && (
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {color.selectedFiles.map((file, fileIndex) => (
//                           <div
//                             key={fileIndex}
//                             className="relative w-24 h-24 rounded-md overflow-hidden border"
//                           >
//                             <img
//                               src={URL.createObjectURL(file)}
//                               alt={`Color Preview ${fileIndex + 1}`}
//                               className="w-full h-full object-cover"
//                             />
//                             {/* You could add a button to remove a single image here if needed */}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handleAddColor}
//                 className="w-full sm:w-auto"
//               >
//                 <Plus /> Add Color
//               </Button>
//               {errors.colors && (
//                 <p className="text-red-500 text-sm mt-1">{errors.colors}</p>
//               )}
//             </div>
//           </div>
//           {/* --- */}
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold text-foreground/80">
//               Status & Ratings
//             </h3>
//             <div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="isNew"
//                   name="isNew"
//                   checked={formData.isNew}
//                   onCheckedChange={(checked) =>
//                     setFormData({ ...formData, isNew: checked })
//                   }
//                 />
//                 <label htmlFor="isNew">New Arrival</label>
//               </div>
//             </div>
//             <div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="onSale"
//                   name="onSale"
//                   checked={formData.onSale}
//                   onCheckedChange={(checked) =>
//                     setFormData({ ...formData, onSale: checked })
//                   }
//                 />
//                 <label htmlFor="onSale">On Sale</label>
//               </div>
//             </div>
//             <div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="forHomePage"
//                   name="forHomePage"
//                   checked={formData.forHomePage}
//                   onCheckedChange={(checked) =>
//                     setFormData({ ...formData, forHomePage: checked })
//                   }
//                 />
//                 <label htmlFor="forHomePage">Display on Home Page</label>
//               </div>
//             </div>
//             <div>
//               <label htmlFor="rating">Rating</label>
//               <Input
//                 type="number"
//                 id="rating"
//                 name="rating"
//                 value={formData.rating}
//                 onChange={handleChange}
//                 min="0"
//                 max="5"
//                 step="0.1"
//               />
//               {errors.rating && (
//                 <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
//               )}
//             </div>
//             <div>
//               <label htmlFor="reviews">Number of Reviews</label>
//               <Input
//                 type="number"
//                 id="reviews"
//                 name="reviews"
//                 value={formData.reviews}
//                 onChange={handleChange}
//                 min="0"
//                 step="1"
//               />
//               {errors.reviews && (
//                 <p className="text-red-500 text-sm mt-1">{errors.reviews}</p>
//               )}
//             </div>
//           </div>
//           {/* --- */}
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold text-foreground/80">
//               Features
//             </h3>
//             <p className="text-sm text-muted-foreground">
//               Default values will be used if left empty.
//             </p>
//             {formData.features.map((feature, index) => (
//               <div key={index} className="flex items-center space-x-2 mb-2">
//                 <Input
//                   type="text"
//                   value={feature}
//                   onChange={(e) => handleFeatureChange(index, e.target.value)}
//                   className="flex-1 bg-secondary/50"
//                   placeholder={`Feature ${index + 1}`}
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => handleRemoveFeature(index)}
//                 >
//                   <X />
//                 </Button>
//               </div>
//             ))}
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleAddFeature}
//               className="w-full sm:w-auto"
//             >
//               <Plus /> Add Feature
//             </Button>
//             {errors.features && (
//               <p className="text-red-500 text-sm mt-1">{errors.features}</p>
//             )}
//           </div>
//           {/* --- */}
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold text-foreground/80">
//               Specifications
//             </h3>
//             <p className="text-sm text-muted-foreground">
//               Default values will be used if left empty.
//             </p>
//             <div>
//               <label htmlFor="specMaterial">Material</label>
//               <Input
//                 type="text"
//                 id="specMaterial"
//                 name="specifications.Material"
//                 value={formData.specifications.Material}
//                 onChange={(e) =>
//                   handleSpecificationChange("Material", e.target.value)
//                 }
//                 className="bg-secondary/50"
//                 placeholder="e.g., 100% Cotton"
//               />
//               {errors.Material && (
//                 <p className="text-red-500 text-sm mt-1">{errors.Material}</p>
//               )}
//             </div>
//             <div>
//               <label htmlFor="specWeight">Weight</label>
//               <Input
//                 type="text"
//                 id="specWeight"
//                 name="specifications.Weight"
//                 value={formData.specifications.Weight}
//                 onChange={(e) =>
//                   handleSpecificationChange("Weight", e.target.value)
//                 }
//                 className="bg-secondary/50"
//                 placeholder="e.g., 300 GSM"
//               />
//               {errors.Weight && (
//                 <p className="text-red-500 text-sm mt-1">{errors.Weight}</p>
//               )}
//             </div>
//             <div>
//               <label htmlFor="specFit">Fit</label>
//               <Input
//                 type="text"
//                 id="specFit"
//                 name="specifications.Fit"
//                 value={formData.specifications.Fit}
//                 onChange={(e) =>
//                   handleSpecificationChange("Fit", e.target.value)
//                 }
//                 className="bg-secondary/50"
//                 placeholder="e.g., Oversized, Regular"
//               />
//               {errors.Fit && (
//                 <p className="text-red-500 text-sm mt-1">{errors.Fit}</p>
//               )}
//             </div>
//             <div>
//               <label htmlFor="specCare">Care Instructions</label>
//               <Input
//                 type="text"
//                 id="specCare"
//                 name="specifications.Care"
//                 value={formData.specifications.Care}
//                 onChange={(e) =>
//                   handleSpecificationChange("Care", e.target.value)
//                 }
//                 className="bg-secondary/50"
//                 placeholder="e.g., Machine wash cold"
//               />
//               {errors.Care && (
//                 <p className="text-red-500 text-sm mt-1">{errors.Care}</p>
//               )}
//             </div>
//           </div>
//           {/* --- */}
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold text-foreground/80">
//               Department & Size Chart
//             </h3>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="forDepartment"
//                 name="forDepartment"
//                 checked={formData.forDepartment}
//                 onCheckedChange={(checked) =>
//                   setFormData({ ...formData, forDepartment: checked })
//                 }
//               />
//               <label htmlFor="forDepartment">For Department Store</label>
//             </div>
//             {formData.forDepartment && (
//               <>
//                 <div>
//                   <label htmlFor="departmentName">Department Name *</label>
//                   <Input
//                     type="text"
//                     id="departmentName"
//                     name="departmentName"
//                     value={formData.departmentName}
//                     onChange={handleChange}
//                     className="bg-secondary/50"
//                     placeholder="e.g., Men's Clothing"
//                   />
//                   {errors.departmentName && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.departmentName}
//                     </p>
//                   )}
//                 </div>
//               </>
//             )}
//             <div>
//               <label
//                 htmlFor="sizeChartUpload"
//                 className="block text-sm font-medium mb-2"
//               >
//                 Size Chart Image
//               </label>
//               <p className="text-sm text-muted-foreground">
//                 <a
//                   href={defaultSizeChartUrl[0]}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="underline"
//                 >
//                   Default size chart
//                 </a>{" "}
//                 will be used if you don't upload a new one.
//               </p>
//               <Input
//                 type="file"
//                 id="sizeChartUpload"
//                 accept="image/*"
//                 onChange={handleFileChangeForSizeChart}
//                 className="bg-secondary/50 file:text-foreground file:bg-primary file:rounded-md file:border-0 file:px-3 file:py-1.5"
//                 disabled={isUploading}
//               />
//               {errors.sizeChart && (
//                 <p className="text-red-500 text-sm mt-1">{errors.sizeChart}</p>
//               )}
//             </div>
//             {isUploading && selectedFileForSizeChart.length > 0 && (
//               <div className="flex items-center text-accent">
//                 <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                 <span>Uploading size chart...</span>
//               </div>
//             )}
//             {selectedFileForSizeChart.length > 0 ? (
//               <div className="mt-2 relative w-32 h-32 rounded-md overflow-hidden border border-border/50">
//                 <img
//                   src={URL.createObjectURL(selectedFileForSizeChart[0])}
//                   alt="Size Chart Preview"
//                   className="w-full h-full object-cover"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/70 text-foreground/80 hover:bg-background"
//                   onClick={handleRemoveSelectedFileforSizeChart}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             ) : (
//               <div className="mt-2 relative w-32 h-32 rounded-md overflow-hidden border border-border/50">
//                 <a
//                   href={defaultSizeChartUrl[0]}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <img
//                     src={defaultSizeChartUrl[0]}
//                     alt="Default Size Chart"
//                     className="w-full h-full object-cover"
//                   />
//                 </a>
//               </div>
//             )}
//             {formData.sizeChart.length > 0 && (
//               <div className="mt-4 relative w-32 h-32 rounded-md overflow-hidden border border-accent/50">
//                 <a
//                   href={formData.sizeChart[0]}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <img
//                     src={formData.sizeChart[0]}
//                     alt="Uploaded Size Chart"
//                     className="w-full h-full object-cover"
//                   />
//                 </a>
//               </div>
//             )}
//           </div>
//           {/* --- */}
//           <Button
//             type="submit"
//             variant="cta"
//             size="lg"
//             className="w-full"
//             disabled={isLoading || isUploading}
//           >
//             {isLoading || isUploading ? (
//               <>
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 {isUploading ? "Uploading Images..." : "Adding Product..."}
//               </>
//             ) : (
//               "Add Product"
//             )}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default AddProductForm;

// // the problem is in this part when i click add color it says colors is undefined but in the state the colors are initialized with empty array
// // and then i click on the color name it gives me error
import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Plus, X, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddProductForm = () => {
  const defaultFeatures = ["Pure Fabric", "Stylish Design"];
  const defaultSpecs = {
    Material: "100% Cotton",
    Weight: "180 GSM",
    Fit: "Round Neck, Regular Fit",
    Care: "Machine Washed",
  };
  const defaultSizeChartUrl = [
    "https://res.cloudinary.com/dfvxh7p8p/image/upload/v1755700423/i7af6otb7qaksvobk4up.png",
  ];

  const initialFormData = {
    name: "",
    description: "",
    images: [],
    sizes: { S: true, M: true, L: true, XL: true, XXL: true },
    category: "",
    forDepartment: false,
    departmentName: "",
    isNew: true,
    onSale: false,
    forHomePage: false,
    variants: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [mainProductImages, setMainProductImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (field, key, checked) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [key]: checked },
    }));
  };

  const handleMainFileChange = (e) => {
    setMainProductImages(Array.from(e.target.files));
  };

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
          colors: [],
          sizeChartFile: null,
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
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        [name]: value,
      };
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

  const handleFeatureChange = (variantIndex, featureIndex, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      const newFeatures = [...newVariants[variantIndex].features];
      newFeatures[featureIndex] = value;
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        features: newFeatures,
      };
      return { ...prev, variants: newVariants };
    });
  };

  const handleAddFeature = (variantIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      const newFeatures = [...newVariants[variantIndex].features, ""];
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        features: newFeatures,
      };
      return { ...prev, variants: newVariants };
    });
  };

  const handleRemoveFeature = (variantIndex, featureIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      const newFeatures = newVariants[variantIndex].features.filter(
        (_, i) => i !== featureIndex
      );
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        features: newFeatures,
      };
      return { ...prev, variants: newVariants };
    });
  };

  const handleSpecificationChange = (variantIndex, field, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      const newSpecifications = {
        ...newVariants[variantIndex].specifications,
        [field]: value,
      };
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        specifications: newSpecifications,
      };
      return { ...prev, variants: newVariants };
    });
  };

  const handleVariantSizeChartChange = (variantIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex].sizeChartFile = file;
      return { ...prev, variants: newVariants };
    });
  };

  const handleAddColor = (variantIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      const newColors = [
        ...newVariants[variantIndex].colors,
        { name: "", selectedFiles: [] },
      ];
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        colors: newColors,
      };
      return { ...prev, variants: newVariants };
    });
  };

  const handleRemoveColor = (variantIndex, colorIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      const newColors = newVariants[variantIndex].colors.filter(
        (_, i) => i !== colorIndex
      );
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        colors: newColors,
      };
      return { ...prev, variants: newVariants };
    });
  };

  const handleColorChange = (variantIndex, colorIndex, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      const newColors = [...newVariants[variantIndex].colors];
      newColors[colorIndex] = { ...newColors[colorIndex], name: value };
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        colors: newColors,
      };
      return { ...prev, variants: newVariants };
    });
  };

  const handleColorImageChange = (variantIndex, colorIndex, files) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      const newColors = [...newVariants[variantIndex].colors];
      newColors[colorIndex] = {
        ...newColors[colorIndex],
        selectedFiles: Array.from(files),
      };
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        colors: newColors,
      };
      return { ...prev, variants: newVariants };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsUploading(true);

    try {
      const mainImageUrls = await Promise.all(
        mainProductImages.map(uploadSingleImage)
      );

      const finalVariantsData = await Promise.all(
        formData.variants.map(async (variant) => {
          const processedColors = await Promise.all(
            variant.colors.map(async (color) => {
              const uploadedImageUrls = await Promise.all(
                (color.selectedFiles || []).map(uploadSingleImage)
              );
              return {
                name: color.name,
                images: uploadedImageUrls.filter(Boolean),
              };
            })
          );

          let uploadedSizeChartUrl = [...defaultSizeChartUrl];
          if (variant.sizeChartFile) {
            const url = await uploadSingleImage(variant.sizeChartFile);
            if (url) uploadedSizeChartUrl = [url];
          }

          const { sizeChartFile, ...restOfVariant } = variant;

          return {
            ...restOfVariant,
            colors: processedColors,
            sizeChart: uploadedSizeChartUrl,
          };
        })
      );

      setIsUploading(false);

      const dataToSend = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        sizes: formData.sizes,
        images: mainImageUrls.filter(Boolean),
        isNew: formData.isNew,
        onSale: formData.onSale,
        forHomePage: formData.forHomePage,
        forDepartment: formData.forDepartment,
        departmentName: formData.departmentName,
        variants: finalVariantsData,
      };

      await axios.post(`${API_BASE_URL}/admin/products`, dataToSend);

      toast({
        title: "Success!",
        description: "Product added successfully.",
        variant: "success",
      });
      setFormData(initialFormData);
      setMainProductImages([]);
      setErrors({});
    } catch (err) {
      console.error("Error adding product:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to add product.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Basic Information</h3>
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Main Product Images *</h3>
            <Input type="file" multiple onChange={handleMainFileChange} />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Available Sizes *</h3>
            <div className="flex flex-wrap gap-4">
              {Object.keys(formData.sizes).map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={formData.sizes[size]}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("sizes", size, !!checked)
                    }
                  />
                  <Label htmlFor={`size-${size}`}>{size}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Product Variants *</h3>
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddVariant}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Variant
              </Button>
            </div>
            {formData.variants.map((variant, variantIndex) => (
              <div
                key={variantIndex}
                className="p-4 border rounded-lg space-y-4 relative bg-card/40"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => handleRemoveVariant(variantIndex)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <h4 className="text-lg font-medium">
                  Variant #{variantIndex + 1}
                </h4>
                <div>
                  <Label>Variant Name *</Label>
                  <Select
                    onValueChange={(value) =>
                      handleVariantNameChange(variantIndex, value)
                    }
                    value={variant.name}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select variant type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Oversized">Oversized</SelectItem>
                      <SelectItem value="Polo">Polo</SelectItem>
                      <SelectItem value="Hoodie">Hoodie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Price *</Label>
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
                  <Label htmlFor={`size-chart-${variantIndex}`}>
                    Size Chart for {variant.name} Variant
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    If no image is uploaded, the{" "}
                    <a
                      href={defaultSizeChartUrl[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      default size chart
                    </a>{" "}
                    will be used.
                  </p>
                  <Input
                    id={`size-chart-${variantIndex}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleVariantSizeChartChange(variantIndex, e)
                    }
                  />
                  {variant.sizeChartFile && (
                    <div className="mt-2 relative w-32 h-32 rounded-md border">
                      <img
                        src={URL.createObjectURL(variant.sizeChartFile)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
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
                <div>
                  <Label>Colors for this Variant *</Label>
                  {variant.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="p-3 border rounded-md mt-2 space-y-2 relative bg-card/30"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() =>
                          handleRemoveColor(variantIndex, colorIndex)
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Color Name (e.g., Midnight Black)"
                        value={color.name}
                        onChange={(e) =>
                          handleColorChange(
                            variantIndex,
                            colorIndex,
                            e.target.value
                          )
                        }
                      />
                      <Input
                        type="file"
                        multiple
                        onChange={(e) =>
                          handleColorImageChange(
                            variantIndex,
                            colorIndex,
                            e.target.files
                          )
                        }
                      />
                      {color.selectedFiles &&
                        color.selectedFiles.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {color.selectedFiles.map((file, fileIndex) => (
                              <div
                                key={fileIndex}
                                className="relative w-20 h-20 rounded-md border"
                              >
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt="Color preview"
                                  className="w-full h-full object-cover rounded-md"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleAddColor(variantIndex)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Color
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Other Settings</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isNew"
                name="isNew"
                checked={formData.isNew}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isNew: !!checked }))
                }
              />
              <Label htmlFor="isNew">New Arrival</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="onSale"
                name="onSale"
                checked={formData.onSale}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, onSale: !!checked }))
                }
              />
              <Label htmlFor="onSale">On Sale</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="forHomePage"
                name="forHomePage"
                checked={formData.forHomePage}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, forHomePage: !!checked }))
                }
              />
              <Label htmlFor="forHomePage">Display on Home Page</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="forDepartment"
                name="forDepartment"
                checked={formData.forDepartment}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, forDepartment: !!checked }))
                }
              />
              <Label htmlFor="forDepartment">For Department Store</Label>
            </div>
            {formData.forDepartment && (
              <div>
                <Label htmlFor="departmentName">Department Name *</Label>
                <Input
                  id="departmentName"
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                {isUploading ? "Uploading..." : "Submitting..."}
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
