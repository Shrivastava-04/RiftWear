import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Instagram, Share, Twitter } from "lucide-react";
import emailjs from "@emailjs/browser";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import DepartmentProductCard from "@/components/DepartmentCard";
import DropCountdown from "@/components/DropCountdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import comingSoonImage from "../assets/coming soon image 2.png";

// Custom hook to get window width
const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
};

const Index = () => {
  const [heroBlur, setHeroBlur] = useState(0);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const contactSectionRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const location = useLocation();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { toast } = useToast();
  const navigate = useNavigate();

  const [allFeaturedProducts, setAllFeaturedProducts] = useState([]);
  const [productsToDisplay, setProductsToDisplay] = useState([]);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [user, setUser] = useState(null);
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    message: "",
    subject: "",
  });
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);

  const windowWidth = useWindowWidth();

  const comingSoonPlaceholder = {
    _id: "mock-coming-soon-" + Math.random(),
    name: "Coming Soon",
    images: [comingSoonImage],
    price: 0,
    originalPrice: 0,
    category: "Placeholder",
    isNew: false,
    onSale: false,
    variants: [],
  };

  useEffect(() => {
    const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");

    const fetchUserProfile = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/user/userById`, {
          params: { id: userId },
        });
        const userData = response.data.user;
        setUser(userData);
        setContactFormData((prev) => ({
          ...prev,
          name: userData.name || "",
          email: userData.email || "",
        }));
      } catch (error) {
        console.error("Profile Page: Error fetching user profile:", error);
      }
    };

    const loadProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/product/getallproduct`);
        const homePageProducts = res.data.filter(
          (item) => !item.forDepartment && item.forHomePage
        );

        const flattenedProducts = homePageProducts.map((product) => {
          if (product.variants && product.variants.length > 0) {
            const firstVariant = product.variants[0];
            return {
              ...product,
              price: firstVariant.price,
              originalPrice: firstVariant.originalPrice,
            };
          }
          return product;
        });

        // MODIFIED: Sort products by creation date, newest first
        const sortedProducts = flattenedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setAllFeaturedProducts(sortedProducts);
      } catch (error) {
        console.error("Error loading featured products:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/departments/get-department`
        );
        setDepartmentsData(
          response.data.sort((a, b) => a.name.localeCompare(b.name))
        );
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    if (userId) fetchUserProfile();
    loadProducts();
    fetchDepartments();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (allFeaturedProducts.length === 0) {
      setProductsToDisplay([]);
      return;
    }

    let columns = 2; // Default for mobile
    if (windowWidth >= 1024) {
      // lg
      columns = 5;
    } else if (windowWidth >= 640) {
      // sm
      columns = 3;
    }

    // NEW LOGIC: Limit products to 3 rows on mobile
    let productsToProcess = allFeaturedProducts;
    if (columns === 2) {
      // Max 6 products for mobile (3 rows of 2)
      productsToProcess = allFeaturedProducts.slice(0, 6);
    }

    const totalProducts = productsToProcess.length;
    const remainder = totalProducts % columns;
    const placeholdersNeeded = remainder === 0 ? 0 : columns - remainder;

    const placeholders = Array.from({ length: placeholdersNeeded }, (_, i) => ({
      ...comingSoonPlaceholder,
      _id: `mock-coming-soon-${i}`,
    }));

    setProductsToDisplay([...productsToProcess, ...placeholders]);
  }, [allFeaturedProducts, windowWidth]);

  useEffect(() => {
    const heroBlurEndScroll = 250;
    const maxHeroBlurPixels = 150;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroScrollProgress = Math.min(
        1,
        Math.max(0, scrollY / heroBlurEndScroll)
      );
      setHeroBlur(heroScrollProgress * maxHeroBlurPixels);
      setHeroOpacity(1 - Math.pow(heroScrollProgress, 2));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.hash === "#about" && aboutSectionRef.current) {
      aboutSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    if (location.hash === "#contact" && contactSectionRef.current) {
      contactSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [location]);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactFormData({ ...contactFormData, [name]: value });
  };

  const validateContactForm = () => {
    const newErrors = {};
    if (!contactFormData.name) newErrors.name = "Name is required";
    if (!contactFormData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(contactFormData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!contactFormData.message) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateContactForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSending(true);

    emailjs
      .send(
        "service_zhcibqb",
        "template_0gppc5h",
        contactFormData,
        "CPvYRDJLV592kASVa"
      )
      .then((response) => {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you as soon as possible.",
          variant: "success",
        });
        setContactFormData({ ...contactFormData, message: "", subject: "" });
      })
      .catch((error) => {
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

  const handleScrollToContact = (e) => {
    e.preventDefault();
    if (contactSectionRef.current) {
      contactSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <Header />
      <DropCountdown
        onScrollToContact={handleScrollToContact}
        blurAmount={heroBlur}
        opacity={heroOpacity}
      />
      <HeroSection blurAmount={heroBlur} opacity={heroOpacity} />
      <div className="relative z-10 pt-[60vh] min-h-screen">
        <section
          className="py-20"
          style={{
            background: `linear-gradient(to bottom, var(--background), hsl(var(--primary) / 0.2))`,
          }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                Featured Products
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Discover our most popular pieces.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
              {productsToDisplay.map((product) => (
                <ProductCard
                  key={product._id}
                  arrival={
                    product.name === "Coming Soon" ? "comingSoon" : "arrived"
                  }
                  product={product}
                  forDepartment={false}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          className="py-20"
          style={{
            background: `linear-gradient(to bottom, var(--background), hsl(var(--primary) / 0.2))`,
          }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                Shop by Department
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Find apparel designed specifically for your field of study.
              </p>
            </div>
          </div>
          <div className="flex overflow-x-scroll pb-4 space-x-6 scrollbar-hide px-4">
            {departmentsData.map((department) => (
              <DepartmentProductCard
                key={department._id}
                department={department}
                arrival={
                  department.productIsAvailable ? "arrived" : "comingSoon"
                }
              />
            ))}
          </div>
        </section>

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
                <form onSubmit={handleContactSubmit} className="space-y-6">
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
                        value={contactFormData.name}
                        onChange={handleContactChange}
                        required
                        className="bg-secondary/50"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name}
                        </p>
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
                        value={contactFormData.email}
                        onChange={handleContactChange}
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
                      value={contactFormData.subject}
                      onChange={handleContactChange}
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
                      value={contactFormData.message}
                      onChange={handleContactChange}
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
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/20 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email Us</h3>
                    <p className="text-foreground/70">
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
                    <h3 className="font-semibold text-lg">Social Media</h3>
                    <div className="flex space-x-4 py-1">
                      <a
                        href="https://www.instagram.com/rift_wear/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 hover:text-accent"
                      >
                        <Instagram className="h-5 w-5" />
                        <span>rift_wear</span>
                      </a>
                      <a
                        href="https://x.com/rift_wear"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 hover:text-accent"
                      >
                        <Twitter className="h-5 w-5" />
                        <span>rift_wear</span>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Index;
