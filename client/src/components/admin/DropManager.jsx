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
//   const [dropStartDate, setDropStartDate] = useState("");
//   const [dropStartTime, setDropStartTime] = useState("");
//   const [dropEndDate, setDropEndDate] = useState("");
//   const [dropEndTime, setDropEndTime] = useState("");
//   const [currentDrop, setCurrentDrop] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isSavingStart, setIsSavingStart] = useState(false);
//   const [isSavingEnd, setIsSavingEnd] = useState(false);
//   const { toast } = useToast();

//   const fetchDropDates = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/drops/drop-date`);
//       const fetchedDrop = response.data;
//       setCurrentDrop(fetchedDrop);

//       // Initialize state with fetched data for editing
//       if (fetchedDrop.startDate) {
//         const start = new Date(fetchedDrop.startDate);
//         setDropStartDate(start.toISOString().split("T")[0]);
//         setDropStartTime(start.toTimeString().slice(0, 5));
//       }
//       if (fetchedDrop.endDate) {
//         const end = new Date(fetchedDrop.endDate);
//         setDropEndDate(end.toISOString().split("T")[0]);
//         setDropEndTime(end.toTimeString().slice(0, 5));
//       }
//     } catch (error) {
//       if (error.response?.status === 404) {
//         setCurrentDrop(null);
//       } else {
//         toast({
//           title: "Error fetching drop dates",
//           description: "Could not load the current drop dates.",
//           variant: "destructive",
//         });
//         console.error("Error fetching drop dates:", error);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDropDates();
//   }, []);

//   const handleSaveDropStartDate = async () => {
//     if (!dropStartDate || !dropStartTime) {
//       toast({
//         title: "Validation Error",
//         description: "Please select both a start date and time.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsSavingStart(true);
//     try {
//       await axios.put(`${API_BASE_URL}/drops/admin/drop-start-date`, {
//         startDate: `${dropStartDate}T${dropStartTime}:00`,
//       });
//       toast({
//         title: "Success",
//         description: "Drop start date saved successfully!",
//         variant: "success",
//       });
//       fetchDropDates();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save drop start date.",
//         variant: "destructive",
//       });
//       console.error("Error saving drop start date:", error);
//     } finally {
//       setIsSavingStart(false);
//     }
//   };

//   const handleSaveDropEndDate = async () => {
//     if (!dropEndDate || !dropEndTime) {
//       toast({
//         title: "Validation Error",
//         description: "Please select both an end date and time.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsSavingEnd(true);
//     try {
//       await axios.put(`${API_BASE_URL}/drops/admin/drop-end-date`, {
//         endDate: `${dropEndDate}T${dropEndTime}:00`,
//       });
//       toast({
//         title: "Success",
//         description: "Drop end date saved successfully!",
//         variant: "success",
//       });
//       fetchDropDates();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save drop end date.",
//         variant: "destructive",
//       });
//       console.error("Error saving drop end date:", error);
//     } finally {
//       setIsSavingEnd(false);
//     }
//   };

//   const formatIST = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleString("en-GB", {
//       timeZone: "Asia/Kolkata",
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//     });
//   };

//   return (
//     <Card className="bg-card/50 border-border/50 p-6">
//       <CardHeader>
//         <CardTitle className="text-2xl gradient-text">
//           Manage Drop Dates
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {loading ? (
//           <div className="flex items-center justify-center">
//             <Loader2 className="h-5 w-5 animate-spin mr-2" />
//             <span>Loading...</span>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <p className="text-sm">
//                 Current drop start date:{" "}
//                 <strong>{formatIST(currentDrop?.startDate)}</strong>
//               </p>
//               <p className="text-sm">
//                 Current drop end date:{" "}
//                 <strong>{formatIST(currentDrop?.endDate)}</strong>
//               </p>
//             </div>

//             <div className="border-t border-border pt-4 space-y-4">
//               <h3 className="font-semibold text-lg">Set Drop Start Date</h3>
//               <div className="flex space-x-2">
//                 <div className="flex-1">
//                   <Label htmlFor="drop-start-date">Date</Label>
//                   <Input
//                     id="drop-start-date"
//                     type="date"
//                     value={dropStartDate}
//                     onChange={(e) => setDropStartDate(e.target.value)}
//                     className="mt-2"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <Label htmlFor="drop-start-time">Time (IST)</Label>
//                   <Input
//                     id="drop-start-time"
//                     type="time"
//                     value={dropStartTime}
//                     onChange={(e) => setDropStartTime(e.target.value)}
//                     className="mt-2"
//                   />
//                 </div>
//               </div>
//               <Button
//                 onClick={handleSaveDropStartDate}
//                 disabled={isSavingStart}
//               >
//                 {isSavingStart ? (
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 ) : (
//                   "Save Start Date"
//                 )}
//               </Button>
//             </div>

//             <div className="border-t border-border pt-4 space-y-4">
//               <h3 className="font-semibold text-lg">Set Drop End Date</h3>
//               <div className="flex space-x-2">
//                 <div className="flex-1">
//                   <Label htmlFor="drop-end-date">Date</Label>
//                   <Input
//                     id="drop-end-date"
//                     type="date"
//                     value={dropEndDate}
//                     onChange={(e) => setDropEndDate(e.target.value)}
//                     className="mt-2"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <Label htmlFor="drop-end-time">Time (IST)</Label>
//                   <Input
//                     id="drop-end-time"
//                     type="time"
//                     value={dropEndTime}
//                     onChange={(e) => setDropEndTime(e.target.value)}
//                     className="mt-2"
//                   />
//                 </div>
//               </div>
//               <Button onClick={handleSaveDropEndDate} disabled={isSavingEnd}>
//                 {isSavingEnd ? (
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 ) : (
//                   "Save End Date"
//                 )}
//               </Button>
//             </div>
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
  const [dropStartDate, setDropStartDate] = useState("");
  const [dropStartTime, setDropStartTime] = useState("");
  const [dropEndDate, setDropEndDate] = useState("");
  const [dropEndTime, setDropEndTime] = useState("");
  const [currentDrop, setCurrentDrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSavingStart, setIsSavingStart] = useState(false);
  const [isSavingEnd, setIsSavingEnd] = useState(false);
  const { toast } = useToast();

  const fetchDropDates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/drops/drop-date`);
      const fetchedDrop = response.data;
      setCurrentDrop(fetchedDrop);

      // **MODIFIED**: Helper function to correctly format dates for inputs
      const setDateAndTimeInputs = (dateString, setDate, setTime) => {
        if (!dateString) {
          setDate("");
          setTime("");
          return;
        }

        const date = new Date(dateString);

        // Use Intl.DateTimeFormat to get parts based on IST timezone
        const formatter = new Intl.DateTimeFormat("en-CA", {
          // 'en-CA' gives YYYY-MM-DD format
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        const timeFormatter = new Intl.DateTimeFormat("en-GB", {
          // 'en-GB' gives HH:mm format
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        setDate(formatter.format(date));
        setTime(timeFormatter.format(date));
      };

      setDateAndTimeInputs(
        fetchedDrop.startDate,
        setDropStartDate,
        setDropStartTime
      );
      setDateAndTimeInputs(fetchedDrop.endDate, setDropEndDate, setDropEndTime);
    } catch (error) {
      if (error.response?.status === 404) {
        setCurrentDrop(null);
      } else {
        toast({
          title: "Error fetching drop dates",
          description: "Could not load the current drop dates.",
          variant: "destructive",
        });
        console.error("Error fetching drop dates:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropDates();
  }, []);

  const handleSaveDropStartDate = async () => {
    if (!dropStartDate || !dropStartTime) {
      toast({
        title: "Validation Error",
        description: "Please select both a start date and time.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingStart(true);
    try {
      // **CHANGE HERE**: Append the IST timezone offset '+05:30'
      const isoStringWithIST = `${dropStartDate}T${dropStartTime}:00+05:30`;

      await axios.put(`${API_BASE_URL}/drops/admin/drop-start-date`, {
        startDate: isoStringWithIST,
      });

      toast({
        title: "Success",
        description: "Drop start date saved successfully!",
        variant: "success",
      });
      fetchDropDates();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save drop start date.",
        variant: "destructive",
      });
      console.error("Error saving drop start date:", error);
    } finally {
      setIsSavingStart(false);
    }
  };

  const handleSaveDropEndDate = async () => {
    if (!dropEndDate || !dropEndTime) {
      toast({
        title: "Validation Error",
        description: "Please select both an end date and time.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingEnd(true);
    try {
      // **CHANGE HERE**: Append the IST timezone offset '+05:30'
      const isoStringWithIST = `${dropEndDate}T${dropEndTime}:00+05:30`;

      await axios.put(`${API_BASE_URL}/drops/admin/drop-end-date`, {
        endDate: isoStringWithIST,
      });
      toast({
        title: "Success",
        description: "Drop end date saved successfully!",
        variant: "success",
      });
      fetchDropDates();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save drop end date.",
        variant: "destructive",
      });
      console.error("Error saving drop end date:", error);
    } finally {
      setIsSavingEnd(false);
    }
  };

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
          Manage Drop Dates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span>Loading...</span>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm">
                Current drop start date:{" "}
                <strong>{formatIST(currentDrop?.startDate)}</strong>
              </p>
              <p className="text-sm">
                Current drop end date:{" "}
                <strong>{formatIST(currentDrop?.endDate)}</strong>
              </p>
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <h3 className="font-semibold text-lg">Set Drop Start Date</h3>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="drop-start-date">Date</Label>
                  <Input
                    id="drop-start-date"
                    type="date"
                    value={dropStartDate}
                    onChange={(e) => setDropStartDate(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="drop-start-time">Time (IST)</Label>
                  <Input
                    id="drop-start-time"
                    type="time"
                    value={dropStartTime}
                    onChange={(e) => setDropStartTime(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
              <Button
                onClick={handleSaveDropStartDate}
                disabled={isSavingStart}
              >
                {isSavingStart ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  "Save Start Date"
                )}
              </Button>
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <h3 className="font-semibold text-lg">Set Drop End Date</h3>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="drop-end-date">Date</Label>
                  <Input
                    id="drop-end-date"
                    type="date"
                    value={dropEndDate}
                    onChange={(e) => setDropEndDate(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="drop-end-time">Time (IST)</Label>
                  <Input
                    id="drop-end-time"
                    type="time"
                    value={dropEndTime}
                    onChange={(e) => setDropEndTime(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
              <Button onClick={handleSaveDropEndDate} disabled={isSavingEnd}>
                {isSavingEnd ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  "Save End Date"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DropManager;
