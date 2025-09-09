// import React, { useState } from "react";
// import axios from "axios";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from "@/hooks/use-toast";
// import { Label } from "@/components/ui/label";
// import { Plus, X, Loader2 } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

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

//   const initialFormData = {
//     name: "",
//     description: "",
//     sizes: { S: true, M: true, L: true, XL: true, XXL: true },
//     category: "",
//     forDepartment: false,
//     departmentName: "",
//     isNew: true,
//     onSale: false,
//     forHomePage: false,
//     variants: [],
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [mainProductImages, setMainProductImages] = useState([]);
//   const [mainImageUrls, setMainImageUrls] = useState([""]); // State for main image URLs
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
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//         { method: "POST", body: formData }
//       );
//       const data = await response.json();
//       return data.secure_url;
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       return null;
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleCheckboxChange = (field, key, checked) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: { ...prev[field], [key]: checked },
//     }));
//   };

//   // --- Main Image Handlers ---
//   const handleMainFileChange = (e) => {
//     setMainProductImages(Array.from(e.target.files));
//   };

//   const handleMainUrlChange = (index, value) => {
//     const newUrls = [...mainImageUrls];
//     newUrls[index] = value;
//     setMainImageUrls(newUrls);
//   };

//   const addMainUrlInput = () => {
//     setMainImageUrls([...mainImageUrls, ""]);
//   };

//   const removeMainUrlInput = (index) => {
//     setMainImageUrls(mainImageUrls.filter((_, i) => i !== index));
//   };
//   // --- End Main Image Handlers ---

//   const handleAddVariant = () => {
//     setFormData((prev) => ({
//       ...prev,
//       variants: [
//         ...prev.variants,
//         {
//           name: "Regular",
//           price: "",
//           originalPrice: "",
//           features: [...defaultFeatures],
//           specifications: { ...defaultSpecs },
//           colors: [],
//           sizeChartFile: null,
//         },
//       ],
//     }));
//   };

//   const handleRemoveVariant = (variantIndex) => {
//     setFormData((prev) => ({
//       ...prev,
//       variants: prev.variants.filter((_, i) => i !== variantIndex),
//     }));
//   };

//   const handleVariantChange = (variantIndex, e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       newVariants[variantIndex] = {
//         ...newVariants[variantIndex],
//         [name]: value,
//       };
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleVariantNameChange = (variantIndex, newName) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       newVariants[variantIndex].name = newName;
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleFeatureChange = (variantIndex, featureIndex, value) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       const newFeatures = [...newVariants[variantIndex].features];
//       newFeatures[featureIndex] = value;
//       newVariants[variantIndex].features = newFeatures;
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleAddFeature = (variantIndex) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       newVariants[variantIndex].features.push("");
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleRemoveFeature = (variantIndex, featureIndex) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       newVariants[variantIndex].features = newVariants[
//         variantIndex
//       ].features.filter((_, i) => i !== featureIndex);
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleSpecificationChange = (variantIndex, field, value) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       newVariants[variantIndex].specifications[field] = value;
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleVariantSizeChartChange = (variantIndex, e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       newVariants[variantIndex].sizeChartFile = file;
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleAddColor = (variantIndex) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       newVariants[variantIndex].colors.push({
//         name: "",
//         selectedFiles: [],
//         imageUrls: [""], // NEW: Initialize with one URL input
//       });
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleRemoveColor = (variantIndex, colorIndex) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       newVariants[variantIndex].colors = newVariants[
//         variantIndex
//       ].colors.filter((_, i) => i !== colorIndex);
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleColorChange = (variantIndex, colorIndex, value) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       newVariants[variantIndex].colors[colorIndex].name = value;
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleColorImageChange = (variantIndex, colorIndex, files) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       newVariants[variantIndex].colors[colorIndex].selectedFiles =
//         Array.from(files);
//       return { ...prev, variants: newVariants };
//     });
//   };

//   // --- NEW: Handlers for Color Image URLs ---
//   const handleColorUrlChange = (variantIndex, colorIndex, urlIndex, value) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       const newColors = [...newVariants[variantIndex].colors];
//       newColors[colorIndex].imageUrls[urlIndex] = value;
//       newVariants[variantIndex].colors = newColors;
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const addColorUrlInput = (variantIndex, colorIndex) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       const newColors = [...newVariants[variantIndex].colors];
//       newColors[colorIndex].imageUrls.push("");
//       newVariants[variantIndex].colors = newColors;
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const removeColorUrlInput = (variantIndex, colorIndex, urlIndex) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       const newColors = [...newVariants[variantIndex].colors];
//       newColors[colorIndex].imageUrls = newColors[colorIndex].imageUrls.filter(
//         (_, i) => i !== urlIndex
//       );
//       newVariants[variantIndex].colors = newColors;
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setIsUploading(true);

//     try {
//       // 1. Process main images: upload files and combine with URLs
//       const uploadedMainImageUrls = await Promise.all(
//         mainProductImages.map(uploadSingleImage)
//       );
//       const allMainImageUrls = [
//         ...uploadedMainImageUrls.filter(Boolean),
//         ...mainImageUrls.filter(Boolean), // Filter out empty strings
//       ];

//       // 2. Process all variants and their colors
//       const finalVariantsData = await Promise.all(
//         formData.variants.map(async (variant) => {
//           const processedColors = await Promise.all(
//             variant.colors.map(async (color) => {
//               // Upload files for this color
//               const uploadedImageUrls = await Promise.all(
//                 (color.selectedFiles || []).map(uploadSingleImage)
//               );
//               // Combine uploaded file URLs with direct URLs
//               const allImageUrls = [
//                 ...uploadedImageUrls.filter(Boolean),
//                 ...(color.imageUrls || []).filter(Boolean),
//               ];
//               return {
//                 name: color.name,
//                 images: allImageUrls,
//               };
//             })
//           );

//           // 3. Process size chart for this variant
//           let uploadedSizeChartUrl = [...defaultSizeChartUrl];
//           if (variant.sizeChartFile) {
//             const url = await uploadSingleImage(variant.sizeChartFile);
//             if (url) uploadedSizeChartUrl = [url];
//           }

//           const { sizeChartFile, ...restOfVariant } = variant;

//           return {
//             ...restOfVariant,
//             colors: processedColors,
//             sizeChart: uploadedSizeChartUrl,
//           };
//         })
//       );

//       setIsUploading(false);

//       const dataToSend = {
//         name: formData.name,
//         description: formData.description,
//         category: formData.category,
//         sizes: formData.sizes,
//         images: allMainImageUrls, // Use the combined list of main image URLs
//         isNew: formData.isNew,
//         onSale: formData.onSale,
//         forHomePage: formData.forHomePage,
//         forDepartment: formData.forDepartment,
//         departmentName: formData.departmentName,
//         variants: finalVariantsData,
//       };

//       await axios.post(`${API_BASE_URL}/admin/products`, dataToSend);

//       toast({
//         title: "Success!",
//         description: "Product added successfully.",
//         variant: "success",
//       });
//       setFormData(initialFormData);
//       setMainProductImages([]);
//       setMainImageUrls([""]); // Reset main image URLs
//       setErrors({});
//     } catch (err) {
//       console.error("Error adding product:", err);
//       toast({
//         title: "Error",
//         description: err.response?.data?.message || "Failed to add product.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//       setIsUploading(false);
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Add New Product</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* --- Basic Information --- */}
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold">Basic Information</h3>
//             <div>
//               <Label htmlFor="name">Name *</Label>
//               <Input
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <Label htmlFor="description">Description *</Label>
//               <Textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <Label htmlFor="category">Category *</Label>
//               <Input
//                 id="category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           {/* --- Main Product Images (UPDATED) --- */}
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold">Main Product Images *</h3>
//             <div>
//               <Label htmlFor="main-images-file">Upload From Device</Label>
//               <Input
//                 id="main-images-file"
//                 type="file"
//                 multiple
//                 onChange={handleMainFileChange}
//               />
//             </div>
//             <div>
//               <Label>Or Add Image URLs</Label>
//               {mainImageUrls.map((url, index) => (
//                 <div key={index} className="flex items-center space-x-2 mb-2">
//                   <Input
//                     type="url"
//                     placeholder="https://example.com/image.png"
//                     value={url}
//                     onChange={(e) => handleMainUrlChange(index, e.target.value)}
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => removeMainUrlInput(index)}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ))}
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={addMainUrlInput}
//               >
//                 <Plus className="h-4 w-4 mr-2" /> Add URL
//               </Button>
//             </div>
//           </div>

//           {/* --- Available Sizes --- */}
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold">Available Sizes *</h3>
//             <div className="flex flex-wrap gap-4">
//               {Object.keys(formData.sizes).map((size) => (
//                 <div key={size} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`size-${size}`}
//                     checked={formData.sizes[size]}
//                     onCheckedChange={(checked) =>
//                       handleCheckboxChange("sizes", size, !!checked)
//                     }
//                   />
//                   <Label htmlFor={`size-${size}`}>{size}</Label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* --- Product Variants --- */}
//           <div className="space-y-6">
//             <div className="flex justify-between items-center">
//               <h3 className="text-xl font-semibold">Product Variants *</h3>
//               <Button
//                 type="button"
//                 variant="secondary"
//                 onClick={handleAddVariant}
//               >
//                 <Plus className="h-4 w-4 mr-2" /> Add Variant
//               </Button>
//             </div>
//             {formData.variants.map((variant, variantIndex) => (
//               <div
//                 key={variantIndex}
//                 className="p-4 border rounded-lg space-y-4 relative bg-card/40"
//               >
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   className="absolute top-2 right-2 h-7 w-7"
//                   onClick={() => handleRemoveVariant(variantIndex)}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//                 <h4 className="text-lg font-medium">
//                   Variant #{variantIndex + 1}
//                 </h4>
//                 <div>
//                   <Label>Variant Name *</Label>
//                   <Select
//                     onValueChange={(value) =>
//                       handleVariantNameChange(variantIndex, value)
//                     }
//                     value={variant.name}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select variant type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Regular">Regular</SelectItem>
//                       <SelectItem value="Oversized">Oversized</SelectItem>
//                       <SelectItem value="Polo">Polo</SelectItem>
//                       <SelectItem value="Hoodie">Hoodie</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 {/* ... Price, Original Price, Size Chart, Features, Specs ... (No changes here) */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label>Price *</Label>
//                     <Input
//                       type="number"
//                       name="price"
//                       value={variant.price}
//                       onChange={(e) => handleVariantChange(variantIndex, e)}
//                     />
//                   </div>
//                   <div>
//                     <Label>Original Price</Label>
//                     <Input
//                       type="number"
//                       name="originalPrice"
//                       value={variant.originalPrice}
//                       onChange={(e) => handleVariantChange(variantIndex, e)}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor={`size-chart-${variantIndex}`}>
//                     Size Chart for {variant.name} Variant
//                   </Label>
//                   <p className="text-sm text-muted-foreground">
//                     If no image is uploaded, the{" "}
//                     <a
//                       href={defaultSizeChartUrl[0]}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="underline"
//                     >
//                       default size chart
//                     </a>{" "}
//                     will be used.
//                   </p>
//                   <Input
//                     id={`size-chart-${variantIndex}`}
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) =>
//                       handleVariantSizeChartChange(variantIndex, e)
//                     }
//                   />
//                   {variant.sizeChartFile && (
//                     <div className="mt-2 relative w-32 h-32 rounded-md border">
//                       <img
//                         src={URL.createObjectURL(variant.sizeChartFile)}
//                         alt="Preview"
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <Label>Features</Label>
//                   {variant.features.map((feature, featureIndex) => (
//                     <div
//                       key={featureIndex}
//                       className="flex items-center space-x-2 mb-2"
//                     >
//                       <Input
//                         value={feature}
//                         onChange={(e) =>
//                           handleFeatureChange(
//                             variantIndex,
//                             featureIndex,
//                             e.target.value
//                           )
//                         }
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         onClick={() =>
//                           handleRemoveFeature(variantIndex, featureIndex)
//                         }
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   ))}
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleAddFeature(variantIndex)}
//                   >
//                     <Plus className="h-4 w-4 mr-2" /> Add Feature
//                   </Button>
//                 </div>
//                 <div>
//                   <Label>Specifications</Label>
//                   {Object.keys(variant.specifications).map((specKey) => (
//                     <div
//                       key={specKey}
//                       className="grid grid-cols-4 items-center gap-2 mb-2"
//                     >
//                       <Label className="col-span-1 text-sm">{specKey}</Label>
//                       <Input
//                         className="col-span-3"
//                         value={variant.specifications[specKey]}
//                         onChange={(e) =>
//                           handleSpecificationChange(
//                             variantIndex,
//                             specKey,
//                             e.target.value
//                           )
//                         }
//                       />
//                     </div>
//                   ))}
//                 </div>

//                 {/* --- Colors for Variant (UPDATED) --- */}
//                 <div>
//                   <Label>Colors for this Variant *</Label>
//                   {variant.colors.map((color, colorIndex) => (
//                     <div
//                       key={colorIndex}
//                       className="p-3 border rounded-md mt-2 space-y-4 relative bg-card/30"
//                     >
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         className="absolute top-1 right-1 h-6 w-6"
//                         onClick={() =>
//                           handleRemoveColor(variantIndex, colorIndex)
//                         }
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                       <Input
//                         placeholder="Color Name (e.g., Midnight Black)"
//                         value={color.name}
//                         onChange={(e) =>
//                           handleColorChange(
//                             variantIndex,
//                             colorIndex,
//                             e.target.value
//                           )
//                         }
//                       />
//                       <div>
//                         <Label
//                           htmlFor={`color-file-${variantIndex}-${colorIndex}`}
//                           className="text-sm font-medium"
//                         >
//                           Upload Images
//                         </Label>
//                         <Input
//                           id={`color-file-${variantIndex}-${colorIndex}`}
//                           type="file"
//                           multiple
//                           onChange={(e) =>
//                             handleColorImageChange(
//                               variantIndex,
//                               colorIndex,
//                               e.target.files
//                             )
//                           }
//                         />
//                         {/* Preview for uploaded files */}
//                         {color.selectedFiles &&
//                           color.selectedFiles.length > 0 && (
//                             <div className="flex flex-wrap gap-2 mt-2">
//                               {color.selectedFiles.map((file, fileIndex) => (
//                                 <div
//                                   key={fileIndex}
//                                   className="relative w-20 h-20 rounded-md border"
//                                 >
//                                   <img
//                                     src={URL.createObjectURL(file)}
//                                     alt="Color preview"
//                                     className="w-full h-full object-cover rounded-md"
//                                   />
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                       </div>
//                       <div>
//                         <Label className="text-sm font-medium">
//                           Or Add Image URLs
//                         </Label>
//                         {color.imageUrls.map((url, urlIndex) => (
//                           <div
//                             key={urlIndex}
//                             className="flex items-center space-x-2 mb-2"
//                           >
//                             <Input
//                               type="url"
//                               placeholder="https://example.com/image.png"
//                               value={url}
//                               onChange={(e) =>
//                                 handleColorUrlChange(
//                                   variantIndex,
//                                   colorIndex,
//                                   urlIndex,
//                                   e.target.value
//                                 )
//                               }
//                             />
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="icon"
//                               onClick={() =>
//                                 removeColorUrlInput(
//                                   variantIndex,
//                                   colorIndex,
//                                   urlIndex
//                                 )
//                               }
//                             >
//                               <X className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         ))}
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           onClick={() =>
//                             addColorUrlInput(variantIndex, colorIndex)
//                           }
//                         >
//                           <Plus className="h-4 w-4 mr-2" /> Add URL
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     className="mt-2"
//                     onClick={() => handleAddColor(variantIndex)}
//                   >
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Color
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* --- Other Settings --- */}
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold">Other Settings</h3>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="isNew"
//                 name="isNew"
//                 checked={formData.isNew}
//                 onCheckedChange={(checked) =>
//                   setFormData((prev) => ({ ...prev, isNew: !!checked }))
//                 }
//               />
//               <Label htmlFor="isNew">New Arrival</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="onSale"
//                 name="onSale"
//                 checked={formData.onSale}
//                 onCheckedChange={(checked) =>
//                   setFormData((prev) => ({ ...prev, onSale: !!checked }))
//                 }
//               />
//               <Label htmlFor="onSale">On Sale</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="forHomePage"
//                 name="forHomePage"
//                 checked={formData.forHomePage}
//                 onCheckedChange={(checked) =>
//                   setFormData((prev) => ({ ...prev, forHomePage: !!checked }))
//                 }
//               />
//               <Label htmlFor="forHomePage">Display on Home Page</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="forDepartment"
//                 name="forDepartment"
//                 checked={formData.forDepartment}
//                 onCheckedChange={(checked) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     forDepartment: !!checked,
//                   }))
//                 }
//               />
//               <Label htmlFor="forDepartment">For Department Store</Label>
//             </div>
//             {formData.forDepartment && (
//               <div>
//                 <Label htmlFor="departmentName">Department Name *</Label>
//                 <Input
//                   id="departmentName"
//                   name="departmentName"
//                   value={formData.departmentName}
//                   onChange={handleChange}
//                 />
//               </div>
//             )}
//           </div>
//           <Button
//             type="submit"
//             size="lg"
//             className="w-full"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
//                 {isUploading ? "Uploading..." : "Submitting..."}
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
    "https://res.cloudinary.com/dfvxh7p8p/image/upload/v1757169464/size_chart_xlbdxe.png",
  ];

  const initialFormData = {
    name: "",
    description: "",
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
  const [mainImageUrls, setMainImageUrls] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

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

  const handleMainUrlChange = (index, value) => {
    const newUrls = [...mainImageUrls];
    newUrls[index] = value;
    setMainImageUrls(newUrls);
  };

  const addMainUrlInput = () => {
    setMainImageUrls([...mainImageUrls, ""]);
  };

  const removeMainUrlInput = (index) => {
    setMainImageUrls(mainImageUrls.filter((_, i) => i !== index));
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
          sizeChart: [], // Initialize with empty array
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
      newVariants[variantIndex].features[featureIndex] = value;
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

  const handleRemoveFeature = (variantIndex, featureIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex].features = newVariants[
        variantIndex
      ].features.filter((_, i) => i !== featureIndex);
      return { ...prev, variants: newVariants };
    });
  };

  const handleSpecificationChange = (variantIndex, field, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex].specifications[field] = value;
      return { ...prev, variants: newVariants };
    });
  };

  const handleVariantSizeChartUrlChange = (variantIndex, url) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex].sizeChart = url ? [url] : [];
      return { ...prev, variants: newVariants };
    });
  };

  const handleAddColor = (variantIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex].colors.push({
        name: "",
        imageUrls: [""],
      });
      return { ...prev, variants: newVariants };
    });
  };

  const handleRemoveColor = (variantIndex, colorIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex].colors = newVariants[
        variantIndex
      ].colors.filter((_, i) => i !== colorIndex);
      return { ...prev, variants: newVariants };
    });
  };

  const handleColorChange = (variantIndex, colorIndex, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex].colors[colorIndex].name = value;
      return { ...prev, variants: newVariants };
    });
  };

  const handleColorUrlChange = (variantIndex, colorIndex, urlIndex, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex].colors[colorIndex].imageUrls[urlIndex] = value;
      return { ...prev, variants: newVariants };
    });
  };

  const addColorUrlInput = (variantIndex, colorIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[variantIndex].colors[colorIndex].imageUrls.push("");
      return { ...prev, variants: newVariants };
    });
  };

  const removeColorUrlInput = (variantIndex, colorIndex, urlIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      const colorUrls = newVariants[variantIndex].colors[colorIndex].imageUrls;
      newVariants[variantIndex].colors[colorIndex].imageUrls = colorUrls.filter(
        (_, i) => i !== urlIndex
      );
      return { ...prev, variants: newVariants };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const allMainImageUrls = mainImageUrls.filter(Boolean);

      const finalVariantsData = formData.variants.map((variant) => {
        const processedColors = variant.colors.map((color) => ({
          name: color.name,
          images: (color.imageUrls || []).filter(Boolean),
        }));

        const sizeChartUrl =
          variant.sizeChart &&
          variant.sizeChart.length > 0 &&
          variant.sizeChart[0]
            ? variant.sizeChart
            : defaultSizeChartUrl;

        return {
          ...variant,
          colors: processedColors,
          sizeChart: sizeChartUrl,
        };
      });

      const dataToSend = {
        ...formData,
        images: allMainImageUrls,
        variants: finalVariantsData,
      };

      await axios.post(`${API_BASE_URL}/admin/products`, dataToSend);

      toast({
        title: "Success!",
        description: "Product added successfully.",
        variant: "success",
      });
      setFormData(initialFormData);
      setMainImageUrls([""]);
    } catch (err) {
      console.error("Error adding product:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to add product.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4 p-4 border rounded-lg">
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

          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-xl font-semibold">Main Product Images *</h3>
            <div>
              <Label>Image URLs</Label>
              {mainImageUrls.map((url, index) => (
                <div key={index} className="flex items-start space-x-2 mb-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/image.png"
                    value={url}
                    onChange={(e) => handleMainUrlChange(index, e.target.value)}
                  />
                  {url && (
                    <img
                      src={url}
                      alt="preview"
                      className="w-12 h-12 rounded-md border object-cover"
                    />
                  )}
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

          <div className="space-y-4 p-4 border rounded-lg">
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
                  <Label>Size Chart URL</Label>
                  <p className="text-sm text-muted-foreground">
                    If no URL is provided, the default size chart will be used.
                  </p>
                  <div className="flex items-start space-x-2">
                    <Input
                      type="url"
                      placeholder="https://example.com/sizechart.png"
                      value={(variant.sizeChart && variant.sizeChart[0]) || ""}
                      onChange={(e) =>
                        handleVariantSizeChartUrlChange(
                          variantIndex,
                          e.target.value
                        )
                      }
                    />
                    {variant.sizeChart && variant.sizeChart[0] && (
                      <img
                        src={variant.sizeChart[0]}
                        alt="Size Chart Preview"
                        className="w-12 h-12 rounded-md border object-cover"
                      />
                    )}
                  </div>
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
                    <Plus className="h-4 w-4 mr-2" /> Add Feature
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
                      className="p-3 border rounded-md mt-2 space-y-4 relative bg-card/30"
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
                      <div>
                        <Label className="text-sm font-medium">
                          Image URLs for {color.name || "this Color"}
                        </Label>
                        {color.imageUrls.map((url, urlIndex) => (
                          <div
                            key={urlIndex}
                            className="flex items-start space-x-2 mb-2"
                          >
                            <Input
                              type="url"
                              placeholder="https://example.com/image.png"
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
                            {url && (
                              <img
                                src={url}
                                alt="preview"
                                className="w-12 h-12 rounded-md border object-cover"
                              />
                            )}
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
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleAddColor(variantIndex)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Color
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
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
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...
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
