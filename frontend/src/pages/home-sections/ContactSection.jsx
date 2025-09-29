import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { Mail, Instagram, Share, Twitter, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { getPublicSiteSettings } from "@/api/apiService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ContactAndAboutSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // --- NEW: Fetch site settings to get dynamic contact info ---
  const { data: settingsData } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: getPublicSiteSettings,
  });
  const socialLinks = settingsData?.data?.settings?.socialLinks || {};

  const contactSectionRef = useRef(null);
  const aboutSectionRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  useEffect(() => {
    if (location.hash === "#about" && aboutSectionRef.current)
      aboutSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    if (location.hash === "#contact" && contactSectionRef.current)
      contactSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.message) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSending(true);
    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you soon.",
          variant: "success",
        });
        setFormData((prev) => ({ ...prev, message: "", subject: "" }));
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        toast({
          title: "Message Failed",
          description: "Please try again later.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <>
      <section
        ref={contactSectionRef}
        id="contact"
        className="bg-primary py-10"
      >
        <div className="max-w-6xl mx-auto px-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">
                Send us a message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                    >
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-secondary/50"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-secondary/50"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-2"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-secondary/50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="bg-secondary/50"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  variant="cta"
                  size="lg"
                  className="w-full"
                  disabled={isSending}
                >
                  {isSending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section ref={aboutSectionRef} id="about" className="py-10 bg-primary">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* --- UPDATED: Email is now dynamic --- */}
          {socialLinks?.email && (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/20 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email Us</h3>
                    <a
                      href={`mailto:${socialLinks.email}`}
                      className="text-foreground/70 hover:text-accent"
                    >
                      {socialLinks.email || "N/A"}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* --- UPDATED: Phone number is now dynamic --- */}
          {socialLinks?.phone && (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/20 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Helpline Number</h3>
                    {/* <a
                      href={`mailto:${socialLinks.email}`}
                      className="text-foreground/70 hover:text-accent"
                    > */}
                    {socialLinks.phone || "N/A"}
                    {/* </a> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* --- UPDATED: Social links are now dynamic --- */}
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-accent/20 p-3 rounded-lg">
                  <Share className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Social Media</h3>
                  <div className="flex space-x-4 py-1">
                    <a
                      href={socialLinks.instagram || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-accent"
                    >
                      <Instagram className="h-5 w-5" />
                      <span>Instagram</span>
                    </a>
                    <a
                      href={socialLinks.twitter || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-accent"
                    >
                      <Twitter className="h-5 w-5" />
                      <span>Twitter/X</span>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default ContactAndAboutSection;
