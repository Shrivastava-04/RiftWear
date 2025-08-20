// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Eye, EyeOff, ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from "@/hooks/use-toast";
// import logo from "@/assets/logo.png";
// import axios from "axios";
// import { useAuth } from "@/context/AuthCotext.jsx";
// import { GoogleLogin } from "@react-oauth/google"; // <-- Correct import

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     rememberMe: false,
//     phoneNumber: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const Base_URL = import.meta.env.VITE_BACKEND_URL;
//   const { login } = useAuth();

//   const validateEmail = (email) => {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return emailRegex.test(email);
//   };

//   const validatePassword = (password) => {
//     return password.length >= 8;
//   };

//   const validatePhoneNumber = (phoneNumber) => {
//     const phoneRegex = /^[+]?[\s\d\-\(\)]{7,20}$/;
//     if (phoneNumber.trim() === "") {
//       return true;
//     }
//     return phoneRegex.test(phoneNumber);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [name]: "",
//     }));
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     let errorMessage = "";

//     if (name === "name") {
//       if (value.trim() === "") {
//         errorMessage = "Name is required.";
//       }
//     } else if (name === "email") {
//       if (value.trim() === "") {
//         errorMessage = "Email is required.";
//       } else if (!validateEmail(value)) {
//         errorMessage = "Please enter a valid email address.";
//       }
//     } else if (name === "password") {
//       if (value.trim() === "") {
//         errorMessage = "Password is required.";
//       } else if (!validatePassword(value)) {
//         errorMessage = "Password must be at least 8 characters long.";
//       }
//     } else if (name === "phoneNumber") {
//       if (value.trim() === "") {
//         errorMessage = "Phone number is required.";
//       } else if (!validatePhoneNumber(value)) {
//         errorMessage = "Please enter a valid phone number.";
//       }
//     }

//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [name]: errorMessage,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     let newErrors = {};
//     if (formData.name.trim() === "") newErrors.name = "Name is required.";
//     if (formData.email.trim() === "") {
//       newErrors.email = "Email is required.";
//     } else if (!validateEmail(formData.email)) {
//       newErrors.email = "Please enter a valid email address.";
//     }
//     if (formData.password.trim() === "") {
//       newErrors.password = "Password is required.";
//     } else if (!validatePassword(formData.password)) {
//       newErrors.password = "Password must be at least 8 characters long.";
//     }
//     if (formData.phoneNumber.trim() === "") {
//       newErrors.phoneNumber = "Phone number is required.";
//     } else if (!validatePhoneNumber(formData.phoneNumber)) {
//       newErrors.phoneNumber = "Please enter a valid phone number.";
//     }

//     setErrors(newErrors);

//     const errorKeys = Object.keys(newErrors);
//     if (errorKeys.length > 0) {
//       setIsLoading(false);
//       let toastDescription = "";
//       if (errorKeys.length === 1) {
//         toastDescription = newErrors[errorKeys[0]];
//       } else {
//         toastDescription = (
//           <div className="flex flex-col gap-1">
//             <p>Please correct the following errors:</p>
//             <ul className="list-disc pl-5">
//               {Object.values(newErrors).map((msg, index) => (
//                 <li key={index}>{msg}</li>
//               ))}
//             </ul>
//           </div>
//         );
//       }
//       toast({
//         title: "Validation Error",
//         description: toastDescription,
//         variant: "destructive",
//         duration: 5000,
//       });
//       return;
//     }

//     try {
//       const response = await axios.post(`${Base_URL}/user/signup`, formData);

//       localStorage.setItem("userId", JSON.stringify(response.data.user._id));
//       toast({
//         title: "Success",
//         description:
//           response.data.message || "Account created successfully! Welcome.",
//         variant: "success",
//         duration: 3000,
//       });

//       setTimeout(() => {
//         navigate("/");
//       }, 1500);
//     } catch (error) {
//       console.error("Signup API error:", error);

//       let errorMessage = "An unexpected error occurred during signup.";
//       if (error.response) {
//         if (error.response.status === 400) {
//           errorMessage =
//             error.response.data.message ||
//             "Bad Request: Please check your input.";
//         } else if (error.response.status === 409) {
//           errorMessage =
//             error.response.data.message ||
//             "A user with that email or phone number already exists.";
//         } else if (error.response.status === 500) {
//           errorMessage =
//             error.response.data.message ||
//             "Server error: Please try again later.";
//         } else {
//           errorMessage = `Error: ${error.response.status} - ${
//             error.response.data.message || "Unknown server response"
//           }`;
//         }
//       } else if (error.request) {
//         errorMessage =
//           "Network Error: Could not connect to the server. Please check your internet connection.";
//       } else {
//         errorMessage = error.message;
//       }

//       toast({
//         title: "Signup Failed",
//         description: errorMessage,
//         variant: "destructive",
//         duration: 5000,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     const idToken = credentialResponse.credential;
//     if (!idToken) {
//       console.error("ID Token is missing from Google response.");
//       return;
//     }
//     try {
//       const response = await axios.post(`${Base_URL}/auth/google`, {
//         idToken,
//       });

//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("userId", JSON.stringify(response.data.user._id));

//       console.log("Login successful!", response.data.user);
//       navigate("/");
//     } catch (error) {
//       console.error(
//         "Login failed:",
//         error.response?.data?.message || error.message
//       );
//     }
//   };

//   const handleGoogleError = () => {
//     console.log("Google login failed!");
//     toast({
//       title: "Google Login Failed",
//       description: "Could not log in with Google. Please try again.",
//       variant: "destructive",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <Button
//           variant="ghost"
//           onClick={() => navigate("/")}
//           className="mb-6 text-foreground/70 hover:text-accent"
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Home
//         </Button>

//         <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
//           <CardHeader className="text-center">
//             <div className="flex justify-center mb-4">
//               <img src={logo} alt="Arrasté" className="h-12 w-12" />
//             </div>
//             <CardTitle className="text-2xl gradient-text">Welcome</CardTitle>
//             <p className="text-foreground/70">Create a new Account</p>
//           </CardHeader>

//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label
//                   htmlFor="name"
//                   className="block text-sm font-medium mb-2"
//                 >
//                   Enter your name
//                 </label>
//                 <Input
//                   id="name"
//                   name="name"
//                   type="text"
//                   value={formData.name}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   required
//                   className="bg-secondary/50"
//                   placeholder="Enter your name"
//                 />
//                 {errors.name && (
//                   <p className="text-destructive text-sm mt-1">{errors.name}</p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium mb-2"
//                 >
//                   Email Address
//                 </label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   required
//                   className="bg-secondary/50"
//                   placeholder="Enter your email"
//                 />
//                 {errors.email && (
//                   <p className="text-destructive text-sm mt-1">
//                     {errors.email}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="phoneNumber"
//                   className="block text-sm font-medium mb-2"
//                 >
//                   Phone Number
//                 </label>
//                 <Input
//                   id="phoneNumber"
//                   name="phoneNumber"
//                   type="tel"
//                   value={formData.phoneNumber}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   required
//                   className="bg-secondary/50"
//                   placeholder="Enter your phone number"
//                 />
//                 {errors.phoneNumber && (
//                   <p className="text-destructive text-sm mt-1">
//                     {errors.phoneNumber}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium mb-2"
//                 >
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     value={formData.password}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     required
//                     className="bg-secondary/50 pr-10"
//                     placeholder="Enter new password"
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4 text-foreground/50" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-foreground/50" />
//                     )}
//                   </Button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-destructive text-sm mt-1">
//                     {errors.password}
//                   </p>
//                 )}
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="rememberMe"
//                     name="rememberMe"
//                     checked={formData.rememberMe}
//                     onCheckedChange={(checked) =>
//                       setFormData({ ...formData, rememberMe: checked })
//                     }
//                   />
//                   <label
//                     htmlFor="rememberMe"
//                     className="text-sm text-foreground/70 cursor-pointer"
//                   >
//                     Remember me
//                   </label>
//                 </div>
//               </div>

//               <Button
//                 type="submit"
//                 variant="cta"
//                 size="lg"
//                 className="w-full"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Signing Up..." : "Sign Up"}
//               </Button>

//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <span className="w-full border-t border-border/50" />
//                 </div>
//                 <div className="relative flex justify-center text-xs uppercase">
//                   <span className="bg-card px-2 text-foreground/50">
//                     Or continue with
//                   </span>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="w-full">
//                   <GoogleLogin
//                     onSuccess={handleGoogleSuccess}
//                     onError={handleGoogleError}
//                   />
//                 </div>
//                 <Button variant="outline" className="w-full">
//                   <svg
//                     className="w-4 h-4 mr-2"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//                   </svg>
//                   Facebook
//                 </Button>
//               </div>

//               <div className="text-center">
//                 <p className="text-sm text-foreground/70">
//                   Already have an account?{" "}
//                   <Link
//                     to="/login"
//                     className="text-accent hover:text-accent/80 transition-colors font-medium"
//                   >
//                     Login
//                   </Link>
//                 </p>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Signup;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import axios from "axios";
import { useAuth } from "@/context/AuthCotext.jsx";
import { GoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rememberMe: false,
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const Base_URL = import.meta.env.VITE_BACKEND_URL;
  const { login } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[+]?[\s\d\-\(\)]{7,20}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    if (name === "name") {
      if (value.trim() === "") {
        errorMessage = "Name is required.";
      }
    } else if (name === "email") {
      if (value.trim() === "") {
        errorMessage = "Email is required.";
      } else if (!validateEmail(value)) {
        errorMessage = "Please enter a valid email address.";
      }
    } else if (name === "password") {
      if (value.trim() === "") {
        errorMessage = "Password is required.";
      } else if (!validatePassword(value)) {
        errorMessage = "Password must be at least 8 characters long.";
      }
    } else if (name === "phoneNumber") {
      if (value.trim() !== "" && !validatePhoneNumber(value)) {
        errorMessage = "Please enter a valid phone number.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let newErrors = {};
    if (formData.name.trim() === "") newErrors.name = "Name is required.";
    if (formData.email.trim() === "") {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (formData.password.trim() === "") {
      newErrors.password = "Password is required.";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long.";
    }
    if (
      formData.phoneNumber.trim() !== "" &&
      !validatePhoneNumber(formData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number.";
    }

    setErrors(newErrors);

    const errorKeys = Object.keys(newErrors);
    if (errorKeys.length > 0) {
      setIsLoading(false);
      let toastDescription = "";
      if (errorKeys.length === 1) {
        toastDescription = newErrors[errorKeys[0]];
      } else {
        toastDescription = (
          <div className="flex flex-col gap-1">
            <p>Please correct the following errors:</p>
            <ul className="list-disc pl-5">
              {Object.values(newErrors).map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        );
      }
      toast({
        title: "Validation Error",
        description: toastDescription,
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    try {
      const response = await axios.post(`${Base_URL}/user/signup`, formData);
      localStorage.setItem("userId", JSON.stringify(response.data.user._id));
      toast({
        title: "Success",
        description:
          response.data.message || "Account created successfully! Welcome.",
        variant: "success",
        duration: 3000,
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Signup API error:", error);
      let errorMessage = "An unexpected error occurred during signup.";
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage =
            error.response.data.message ||
            "Bad Request: Please check your input.";
        } else if (error.response.status === 409) {
          errorMessage =
            error.response.data.message ||
            "A user with that email or phone number already exists.";
        } else if (error.response.status === 500) {
          errorMessage =
            error.response.data.message ||
            "Server error: Please try again later.";
        } else {
          errorMessage = `Error: ${error.response.status} - ${
            error.response.data.message || "Unknown server response"
          }`;
        }
      } else if (error.request) {
        errorMessage =
          "Network Error: Could not connect to the server. Please check your internet connection.";
      } else {
        errorMessage = error.message;
      }
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      console.error("ID Token is missing from Google response.");
      return;
    }
    try {
      const response = await axios.post(`${Base_URL}/auth/google`, {
        idToken,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", JSON.stringify(response.data.user._id));
      console.log("Login successful!", response.data.user);
      navigate("/");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleGoogleError = () => {
    console.log("Google login failed!");
    toast({
      title: "Google Login Failed",
      description: "Could not log in with Google. Please try again.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-foreground/70 hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Arrasté" className="h-12 w-12" />
            </div>
            <CardTitle className="text-2xl gradient-text">Welcome</CardTitle>
            <p className="text-foreground/70">Create a new Account</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Enter your name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="bg-secondary/50"
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="bg-secondary/50"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium mb-2"
                >
                  Phone Number
                </label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-secondary/50"
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className="bg-secondary/50 pr-10"
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-foreground/50" />
                    ) : (
                      <Eye className="h-4 w-4 text-foreground/50" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, rememberMe: checked })
                    }
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm text-foreground/70 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                variant="cta"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-foreground/50">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="w-full text-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  // Set a fixed width in pixels
                />
              </div>

              <div className="text-center">
                <p className="text-sm text-foreground/70">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-accent hover:text-accent/80 transition-colors font-medium"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
