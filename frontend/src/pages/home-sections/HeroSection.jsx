import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPublicSiteSettings } from "@/api/apiService";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = ({ blurAmount = 0, opacity = 1 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch the site settings using React Query
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: getPublicSiteSettings,
  });

  const slides = settingsData?.data?.settings?.heroSection || [];

  // This effect handles the automatic slide transition
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 2500); // Change slide every 5 seconds
      return () => clearTimeout(timer);
    }
  }, [currentIndex, slides.length]);

  // Fallback for when data is loading or if no slides are configured
  if (isLoading || slides.length === 0) {
    return (
      <section className="fixed inset-0 z-0 h-screen w-screen flex items-center justify-center">
        <div className="text-center">
          {isLoading ? "Loading..." : "Welcome to Rift"}
        </div>
      </section>
    );
  }

  return (
    <section
      className="fixed inset-0 z-0 h-screen w-screen flex items-center justify-center overflow-hidden"
      style={{ opacity: opacity }}
    >
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title || "Hero background"}
              className="w-full h-full object-cover"
              style={{ filter: `blur(${blurAmount}px)` }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 container mx-auto px-4 text-center pt-32"
        style={{ filter: `blur(${blurAmount}px)` }}
      >
        {/* Render the content of the currently active slide */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            {slides[currentIndex].title && (
              <h1 className="text-2xl md:text-4xl lg:text-6xl font-black gradient-text animate-fade-in-up">
                {slides[currentIndex].title}
              </h1>
            )}
            {slides[currentIndex].subtitle && (
              <h2 className="text-xs md:text-lg text-foreground/80 max-w-3xl mx-auto animate-fade-in-up-delay">
                {slides[currentIndex].subtitle}
              </h2>
            )}
          </div>
          {/* Conditionally render the button only if a link is provided */}
          {slides[currentIndex].ctaLink && (
            <div className="animate-fade-in-up-delay-2">
              <Button size="lg" variant="cta" asChild>
                <Link to={slides[currentIndex].ctaLink}>
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
