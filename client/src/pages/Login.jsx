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
import { GoogleLogin } from "@react-oauth/google"; // Leave this import

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const Base_URL = import.meta.env.VITE_BACKEND_URL;

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let newErrors = {};
    if (formData.email.trim() === "") {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (formData.password.trim() === "") {
      newErrors.password = "Password is required.";
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
      console.log("hello");
      const response = await axios.post(`${Base_URL}/user/login`, formData);
      console.log(response);
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Login successful!",
          variant: "success",
        });
        localStorage.setItem("userId", JSON.stringify(response.data.user.id));
        setTimeout(() => {
          toast({
            title: "Welcome back!",
            description: "You've successfully logged in.",
          });
          setIsLoading(false);
          navigate("/");
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: "Login failed. Please check your credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "An error occurred while logging in. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Define the success and error handlers
  const handleGoogleSuccess = async (credentialResponse) => {
    // --- THIS IS THE CORRECT LOGIC FOR A DIRECT ID TOKEN ---
    const idToken = credentialResponse.credential;
    // console.log("ID Token to be sent:", idToken);
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
      console.log(error);
    }
  };

  const handleGoogleError = () => {
    console.log("Google login failed!");
  };

  // --- FIX: Change to use the `<GoogleLogin>` component ---
  // The `useGoogleLogin` hook is meant for a different flow.
  // The `<GoogleLogin>` component is what your backend is configured for.
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
            <CardTitle className="text-2xl gradient-text">
              Welcome Back
            </CardTitle>
            <p className="text-foreground/70">Sign in to your account</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  required
                  className="bg-secondary/50"
                  placeholder="Enter your email"
                />
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
                    required
                    className="bg-secondary/50 pr-10"
                    placeholder="Enter your password"
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
                <Link
                  to="/forgot-password"
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="cta"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
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

              <div className="grid grid-cols-2 gap-4">
                {/* --- FIX: Use the <GoogleLogin> component directly here --- */}
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
                <Button variant="outline" className="w-full">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-foreground/70">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-accent hover:text-accent/80 transition-colors font-medium"
                  >
                    Sign up
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

export default Login;
