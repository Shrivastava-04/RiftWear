import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { requestPasswordReset } from "@/api/apiService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: (data) => {
      toast({
        title: "Check Your Email",
        description: data.data.message,
        variant: "success",
      });
      setEmail("");
    },
    onError: (error) => {
      toast({
        title: "An Error Occurred",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Email is required.", variant: "destructive" });
      return;
    }
    mutation.mutate(email);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-muted rounded-full">
                <Mail className="h-8 w-8 text-accent" />
              </div>
            </div>
            <CardTitle className="text-2xl gradient-text">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-foreground/70">
              Enter your email and we'll send you a link to reset your password.
            </CardDescription>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary/50"
                  placeholder="you@example.com"
                />
              </div>
              <Button
                type="submit"
                variant="cta"
                size="lg"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Sending..." : "Send Reset Link"}
              </Button>
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-accent hover:text-accent/80 transition-colors font-medium"
                >
                  <ArrowLeft className="inline h-4 w-4 mr-1" />
                  Back to Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
