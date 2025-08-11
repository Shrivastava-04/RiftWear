// import React, { useState, useEffect, useRef } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { ArrowRight } from "lucide-react";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import HeroSection from "@/components/HeroSection";
// import ProductCard from "@/components/ProductCard";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import hoodieImage from "@/assets/hoodie-1.jpg";
// import tshirtImage from "@/assets/tshirt-1.jpg";
// import { useToast } from "@/hooks/use-toast";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Mail, Phone, MapPin, Clock } from "lucide-react";
// import axios from "axios";
// import comingSoon from "../assets/coming soon image 2.png";
// import DepartmentProductCard from "../components/DepartmentCard";

// const Index = () => {
//   const [heroBlur, setHeroBlur] = useState(0);
//   const [heroOpacity, setHeroOpacity] = useState(1);
//   const [sectionBackgroundOpacity, setSectionBackgroundOpacity] = useState(0); // Starts at 0, fully transparent
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const featuredProductsRef = useRef(null);
//   const contactSectionRef = useRef(null); // <--- NEW REF for Contact Section
//   const aboutSectionRef = useRef(null); // <--- NEW REF for About Section
//   const topOfPageRef = useRef(null);
//   const location = useLocation(); // <--- NEW: Get current location object
//   const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

//   //load Products
//   useEffect(() => {
//     const loadProducts = async () => {
//       const res = await axios.get(`${API_BASE_URL}/product/getallproduct`);
//       // console.log(res.data);
//       const firstTwoProducts = res.data.slice(0, 2);
//       setFeaturedProducts(firstTwoProducts);
//     };
//     loadProducts();
//     console.log("hello world");
//   }, []);

//   // Mock featured products (as per your original code)

//   const product1 = {
//     _id: "689683cdc7875dcf1764057",
//     name: "Tshirt",
//     price: 488,
//     originalPrice: 686,
//     images: [
//       "https://res.cloudinary.com/dfvxh7p8p/image/upload/v1754663484/nhn9gpda.",
//       "https://res.cloudinary.com/dfvxh7p8p/image/upload/v1754663483/asqjsvZC",
//     ],
//     category: "T-Shirt",
//     isNew: true,
//     onSale: true,
//   };
//   const product2 = {
//     _id: "689683cdc7875dcf1764057",
//     name: "Tshirt",
//     price: 488,
//     originalPrice: 686,
//     images: [
//       "https://res.cloudinary.com/dfvxh7p8p/image/upload/v1754663484/nhn9gpda.",
//       "https://res.cloudinary.com/dfvxh7p8p/image/upload/v1754663483/asqjsvZC",
//     ],
//     category: "T-Shirt",
//     isNew: true,
//     onSale: true,
//   };

//   // const departmentsData = Array.from({ length: 18 }, (_, i) => ({
//   //   _id: `dept-${i + 1}`,
//   //   name: `Department ${i + 1}`,
//   //   description: `Find apparel designed for Department ${i + 1}.`,
//   //   image: `https://placehold.co/400x250/0F9D58/FFFFFF?text=Dept+${i + 1}`,
//   //   exploreLink: `/explore?department=Department+${i + 1}`,
//   // }));

//   const [departmentsData, setDepartmentsData] = useState([]);

//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/departments/get-department`
//         );
//         setDepartmentsData(response.data);
//         console.log("Departments fetched successfully:", response.data);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       }
//     };
//     fetchDepartments();
//   }, []);

//   useEffect(() => {
//     // Determine the height of the hero section for calculations
//     const heroHeight = window.innerHeight * 0.8; // Approximate 80vh of the hero section

//     // Define scroll thresholds for the hero's blur/fade
//     // Hero starts blurring immediately (scrollY 0) and maxes out at heroBlurEndScroll
//     const heroBlurEndScroll = 250; // Adjust this value to control blur speed
//     const maxHeroBlurPixels = 150; // Max hero blur intensity

//     // Define scroll thresholds for the Featured Products section's background opacity
//     // Background remains transparent until scrollY reaches sectionBgRevealStart,
//     // then becomes fully opaque at sectionBgRevealEnd.
//     const sectionBgRevealStart = 20; // Start making background opaque after 50px scroll
//     const sectionBgRevealEnd = 400; // Background becomes fully opaque at 350px scroll
//     // You might want to adjust these based on how much of the "Featured Products"
//     // section is initially visible and how quickly you want its background to appear.

//     const handleScroll = () => {
//       const scrollY = window.scrollY;

//       // --- HERO BLUR/OPACITY LOGIC ---
//       // This calculates progress from 0 (at scrollY 0) to 1 (at heroBlurEndScroll)
//       const heroScrollProgress = Math.min(
//         1,
//         Math.max(0, scrollY / heroBlurEndScroll)
//       );
//       setHeroBlur(heroScrollProgress * maxHeroBlurPixels);
//       setHeroOpacity(1 - Math.pow(heroScrollProgress, 2)); // Squared for gradual fade

//       // --- SECTION BACKGROUND OPACITY LOGIC ---
//       let newSectionOpacity;
//       if (scrollY <= sectionBgRevealStart) {
//         newSectionOpacity = 0; // Fully transparent at or before reveal start
//       } else if (scrollY >= sectionBgRevealEnd) {
//         newSectionOpacity = 1; // Fully opaque at or after reveal end
//       } else {
//         // Linearly interpolate opacity between 0 and 1 within the reveal range
//         newSectionOpacity =
//           (scrollY - sectionBgRevealStart) /
//           (sectionBgRevealEnd - sectionBgRevealStart);
//       }
//       setSectionBackgroundOpacity(newSectionOpacity);
//     };

//     // Call handleScroll once on mount to set initial states based on scrollY=0
//     // This is important for the initial transparent background of the section.
//     handleScroll();

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

//   // --- NEW EFFECT FOR SCROLLING TO ANCHOR ---
//   useEffect(() => {
//     // Check if the URL hash matches the ID of our contact section
//     if (location.hash === "#contact") {
//       // Use requestAnimationFrame for smoother scroll in case of rapid events
//       requestAnimationFrame(() => {
//         if (contactSectionRef.current) {
//           // scrollIntoView options:
//           // 'smooth' for animation
//           // 'start' aligns the top of the element with the top of the viewport
//           contactSectionRef.current.scrollIntoView({
//             behavior: "smooth",
//             block: "start",
//           });
//         }
//       });
//     }
//   }, [location]); // Re-run this effect whenever the URL hash changes

//   useEffect(() => {
//     // Check if the URL hash matches the ID of our contact section
//     if (location.hash === "#about") {
//       // Use requestAnimationFrame for smoother scroll in case of rapid events
//       requestAnimationFrame(() => {
//         if (aboutSectionRef.current) {
//           // scrollIntoView options:
//           // 'smooth' for animation
//           // 'start' aligns the top of the element with the top of the viewport
//           aboutSectionRef.current.scrollIntoView({
//             behavior: "smooth",
//             block: "start",
//           });
//         }
//       });
//     }
//   }, [location]); // Re-run this effect whenever the URL hash changes

//   // --- NEW EFFECT FOR SCROLLING TO TOP (LOGO CLICK) ---
//   useEffect(() => {
//     // Check if the current path is the root and no hash is present
//     // This prevents it from scrolling to top if you navigate to /#contact
//     if (location.pathname === "/" && location.hash === "") {
//       requestAnimationFrame(() => {
//         if (topOfPageRef.current) {
//           topOfPageRef.current.scrollIntoView({
//             behavior: "smooth",
//             block: "start",
//           });
//         } else {
//           // Fallback if ref isn't available for some reason
//           window.scrollTo({ top: 0, behavior: "smooth" });
//         }
//       });
//     }
//   }, [location.pathname, location.hash]); // Re-run when path or hash changes

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });
//   const { toast } = useToast();

//   // Removed type annotation for 'e'
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Simulate form submission
//     toast({
//       title: "Message Sent!",
//       description: "We'll get back to you within 24 hours.",
//     });

//     // Reset form
//     setFormData({
//       name: "",
//       email: "",
//       subject: "",
//       message: "",
//     });
//   };

//   // Removed type annotation for 'e'
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <>
//       {/* Header should probably be fixed and on top if it's a navigation */}
//       <Header />
//       {/* Hero Section - Pass blurAmount and opacity */}
//       {/* Ensure HeroSection has fixed position, fills viewport, and lower z-index */}
//       <HeroSection blurAmount={heroBlur} opacity={heroOpacity} />

//       {/*
//         Main content wrapper.
//         Push this down by the height of the HeroSection (80vh).
//         Set a z-index higher than the HeroSection background (z-0)
//         to make it scroll on top of it.
//       */}
//       <div className="relative z-10 pt-[60vh] min-h-screen">
//         {/* Featured Products Section */}
//         <section
//           ref={featuredProductsRef}
//           className="py-20" // Keep py-20 for vertical padding
//           style={{
//             // Apply the gradient. Its opacity is controlled by sectionBackgroundOpacity.
//             background: `linear-gradient(to bottom, var(--background), hsl(var(--primary) / 0.2))`,
//             // opacity: sectionBackgroundOpacity,
//             // Hide the section completely when fully transparent to prevent clicks on its background area
//             // visibility: sectionBackgroundOpacity > 0 ? "visible" : "hidden",
//             transition: "opacity 0.3s ease-out", // Smooth transition for the background appearing
//           }}
//         >
//           <div className="container mx-auto px-4">
//             <div className="text-center mb-12">
//               <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4 animate-fade-in-up">
//                 Featured Products
//               </h2>
//               <p className="text-foreground/70 max-w-2xl mx-auto animate-fade-in-up">
//                 Discover our most popular pieces, carefully selected to elevate
//                 your streetwear game
//               </p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in-up">
//               {featuredProducts.map((product) => (
//                 // Assuming ProductCard now handles the 'product' prop correctly as discussed previously
//                 <ProductCard
//                   key={product._id}
//                   arrival={"arrived"}
//                   product={product}
//                   forDepartment={false} // Assuming this prop is used to differentiate product types
//                 />
//               ))}
//               <ProductCard
//                 arrival={"comingSoon"}
//                 product={product1}
//                 forDepartment={false}
//               />
//               <ProductCard
//                 arrival={"comingSoon"}
//                 product={product2}
//                 forDepartment={false}
//               />
//             </div>
//           </div>
//         </section>
//         <section
//           ref={departmentsData}
//           className="py-20" // Keep py-20 for vertical padding
//           style={{
//             // Apply the gradient. Its opacity is controlled by sectionBackgroundOpacity.
//             background: `linear-gradient(to bottom, var(--background), hsl(var(--primary) / 0.2))`,
//             // opacity: sectionBackgroundOpacity,
//             // Hide the section completely when fully transparent to prevent clicks on its background area
//             // visibility: sectionBackgroundOpacity > 0 ? "visible" : "hidden",
//             transition: "opacity 0.3s ease-out", // Smooth transition for the background appearing
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
//           {/* Full-width scroll container - no horizontal padding */}
//           <div className="flex overflow-x-scroll pb-4 space-x-6 scrollbar-hide">
//             <div className="px-4 flex space-x-6">
//               {departmentsData.map((department) => (
//                 <>
//                   <DepartmentProductCard
//                     key={department._id}
//                     department={department}
//                   />
//                 </>
//               ))}
//             </div>
//           </div>
//         </section>
//         {/* Newsletter Section - This is fine here */}
//         <section className="py-20 bg-primary">
//           <div className="container mx-auto px-4 text-center">
//             <div className="max-w-2xl mx-auto space-y-6">
//               <h2 className="text-3xl md:text-4xl font-bold gradient-text">
//                 Stay in the Loop
//               </h2>
//               <p className="text-foreground/70 text-lg">
//                 Be the first to know about new drops, exclusive offers, and
//                 street style inspiration
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   className="flex-1 px-4 py-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
//                 />
//                 <Button variant="cta" size="lg">
//                   Subscribe
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </section>
//         {/* Contact Section */}
//         <section className="bg-primary">
//           <div className="grid grid-row-1 lg:grid-row-2 gap-12 max-w-6xl mx-auto">
//             {/* Contact Form */}
//             <section
//               ref={contactSectionRef}
//               id="contact"
//               className="py-20 bg-primary"
//             >
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
//                       className="w-full"
//                     >
//                       Send Message
//                     </Button>
//                   </form>
//                 </CardContent>
//               </Card>
//             </section>

//             {/* Contact Information */}
//             <section
//               ref={aboutSectionRef}
//               id="about"
//               className="py-20 bg-primary"
//             >
//               <div className="space-y-8">
//                 <Card className="bg-card/50 border-border/50">
//                   <CardContent className="p-6">
//                     <div className="flex items-start space-x-4">
//                       <div className="bg-accent/20 p-3 rounded-lg">
//                         <Mail className="h-6 w-6 text-accent" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-lg mb-2">Email Us</h3>
//                         <p className="text-foreground/70 mb-1">
//                           riftwear.help@gmail.com
//                         </p>
//                         {/* <p className="text-foreground/70">orders@arraste.com</p> */}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-card/50 border-border/50">
//                   <CardContent className="p-6">
//                     <div className="flex items-start space-x-4">
//                       <div className="bg-accent/20 p-3 rounded-lg">
//                         <Phone className="h-6 w-6 text-accent" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-lg mb-2">Call Us</h3>
//                         <p className="text-foreground/70 mb-1">
//                           +91 78987 82596
//                         </p>
//                         <p className="text-foreground/70">
//                           Mon-Fri, 9AM-6PM IST
//                         </p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* <Card className="bg-card/50 border-border/50">
//                   <CardContent className="p-6">
//                     <div className="flex items-start space-x-4">
//                       <div className="bg-accent/20 p-3 rounded-lg">
//                         <MapPin className="h-6 w-6 text-accent" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
//                         <p className="text-foreground/70 mb-1">
//                           123 Street Style Avenue
//                         </p>
//                         <p className="text-foreground/70">New York, NY 10001</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card> */}

//                 {/* <Card className="bg-card/50 border-border/50">
//                   <CardContent className="p-6">
//                     <div className="flex items-start space-x-4">
//                       <div className="bg-accent/20 p-3 rounded-lg">
//                         <Clock className="h-6 w-6 text-accent" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-lg mb-2">
//                           Store Hours
//                         </h3>
//                         <div className="text-foreground/70 space-y-1">
//                           <p>Monday - Friday: 10AM - 8PM</p>
//                           <p>Saturday: 10AM - 9PM</p>
//                           <p>Sunday: 12PM - 6PM</p>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card> */}
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

// // {/* NEW: Departments Section with Horizontal Scroll */}
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import DepartmentProductCard from "@/components/DepartmentCard"; // <-- IMPORT NEW COMPONENT
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import hoodieImage from "@/assets/hoodie-1.jpg";
import tshirtImage from "@/assets/tshirt-1.jpg";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import axios from "axios";
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

  // Load Products for Featured Section
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/product/getallproduct`);
        const firstTwoProducts = res.data.slice(0, 2); // Get first two for featured
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
    subject: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();

    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
                Discover our most popular pieces, carefully selected to elevate
                your streetwear game
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
        {/* <section
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
        {/* <div className="flex overflow-x-scroll pb-4 space-x-6 scrollbar-hide px-4">
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
        </section> */}

        {/* Newsletter Section */}
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
