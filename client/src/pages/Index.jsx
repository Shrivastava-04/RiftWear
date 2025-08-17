import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Facebook,
  Instagram,
  SeparatorVerticalIcon,
  Share,
  Twitter,
  Youtube,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import DepartmentProductCard from "@/components/DepartmentCard"; // <-- IMPORT NEW COMPONENT
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import hoodieImage from "@/assets/hoodie-1.jpg";
import tshirtImage from "@/assets/tshirt-1.jpg";
// import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import comingSoon from "../assets/coming soon image 2.png";

const Index = () => {
  const [heroBlur, setHeroBlur] = useState(0);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [sectionBackgroundOpacity, setSectionBackgroundOpacity] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const featuredProductsRef = useRef(null);
  const contactSectionRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const topOfPageRef = useRef(null);
  const location = useLocation();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { toast } = useToast();

  // Load Products for Featured Section
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/product/getallproduct`);
        const firstTwoProducts = res.data
          .filter((item) => {
            return !item.forDepartment && item.forHomePage; // Filter out products not for home page
          })
          .slice(0, 4); // Get first two for featured
        setFeaturedProducts(firstTwoProducts);
      } catch (error) {
        console.error("Error loading featured products:", error);
      }
    };
    loadProducts();
  }, [API_BASE_URL]);

  const product1 = {
    _id: "mock-1", // Changed to unique mock IDs
    name: "Tshirt Mock 1",
    price: 488,
    originalPrice: 686,
    images: [
      "https://placehold.co/400x400/333/FFF?text=Coming+Soon+1", // Placeholder
      "https://placehold.co/400x400/333/FFF?text=Coming+Soon+1",
    ],
    category: "T-Shirt",
    isNew: true,
    onSale: true,
  };
  const product2 = {
    _id: "mock-2", // Changed to unique mock IDs
    name: "Tshirt Mock 2",
    price: 488,
    originalPrice: 686,
    images: [
      "https://placehold.co/400x400/333/FFF?text=Coming+Soon+2", // Placeholder
      "https://placehold.co/400x400/333/FFF?text=Coming+Soon+2",
    ],
    category: "T-Shirt",
    isNew: true,
    onSale: true,
  };

  const [departmentsData, setDepartmentsData] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Corrected API endpoint for fetching departments
        const response = await axios.get(
          `${API_BASE_URL}/departments/get-department`
        );
        setDepartmentsData(response.data);
        // console.log(response.);
        console.log("Departments fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, [API_BASE_URL]);

  useEffect(() => {
    const heroHeight = window.innerHeight * 0.8;
    const heroBlurEndScroll = 250;
    const maxHeroBlurPixels = 150;
    const sectionBgRevealStart = 20;
    const sectionBgRevealEnd = 400;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      const heroScrollProgress = Math.min(
        1,
        Math.max(0, scrollY / heroBlurEndScroll)
      );
      setHeroBlur(heroScrollProgress * maxHeroBlurPixels);
      setHeroOpacity(1 - Math.pow(heroScrollProgress, 2));

      let newSectionOpacity;
      if (scrollY <= sectionBgRevealStart) {
        newSectionOpacity = 0;
      } else if (scrollY >= sectionBgRevealEnd) {
        newSectionOpacity = 1;
      } else {
        newSectionOpacity =
          (scrollY - sectionBgRevealStart) /
          (sectionBgRevealEnd - sectionBgRevealStart);
      }
      setSectionBackgroundOpacity(newSectionOpacity);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.hash === "#contact") {
      requestAnimationFrame(() => {
        if (contactSectionRef.current) {
          contactSectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    }
  }, [location]);

  useEffect(() => {
    if (location.hash === "#about") {
      requestAnimationFrame(() => {
        if (aboutSectionRef.current) {
          aboutSectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname === "/" && location.hash === "") {
      requestAnimationFrame(() => {
        if (topOfPageRef.current) {
          topOfPageRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }
  }, [location.pathname, location.hash]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    subject: "",
  });

  const [errors, setErrors] = useState({});

  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = "Name is required";
    }
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.message) {
      errors.message = "Message is required";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validateData = validate();
    if (Object.keys(validateData).length > 0) {
      setErrors(validateData);
    } else {
      setErrors({});
      setIsSending(true);

      emailjs
        .send(
          "service_zhcibqb",
          "template_0gppc5h",
          formData,
          "CPvYRDJLV592kASVa"
        )
        .then((response) => {
          console.log("SUCCESS!", response.status, response.text);
          // toast.success("Message sent successfully");
          toast({
            title: "Message Sent!",
            description:
              "Your message has been sent successfully. We'll get back to you as soon as possible.",
            variant: "success",
          });
          setFormData({ name: "", email: "", message: "", subject: "" });
        })
        .catch((error) => {
          // console.log("FAILED...", error);
          toast({
            title: "Message Failed",
            description: "Failed to send message. Please try again later.",
            variant: "destructive",
          });
          // toast.error("Failed to send message. Please try again later");
        })
        .finally(() => {
          setIsSending(false);
        });
    }
  };

  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   subject: "",
  //   message: "",
  // });
  // const { toast } = useToast();

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   toast({
  //     title: "Message Sent!",
  //     description: "We'll get back to you within 24 hours.",
  //   });

  //   setFormData({
  //     name: "",
  //     email: "",
  //     subject: "",
  //     message: "",
  //   });
  // };

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  return (
    <>
      <Header />
      <HeroSection blurAmount={heroBlur} opacity={heroOpacity} />

      <div className="relative z-10 pt-[60vh] min-h-screen">
        {/* Featured Products Section */}
        <section
          ref={featuredProductsRef}
          className="py-20"
          style={{
            background: `linear-gradient(to bottom, var(--background), hsl(var(--primary) / 0.2))`,
            transition: "opacity 0.3s ease-out",
          }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4 animate-fade-in-up">
                Featured Products
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto animate-fade-in-up">
                Discover our most popular pieces.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in-up">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  arrival={"arrived"}
                  product={product}
                  forDepartment={false} // This tells ProductCard to render as a standard size
                />
              ))}
              {/* <ProductCard
                arrival={"comingSoon"}
                product={product1} // Using mock product for coming soon
                forDepartment={false}
              />
              <ProductCard
                arrival={"comingSoon"}
                product={product2} // Using mock product for coming soon
                forDepartment={false}
              /> */}
            </div>
          </div>
        </section>

        {/* Shop by Department Section */}
        <section
          className="py-20"
          style={{
            background: `linear-gradient(to bottom, var(--background), hsl(var(--primary) / 0.2))`,
            transition: "opacity 0.3s ease-out",
          }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4 animate-fade-in-up">
                Shop by Department
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto animate-fade-in-up">
                Find apparel designed specifically for your field of study.
              </p>
            </div>
          </div>
          {/* Full-width scroll container - no horizontal padding */}
          <div className="flex overflow-x-scroll pb-4 space-x-6 scrollbar-hide px-4">
            {departmentsData.map((department) => (
              // Use the new DepartmentProductCard here
              <DepartmentProductCard
                key={department._id}
                department={department}
                // Determine 'arrival' based on department.productIsAvailable
                arrival={
                  department.productIsAvailable ? "arrived" : "comingSoon"
                }
              />
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        {/* <section className="py-20 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                Stay in the Loop
              </h2>
              <p className="text-foreground/70 text-lg">
                Be the first to know about new drops, exclusive offers, and
                street style inspiration
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <Button variant="cta" size="lg">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section> */}

        {/* Contact Section */}
        <section className="bg-primary">
          <div className="grid grid-row-1 lg:grid-row-2 gap-12 max-w-6xl mx-auto">
            <section
              ref={contactSectionRef}
              id="contact"
              className="py-20 bg-primary"
            >
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
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium mb-2"
                      >
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
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
                    </div>

                    <Button
                      type="submit"
                      variant="cta"
                      size="lg"
                      className={`w-full ${
                        isSending ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={isSending}
                    >
                      {isSending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </section>

            {/* Contact Information */}
            <section
              ref={aboutSectionRef}
              id="about"
              className="py-20 bg-primary"
            >
              {/* Container for Contact Cards, giving them the same max-width as the FAQ section */}
              <div className="max-w-4xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                  {/* Email Card */}
                  <Card className="bg-card/50 border-border/50 flex-1 w-full">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-accent/20 p-3 rounded-lg">
                          <Mail className="h-6 w-6 text-accent" />
                        </div>
                        <div className="py-1">
                          <h3 className="font-semibold text-lg mb-2">
                            Email Us
                          </h3>
                          <p
                            // href="mailto:riftwear.help@gmail.com"
                            className="text-foreground/70 mb-1"
                          >
                            riftwear.help@gmail.com
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Social Media Card */}
                  <Card className="bg-card/50 border-border/50 flex-1 w-full">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-accent/20 p-3 rounded-lg">
                          <Share className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            Social Media
                          </h3>
                          <div className="flex space-x-8 py-2">
                            <a
                              href="https://www.instagram.com/rift_wear/"
                              target="_blank"
                              rel="noopner noreferrer"
                              className="flex items-center space-x-2"
                            >
                              {/* <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-accent"
                              > */}
                              <Instagram className="h-5 w-5" />
                              <p>rift_wear</p>
                              {/* </Button> */}
                            </a>
                            <a
                              href="https://x.com/rift_wear"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2"
                            >
                              {/* <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-accent"
                              > */}
                              <Twitter className="h-5 w-5" />
                              <p>rift_wear</p>
                              {/* </Button> */}
                            </a>
                            {/* <Button
                              variant="ghost"
                              size="icon"
                              className="hover:text-accent"
                            >
                              <Twitter className="h-4 w-4" />
                            </Button> */}
                            {/* <Button
                              variant="ghost"
                              size="icon"
                              className="hover:text-accent"
                            >
                              <Facebook className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:text-accent"
                            >
                              <Youtube className="h-4 w-4" />
                            </Button> */}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              {/* FAQ Section */}
              <div className="mt-20 max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold gradient-text mb-4">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-foreground/70">
                    Quick answers to common questions
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* FAQ Cards */}
                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">
                        What's your return policy?
                      </h3>
                      <p className="text-foreground/70 text-sm">
                        We offer 30-day returns on all unworn items with
                        original tags. Free return shipping included.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">
                        How long does shipping take?
                      </h3>
                      <p className="text-foreground/70 text-sm">
                        Standard shipping takes 10-12 business days.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">
                        Do you offer size exchanges?
                      </h3>
                      <p className="text-foreground/70 text-sm">
                        Yes! Free size exchanges within 30 days. Check our size
                        guide or contact us for help.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">
                        When do you restock sold-out items?
                      </h3>
                      <p className="text-foreground/70 text-sm">
                        Restocks vary by item. Sign up for notifications on
                        product pages to be alerted when items return.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
            {/* <section
              ref={aboutSectionRef}
              id="about"
              className="py-20 bg-primary"
            > */}
            {/* <div className="space-y-8 flex items-center justify-around min-w-full">
                <Card className="bg-card/50 border-border/50 ">
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-accent/20 p-3 rounded-lg">
                        <Share className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          Social Media
                        </h3>
                        <div className="flex space-x-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-accent"
                          >
                            <Instagram className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-accent"
                          >
                            <Twitter className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-accent"
                          >
                            <Facebook className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-accent"
                          >
                            <Youtube className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-accent/20 p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                        <p className="text-foreground/70 mb-1">
                          +91 78987 82596
                        </p>
                        <p className="text-foreground/70">
                          Mon-Fri, 9AM-6PM IST
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card> */}
            {/* </div>  */}
            {/* <div class="flex items-center justify-between min-w-full gap-4 md:gap-8">
                <Card className="bg-card/50 border-border/50 flex-1">
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50 flex-1">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-accent/20 p-3 rounded-lg">
                        <Share className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          Social Media
                        </h3>
                        <div className="flex space-x-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-accent"
                          >
                            <Instagram className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-accent"
                          >
                            <Twitter className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-accent"
                          >
                            <Facebook className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-accent"
                          >
                            <Youtube className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div> */}
            {/* FAQ Section */}
            {/* <div className="mt-20">
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
                        We offer 30-day returns on all unworn items with
                        original tags. Free return shipping included.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">
                        How long does shipping take?
                      </h3>
                      <p className="text-foreground/70 text-sm">
                        Standard shipping takes 3-5 business days. Express
                        shipping available for 1-2 day delivery.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">
                        Do you offer size exchanges?
                      </h3>
                      <p className="text-foreground/70 text-sm">
                        Yes! Free size exchanges within 30 days. Check our size
                        guide or contact us for help.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">
                        When do you restock sold-out items?
                      </h3>
                      <p className="text-foreground/70 text-sm">
                        Restocks vary by item. Sign up for notifications on
                        product pages to be alerted when items return.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div> */}
            {/* </section> */}
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Index;
