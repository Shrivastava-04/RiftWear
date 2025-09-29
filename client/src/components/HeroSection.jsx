import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
// import FinalBg from "../assets/FinalBG.mp4";
import React from "react";
import DropCountdown from "./DropCountdown";

const HeroSection = ({ blurAmount = 0, opacity = 1 }) => {
  return (
    <section
      className="fixed inset-0 z-0 h-screen w-screen flex items-center justify-center overflow-hidden"
      style={{ opacity: opacity }}
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Hero Image"
          className="w-full h-full object-cover transition-all duration-300"
          style={{ filter: `blur(${blurAmount}px)` }}
        />
        {/* <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover transition-all duration-300"
          style={{ filter: `blur(${blurAmount}px)` }}
        >
          <source
            src="https://res.cloudinary.com/dfvxh7p8p/video/upload/v1756673332/FinalBG_evzsir.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video> */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
      </div>

      {/* Content */}
      {/* MODIFIED: Added pt-24 (padding-top) to push the content down below the countdown elements */}
      <div
        className="relative z-10 container mx-auto px-4 text-center pt-32"
        style={{ filter: `blur(${blurAmount}px)` }}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-1 md:space-y-4">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-black gradient-text animate-fade-in-up">
              FOR THE HALLWAYS
            </h1>
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-black gradient-text animate-fade-in-up-delay">
              TO THE HANGOUTS
            </h1>
          </div>

          <p className="text-xs md:text-lg text-foreground/80 max-w-3xl mx-auto animate-fade-in-up-delay">
            Every college has its stories, its landmarks, its legends. <br />{" "}
            This isn't just merch; it's a piece of your story. <br /> Made for
            the crew you call family.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
