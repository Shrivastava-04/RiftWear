import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const DropManager = () => {
  const [dropDate, setDropDate] = useState("");
  const [dropTime, setDropTime] = useState(""); // NEW: State for time input
  const [currentDropDate, setCurrentDropDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchDropDate = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/drops/drop-date`);
      setCurrentDropDate(response.data.endDate);
    } catch (error) {
      if (error.response?.status === 404) {
        setCurrentDropDate(null);
      } else {
        toast({
          title: "Error fetching drop date",
          description: "Could not load the current drop date.",
          variant: "destructive",
        });
        console.error("Error fetching drop date:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropDate();
  }, []);

  const handleSaveDropDate = async () => {
    if (!dropDate || !dropTime) {
      toast({
        title: "Validation Error",
        description: "Please select both a date and time.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Combine date and time into a single string for the backend
      await axios.put(`${API_BASE_URL}/drops/admin/drop-date`, {
        endDate: `${dropDate}T${dropTime}:00`, // Format as ISO 8601 string
      });
      toast({
        title: "Success",
        description: "Drop date saved successfully!",
        variant: "success",
      });
      fetchDropDate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save drop date.",
        variant: "destructive",
      });
      console.error("Error saving drop date:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to format date to DD-MM-YYYY HH:mm:ss in IST
  const formatIST = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Card className="bg-card/50 border-border/50 p-6">
      <CardHeader>
        <CardTitle className="text-2xl gradient-text">
          Manage Drop Date
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span>Loading...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {currentDropDate ? (
              <p className="text-sm">
                Current drop ends on:{" "}
                <strong>{formatIST(currentDropDate)}</strong>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No drop date is currently set.
              </p>
            )}
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="drop-date">Date</Label>
                <Input
                  id="drop-date"
                  type="date"
                  value={dropDate}
                  onChange={(e) => setDropDate(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="drop-time">Time (IST)</Label>
                <Input
                  id="drop-time"
                  type="time"
                  value={dropTime}
                  onChange={(e) => setDropTime(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            <Button onClick={handleSaveDropDate} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                "Save Drop Date"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DropManager;
