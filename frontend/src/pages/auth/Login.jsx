import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming these paths are correct
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast"; // Assuming this path is correct
import logo from "@/assets/logo.png"; // Assuming this path is correct

// --- NEW IMPORTS ---
import { useAuth } from "@/hooks/useAuth"; // Our new hook to access auth context
import { loginUser, googleLogin } from "@/api/apiService"; // Our new centralized API function
import { GoogleLogin } from "@react-oauth/google";
// Note: GoogleLogin component and setup will be handled separately if needed

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // --- NEW: Using our AuthContext ---
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      /* ... validation ... */ return;
    }
    setIsLoading(true);
    try {
      await loginUser(formData); // 1. Call the backend to set the cookie
      await login(); // 2. Call our context's login(), which triggers a refetch

      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
        variant: "success",
      });
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred.";
      // console.log(errorMessage);
      console.log(error);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // We will handle Google Login functionality next
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const idToken = credentialResponse.credential;
      await googleLogin(idToken); // 1. Call the backend to set the cookie
      await login(); // 2. Call our context's login(), which triggers a refetch

      toast({
        title: "Welcome!",
        description: "You've successfully signed in.",
        variant: "success",
      });
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Google login failed.";
      toast({
        title: "Google Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast({
      title: "Google login failed. Please try again.",
      variant: "destructive",
    });
  };

  // --- UI REMAINS IDENTICAL TO YOURS ---
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
              <img src={logo} alt="Rift Logo" className="h-12 w-12" />
            </div>
            <CardTitle className="text-2xl gradient-text">
              Welcome Back
            </CardTitle>
            <p className="text-foreground/70">Sign in to your account</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Google Login button will be added here */}
              <div className="flex items-center justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>
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
                  <Checkbox id="rememberMe" name="rememberMe" />
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
