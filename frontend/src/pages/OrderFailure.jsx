import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { XCircle, ShoppingCart, Home } from "lucide-react";

// --- UI Components ---
import Header from "@/components/common/Header"; // Corrected Path
import Footer from "@/components/common/Footer"; // Corrected Path
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OrderFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto text-center bg-card/50 border-destructive/50 shadow-lg">
          <CardHeader className="p-6">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-destructive">
              Order Failed
            </CardTitle>
            <CardDescription className="text-foreground/70 pt-2">
              Unfortunately, your order could not be processed at this time.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="text-foreground/80">
              There may have been an issue with the payment. Please check your
              details and try again.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 p-6 pt-0">
            <Button
              variant="cta"
              size="lg"
              className="flex-1"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default OrderFailure;
