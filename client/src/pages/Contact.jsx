import React, { useState } from "react"; // Explicitly import React
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();

  // Removed type annotation for 'e'
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate form submission
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  // Removed type annotation for 'e'
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Have questions about our products or need style advice? We're here
            to help you unleash your streetwear potential.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/20 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                    <p className="text-foreground/70 mb-1">
                      riftwear.help@gmail.com
                    </p>
                    {/* <p className="text-foreground/70">orders@arraste.com</p> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/20 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                    <p className="text-foreground/70 mb-1">+91 78987 82596</p>
                    <p className="text-foreground/70">Mon-Fri, 9AM-6PM IST</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold gradient-text mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-foreground/70">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  What's your return policy?
                </h3>
                <p className="text-foreground/70 text-sm">
                  We offer 30-day returns on all unworn items with original
                  tags. Free return shipping included.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  How long does shipping take?
                </h3>
                <p className="text-foreground/70 text-sm">
                  Standard shipping takes 3-5 business days. Express shipping
                  available for 1-2 day delivery.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  Do you offer size exchanges?
                </h3>
                <p className="text-foreground/70 text-sm">
                  Yes! Free size exchanges within 30 days. Check our size guide
                  or contact us for help.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  When do you restock sold-out items?
                </h3>
                <p className="text-foreground/70 text-sm">
                  Restocks vary by item. Sign up for notifications on product
                  pages to be alerted when items return.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
