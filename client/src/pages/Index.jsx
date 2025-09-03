// import React, { useState, useEffect, useRef } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { ArrowRight, Instagram, Share, Twitter } from "lucide-react";
// import emailjs from "@emailjs/browser";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import HeroSection from "@/components/HeroSection";
// import ProductCard from "@/components/ProductCard";
// import DepartmentProductCard from "@/components/DepartmentCard";
// import DropCountdown from "@/components/DropCountdown";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Mail, Phone, MapPin, Clock } from "lucide-react";
// import axios from "axios";
// import { useToast } from "@/hooks/use-toast";
// import comingSoonImage from "../assets/coming soon image 2.png";

// const Index = () => {
//   const [heroBlur, setHeroBlur] = useState(0);
//   const [heroOpacity, setHeroOpacity] = useState(1);
//   const [sectionBackgroundOpacity, setSectionBackgroundOpacity] = useState(0);
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const featuredProductsRef = useRef(null);
//   const contactSectionRef = useRef(null);
//   const aboutSectionRef = useRef(null);
//   const topOfPageRef = useRef(null);
//   const location = useLocation();
//   const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
//   const { toast } = useToast();
//   const [user, setUser] = useState(null);
//   const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");
//   const navigate = useNavigate();

//   const fetchUserProfile = async () => {
//     if (!userId) {
//       // setLoading(false);
//       // navigate("/login");
//       return;
//     }
//     try {
//       // setLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/user/userById`, {
//         params: { id: userId },
//       });
//       const userData = response.data.user;
//       setUser(userData);
//       // UPDATED: Initialize form with the single address object
//     } catch (error) {
//       console.error("Profile Page: Error fetching user profile:", error);
//       localStorage.removeItem("userId");
//       navigate("/login");
//     } finally {
//       // setLoading(false);
//     }
//   };

//   const comingSoonPlaceholder = {
//     _id: "mock-coming-soon-" + Math.random(),
//     name: "Coming Soon",
//     price: 0,
//     originalPrice: 0,
//     images: [comingSoonImage],
//     category: "Placeholder",
//     isNew: false,
//     onSale: false,
//     colors: [],
//     sizeChart: [],
//     forDepartment: false,
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchUserProfile();
//     }
//     const loadProducts = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/product/getallproduct`);
//         const homePageProducts = res.data.filter(
//           (item) => !item.forDepartment && item.forHomePage
//         );

//         // --- THIS IS THE CRUCIAL PART THAT MAKES IT WORK ---
//         // We flatten the product data here before it gets passed to ProductCard
//         const flattenedProducts = homePageProducts.map((product) => {
//           if (product.variants && product.variants.length > 0) {
//             const firstVariant = product.variants[0];
//             return {
//               ...product, // Keep top-level fields like _id, name, images
//               price: firstVariant.price, // Add price from the first variant
//               originalPrice: firstVariant.originalPrice, // Add originalPrice
//             };
//           }
//           return product; // Fallback for products without variants
//         });
//         // ----------------------------------------------------

//         const actualProducts = flattenedProducts.slice(0, 4);
//         const placeholdersNeeded = 4 - flattenedProducts.length;

//         const productsToDisplay = [
//           ...actualProducts,
//           ...Array(placeholdersNeeded).fill(comingSoonPlaceholder),
//         ];

//         setFeaturedProducts(productsToDisplay);
//       } catch (error) {
//         console.error("Error loading featured products:", error);
//       }
//     };
//     loadProducts();
//   }, [API_BASE_URL, userId]);

//   const [departmentsData, setDepartmentsData] = useState([]);

//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/departments/get-department`
//         );
//         setDepartmentsData(
//           response.data.sort((a, b) => a.name.localeCompare(b.name))
//         );
//         // console.log(response.data);
//         // console.log("Departments fetched successfully:", response.data);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       }
//     };
//     fetchDepartments();
//   }, [API_BASE_URL]);

//   useEffect(() => {
//     const heroBlurEndScroll = 250;
//     const maxHeroBlurPixels = 150;
//     const sectionBgRevealStart = 20;
//     const sectionBgRevealEnd = 400;

//     const handleScroll = () => {
//       const scrollY = window.scrollY;

//       const heroScrollProgress = Math.min(
//         1,
//         Math.max(0, scrollY / heroBlurEndScroll)
//       );
//       setHeroBlur(heroScrollProgress * maxHeroBlurPixels);
//       setHeroOpacity(1 - Math.pow(heroScrollProgress, 2));

//       let newSectionOpacity;
//       if (scrollY <= sectionBgRevealStart) {
//         newSectionOpacity = 0;
//       } else if (scrollY >= sectionBgRevealEnd) {
//         newSectionOpacity = 1;
//       } else {
//         newSectionOpacity =
//           (scrollY - sectionBgRevealStart) /
//           (sectionBgRevealEnd - sectionBgRevealEnd);
//       }
//       setSectionBackgroundOpacity(newSectionOpacity);
//     };

//     handleScroll();
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // const location = useLocation();

//   useEffect(() => {
//     if (location.hash === "#contact") {
//       // Use setTimeout to ensure the DOM has had time to update
//       const timeoutId = setTimeout(() => {
//         if (contactSectionRef.current) {
//           contactSectionRef.current.scrollIntoView({
//             behavior: "smooth",
//             block: "start",
//           });
//         }
//       }, 100); // 100ms is a safe delay

//       // Cleanup function to clear the timeout if the component unmounts
//       return () => clearTimeout(timeoutId);
//     }
//   }, [location]);

//   // useEffect(() => {
//   //   if (location.hash === "#contact") {
//   //     requestAnimationFrame(() => {
//   //       if (contactSectionRef.current) {
//   //         contactSectionRef.current.scrollIntoView({
//   //           behavior: "smooth",
//   //           block: "start",
//   //         });
//   //       }
//   //     });
//   //   }
//   // }, [location]);

//   useEffect(() => {
//     if (location.hash === "#about") {
//       requestAnimationFrame(() => {
//         if (aboutSectionRef.current) {
//           aboutSectionRef.current.scrollIntoView({
//             behavior: "smooth",
//             block: "start",
//           });
//         }
//       });
//     }
//   }, [location]);

//   useEffect(() => {
//     if (location.pathname === "/" && location.hash === "") {
//       requestAnimationFrame(() => {
//         if (topOfPageRef.current) {
//           topOfPageRef.current.scrollIntoView({
//             behavior: "smooth",
//             block: "start",
//           });
//         } else {
//           window.scrollTo({ top: 0, behavior: "smooth" });
//         }
//       });
//     }
//   }, [location.pathname, location.hash]);

//   const [formData, setFormData] = useState({
//     name: user ? user.name : "",
//     email: user ? user.email : "",
//     message: "",
//     subject: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [isSending, setIsSending] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const validate = () => {
//     const errors = {};
//     if (!formData.name) {
//       errors.name = "Name is required";
//     }
//     if (!formData.email) {
//       errors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       errors.email = "Email is invalid";
//     }
//     if (!formData.message) {
//       errors.message = "Message is required";
//     }
//     return errors;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const validateData = validate();
//     if (Object.keys(validateData).length > 0) {
//       setErrors(validateData);
//     } else {
//       setErrors({});
//       setIsSending(true);

//       emailjs
//         .send(
//           "service_zhcibqb",
//           "template_0gppc5h",
//           formData,
//           "CPvYRDJLV592kASVa"
//         )
//         .then((response) => {
//           console.log("SUCCESS!", response.status, response.text);
//           toast({
//             title: "Message Sent!",
//             description:
//               "Your message has been sent successfully. We'll get back to you as soon as possible.",
//             variant: "success",
//           });
//           setFormData({ name: "", email: "", message: "", subject: "" });
//         })
//         .catch((error) => {
//           toast({
//             title: "Message Failed",
//             description: "Failed to send message. Please try again later.",
//             variant: "destructive",
//           });
//         })
//         .finally(() => {
//           setIsSending(false);
//         });
//     }
//   };

//   return (
//     <>
//       <Header />
//       {/* <DropCountdown /> */}
//       <HeroSection blurAmount={heroBlur} opacity={heroOpacity} />

//       <div className="relative z-10 pt-[60vh] min-h-screen">
//         <section
//           ref={featuredProductsRef}
//           className="py-20"
//           style={{
//             background: `linear-gradient(to bottom, var(--background), hsl(var(--primary) / 0.2))`,
//             transition: "opacity 0.3s ease-out",
//           }}
//         >
//           <div className="container mx-auto px-4">
//             <div className="text-center mb-12">
//               <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4 animate-fade-in-up">
//                 Featured Products
//               </h2>
//               <p className="text-foreground/70 max-w-2xl mx-auto animate-fade-in-up">
//                 Discover our most popular pieces.
//               </p>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in-up">
//               {featuredProducts.map((product) => (
//                 <ProductCard
//                   key={product._id}
//                   arrival={
//                     product.name === "Coming Soon" ? "comingSoon" : "arrived"
//                   }
//                   product={product}
//                   forDepartment={false}
//                 />
//               ))}
//             </div>
//           </div>
//         </section>

//         <section
//           className="py-20"
//           style={{
//             background: `linear-gradient(to bottom, var(--background), hsl(var(--primary) / 0.2))`,
//             transition: "opacity 0.3s ease-out",
//           }}
//         >
//           <div className="container mx-auto px-4">
//             <div className="text-center mb-12">
//               <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4 animate-fade-in-up">
//                 Shop by Department
//               </h2>
//               <p className="text-foreground/70 max-w-2xl mx-auto animate-fade-in-up">
//                 Find apparel designed specifically for your field of study.
//               </p>
//             </div>
//           </div>
//           <div className="flex overflow-x-scroll pb-4 space-x-6 scrollbar-hide px-4">
//             {departmentsData.map((department) => (
//               <DepartmentProductCard
//                 key={department._id}
//                 department={department}
//                 arrival={
//                   department.productIsAvailable ? "arrived" : "comingSoon"
//                 }
//               />
//             ))}
//           </div>
//         </section>

//         <section className="bg-primary">
//           <div
//             className="grid grid-row-1 lg:grid-row-2 gap-12 max-w-6xl mx-auto"
//             ref={contactSectionRef}
//             id="contact"
//           >
//             <section className="md:py-10 bg-primary">
//               <Card className="bg-card/50 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="text-2xl gradient-text">
//                     Send us a message
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <form onSubmit={handleSubmit} className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label
//                           htmlFor="name"
//                           className="block text-sm font-medium mb-2"
//                         >
//                           Name *
//                         </label>
//                         <Input
//                           id="name"
//                           name="name"
//                           value={formData.name}
//                           onChange={handleChange}
//                           required
//                           className="bg-secondary/50"
//                         />
//                       </div>
//                       <div>
//                         <label
//                           htmlFor="email"
//                           className="block text-sm font-medium mb-2"
//                         >
//                           Email *
//                         </label>
//                         <Input
//                           id="email"
//                           name="email"
//                           type="email"
//                           value={formData.email}
//                           onChange={handleChange}
//                           required
//                           className="bg-secondary/50"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="subject"
//                         className="block text-sm font-medium mb-2"
//                       >
//                         Subject *
//                       </label>
//                       <Input
//                         id="subject"
//                         name="subject"
//                         value={formData.subject}
//                         onChange={handleChange}
//                         required
//                         className="bg-secondary/50"
//                       />
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="message"
//                         className="block text-sm font-medium mb-2"
//                       >
//                         Message *
//                       </label>
//                       <Textarea
//                         id="message"
//                         name="message"
//                         value={formData.message}
//                         onChange={handleChange}
//                         required
//                         rows={6}
//                         className="bg-secondary/50"
//                       />
//                     </div>

//                     <Button
//                       type="submit"
//                       variant="cta"
//                       size="lg"
//                       className={`w-full ${
//                         isSending ? "opacity-50 cursor-not-allowed" : ""
//                       }`}
//                       disabled={isSending}
//                     >
//                       {isSending ? "Sending..." : "Send Message"}
//                     </Button>
//                   </form>
//                 </CardContent>
//               </Card>
//             </section>

//             <section
//               ref={aboutSectionRef}
//               id="about"
//               className="md:py-10 bg-primary"
//             >
//               <div className="max-w-4xl mx-auto px-4">
//                 <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
//                   <Card className="bg-card/50 border-border/50 flex-1 w-full">
//                     <CardContent className="p-6">
//                       <div className="flex items-start space-x-4">
//                         <div className="bg-accent/20 p-3 rounded-lg">
//                           <Mail className="h-6 w-6 text-accent" />
//                         </div>
//                         <div className="py-1">
//                           <h3 className="font-semibold text-lg mb-2">
//                             Email Us
//                           </h3>
//                           <p className="text-foreground/70 mb-1">
//                             riftwear.help@gmail.com
//                           </p>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <Card className="bg-card/50 border-border/50 flex-1 w-full">
//                     <CardContent className="p-6">
//                       <div className="flex items-start space-x-4">
//                         <div className="bg-accent/20 p-3 rounded-lg">
//                           <Share className="h-6 w-6 text-accent" />
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-lg mb-2">
//                             Social Media
//                           </h3>
//                           <div className="flex space-x-8 py-2">
//                             <a
//                               href="https://www.instagram.com/rift_wear/"
//                               target="_blank"
//                               rel="noopner noreferrer"
//                               className="flex items-center space-x-2"
//                             >
//                               <Instagram className="h-5 w-5" />
//                               <p>rift_wear</p>
//                             </a>
//                             <a
//                               href="https://x.com/rift_wear"
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="flex items-center space-x-2"
//                             >
//                               <Twitter className="h-5 w-5" />
//                               <p>rift_wear</p>
//                             </a>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             </section>
//           </div>
//         </section>
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default Index;
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
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import comingSoonImage from "../assets/coming soon image 2.png";

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
  const [user, setUser] = useState(null);
  const userId = (localStorage.getItem("userId") || "").replaceAll(/"/g, "");
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    if (!userId) {
      // setLoading(false);
      // navigate("/login");
      return;
    }
    try {
      // setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/user/userById`, {
        params: { id: userId },
      });
      const userData = response.data.user;
      setUser(userData);
      // UPDATED: Initialize form with the single address object
    } catch (error) {
      console.error("Profile Page: Error fetching user profile:", error);
      localStorage.removeItem("userId");
      navigate("/login");
    } finally {
      // setLoading(false);
    }
  };

  const comingSoonPlaceholder = {
    _id: "mock-coming-soon-" + Math.random(),
    name: "Coming Soon",
    price: 0,
    originalPrice: 0,
    images: [comingSoonImage],
    category: "Placeholder",
    isNew: false,
    onSale: false,
    colors: [],
    sizeChart: [],
    forDepartment: false,
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
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

        const actualProducts = flattenedProducts.slice(0, 4);
        const placeholdersNeeded = 4 - flattenedProducts.length;

        const productsToDisplay = [
          ...actualProducts,
          ...Array(placeholdersNeeded).fill(comingSoonPlaceholder),
        ];

        setFeaturedProducts(productsToDisplay);
      } catch (error) {
        console.error("Error loading featured products:", error);
      }
    };
    loadProducts();
  }, [API_BASE_URL, userId]);

  const [departmentsData, setDepartmentsData] = useState([]);

  useEffect(() => {
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
    fetchDepartments();
  }, [API_BASE_URL]);

  useEffect(() => {
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
          (sectionBgRevealEnd - sectionBgRevealEnd);
      }
      setSectionBackgroundOpacity(newSectionOpacity);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Removed the location.hash useEffect and moved logic to a click handler

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
    name: user ? user.name : "",
    email: user ? user.email : "",
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
          toast({
            title: "Message Sent!",
            description:
              "Your message has been sent successfully. We'll get back to you as soon as possible.",
            variant: "success",
          });
          setFormData({ name: "", email: "", message: "", subject: "" });
        })
        .catch((error) => {
          toast({
            title: "Message Failed",
            description: "Failed to send message. Please try again later.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsSending(false);
        });
    }
  };

  // NEW: Refined click handler for scrolling
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
      {/* Pass the new click handler to the DropCountdown component */}
      <DropCountdown
        onScrollToContact={handleScrollToContact}
        blurAmount={heroBlur}
        opacity={heroOpacity}
      />
      <HeroSection blurAmount={heroBlur} opacity={heroOpacity} />

      <div className="relative z-10 pt-[60vh] min-h-screen">
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

        <section className="bg-primary">
          <div className="grid grid-row-1 lg:grid-row-2 gap-12 max-w-6xl mx-auto">
            <section
              ref={contactSectionRef}
              id="contact"
              className="md:py-10 bg-primary"
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

            <section
              ref={aboutSectionRef}
              id="about"
              className="md:py-10 bg-primary"
            >
              <div className="max-w-4xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
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
                          <p className="text-foreground/70 mb-1">
                            riftwear.help@gmail.com
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
                              <Instagram className="h-5 w-5" />
                              <p>rift_wear</p>
                            </a>
                            <a
                              href="https://x.com/rift_wear"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2"
                            >
                              <Twitter className="h-5 w-5" />
                              <p>rift_wear</p>
                            </a>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
