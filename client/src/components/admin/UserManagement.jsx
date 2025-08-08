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
import { Eye, Loader2, Trash2, Edit } from "lucide-react"; // Ensure Trash2 and Edit are imported

import UserDetailsModal from "./UserDetailsModal";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${userId}`);
      // Optionally, show a toast notification here
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error("Error deleting user:", err);
      // Optionally, show an error toast here
    }
  };

  const handleEditUser = (user) => {
    alert(`Implement edit functionality for user: ${user.name}`);
    // You would typically navigate to an edit form or open an edit modal here.
  };

  if (loading) {
    return (
      <Card className="bg-card/50 border-border/50 p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Loading users...</p>
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
        {" "}
        {/* Adjusted padding */}
        <CardTitle className="text-xl sm:text-2xl gradient-text">
          {" "}
          {/* Adjusted font size */}
          All Users ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {" "}
        {/* Adjusted padding */}
        {users.length === 0 ? (
          <p className="text-foreground/70 text-center py-4">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            {" "}
            {/* Allows horizontal scrolling for table on small screens */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Email</TableHead>
                  <TableHead className="whitespace-nowrap">Role</TableHead>
                  <TableHead className="text-right whitespace-nowrap">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium whitespace-normal">
                      {" "}
                      {/* Allows name to wrap */}
                      {user.name}
                    </TableCell>
                    <TableCell className="whitespace-normal text-sm">
                      {" "}
                      {/* Allows email to wrap, smaller font */}
                      {user.email}
                    </TableCell>
                    <TableCell className="capitalize whitespace-nowrap">
                      {" "}
                      {/* Capitalize and prevent wrap */}
                      {user.role}
                    </TableCell>
                    <TableCell className="text-right flex space-x-1 justify-end">
                      {" "}
                      {/* Adjusted spacing */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(user)}
                      >
                        <Eye className="h-4 w-4" />
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

      {/* User Details Modal Render */}
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
