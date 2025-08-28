// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from "@/hooks/use-toast";
// import { Loader2, X, Image as ImageIcon, Plus } from "lucide-react";

// const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
// const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
// const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
//   const { toast } = useToast();
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [mainImagesToUpload, setMainImagesToUpload] = useState([]);
//   const [selectedFileForSizeChart, setSelectedFileForSizeChart] =
//     useState(null);

//   useEffect(() => {
//     if (product) {
//       // Structure formData for the new schema
//       const initialColors = product.colors.map((color) => ({
//         ...color,
//         newImages: [],
//       }));
//       setFormData({
//         ...product,
//         colors: initialColors,
//       });
//       setMainImagesToUpload([]);
//       setSelectedFileForSizeChart(null);
//     }
//   }, [product]);

//   // Handle regular inputs and nested fields
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevData) => {
//       if (name.includes(".")) {
//         const [parent, child] = name.split(".");
//         return {
//           ...prevData,
//           [parent]: {
//             ...prevData[parent],
//             [child]: type === "checkbox" ? checked : value,
//           },
//         };
//       }
//       return { ...prevData, [name]: type === "checkbox" ? checked : value };
//     });
//   };

//   // Handle dynamic array inputs (e.g., features)
//   const handleArrayChange = (arrayName, index, value) => {
//     setFormData((prevData) => {
//       const newArray = [...prevData[arrayName]];
//       newArray[index] = value;
//       return { ...prevData, [arrayName]: newArray };
//     });
//   };

//   const handleAddArrayItem = (arrayName) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [arrayName]: [...prevData[arrayName], ""],
//     }));
//   };

//   const handleRemoveArrayItem = (arrayName, index) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [arrayName]: prevData[arrayName].filter((_, i) => i !== index),
//     }));
//   };

//   // Handle new main product image files
//   const handleMainFileChange = (e) => {
//     setMainImagesToUpload(Array.from(e.target.files));
//   };

//   // Handle removing a newly selected local file
//   const handleRemoveMainFile = (indexToRemove) => {
//     setMainImagesToUpload((prevFiles) =>
//       prevFiles.filter((_, index) => index !== indexToRemove)
//     );
//   };

//   // Handle removing an existing product image URL from the form data
//   const handleRemoveExistingImage = (indexToRemove) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       images: prevData.images.filter((_, index) => index !== indexToRemove),
//     }));
//   };

//   // Handle new size chart image upload
//   const handleSizeChartFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFileForSizeChart(file);
//     }
//   };

//   const handleRemoveSizeChartFile = () => {
//     setSelectedFileForSizeChart(null);
//   };

//   // --- NEW: Color Variant Handlers ---
//   const handleColorNameChange = (index, value) => {
//     const newColors = [...formData.colors];
//     newColors[index] = { ...newColors[index], name: value };
//     setFormData({ ...formData, colors: newColors });
//   };

//   const handleColorImagesChange = (colorIndex, files) => {
//     const newColors = [...formData.colors];
//     newColors[colorIndex] = {
//       ...newColors[colorIndex],
//       newImages: Array.from(files),
//     };
//     setFormData({ ...formData, colors: newColors });
//   };

//   const handleRemoveExistingColorImage = (colorIndex, imageIndex) => {
//     const newColors = [...formData.colors];
//     newColors[colorIndex].images = newColors[colorIndex].images.filter(
//       (_, i) => i !== imageIndex
//     );
//     setFormData({ ...formData, colors: newColors });
//   };

//   const handleRemoveNewColorImage = (colorIndex, imageIndex) => {
//     const newColors = [...formData.colors];
//     newColors[colorIndex].newImages = newColors[colorIndex].newImages.filter(
//       (_, i) => i !== imageIndex
//     );
//     setFormData({ ...formData, colors: newColors });
//   };

//   const handleAddColor = () => {
//     setFormData((prevData) => ({
//       ...prevData,
//       colors: [...prevData.colors, { name: "", images: [], newImages: [] }],
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
//   // ------------------------------------

//   // Reusable image upload function
//   const uploadSingleImage = async (file) => {
//     if (!file) return null;
//     if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
//       console.error("Cloudinary credentials not set.");
//       return null;
//     }
//     const uploadFormData = new FormData();
//     uploadFormData.append("file", file);
//     uploadFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//         {
//           method: "POST",
//           body: uploadFormData,
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

//   // Save changes handler
//   const handleSave = async () => {
//     setLoading(true);
//     let updatedSizeChart = formData.sizeChart;
//     let finalImageUrls = [...formData.images];
//     let finalColorData = [...formData.colors];

//     setIsUploading(true);

//     // Upload new main product images
//     if (mainImagesToUpload.length > 0) {
//       const newImageUrls = (
//         await Promise.all(
//           mainImagesToUpload.map((file) => uploadSingleImage(file))
//         )
//       ).filter((url) => url !== null);
//       finalImageUrls = [...finalImageUrls, ...newImageUrls];
//     }

//     // Upload new size chart image
//     if (selectedFileForSizeChart) {
//       const newSizeChartUrl = await uploadSingleImage(selectedFileForSizeChart);
//       if (newSizeChartUrl) {
//         updatedSizeChart = [newSizeChartUrl];
//       } else {
//         toast({
//           title: "Image Upload Failed",
//           description: "The new size chart image could not be uploaded.",
//           variant: "destructive",
//         });
//         setLoading(false);
//         setIsUploading(false);
//         return;
//       }
//     }

//     // Upload new images for each color variant
//     const colorUploadPromises = finalColorData.map(async (color) => {
//       if (color.newImages && color.newImages.length > 0) {
//         const uploadedUrls = (
//           await Promise.all(
//             color.newImages.map((file) => uploadSingleImage(file))
//           )
//         ).filter((url) => url !== null);
//         return {
//           ...color,
//           images: [...color.images, ...uploadedUrls],
//           newImages: undefined, // Remove newImages property before sending
//         };
//       }
//       return color;
//     });
//     finalColorData = await Promise.all(colorUploadPromises);

//     setIsUploading(false);

//     try {
//       const sanitizedData = {
//         ...formData,
//         images: finalImageUrls.filter((url) => url.trim() !== ""),
//         features: formData.features.filter((feature) => feature.trim() !== ""),
//         sizeChart: updatedSizeChart,
//         colors: finalColorData,
//       };

//       const response = await axios.put(`${API_BASE_URL}/admin/updateProduct`, {
//         _id: product._id,
//         updatedProduct: sanitizedData,
//       });

//       toast({
//         title: "Product Updated",
//         description: `The product "${response.data.product.name}" was updated successfully.`,
//         variant: "success",
//       });
//       onProductUpdated();
//       onClose();
//     } catch (err) {
//       console.error("Error updating product:", err);
//       toast({
//         title: "Failed to Update",
//         description: err.response?.data?.message || "Server error.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Edit Product</DialogTitle>
//           <DialogDescription>
//             Make changes to the product here. All fields will be pre-filled.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           {/* General Fields */}
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="name" className="text-right">
//               Name
//             </Label>
//             <Input
//               id="name"
//               name="name"
//               value={formData.name || ""}
//               onChange={handleChange}
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="price" className="text-right">
//               Price
//             </Label>
//             <Input
//               id="price"
//               name="price"
//               type="number"
//               value={formData.price || 0}
//               onChange={handleChange}
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="originalPrice" className="text-right">
//               Original Price
//             </Label>
//             <Input
//               id="originalPrice"
//               name="originalPrice"
//               type="number"
//               value={formData.originalPrice || 0}
//               onChange={handleChange}
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="category" className="text-right">
//               Category
//             </Label>
//             <Input
//               id="category"
//               name="category"
//               value={formData.category || ""}
//               onChange={handleChange}
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="description" className="text-right">
//               Description
//             </Label>
//             <Textarea
//               id="description"
//               name="description"
//               value={formData.description || ""}
//               onChange={handleChange}
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="rating" className="text-right">
//               Rating
//             </Label>
//             <Input
//               id="rating"
//               name="rating"
//               type="number"
//               value={formData.rating || 0}
//               onChange={handleChange}
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="reviews" className="text-right">
//               Reviews
//             </Label>
//             <Input
//               id="reviews"
//               name="reviews"
//               type="number"
//               value={formData.reviews || 0}
//               onChange={handleChange}
//               className="col-span-3"
//             />
//           </div>
//           {/* Boolean Fields */}
//           <div className="flex flex-col space-y-2 mt-4">
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="isNew"
//                 name="isNew"
//                 checked={formData.isNew}
//                 onCheckedChange={(checked) =>
//                   setFormData((prev) => ({ ...prev, isNew: checked }))
//                 }
//               />
//               <Label htmlFor="isNew">New Product</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="onSale"
//                 name="onSale"
//                 checked={formData.onSale}
//                 onCheckedChange={(checked) =>
//                   setFormData((prev) => ({ ...prev, onSale: checked }))
//                 }
//               />
//               <Label htmlFor="onSale">On Sale</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="forDepartment"
//                 name="forDepartment"
//                 checked={formData.forDepartment}
//                 onCheckedChange={(checked) =>
//                   setFormData((prev) => ({ ...prev, forDepartment: checked }))
//                 }
//               />
//               <Label htmlFor="forDepartment">For Department</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="forHomePage"
//                 name="forHomePage"
//                 checked={formData.forHomePage}
//                 onCheckedChange={(checked) =>
//                   setFormData((prev) => ({ ...prev, forHomePage: checked }))
//                 }
//               />
//               <Label htmlFor="forHomePage">Display on Home Page</Label>
//             </div>
//             {formData.forDepartment && (
//               <div className="grid grid-cols-4 items-center gap-4 mt-2">
//                 <Label htmlFor="departmentName" className="text-right">
//                   Department Name
//                 </Label>
//                 <Input
//                   id="departmentName"
//                   name="departmentName"
//                   value={formData.departmentName || ""}
//                   onChange={handleChange}
//                   className="col-span-3"
//                 />
//               </div>
//             )}
//           </div>
//           {/* Nested Objects (Sizes, Variety) */}
//           <h3 className="font-semibold mt-4">Options</h3>
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//             {/* Sizes */}
//             <div>
//               <Label className="font-medium">Sizes</Label>
//               {Object.keys(formData.sizes || {}).map((size) => (
//                 <div key={size} className="flex items-center space-x-2 mt-2">
//                   <Checkbox
//                     id={`size-${size}`}
//                     name={`sizes.${size}`}
//                     checked={formData.sizes[size]}
//                     onCheckedChange={(checked) =>
//                       handleChange({
//                         target: {
//                           name: `sizes.${size}`,
//                           type: "checkbox",
//                           checked,
//                         },
//                       })
//                     }
//                   />
//                   <Label htmlFor={`size-${size}`}>{size}</Label>
//                 </div>
//               ))}
//             </div>
//             {/* Variety of Product */}
//             <div>
//               <Label className="font-medium">Variety</Label>
//               {Object.keys(formData.varietyOfProduct || {}).map((variety) => (
//                 <div key={variety} className="flex items-center space-x-2 mt-2">
//                   <Checkbox
//                     id={`variety-${variety}`}
//                     name={`varietyOfProduct.${variety}`}
//                     checked={formData.varietyOfProduct[variety]}
//                     onCheckedChange={(checked) =>
//                       handleChange({
//                         target: {
//                           name: `varietyOfProduct.${variety}`,
//                           type: "checkbox",
//                           checked,
//                         },
//                       })
//                     }
//                   />
//                   <Label htmlFor={`variety-${variety}`}>{variety}</Label>
//                 </div>
//               ))}
//             </div>
//           </div>
//           {/* Specifications */}
//           <h3 className="font-semibold mt-4">Specifications</h3>
//           {Object.keys(formData.specifications || {}).map((spec) => (
//             <div key={spec} className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor={`spec-${spec}`} className="text-right">
//                 {spec}
//               </Label>
//               <Input
//                 id={`spec-${spec}`}
//                 name={`specifications.${spec}`}
//                 value={formData.specifications[spec] || ""}
//                 onChange={handleChange}
//                 className="col-span-3"
//               />
//             </div>
//           ))}
//           {/* Main Product Images */}
//           <h3 className="font-semibold mt-4">Main Product Images</h3>
//           <p className="text-sm text-muted-foreground">
//             Add new images or remove existing ones.
//           </p>
//           <div className="flex flex-wrap gap-2 mb-4">
//             {formData.images?.map((image, index) => (
//               <div
//                 key={`existing-main-${index}`}
//                 className="relative w-24 h-24 rounded-md overflow-hidden border border-border/50"
//               >
//                 <img
//                   src={image}
//                   alt={`Product ${index + 1}`}
//                   className="w-full h-full object-cover"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/70 text-foreground/80 hover:bg-background"
//                   onClick={() => handleRemoveExistingImage(index)}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//             {mainImagesToUpload.map((file, index) => (
//               <div
//                 key={`new-main-${index}`}
//                 className="relative w-24 h-24 rounded-md overflow-hidden border border-border/50"
//               >
//                 <img
//                   src={URL.createObjectURL(file)}
//                   alt={`New Preview ${index + 1}`}
//                   className="w-full h-full object-cover"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/70 text-foreground/80 hover:bg-background"
//                   onClick={() => handleRemoveMainFile(index)}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="mainImageUpload" className="text-right">
//               Add Main Images
//             </Label>
//             <Input
//               id="mainImageUpload"
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={handleMainFileChange}
//               className="col-span-3 file:text-foreground"
//               disabled={isUploading}
//             />
//           </div>
//           {/* Color Images Section */}
//           <h3 className="font-semibold mt-4">Color Variants</h3>
//           {formData.colors?.map((color, colorIndex) => (
//             <div
//               key={colorIndex}
//               className="p-4 border rounded-lg bg-card/40 relative"
//             >
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon"
//                 className="absolute top-1 right-1 h-6 w-6 rounded-full"
//                 onClick={() => handleRemoveColor(colorIndex)}
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//               <div className="space-y-2">
//                 <Label htmlFor={`color-name-${colorIndex}`}>Color Name</Label>
//                 <Input
//                   type="text"
//                   id={`color-name-${colorIndex}`}
//                   value={color.name}
//                   onChange={(e) =>
//                     handleColorNameChange(colorIndex, e.target.value)
//                   }
//                   placeholder="e.g., Black, White"
//                   className="bg-secondary/50"
//                 />
//                 <Label htmlFor={`color-images-${colorIndex}`}>
//                   Color Images
//                 </Label>
//                 {/* Image previews for existing and new images for this color */}
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {color.images?.map((image, imageIndex) => (
//                     <div
//                       key={`existing-color-${imageIndex}`}
//                       className="relative w-24 h-24 rounded-md overflow-hidden border"
//                     >
//                       <img
//                         src={image}
//                         alt={`Color ${color.name} ${imageIndex + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/70 text-foreground/80 hover:bg-background"
//                         onClick={() =>
//                           handleRemoveExistingColorImage(colorIndex, imageIndex)
//                         }
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   ))}
//                   {color.newImages?.map((file, imageIndex) => (
//                     <div
//                       key={`new-color-${imageIndex}`}
//                       className="relative w-24 h-24 rounded-md overflow-hidden border"
//                     >
//                       <img
//                         src={URL.createObjectURL(file)}
//                         alt={`New ${color.name} ${imageIndex + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/70 text-foreground/80 hover:bg-background"
//                         onClick={() =>
//                           handleRemoveNewColorImage(colorIndex, imageIndex)
//                         }
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//                 <Input
//                   type="file"
//                   id={`color-images-${colorIndex}`}
//                   multiple
//                   accept="image/*"
//                   onChange={(e) =>
//                     handleColorImagesChange(colorIndex, e.target.files)
//                   }
//                   className="bg-secondary/50 file:text-foreground"
//                 />
//               </div>
//             </div>
//           ))}
//           <Button
//             type="button"
//             variant="outline"
//             onClick={handleAddColor}
//             className="w-full sm:w-auto"
//           >
//             <Plus className="h-4 w-4 mr-1" /> Add Color
//           </Button>
//           {/* Features */}
//           <h3 className="font-semibold mt-4">Features</h3>
//           {formData.features?.map((feature, index) => (
//             <div key={index} className="flex items-center space-x-2">
//               <Input
//                 value={feature}
//                 onChange={(e) =>
//                   handleArrayChange("features", index, e.target.value)
//                 }
//                 placeholder="Feature"
//               />
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => handleRemoveArrayItem("features", index)}
//               >
//                 <X />
//               </Button>
//             </div>
//           ))}
//           <Button
//             onClick={() => handleAddArrayItem("features")}
//             variant="outline"
//             size="sm"
//           >
//             <Plus className="h-4 w-4 mr-1" /> Add Feature
//           </Button>
//           {/* Size Chart Image Upload */}
//           <h3 className="font-semibold mt-4">Size Chart Image</h3>
//           <p className="text-sm text-muted-foreground">
//             Upload a new image to replace the existing one.
//           </p>
//           <div className="flex items-center space-x-2">
//             <Input
//               type="file"
//               accept="image/*"
//               onChange={handleSizeChartFileChange}
//               className="flex-1"
//             />
//             {selectedFileForSizeChart && (
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={handleRemoveSizeChartFile}
//               >
//                 <X />
//               </Button>
//             )}
//           </div>
//           {isUploading && selectedFileForSizeChart && (
//             <div className="flex items-center text-accent mt-2">
//               <Loader2 className="h-5 w-5 animate-spin mr-2" />
//               <span>Uploading size chart...</span>
//             </div>
//           )}
//           {/* Display current or new size chart image preview */}
//           {(selectedFileForSizeChart || formData.sizeChart?.length > 0) && (
//             <div className="mt-2 relative w-32 h-32 rounded-md overflow-hidden border">
//               <img
//                 src={
//                   selectedFileForSizeChart
//                     ? URL.createObjectURL(selectedFileForSizeChart)
//                     : formData.sizeChart[0]
//                 }
//                 alt="Size Chart"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           )}
//         </div>
//         <DialogFooter>
//           <Button onClick={onClose} variant="outline" disabled={loading}>
//             Cancel
//           </Button>
//           <Button onClick={handleSave} disabled={loading || isUploading}>
//             {loading || isUploading ? (
//               <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//             ) : (
//               "Save changes"
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EditProductModal;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from "@/hooks/use-toast";
// import { Loader2, X, Plus } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
// const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
// const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// // Reusable defaults for new variants
// const defaultFeatures = ["Pure Fabric", "Stylish Design"];
// const defaultSpecs = {
//   Material: "100% Cotton",
//   Weight: "180 GSM",
//   Fit: "Round Neck, Regular Fit",
//   Care: "Machine Washed",
// };
// const defaultSizeChartUrl = [
//   "https://res.cloudinary.com/dfvxh7p8p/image/upload/v1755700423/i7af6otb7qaksvobk4up.png",
// ];

// const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
//   const { toast } = useToast();
//   const [formData, setFormData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [mainImagesToUpload, setMainImagesToUpload] = useState([]);

//   useEffect(() => {
//     if (product) {
//       const productCopy = JSON.parse(JSON.stringify(product));
//       console.log(productCopy);
//       const variantsWithUploadState = productCopy.variants.map((variant) => ({
//         ...variant,
//         sizeChartFile: null,
//         colors: variant.colors.map((color) => ({
//           ...color,
//           newImages: [],
//         })),
//       }));
//       setFormData({ ...productCopy, variants: variantsWithUploadState });
//       setMainImagesToUpload([]);
//     }
//   }, [product]);

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

//   // --- GENERAL & TOP-LEVEL HANDLERS ---
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleCheckboxChange = (name, checked) => {
//     setFormData((prev) => ({ ...prev, [name]: checked }));
//   };

//   const handleMainFileChange = (e) => {
//     setMainImagesToUpload(Array.from(e.target.files));
//   };

//   const handleRemoveExistingImage = (indexToRemove) => {
//     setFormData((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== indexToRemove),
//     }));
//   };

//   // --- DYNAMIC VARIANT HANDLERS ---
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
//           sizeChart: [],
//           sizeChartFile: null,
//           colors: [],
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
//       newVariants[variantIndex][name] = value;
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

//   const handleVariantSizeChartChange = (variantIndex, e) => {
//     const file = e.target.files[0];
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       newVariants[variantIndex].sizeChartFile = file;
//       newVariants[variantIndex].sizeChart = [];
//       return { ...prev, variants: newVariants };
//     });
//   };

//   // --- RE-ADDED: NESTED HANDLERS (Features, Specs, Colors) ---
//   const handleFeatureChange = (variantIndex, featureIndex, value) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       const newFeatures = [...newVariants[variantIndex].features];
//       newFeatures[featureIndex] = value;
//       newVariants[variantIndex] = {
//         ...newVariants[variantIndex],
//         features: newFeatures,
//       };
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleAddFeature = (variantIndex) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       const newFeatures = [...newVariants[variantIndex].features, ""];
//       newVariants[variantIndex] = {
//         ...newVariants[variantIndex],
//         features: newFeatures,
//       };
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleRemoveFeature = (variantIndex, featureIndex) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       const newFeatures = newVariants[variantIndex].features.filter(
//         (_, i) => i !== featureIndex
//       );
//       newVariants[variantIndex] = {
//         ...newVariants[variantIndex],
//         features: newFeatures,
//       };
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleSpecificationChange = (variantIndex, field, value) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       const newSpecifications = {
//         ...newVariants[variantIndex].specifications,
//         [field]: value,
//       };
//       newVariants[variantIndex] = {
//         ...newVariants[variantIndex],
//         specifications: newSpecifications,
//       };
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleAddColor = (variantIndex) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       const newColors = [
//         ...newVariants[variantIndex].colors,
//         { name: "", images: [], newImages: [] },
//       ];
//       newVariants[variantIndex] = {
//         ...newVariants[variantIndex],
//         colors: newColors,
//       };
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleRemoveColor = (variantIndex, colorIndex) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       const newColors = newVariants[variantIndex].colors.filter(
//         (_, i) => i !== colorIndex
//       );
//       newVariants[variantIndex] = {
//         ...newVariants[variantIndex],
//         colors: newColors,
//       };
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleColorNameChange = (variantIndex, colorIndex, value) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       const newColors = [...newVariants[variantIndex].colors];
//       newColors[colorIndex] = { ...newColors[colorIndex], name: value };
//       newVariants[variantIndex] = {
//         ...newVariants[variantIndex],
//         colors: newColors,
//       };
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleColorImagesChange = (variantIndex, colorIndex, files) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       const newColors = [...newVariants[variantIndex].colors];
//       newColors[colorIndex] = {
//         ...newColors[colorIndex],
//         newImages: Array.from(files),
//       };
//       newVariants[variantIndex] = {
//         ...newVariants[variantIndex],
//         colors: newColors,
//       };
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleRemoveExistingColorImage = (
//     variantIndex,
//     colorIndex,
//     imageIndex
//   ) => {
//     setFormData((prev) => {
//       const newVariants = [...prev.variants];
//       const newColors = [...newVariants[variantIndex].colors];
//       const newColorImages = newColors[colorIndex].images.filter(
//         (_, i) => i !== imageIndex
//       );
//       newColors[colorIndex] = {
//         ...newColors[colorIndex],
//         images: newColorImages,
//       };
//       newVariants[variantIndex] = {
//         ...newVariants[variantIndex],
//         colors: newColors,
//       };
//       return { ...prev, variants: newVariants };
//     });
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     setIsUploading(true);
//     try {
//       const newMainImageUrls = await Promise.all(
//         mainImagesToUpload.map(uploadSingleImage)
//       );
//       const finalMainImages = [
//         ...formData.images,
//         ...newMainImageUrls.filter(Boolean),
//       ];

//       const finalVariantsData = await Promise.all(
//         formData.variants.map(async (variant) => {
//           let finalSizeChartUrl = variant.sizeChart;
//           if (variant.sizeChartFile) {
//             const uploadedUrl = await uploadSingleImage(variant.sizeChartFile);
//             if (uploadedUrl) finalSizeChartUrl = [uploadedUrl];
//           }

//           const finalColors = await Promise.all(
//             variant.colors.map(async (color) => {
//               const newImageUrls = await Promise.all(
//                 (color.newImages || []).map(uploadSingleImage)
//               );
//               return {
//                 _id: color._id,
//                 name: color.name,
//                 images: [...color.images, ...newImageUrls.filter(Boolean)],
//               };
//             })
//           );

//           return {
//             _id: variant._id,
//             name: variant.name,
//             price: variant.price,
//             originalPrice: variant.originalPrice,
//             features: variant.features,
//             specifications: variant.specifications,
//             sizeChart: finalSizeChartUrl,
//             colors: finalColors,
//           };
//         })
//       );

//       setIsUploading(false);

//       const updatedProductData = {
//         ...formData,
//         images: finalMainImages,
//         variants: finalVariantsData,
//       };

//       delete updatedProductData._id;
//       delete updatedProductData.createdAt;
//       delete updatedProductData.updatedAt;
//       delete updatedProductData.__v;

//       await axios.put(`${API_BASE_URL}/admin/updateProduct`, {
//         _id: product._id,
//         updatedProduct: updatedProductData,
//       });

//       toast({ title: "Product Updated", variant: "success" });
//       onProductUpdated();
//       onClose();
//     } catch (err) {
//       console.error("Error updating product:", err);
//       toast({
//         title: "Failed to Update",
//         description: err.response?.data?.message || "Server error.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//       setIsUploading(false);
//     }
//   };

//   if (!formData)
//     return (
//       <Dialog open={isOpen} onOpenChange={onClose}>
//         <DialogContent>
//           <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//         </DialogContent>
//       </Dialog>
//     );

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Edit: {product.name}</DialogTitle>
//         </DialogHeader>
//         <div className="py-4 space-y-8">
//           <div className="space-y-4 p-4 border rounded-lg">
//             <h3 className="text-lg font-semibold">Basic Information</h3>
//             <div>
//               <Label>Name</Label>
//               <Input
//                 name="name"
//                 value={formData.name || ""}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <Label>Description</Label>
//               <Textarea
//                 name="description"
//                 value={formData.description || ""}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <Label>Category</Label>
//               <Input
//                 name="category"
//                 value={formData.category || ""}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold">Main Product Images *</h3>

//             <Input type="file" multiple onChange={handleMainFileChange} />
//           </div>

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

//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-semibold">Variants</h3>
//               <Button
//                 type="button"
//                 size="sm"
//                 variant="outline"
//                 onClick={handleAddVariant}
//               >
//                 <Plus className="h-4 w-4 mr-2" /> Add Variant
//               </Button>
//             </div>
//             {formData.variants.map((variant, variantIndex) => (
//               <div
//                 key={variant._id || `new-${variantIndex}`}
//                 className="p-4 border rounded-lg space-y-4 relative bg-card/40"
//               >
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   size="icon"
//                   className="absolute top-2 right-2 h-7 w-7"
//                   onClick={() => handleRemoveVariant(variantIndex)}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//                 <h4 className="font-semibold text-md">
//                   Variant: {variant.name || `New Variant`}
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <Label>Name</Label>
//                     <Select
//                       onValueChange={(value) =>
//                         handleVariantNameChange(variantIndex, value)
//                       }
//                       value={variant.name}
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Regular">Regular</SelectItem>
//                         <SelectItem value="Oversized">Oversized</SelectItem>
//                         <SelectItem value="Polo">Polo</SelectItem>
//                         <SelectItem value="Hoodie">Hoodie</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label>Price</Label>
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
//                   <Label>Size Chart</Label>
//                   <div className="flex flex-wrap gap-2 mb-2">
//                     {variant.sizeChart.map((url, i) => (
//                       <img
//                         key={i}
//                         src={url}
//                         className="w-20 h-20 object-cover rounded-md border"
//                         alt="Size Chart"
//                       />
//                     ))}
//                     {variant.sizeChartFile && (
//                       <img
//                         src={URL.createObjectURL(variant.sizeChartFile)}
//                         className="w-20 h-20 object-cover rounded-md border border-dashed border-primary"
//                         alt="New Preview"
//                       />
//                     )}
//                   </div>
//                   <Input
//                     type="file"
//                     onChange={(e) =>
//                       handleVariantSizeChartChange(variantIndex, e)
//                     }
//                   />
//                 </div>

//                 {/* --- RE-ADDED: Features Section --- */}
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
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Feature
//                   </Button>
//                 </div>

//                 {/* --- RE-ADDED: Specifications Section --- */}
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

//                 <div>
//                   <Label>Colors</Label>
//                   {variant.colors.map((color, colorIndex) => (
//                     <div
//                       key={color._id || `new-color-${colorIndex}`}
//                       className="p-2 border rounded-md mt-2 relative"
//                     >
//                       <Button
//                         type="button"
//                         variant="destructive"
//                         size="icon"
//                         className="absolute top-1 right-1 h-6 w-6"
//                         onClick={() =>
//                           handleRemoveColor(variantIndex, colorIndex)
//                         }
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                       <Input
//                         className="mb-2"
//                         placeholder="Color Name"
//                         value={color.name}
//                         onChange={(e) =>
//                           handleColorNameChange(
//                             variantIndex,
//                             colorIndex,
//                             e.target.value
//                           )
//                         }
//                       />
//                       <div className="flex flex-wrap gap-2 mb-2">
//                         {color.images.map((imgUrl, imgIndex) => (
//                           <div key={imgIndex} className="relative w-20 h-20">
//                             <img
//                               src={imgUrl}
//                               className="w-full h-full object-cover rounded-md"
//                               alt=""
//                             />
//                             <Button
//                               size="icon"
//                               variant="destructive"
//                               className="absolute -top-1 -right-1 h-5 w-5"
//                               onClick={() =>
//                                 handleRemoveExistingColorImage(
//                                   variantIndex,
//                                   colorIndex,
//                                   imgIndex
//                                 )
//                               }
//                             >
//                               <X className="h-3 w-3" />
//                             </Button>
//                           </div>
//                         ))}
//                         {(color.newImages || []).map((file, fileIndex) => (
//                           <div key={fileIndex} className="relative w-20 h-20">
//                             <img
//                               src={URL.createObjectURL(file)}
//                               className="w-full h-full object-cover rounded-md"
//                               alt=""
//                             />
//                           </div>
//                         ))}
//                       </div>
//                       <Input
//                         type="file"
//                         multiple
//                         onChange={(e) =>
//                           handleColorImagesChange(
//                             variantIndex,
//                             colorIndex,
//                             e.target.files
//                           )
//                         }
//                       />
//                     </div>
//                   ))}
//                   <Button
//                     size="sm"
//                     type="button"
//                     variant="outline"
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

//           <div className="space-y-4 p-4 border rounded-lg">
//             <h3 className="text-lg font-semibold">Other Settings</h3>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="isNew"
//                 checked={formData.isNew}
//                 onCheckedChange={(checked) =>
//                   handleCheckboxChange("isNew", !!checked)
//                 }
//               />
//               <Label htmlFor="isNew">New Arrival</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="onSale"
//                 checked={formData.onSale}
//                 onCheckedChange={(checked) =>
//                   handleCheckboxChange("onSale", !!checked)
//                 }
//               />
//               <Label htmlFor="onSale">On Sale</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="forHomePage"
//                 checked={formData.forHomePage}
//                 onCheckedChange={(checked) =>
//                   handleCheckboxChange("forHomePage", !!checked)
//                 }
//               />
//               <Label htmlFor="forHomePage">Display on Home Page</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="forDepartment"
//                 checked={formData.forDepartment}
//                 onCheckedChange={(checked) =>
//                   handleCheckboxChange("forDepartment", !!checked)
//                 }
//               />
//               <Label htmlFor="forDepartment">For Department Store</Label>
//             </div>
//             {formData.forDepartment && (
//               <div>
//                 <Label htmlFor="departmentName">Department Name</Label>
//                 <Input
//                   id="departmentName"
//                   name="departmentName"
//                   value={formData.departmentName || ""}
//                   onChange={handleChange}
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//         <DialogFooter>
//           <Button onClick={onClose} variant="outline">
//             Cancel
//           </Button>
//           <Button onClick={handleSave} disabled={loading}>
//             {loading ? (
//               <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//             ) : (
//               "Save Changes"
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EditProductModal;
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
  const [mainImagesToUpload, setMainImagesToUpload] = useState([]);

  useEffect(() => {
    if (product) {
      const productCopy = JSON.parse(JSON.stringify(product));
      const variantsWithUploadState = productCopy.variants.map((variant) => ({
        ...variant,
        sizeChartFile: null,
        colors: variant.colors.map((color) => ({
          ...color,
          newImages: [],
        })),
      }));
      setFormData({ ...productCopy, variants: variantsWithUploadState });
      setMainImagesToUpload([]);
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

  const handleAddColor = (variantIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      const newColors = [
        ...newVariants[variantIndex].colors,
        { name: "", images: [], newImages: [] },
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

  const handleColorNameChange = (variantIndex, colorIndex, value) => {
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

  const handleColorImagesChange = (variantIndex, colorIndex, files) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      const newColors = [...newVariants[variantIndex].colors];
      newColors[colorIndex] = {
        ...newColors[colorIndex],
        newImages: Array.from(files),
      };
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        colors: newColors,
      };
      return { ...prev, variants: newVariants };
    });
  };

  const handleRemoveExistingColorImage = (
    variantIndex,
    colorIndex,
    imageIndex
  ) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      const newColors = [...newVariants[variantIndex].colors];
      const newColorImages = newColors[colorIndex].images.filter(
        (_, i) => i !== imageIndex
      );
      newColors[colorIndex] = {
        ...newColors[colorIndex],
        images: newColorImages,
      };
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        colors: newColors,
      };
      return { ...prev, variants: newVariants };
    });
  };

  // --- SUBMISSION LOGIC ---
  const handleSave = async () => {
    setLoading(true);
    setIsUploading(true);
    try {
      const newMainImageUrls = await Promise.all(
        mainImagesToUpload.map(uploadSingleImage)
      );
      const finalMainImages = [
        ...formData.images,
        ...newMainImageUrls.filter(Boolean),
      ];

      const finalVariantsData = await Promise.all(
        formData.variants.map(async (variant) => {
          let finalSizeChartUrl = variant.sizeChart;
          if (variant.sizeChartFile) {
            const uploadedUrl = await uploadSingleImage(variant.sizeChartFile);
            if (uploadedUrl) finalSizeChartUrl = [uploadedUrl];
          }

          const finalColors = await Promise.all(
            variant.colors.map(async (color) => {
              const newImageUrls = await Promise.all(
                (color.newImages || []).map(uploadSingleImage)
              );
              return {
                _id: color._id,
                name: color.name,
                images: [...color.images, ...newImageUrls.filter(Boolean)],
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

          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Main Product Images</h3>
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
            <div>
              <Label htmlFor="mainImageUpload">Add New Images</Label>
              <Input
                id="mainImageUpload"
                type="file"
                multiple
                onChange={handleMainFileChange}
              />
            </div>
          </div>

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
                <div>
                  <Label>Colors</Label>
                  {variant.colors.map((color, colorIndex) => (
                    <div
                      key={color._id || `new-color-${colorIndex}`}
                      className="p-2 border rounded-md mt-2 relative"
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
                        className="mb-2"
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
                      <div className="flex flex-wrap gap-2 mb-2">
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
                        {(color.newImages || []).map((file, fileIndex) => (
                          <div key={fileIndex} className="relative w-20 h-20">
                            <img
                              src={URL.createObjectURL(file)}
                              className="w-full h-full object-cover rounded-md"
                              alt=""
                            />
                          </div>
                        ))}
                      </div>
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
                  ))}
                  <Button
                    size="sm"
                    type="button"
                    variant="outline"
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
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
