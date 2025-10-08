import React, { useState, useEffect, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  BookCopy,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  adminGetAllDepartments,
  adminCreateDepartment,
  adminUpdateDepartment,
  adminDeleteDepartment,
  adminGetAllProducts,
  adminAddProductsToDepartment,
  adminRemoveProductsFromDepartment,
} from "../../api/apiService";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- Sub-component for Creating/Editing a Department ---
const DepartmentFormModal = ({ isOpen, onClose, department, onSave }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || "",
        college: department.college || "IIT (ISM) Dhanbad",
        description: department.description || "",
        isActive: department.isActive || false,
      });
    } else {
      setFormData({
        name: "",
        college: "IIT (ISM) Dhanbad",
        description: "",
        isActive: false, // UPDATED: Default to false to match schema
      });
    }
  }, [department, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData, department?._id);
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {department ? "Edit Department" : "Create New Department"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div>
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="college">College</Label>
            <Input
              id="college"
              name="college"
              value={formData.college || ""}
              disabled
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="isActive"
              checked={formData.isActive || false}
              onCheckedChange={(c) =>
                setFormData((p) => ({ ...p, isActive: c }))
              }
            />
            <Label htmlFor="isActive">Active (Visible for selection)</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Department
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// --- NEW Sub-component for Managing Products in a Department ---
const ManageProductsModal = ({ isOpen, onClose, department, onUpdate }) => {
  // console.log(department);
  const { toast } = useToast();
  const [allProducts, setAllProducts] = useState([]);
  const [assignedIds, setAssignedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && department) {
      console.log(department);
      setLoading(true);
      adminGetAllProducts()
        .then((response) => {
          setAllProducts(
            response.data.products.filter((a) => {
              return (
                a.category.department === department.name &&
                a.category.college === department.college
              );
            }) || []
          );
          setAssignedIds(new Set(department.products || []));
        })
        .catch(() =>
          toast({
            title: "Error",
            description: "Could not fetch products.",
            variant: "destructive",
          })
        )
        .finally(() => setLoading(false));
    }
  }, [isOpen, department, toast]);

  const handleAssign = (productId) => {
    setAssignedIds((prev) => new Set(prev).add(productId));
  };

  const handleUnassign = (productId) => {
    const newSet = new Set(assignedIds);
    newSet.delete(productId);
    setAssignedIds(newSet);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const originalIds = new Set(department.products || []);
      const currentIds = assignedIds;

      const productsToAdd = [...currentIds].filter(
        (id) => !originalIds.has(id)
      );
      const productsToRemove = [...originalIds].filter(
        (id) => !currentIds.has(id)
      );

      console.log(productsToAdd, productsToRemove);

      const promises = [];
      if (productsToAdd.length > 0) {
        console.log(department._id);
        promises.push(
          adminAddProductsToDepartment(department._id, productsToAdd)
        );
      }
      if (productsToRemove.length > 0) {
        console.log(department);
        promises.push(
          adminRemoveProductsFromDepartment(department._id, productsToRemove)
        );
      }

      await Promise.all(promises);
      toast({ title: "Success", description: "Product assignments updated." });
      onUpdate(); // Refresh the main department list
      onClose();
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Failed to save changes.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const unassignedProducts = allProducts.filter((p) => !assignedIds.has(p._id));
  const assignedProducts = allProducts.filter((p) => assignedIds.has(p._id));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Manage Products for: {department?.name}</DialogTitle>
          <DialogDescription>
            Add or remove products from this department.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 h-[60vh] pt-4">
            {/* Unassigned Products Column */}
            <div className="flex flex-col border rounded-lg">
              <h3 className="p-3 font-semibold border-b">
                Available Products ({unassignedProducts.length})
              </h3>
              <ScrollArea className="flex-grow p-2">
                {unassignedProducts.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted"
                  >
                    <span className="text-sm">{p.name}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleAssign(p._id)}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </div>

            {/* Assigned Products Column */}
            <div className="flex flex-col border rounded-lg">
              <h3 className="p-3 font-semibold border-b">
                Assigned Products ({assignedProducts.length})
              </h3>
              <ScrollArea className="flex-grow p-2">
                {assignedProducts.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted"
                  >
                    <span className="text-sm">{p.name}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleUnassign(p._id)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- Main Page Component ---
const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [managingDepartment, setManagingDepartment] = useState(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminGetAllDepartments();
      setDepartments(response.data.departments);
    } catch (err) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to fetch departments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleSave = async (formData, departmentId) => {
    try {
      if (departmentId) {
        await adminUpdateDepartment(departmentId, formData);
        toast({
          title: "Success",
          description: "Department updated successfully.",
        });
      } else {
        await adminCreateDepartment(formData);
        toast({
          title: "Success",
          description: "Department created successfully.",
        });
      }
      fetchDepartments();
      setIsFormModalOpen(false);
    } catch (err) {
      toast({
        title: "Save Failed",
        description: err.response?.data?.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (departmentId) => {
    if (
      !window.confirm(
        "Are you sure? This will only work if no products are assigned to this department."
      )
    )
      return;
    try {
      await adminDeleteDepartment(departmentId);
      toast({
        title: "Success",
        description: "Department deleted successfully.",
      });
      fetchDepartments();
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: err.response?.data?.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  const openFormModal = (department = null) => {
    setEditingDepartment(department);
    setIsFormModalOpen(true);
  };

  const openProductModal = (department) => {
    setManagingDepartment(department);
    setIsProductModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Department Management
            </CardTitle>
            <CardDescription>
              Create and manage departments for the College Store.
            </CardDescription>
          </div>
          <Button onClick={() => openFormModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept._id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{dept.college}</TableCell>
                      <TableCell>{dept.products?.length || 0}</TableCell>
                      <TableCell>
                        <Badge
                          variant={dept.isActive ? "success" : "secondary"}
                        >
                          {dept.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openProductModal(dept)}
                          title="Manage Products"
                        >
                          <BookCopy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openFormModal(dept)}
                          title="Edit Department"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(dept._id)}
                          title="Delete Department"
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
      </Card>

      <DepartmentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        department={editingDepartment}
        onSave={handleSave}
      />

      <ManageProductsModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        department={managingDepartment}
        onUpdate={fetchDepartments}
      />
    </>
  );
};

export default DepartmentManagement;
