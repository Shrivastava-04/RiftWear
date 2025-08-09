import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-8 text-center">
          Shipping Policy
        </h1>

        <Card className="max-w-3xl mx-auto bg-card/50 border-border/50 shadow-lg p-6">
          <CardContent className="space-y-6 text-foreground/80">
            <p>
              For International buyers, orders are shipped and delivered through
              registered international courier companies and/or International
              speed post only.
            </p>
            <p>
              For domestic buyers, orders are shipped through registered
              domestic courier companies and /or speed post only.
            </p>
            <p className="font-semibold text-destructive">
              **Note:** We are currently only delivering in Indian Institute of
              Technology (Indian School Of Mines) Dhanbad.
            </p>
            <p>
              Orders are shipped within 9-15 days or as per the delivery date
              agreed at the time of order confirmation and delivering of the
              shipment subject to Courier Company / post office norms.
            </p>
            <p>
              **Rift Wear** is not liable for any delay in delivery by the
              courier company / postal authorities and only guarantees to hand
              over the consignment to the courier company or postal authorities
              within 9-15 days from the date of the order and payment or as per
              the delivery date agreed at the time of order confirmation.
            </p>
            <p>
              Delivery of all orders will be to the address provided by the
              buyer. Delivery of our services will be confirmed on your mail ID
              as specified during registration.
            </p>
            <p>
              For any issues in utilizing our services you may contact our
              helpdesk on **7898782596** or **riftwear.help@gmail.com**.
            </p>
          </CardContent>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" /> Back to Home
              </Link>
            </Button>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingPolicy;
