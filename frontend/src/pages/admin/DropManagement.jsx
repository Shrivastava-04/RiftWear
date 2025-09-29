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
  adminGetAllDrops,
  adminCreateDrop,
  adminUpdateDrop,
  adminDeleteDrop,
} from "@/api/apiService";

// Helper to format date strings into YYYY-MM-DD for date inputs
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

// Helper to format date strings into HH:mm for time inputs
const formatTimeForInput = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// --- Sub-component for the Add/Edit Modal ---
const DropFormModal = ({ isOpen, onClose, drop, onSave }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (drop) {
      setFormData({
        name: drop.name || "",
        description: drop.description || "",
        targetCollection: drop.targetCollection || "",
        startDate: formatDateForInput(drop.startDate),
        startTime: formatTimeForInput(drop.startDate),
        endDate: formatDateForInput(drop.endDate),
        endTime: formatTimeForInput(drop.endDate),
        isActive: drop.isActive || false,
      });
    } else {
      // Defaults for a new drop
      setFormData({
        name: "",
        description: "",
        targetCollection: "",
        startDate: "",
        startTime: "12:00",
        endDate: "",
        endTime: "12:00",
        isActive: false,
      });
    }
  }, [drop, isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Combine date and time into full ISO strings
    const finalData = {
      ...formData,
      startDate: `${formData.startDate}T${formData.startTime}:00`,
      endDate: `${formData.endDate}T${formData.endTime}:00`,
    };
    // Remove temporary time fields
    delete finalData.startTime;
    delete finalData.endTime;

    await onSave(finalData, drop?._id);
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {drop ? "Edit Drop Event" : "Create New Drop Event"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details for your drop. You can activate it here or from
            the Site Settings page.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="name">Drop Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="targetCollection">Target Collection</Label>
              <Input
                id="targetCollection"
                name="targetCollection"
                value={formData.targetCollection}
                onChange={handleChange}
                required
                placeholder="e.g., Anime Collection"
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(c) =>
                  setFormData((p) => ({ ...p, isActive: c }))
                }
              />
              <Label htmlFor="isActive">Drop is Active</Label>
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
                </>
              ) : null}{" "}
              Save Drop
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DropManagement = () => {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDrop, setEditingDrop] = useState(null);

  const fetchDrops = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminGetAllDrops();
      setDrops(response.data.drops);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch drops.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrops();
  }, [fetchDrops]);

  const handleSave = async (formData, dropId) => {
    try {
      if (dropId) {
        await adminUpdateDrop(dropId, formData);
        toast({ title: "Success", description: "Drop updated successfully." });
      } else {
        await adminCreateDrop(formData);
        toast({ title: "Success", description: "Drop created successfully." });
      }
      fetchDrops();
      setIsModalOpen(false);
    } catch (err) {
      toast({
        title: "Save Failed",
        description: err.response?.data?.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (dropId) => {
    if (!window.confirm("Are you sure you want to delete this drop event?"))
      return;
    try {
      await adminDeleteDrop(dropId);
      toast({ title: "Success", description: "Drop deleted successfully." });
      fetchDrops();
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: err.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  const openModal = (drop = null) => {
    setEditingDrop(drop);
    setIsModalOpen(true);
  };

  const formatDateTime = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <>
      <Card className="bg-card/50 border-border/50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold gradient-text">
              Drop Event Management
            </CardTitle>
            <CardDescription>
              Create and manage timed release events for your product
              collections.
            </CardDescription>
          </div>
          <Button onClick={() => openModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Drop
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
                    <TableHead>Name</TableHead>
                    <TableHead>Target Collection</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drops.map((drop) => (
                    <TableRow key={drop._id}>
                      <TableCell className="font-medium">{drop.name}</TableCell>
                      <TableCell>{drop.targetCollection}</TableCell>
                      <TableCell>{formatDateTime(drop.startDate)}</TableCell>
                      <TableCell>{formatDateTime(drop.endDate)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={drop.isActive ? "success" : "secondary"}
                        >
                          {drop.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openModal(drop)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(drop._id)}
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

      <DropFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        drop={editingDrop}
        onSave={handleSave}
      />
    </>
  );
};

export default DropManagement;
