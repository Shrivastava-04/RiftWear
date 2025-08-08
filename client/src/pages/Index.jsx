import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import hoodieImage from "@/assets/hoodie-1.jpg";
import tshirtImage from "@/assets/tshirt-1.jpg";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import axios from "axios";

const Index = () => {
  const [heroBlur, setHeroBlur] = useState(0);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [sectionBackgroundOpacity, setSectionBackgroundOpacity] = useState(0); // Starts at 0, fully transparent
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const featuredProductsRef = useRef(null);
  const contactSectionRef = useRef(null); // <--- NEW REF for Contact Section
  const aboutSectionRef = useRef(null); // <--- NEW REF for About Section
  const topOfPageRef = useRef(null);
  const location = useLocation(); // <--- NEW: Get current location object
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  //load Products
  useEffect(() => {
    const loadProducts = async () => {
      const res = await axios.get(`${API_BASE_URL}/product/getallproduct`);
      // console.log(res.data);
      setFeaturedProducts(res.data);
    };
    loadProducts();
  }, []);

  // Mock featured products (as per your original code)
  const featuredProductsa = [
    {
      id: "1",
      name: "Urban Essential Hoodie",
      price: 89,
      originalPrice: 120,
      image: hoodieImage,
      category: "Hoodies",
      isNew: true,
      onSale: true,
    },
    {
      id: "2",
      name: "Street Culture Tee",
      price: 45,
      image: tshirtImage,
      category: "T-Shirts",
      isNew: true,
    },
    {
      id: "3",
      name: "Midnight Black Hoodie",
      price: 95,
      image: hoodieImage,
      category: "Hoodies",
    },
    {
      id: "4",
      name: "Graphic Statement Tee",
      price: 39,
      originalPrice: 55,
      image: tshirtImage,
      category: "T-Shirts",
      onSale: true,
    },
  ];

  useEffect(() => {
    // Determine the height of the hero section for calculations
    const heroHeight = window.innerHeight * 0.8; // Approximate 80vh of the hero section

    // Define scroll thresholds for the hero's blur/fade
    // Hero starts blurring immediately (scrollY 0) and maxes out at heroBlurEndScroll
    const heroBlurEndScroll = 250; // Adjust this value to control blur speed
    const maxHeroBlurPixels = 150; // Max hero blur intensity

    // Define scroll thresholds for the Featured Products section's background opacity
    // Background remains transparent until scrollY reaches sectionBgRevealStart,
    // then becomes fully opaque at sectionBgRevealEnd.
    const sectionBgRevealStart = 20; // Start making background opaque after 50px scroll
    const sectionBgRevealEnd = 400; // Background becomes fully opaque at 350px scroll
    // You might want to adjust these based on how much of the "Featured Products"
    // section is initially visible and how quickly you want its background to appear.

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // --- HERO BLUR/OPACITY LOGIC ---
      // This calculates progress from 0 (at scrollY 0) to 1 (at heroBlurEndScroll)
      const heroScrollProgress = Math.min(
        1,
        Math.max(0, scrollY / heroBlurEndScroll)
      );
      setHeroBlur(heroScrollProgress * maxHeroBlurPixels);
      setHeroOpacity(1 - Math.pow(heroScrollProgress, 2)); // Squared for gradual fade

      // --- SECTION BACKGROUND OPACITY LOGIC ---
      let newSectionOpacity;
      if (scrollY <= sectionBgRevealStart) {
        newSectionOpacity = 0; // Fully transparent at or before reveal start
      } else if (scrollY >= sectionBgRevealEnd) {
        newSectionOpacity = 1; // Fully opaque at or after reveal end
      } else {
        // Linearly interpolate opacity between 0 and 1 within the reveal range
        newSectionOpacity =
          (scrollY - sectionBgRevealStart) /
          (sectionBgRevealEnd - sectionBgRevealStart);
      }
      setSectionBackgroundOpacity(newSectionOpacity);
    };

    // Call handleScroll once on mount to set initial states based on scrollY=0
    // This is important for the initial transparent background of the section.
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // --- NEW EFFECT FOR SCROLLING TO ANCHOR ---
  useEffect(() => {
    // Check if the URL hash matches the ID of our contact section
    if (location.hash === "#contact") {
      // Use requestAnimationFrame for smoother scroll in case of rapid events
      requestAnimationFrame(() => {
        if (contactSectionRef.current) {
          // scrollIntoView options:
          // 'smooth' for animation
          // 'start' aligns the top of the element with the top of the viewport
          contactSectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    }
  }, [location]); // Re-run this effect whenever the URL hash changes

  useEffect(() => {
    // Check if the URL hash matches the ID of our contact section
    if (location.hash === "#about") {
      // Use requestAnimationFrame for smoother scroll in case of rapid events
      requestAnimationFrame(() => {
        if (aboutSectionRef.current) {
          // scrollIntoView options:
          // 'smooth' for animation
          // 'start' aligns the top of the element with the top of the viewport
          aboutSectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    }
  }, [location]); // Re-run this effect whenever the URL hash changes

  // --- NEW EFFECT FOR SCROLLING TO TOP (LOGO CLICK) ---
  useEffect(() => {
    // Check if the current path is the root and no hash is present
    // This prevents it from scrolling to top if you navigate to /#contact
    if (location.pathname === "/" && location.hash === "") {
      requestAnimationFrame(() => {
        if (topOfPageRef.current) {
          topOfPageRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } else {
          // Fallback if ref isn't available for some reason
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }
  }, [location.pathname, location.hash]); // Re-run when path or hash changes

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
    <>
      {/* Header should probably be fixed and on top if it's a navigation */}
      <Header />
      {/* Hero Section - Pass blurAmount and opacity */}
      {/* Ensure HeroSection has fixed position, fills viewport, and lower z-index */}
      <HeroSection blurAmount={heroBlur} opacity={heroOpacity} />

      {/*
        Main content wrapper.
        Push this down by the height of the HeroSection (80vh).
        Set a z-index higher than the HeroSection background (z-0)
        to make it scroll on top of it.
      */}
      <div className="relative z-10 pt-[60vh] min-h-screen">
        {/* Featured Products Section */}
        <section
          ref={featuredProductsRef}
          className="py-20" // Keep py-20 for vertical padding
          style={{
            // Apply the gradient. Its opacity is controlled by sectionBackgroundOpacity.
            background: `linear-gradient(to bottom, var(--background), hsl(var(--primary) / 0.2))`,
            // opacity: sectionBackgroundOpacity,
            // Hide the section completely when fully transparent to prevent clicks on its background area
            // visibility: sectionBackgroundOpacity > 0 ? "visible" : "hidden",
            transition: "opacity 0.3s ease-out", // Smooth transition for the background appearing
          }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4 animate-fade-in-up">
                Featured Products
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto animate-fade-in-up">
                Discover our most popular pieces, carefully selected to elevate
                your streetwear game
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in-up">
              {featuredProducts.map((product) => (
                // Assuming ProductCard now handles the 'product' prop correctly as discussed previously
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" asChild>
                <Link to="/explore">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <section
          ref={featuredProductsRef}
          className="pt-5 pb-20" // Keep py-20 for vertical padding
          style={{
            // Apply the gradient. Its opacity is controlled by sectionBackgroundOpacity.
            background: `linear-gradient(to bottom, var(--background), hsl(var(--primary) / 0.2))`,
            // opacity: sectionBackgroundOpacity,
            // Hide the section completely when fully transparent to prevent clicks on its background area
            // visibility: sectionBackgroundOpacity > 0 ? "visible" : "hidden",
            transition: "opacity 0.3s ease-out", // Smooth transition for the background appearing
          }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4 animate-fade-in-up">
                Featured Products
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto animate-fade-in-up">
                Discover our most popular pieces, carefully selected to elevate
                your streetwear game
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in-up">
              {featuredProducts.map((product) => (
                // Assuming ProductCard now handles the 'product' prop correctly as discussed previously
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" asChild>
                <Link to="/explore">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Explore Categories (This section will naturally scroll up after Featured Products) */}
        {/* <section className="py-20"> */}
        {/* {" "} */}
        {/* You can apply a fixed background here if desired */}
        {/* <div className="container mx-auto px-4"> */}
        {/* <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                Explore Collections
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Find your perfect style in our curated collections
              </p>
            </div> */}

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="group overflow-hidden border-border/50 bg-gradient-card">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={hoodieImage}
                    alt="Hoodies Collection"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                  <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Explore Hoodies
                    </h3>
                    <p className="text-foreground/70 mb-4">
                      Premium comfort meets street style
                    </p>
                    <Button variant="cta" asChild>
                      <Link to="/explore?category=hoodies">
                        Shop Hoodies
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </div>
              </Card>

              <Card className="group overflow-hidden border-border/50 bg-gradient-card">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={tshirtImage}
                    alt="T-Shirts Collection"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                  <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Explore T-Shirts
                    </h3>
                    <p className="text-foreground/70 mb-4">
                      Express yourself with bold graphics
                    </p>
                    <Button variant="cta" asChild>
                      <Link to="/explore?category=tshirts">
                        Shop T-Shirts
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </div> */}
        {/* </div> */}
        {/* </section> */}

        {/* Newsletter Section - This is fine here */}
        <section className="py-20 bg-primary">
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
        </section>

        {/* Contact Section */}
        <section className="bg-primary">
          <div className="grid grid-row-1 lg:grid-row-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
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
                      className="w-full"
                    >
                      Send Message
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
                          support@arraste.com
                        </p>
                        <p className="text-foreground/70">orders@arraste.com</p>
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
                        <p className="text-foreground/70 mb-1">
                          +1 (555) 123-4567
                        </p>
                        <p className="text-foreground/70">
                          Mon-Fri, 9AM-6PM EST
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-accent/20 p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
                        <p className="text-foreground/70 mb-1">
                          123 Street Style Avenue
                        </p>
                        <p className="text-foreground/70">New York, NY 10001</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-accent/20 p-3 rounded-lg">
                        <Clock className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          Store Hours
                        </h3>
                        <div className="text-foreground/70 space-y-1">
                          <p>Monday - Friday: 10AM - 8PM</p>
                          <p>Saturday: 10AM - 9PM</p>
                          <p>Sunday: 12PM - 6PM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Index;
