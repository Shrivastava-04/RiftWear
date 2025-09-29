import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// --- API & Custom Hooks ---
import {
  fetchProducts,
  fetchDepartments,
  getPublicSiteSettings,
} from "@/api/apiService";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";

// --- UI Components ---
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import HeroSection from "./home-sections/HeroSection";
import DropCountdown from "./home-sections/DropCountdown";
import ProductCard from "@/components/common/ProductCard";
import DepartmentProductCard from "@/components/common/DepartmentProductCard";
import ContactAndAboutSection from "./home-sections/ContactSection";

const Home = () => {
  const [heroBlur, setHeroBlur] = useState(0);
  const [heroOpacity, setHeroOpacity] = useState(1);

  // --- UPDATED: Fetch site settings in the top-level component ---

  const { data: settingsData } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: getPublicSiteSettings,
  });
  const comingSoonInfo = settingsData?.data?.settings?.comingSoon;

  // --- Scroll effect for Hero Section ---
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const blurEndScroll = 250;
      const maxBlurPixels = 150;
      const progress = Math.min(1, scrollY / blurEndScroll);
      setHeroBlur(progress * maxBlurPixels);
      setHeroOpacity(1 - Math.pow(progress, 2));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Header />
      <DropCountdown
        collectionName="IIT (ISM) Dhanbad"
        blurAmount={heroBlur}
        opacity={heroOpacity}
      />
      <HeroSection blurAmount={heroBlur} opacity={heroOpacity} />

      {/* This is the main scrollable content area */}
      <div className="relative z-10 pt-[60vh]">
        <FeaturedProductsSection comingSoonInfo={comingSoonInfo} />
        <SpecialCollectionSection comingSoonInfo={comingSoonInfo} />
        <DepartmentsSection comingSoonInfo={comingSoonInfo} />
        <ContactAndAboutSection />
      </div>

      <Footer />
    </>
  );
};

// --- Child Component for Featured Products ---
const FeaturedProductsSection = ({ comingSoonInfo }) => {
  const { data: response, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () =>
      fetchProducts({
        forHomePage: true,
        isActive: true,
        categoryType: "College Store",
      }),
  });

  const products =
    response?.data?.products
      .filter((p) => !p.category.department)
      .filter((p) => p.forHomePage)
      .sort((a, b) => {
        return a.sortPriority < b.sortPriority ? -1 : 1;
      }) || [];
  const windowWidth = useWindowWidth();
  let columns = windowWidth >= 1024 ? 5 : windowWidth >= 640 ? 3 : 2;
  const placeholdersNeeded =
    products.length % columns === 0 ? 0 : columns - (products.length % columns);
  const placeholders = Array.from({ length: placeholdersNeeded });

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Featured Products
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Discover our most popular college pieces.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <ProductCard key={i} />)
          ) : (
            <>
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
              {/* --- UPDATED: Pass dynamic data to placeholder cards --- */}
              {placeholders.map((_, i) => (
                <ProductCard
                  key={`placeholder-featured-${i}`}
                  comingSoonImage={comingSoonInfo?.image}
                  comingSoonText={comingSoonInfo?.text}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

// --- Child Component for Special Collection ---
const SpecialCollectionSection = ({ comingSoonInfo }) => {
  const { data: response, isLoading } = useQuery({
    queryKey: ["products", "special"],
    queryFn: () =>
      fetchProducts({
        forHomePage: true,
        isActive: true,
        categoryType: "Fashion",
      }),
  });

  const products = response?.data?.products.filter((p) => p.forHomePage) || [];
  const windowWidth = useWindowWidth();
  let columns = windowWidth >= 1024 ? 5 : windowWidth >= 640 ? 3 : 2;
  const placeholdersNeeded =
    products.length % columns === 0 ? 0 : columns - (products.length % columns);
  const placeholders = Array.from({ length: placeholdersNeeded });

  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Special Collection
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Explore our unique fashion and anime-inspired designs.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <ProductCard key={i} />)
          ) : (
            <>
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
              {/* --- UPDATED: Pass dynamic data to placeholder cards --- */}
              {placeholders.map((_, i) => (
                <ProductCard
                  key={`placeholder-special-${i}`}
                  comingSoonImage={comingSoonInfo?.image}
                  comingSoonText={comingSoonInfo?.text}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

// --- Child Component for Departments ---
const DepartmentsSection = ({ comingSoonInfo }) => {
  const scrollRef = useHorizontalScroll();

  const { data: deptsResponse, isLoading: deptsLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });
  const { data: prodsResponse, isLoading: prodsLoading } = useQuery({
    queryKey: ["products", "college"],
    queryFn: () => fetchProducts({ categoryType: "College Store" }),
  });

  const departments = deptsResponse?.data?.departments || [];
  const products = prodsResponse?.data?.products || [];

  const departmentsWithProducts = departments
    .map((dept) => {
      const firstProduct = products.find(
        (p) =>
          p.category.department === dept.name &&
          p.category.college === dept.college
      );
      return { department: dept, product: firstProduct || null };
    })
    .sort((a, b) => {
      if (a.product && !b.product) return -1;
      if (!a.product && b.product) return 1;
      return a.department.name.localeCompare(b.department.name);
    });

  return (
    <section className="py-20">
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
      <div className="w-full overflow-hidden">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto pb-4 space-x-6 scrollbar-hide px-4"
        >
          {deptsLoading || prodsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-56 h-72 bg-secondary rounded-lg flex-shrink-0 animate-pulse"
                ></div>
              ))
            : departmentsWithProducts.map(({ department, product }) => (
                <DepartmentProductCard
                  key={department._id}
                  department={department}
                  product={product}
                  // --- UPDATED: Pass the dynamic image to the department "coming soon" cards ---
                  comingSoonImage={comingSoonInfo?.image}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
