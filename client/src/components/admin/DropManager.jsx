// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Loader2 } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// const DropManager = () => {
//   const [dropDate, setDropDate] = useState("");
//   const [currentDropDate, setCurrentDropDate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const { toast } = useToast();

//   const fetchDropDate = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/drops/drop-date`);
//       setCurrentDropDate(response.data.endDate);
//     } catch (error) {
//       if (error.response?.status === 404) {
//         setCurrentDropDate(null);
//       } else {
//         toast({
//           title: "Error fetching drop date",
//           description: "Could not load the current drop date.",
//           variant: "destructive",
//         });
//         console.error("Error fetching drop date:", error);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDropDate();
//   }, []);

//   const handleSaveDropDate = async () => {
//     if (!dropDate) {
//       toast({
//         title: "Validation Error",
//         description: "Please select an end date.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsSaving(true);
//     try {
//       await axios.put(`${API_BASE_URL}/drops/admin/drop-date`, {
//         endDate: dropDate,
//       });
//       toast({
//         title: "Success",
//         description: "Drop date saved successfully!",
//         variant: "success",
//       });
//       fetchDropDate();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save drop date.",
//         variant: "destructive",
//       });
//       console.error("Error saving drop date:", error);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <Card className="bg-card/50 border-border/50 p-6">
//       <CardHeader>
//         <CardTitle className="text-2xl gradient-text">
//           Manage Drop Date
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {loading ? (
//           <div className="flex items-center justify-center">
//             <Loader2 className="h-5 w-5 animate-spin mr-2" />
//             <span>Loading...</span>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {currentDropDate ? (
//               <p className="text-sm">
//                 Current drop ends on:{" "}
//                 <strong>
//                   {new Date(currentDropDate).toLocaleDateString()}
//                 </strong>
//               </p>
//             ) : (
//               <p className="text-sm text-muted-foreground">
//                 No drop date is currently set.
//               </p>
//             )}
//             <div>
//               <Label htmlFor="drop-date">Set New Drop End Date</Label>
//               <Input
//                 id="drop-date"
//                 type="date"
//                 value={dropDate}
//                 onChange={(e) => setDropDate(e.target.value)}
//                 className="mt-2"
//               />
//             </div>
//             <Button onClick={handleSaveDropDate} disabled={isSaving}>
//               {isSaving ? (
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//               ) : (
//                 "Save Drop Date"
//               )}
//             </Button>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default DropManager;
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
    if (!dropDate) {
      toast({
        title: "Validation Error",
        description: "Please select an end date.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/drops/admin/drop-date`, {
        endDate: dropDate,
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
                <strong>
                  {new Date(currentDropDate).toLocaleDateString("en-GB")}
                </strong>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No drop date is currently set.
              </p>
            )}
            <div>
              <Label htmlFor="drop-date">Set New Drop End Date</Label>
              <Input
                id="drop-date"
                type="date"
                value={dropDate}
                onChange={(e) => setDropDate(e.target.value)}
                className="mt-2"
              />
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
