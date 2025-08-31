import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Loader2, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import UserDetailsModal from "./UserDetailsModal";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { toast } = useToast();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // IMPROVEMENT: State to track which user's details are being loaded
  const [detailsLoadingFor, setDetailsLoadingFor] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/admin/users`);
      setUsers(response.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [API_BASE_URL]);

  // --- CORRECTED: Function to fetch a single user's full details ---
  const fetchUserDetails = async (userId) => {
    setDetailsLoadingFor(userId); // Start loading for this specific user
    try {
      // Use the correct admin route: /admin/users/:id
      const response = await axios.get(`${API_BASE_URL}/admin/users/${userId}`);
      setSelectedUser(response.data.user);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching user details:", err);
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to fetch user details.",
        variant: "destructive",
      });
    } finally {
      setDetailsLoadingFor(null); // Stop loading
    }
  };

  const handleViewDetails = (user) => {
    fetchUserDetails(user._id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Note: Ensure you have a DELETE /admin/users/:id route on your backend
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      // This route might need to be added to your admin.routes.js
      await axios.delete(`${API_BASE_URL}/admin/users/${userId}`);
      toast({
        title: "User Deleted",
        description: "User was removed successfully.",
        variant: "success",
      });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      toast({
        title: "Failed to Delete",
        description: err.response?.data?.message || "Server error.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user) => {
    alert(`Implement edit functionality for user: ${user.name}`);
  };

  if (loading) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Loading users...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-destructive">
        <p>Error: {error}</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-center py-4">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell className="text-right flex space-x-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(user)}
                        disabled={!!detailsLoadingFor}
                      >
                        {/* IMPROVEMENT: Show spinner only on the clicked row */}
                        {detailsLoadingFor === user._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteUser(user._id)}
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

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </Card>
  );
};

export default UserManagement;
