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
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  adminGetAllDepartments,
  adminCreateDepartment,
  adminUpdateDepartment,
  adminDeleteDepartment,
} from "../../api/apiService";

const ERROR_IMG_PLACEHOLDER =
  "https://placehold.co/128x64/222/fff?text=No+Image";

// --- Sub-component for the Add/Edit Modal ---
const DepartmentFormModal = ({ isOpen, onClose, department, onSave }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If editing, populate form with department data. Otherwise, set defaults.
    if (department) {
      setFormData({
        name: department.name || "",
        college: department.college || "IIT (ISM) Dhanbad",
        description: department.description || "",
        image: department.image || "",
        isActive: department.isActive !== false, // Default to true if undefined
      });
    } else {
      setFormData({
        name: "",
        college: "IIT (ISM) Dhanbad",
        description: "",
        image: "",
        isActive: true,
      });
    }
  }, [department, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
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
          <DialogDescription>
            {department
              ? "Update the details for this department."
              : "This will add a new department option for College Store products."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="college">College</Label>
              <Input
                id="college"
                name="college"
                value={formData.college}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                />
                <img
                  src={formData.image || ERROR_IMG_PLACEHOLDER}
                  alt="preview"
                  className="w-24 h-12 object-cover rounded-md border"
                  onError={(e) => (e.target.src = ERROR_IMG_PLACEHOLDER)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Active (Visible for selection)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Department"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminGetAllDepartments();
      console.log(response);
      setDepartments(response.data.departments);
    } catch (err) {
      console.error("Error fetching departments:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to fetch departments.";
      setError(errorMsg);
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
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
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving department:", err);
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
        "Are you sure? This cannot be undone and will only work if no products are assigned to this department."
      )
    ) {
      return;
    }
    try {
      await adminDeleteDepartment(departmentId);
      toast({
        title: "Success",
        description: "Department deleted successfully.",
      });
      fetchDepartments();
    } catch (err) {
      console.error("Error deleting department:", err);
      toast({
        title: "Delete Failed",
        description: err.response?.data?.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  const openModal = (department = null) => {
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="bg-card/50 border-border/50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold gradient-text">
              Department Management
            </CardTitle>
            <CardDescription>
              Create and manage departments for the College Store.
            </CardDescription>
          </div>
          <Button onClick={() => openModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Department
          </Button>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-10">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept._id} className="hover:bg-muted/50">
                      <TableCell>
                        <img
                          src={dept.image || ERROR_IMG_PLACEHOLDER}
                          alt={dept.name}
                          className="w-24 h-12 object-cover rounded-md border"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{dept.college}</TableCell>
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
                          onClick={() => openModal(dept)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(dept._id)}
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        department={editingDepartment}
        onSave={handleSave}
      />
    </>
  );
};

export default DepartmentManagement;
