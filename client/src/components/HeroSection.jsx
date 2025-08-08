import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import React from "react";

const HeroSection = ({ blurAmount = 0, opacity = 1 }) => {
  // Add opacity prop
  return (
    <section
      className="fixed inset-0 z-0 h-screen w-screen flex items-center justify-center overflow-hidden"
      style={{ opacity: opacity }} // Apply dynamic opacity to the whole section
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Arrasté Hero"
          className="w-full h-full object-cover transition-all duration-300" // Smoother transition
          style={{ filter: `blur(${blurAmount}px)` }} // Apply dynamic blur
        />
        {/* The background gradient will also fade with the section opacity */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
      </div>

      {/* Content - place above the blur layer */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black gradient-text animate-fade-in-up">
              UNLEASH
            </h1>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black gradient-text animate-fade-in-up-delay">
              YOUR STYLE
            </h1>
          </div>

          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto animate-fade-in-up-delay">
            Discover premium streetwear that defines your individuality. Express
            yourself with our exclusive collection designed for the bold and
            fearless.
          </p>

          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up-delay">
            <Button variant="hero" size="xl" className="animate-glow">
              SHOP NOW
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="xl">
              VIEW COLLECTION
            </Button>
          </div> */}

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-float" />
          <div
            className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-accent/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-pulse" />
        </div>
      </div> */}
    </section>
  );
};

export default HeroSection;
