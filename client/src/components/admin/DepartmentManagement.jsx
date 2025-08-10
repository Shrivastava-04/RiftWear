// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Loader2, Plus, Edit, Trash2, Package } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch"; // For productIsAvailable
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"; // For selecting productId

// const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// const DepartmentManagement = () => {
//   const [departments, setDepartments] = useState([]);
//   const [products, setProducts] = useState([]); // State to hold products for the dropdown
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [currentDepartment, setCurrentDepartment] = useState(null); // Department being edited

//   // Form states for Create/Edit modals
//   const [departmentName, setDepartmentName] = useState("");
//   // IMPORTANT FIX: Changed initial state to a specific non-empty string for 'no selection'
//   const [selectedProductId, setSelectedProductId] = useState("no-product");
//   const [productAvailability, setProductAvailability] = useState(false);

//   // --- Fetch Departments ---
//   const fetchDepartments = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // CORRECTED ROUTE: Backend uses "/departments" for GET all
//       const response = await axios.get(
//         `${API_BASE_URL}/departments/get-department`
//       );
//       setDepartments(response.data);
//     } catch (err) {
//       console.error("Error fetching departments:", err);
//       setError(err.response?.data?.message || "Failed to fetch departments.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Fetch Products (for productId dropdown) ---
//   const fetchProducts = async () => {
//     try {
//       // CORRECTED ROUTE: Backend uses "/product" for GET all
//       const response = await axios.get(
//         `${API_BASE_URL}/product/getallproduct`,
//         {
//           withCredentials: true, // Assuming product fetching might also need auth
//         }
//       );
//       setProducts(response.data); // Assuming response.data is an array of products
//     } catch (err) {
//       console.error("Error fetching products for dropdown:", err);
//       // Don't set a global error here, as departments might still load
//     }
//   };

//   useEffect(() => {
//     fetchDepartments();
//     fetchProducts(); // Fetch products when component mounts
//   }, []);

//   // --- Handle Create/Edit Form Submission ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     const departmentData = {
//       name: departmentName,
//       // Convert 'no-product' string to actual null before sending to backend
//       productId: selectedProductId === "no-product" ? null : selectedProductId,
//       productIsAvailable: productAvailability,
//     };

//     try {
//       if (currentDepartment) {
//         // Editing existing department
//         // CORRECTED ROUTE AND AXIOS.PUT USAGE: ID goes in URL path, data is second argument
//         await axios.put(
//           `${API_BASE_URL}/departments/update-department`,
//           { params: { id: currentDepartment._id } },
//           departmentData
//         );
//         alert("Department updated successfully!");
//       } else {
//         // Creating new department
//         // CORRECTED ROUTE: Backend uses "/departments" for POST
//         await axios.post(
//           `${API_BASE_URL}/departments/create-department`,
//           departmentData
//         );
//         alert("Department created successfully!");
//       }
//       resetForm();
//       setIsCreateModalOpen(false);
//       setIsEditModalOpen(false);
//       fetchDepartments(); // Re-fetch departments to update the list
//     } catch (err) {
//       console.error("Error saving department:", err);
//       setError(err.response?.data?.message || "Failed to save department.");
//       alert(
//         "Error: " +
//           (err.response?.data?.message || "Failed to save department.")
//       );
//     }
//   };

//   // --- Handle Delete Department ---
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this department?")) {
//       setError(null);
//       try {
//         // CORRECTED ROUTE AND AXIOS.DELETE USAGE: ID goes in URL path
//         await axios.delete(`${API_BASE_URL}/departments/delete-department`, {
//           params: { id },
//         });
//         alert("Department deleted successfully!");
//         fetchDepartments(); // Re-fetch departments
//       } catch (err) {
//         console.error("Error deleting department:", err);
//         setError(err.response?.data?.message || "Failed to delete department.");
//         alert(
//           "Error: " +
//             (err.response?.data?.message || "Failed to delete department.")
//         );
//       }
//     }
//   };

//   // --- Reset Form Fields ---
//   const resetForm = () => {
//     setDepartmentName("");
//     setSelectedProductId("no-product"); // IMPORTANT FIX: Reset to the non-empty 'no selection' value
//     setProductAvailability(false);
//     setCurrentDepartment(null);
//   };

//   // --- Open Create Modal ---
//   const openCreateModal = () => {
//     resetForm(); // Ensure form is clear
//     setIsCreateModalOpen(true);
//   };

//   // --- Open Edit Modal ---
//   const openEditModal = (department) => {
//     setCurrentDepartment(department);
//     setDepartmentName(department.name);
//     // IMPORTANT FIX: Set 'no-product' if productId is null/undefined, otherwise set actual ID
//     setSelectedProductId(department.productId?._id || "no-product");
//     setProductAvailability(department.productIsAvailable);
//     setIsEditModalOpen(true);
//   };

//   if (loading) {
//     return (
//       <Card className="bg-card/50 border-border/50 p-6 flex items-center justify-center min-h-[300px]">
//         <Loader2 className="h-6 w-6 animate-spin mr-2" />
//         <p>Loading departments...</p>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="bg-card/50 border-destructive/50 p-6 text-destructive">
//         <p>Error: {error}</p>
//       </Card>
//     );
//   }

//   return (
//     <Card className="bg-card/50 border-border/50">
//       <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
//         <CardTitle className="text-xl sm:text-2xl gradient-text">
//           Department Management
//         </CardTitle>
//         <Button onClick={openCreateModal} size="sm">
//           <Plus className="h-4 w-4 mr-2" /> Add New Department
//         </Button>
//       </CardHeader>
//       <CardContent className="p-4 sm:p-6">
//         {departments.length === 0 ? (
//           <p className="text-foreground/70 text-center py-4">
//             No departments found.
//           </p>
//         ) : (
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Department Name</TableHead>
//                   <TableHead>Associated Product</TableHead>
//                   <TableHead>Product Available</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {departments.map((department) => (
//                   <TableRow key={department._id}>
//                     <TableCell className="font-medium">
//                       {department.name}
//                     </TableCell>
//                     <TableCell>{department.productId?.name || "N/A"}</TableCell>
//                     <TableCell>
//                       {department.productIsAvailable ? "Yes" : "No"}
//                     </TableCell>
//                     <TableCell className="text-right flex justify-end space-x-2">
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         onClick={() => openEditModal(department)}
//                       >
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="destructive"
//                         size="icon"
//                         onClick={() => handleDelete(department._id)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         )}
//       </CardContent>

//       {/* Create/Edit Department Dialog */}
//       <Dialog
//         open={isCreateModalOpen || isEditModalOpen}
//         onOpenChange={(isOpen) => {
//           if (!isOpen) {
//             setIsCreateModalOpen(false);
//             setIsEditModalOpen(false);
//             resetForm(); // Reset form on close
//           }
//         }}
//       >
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>
//               {currentDepartment ? "Edit Department" : "Create New Department"}
//             </DialogTitle>
//             <DialogDescription>
//               {currentDepartment
//                 ? "Make changes to the department here."
//                 : "Fill in the details for the new department."}
//             </DialogDescription>
//           </DialogHeader>
//           <form onSubmit={handleSubmit} className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="departmentName" className="text-right">
//                 Name
//               </Label>
//               <Input
//                 id="departmentName"
//                 name="departmentName"
//                 value={departmentName}
//                 onChange={(e) => setDepartmentName(e.target.value)}
//                 className="col-span-3"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="productId" className="text-right">
//                 Product
//               </Label>
//               <Select
//                 value={selectedProductId}
//                 onValueChange={setSelectedProductId}
//               >
//                 <SelectTrigger id="productId" className="col-span-3">
//                   <SelectValue placeholder="Select an associated product" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {/* IMPORTANT FIX: Changed value from "" to "no-product" */}
//                   <SelectItem value="no-product">None</SelectItem>
//                   {products.map((product) => (
//                     <SelectItem key={product._id} value={product._id}>
//                       {product.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="productAvailability" className="text-right">
//                 Product Available
//               </Label>
//               <Switch
//                 id="productAvailability"
//                 checked={productAvailability}
//                 onCheckedChange={setProductAvailability}
//                 className="col-span-3"
//               />
//             </div>
//             <DialogFooter>
//               <Button type="submit">
//                 {currentDepartment ? "Save Changes" : "Create Department"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </Card>
//   );
// };

// export default DepartmentManagement;
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Edit, Trash2, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"; // For productIsAvailable
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // For selecting productId

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [products, setProducts] = useState([]); // State to hold products for the dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null); // Department being edited

  // Form states for Create/Edit modals
  const [departmentName, setDepartmentName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("no-product");
  const [productAvailability, setProductAvailability] = useState(false);

  // --- Fetch Departments ---
  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend uses "/departments" for GET all
      const response = await axios.get(
        `${API_BASE_URL}/departments/get-department`,
        {
          withCredentials: true, // Important for sending cookies/JWT
        }
      );
      setDepartments(response.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError(err.response?.data?.message || "Failed to fetch departments.");
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch Products (for productId dropdown) ---
  const fetchProducts = async () => {
    try {
      // Backend uses "/product" for GET all
      const response = await axios.get(
        `${API_BASE_URL}/product/getallproduct`,
        {
          withCredentials: true, // Assuming product fetching might also need auth
        }
      );
      setProducts(response.data); // Assuming response.data is an array of products
    } catch (err) {
      console.error("Error fetching products for dropdown:", err);
      // Don't set a global error here, as departments might still load
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchProducts(); // Fetch products when component mounts
  }, []);

  // --- Handle Create/Edit Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const departmentData = {
      name: departmentName,
      // Convert 'no-product' string to actual null before sending to backend
      productId: selectedProductId === "no-product" ? null : selectedProductId,
      productIsAvailable: productAvailability,
    };

    try {
      if (currentDepartment) {
        // Editing existing department
        // FIX: Corrected axios.put to send ID as a query parameter in the config object
        await axios.put(
          `${API_BASE_URL}/departments/update-department`,
          departmentData, // This is the request body
          {
            params: { id: currentDepartment._id }, // This correctly sends 'id' as a query parameter
            withCredentials: true,
          }
        );
        alert("Department updated successfully!");
      } else {
        // Creating new department
        await axios.post(
          `${API_BASE_URL}/departments/create-department`,
          departmentData,
          { withCredentials: true }
        );
        alert("Department created successfully!");
      }
      resetForm();
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
      fetchDepartments(); // Re-fetch departments to update the list
    } catch (err) {
      console.error("Error saving department:", err);
      setError(err.response?.data?.message || "Failed to save department.");
      alert(
        "Error: " +
          (err.response?.data?.message || "Failed to save department.")
      );
    }
  };

  // --- Handle Delete Department ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      setError(null);
      try {
        // CORRECTED ROUTE AND AXIOS.DELETE USAGE: ID goes in URL path
        await axios.delete(`${API_BASE_URL}/departments/delete-department`, {
          params: { id },
          withCredentials: true, // Ensure credentials are sent for DELETE requests too
        });
        alert("Department deleted successfully!");
        fetchDepartments(); // Re-fetch departments
      } catch (err) {
        console.error("Error deleting department:", err);
        setError(err.response?.data?.message || "Failed to delete department.");
        alert(
          "Error: " +
            (err.response?.data?.message || "Failed to delete department.")
        );
      }
    }
  };

  // --- Reset Form Fields ---
  const resetForm = () => {
    setDepartmentName("");
    setSelectedProductId("no-product"); // Reset to the non-empty 'no selection' value
    setProductAvailability(false);
    setCurrentDepartment(null);
  };

  // --- Open Create Modal ---
  const openCreateModal = () => {
    resetForm(); // Ensure form is clear
    setIsCreateModalOpen(true);
  };

  // --- Open Edit Modal ---
  const openEditModal = (department) => {
    setCurrentDepartment(department);
    setDepartmentName(department.name);
    setSelectedProductId(department.productId?._id || "no-product");
    setProductAvailability(department.productIsAvailable);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <Card className="bg-card/50 border-border/50 p-6 flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Loading departments...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card/50 border-destructive/50 p-6 text-destructive">
        <p>Error: {error}</p>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl gradient-text">
          Department Management
        </CardTitle>
        <Button onClick={openCreateModal} size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add New Department
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {departments.length === 0 ? (
          <p className="text-foreground/70 text-center py-4">
            No departments found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department Name</TableHead>
                  <TableHead>Associated Product</TableHead>
                  <TableHead>Product Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((department) => (
                  <TableRow key={department._id}>
                    <TableCell className="font-medium">
                      {department.name}
                    </TableCell>
                    <TableCell>{department.productId?.name || "N/A"}</TableCell>
                    <TableCell>
                      {department.productIsAvailable ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="text-right flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(department)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(department._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Create/Edit Department Dialog */}
      <Dialog
        open={isCreateModalOpen || isEditModalOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            resetForm(); // Reset form on close
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentDepartment ? "Edit Department" : "Create New Department"}
            </DialogTitle>
            <DialogDescription>
              {currentDepartment
                ? "Make changes to the department here."
                : "Fill in the details for the new department."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="departmentName" className="text-right">
                Name
              </Label>
              <Input
                id="departmentName"
                name="departmentName"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productId" className="text-right">
                Product
              </Label>
              <Select
                value={selectedProductId}
                onValueChange={setSelectedProductId}
              >
                <SelectTrigger id="productId" className="col-span-3">
                  <SelectValue placeholder="Select an associated product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-product">None</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productAvailability" className="text-right">
                Product Available
              </Label>
              <Switch
                id="productAvailability"
                checked={productAvailability}
                onCheckedChange={setProductAvailability}
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button type="submit">
                {currentDepartment ? "Save Changes" : "Create Department"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DepartmentManagement;
