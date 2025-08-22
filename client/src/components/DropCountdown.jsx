import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const ribbonStyles = `
@keyframes scrollLeft {
    0%{
        transform: translateX(100%);
    }
    100%{
        transform: translateX(-100%); 
    }
}
@keyframes scrollLeft2 {
    0%{
        transform: translateX(100%);
    }
    100%{
        transform: translateX(-100%); 
    }
}
.ribbon-animation {
    animation: scrollLeft 20s linear infinite;
    display: flex; 
    width: fit-content; /* Ensure the container is as wide as its content */
}
.ribbon-animation2 {
    animation: scrollLeft2 20s linear infinite;
    display: flex; 
    width: fit-content; /* Ensure the container is as wide as its content */
}
`;

const DropCountdown = ({ blurAmount = 0, opacity = 1 }) => {
  const [endDate, setEndDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropActive, setIsDropActive] = useState(true);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = ribbonStyles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const fetchDropDate = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/drops/drop-date`);
        const date = new Date(response.data.endDate);
        setEndDate(date);
      } catch (error) {
        if (error.response?.status === 404) {
          setIsDropActive(false);
        }
        console.error("Error fetching drop date:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDropDate();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (!endDate) return;

    const intervalId = setInterval(() => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(intervalId);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsDropActive(false);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endDate]);

  if (loading || !isDropActive || !timeLeft) {
    return null;
  }

  const ribbonText =
    "Products are available for purchase! Hurry, before they are gone!";
  // Repeat the text with a separator for the seamless loop
  const repeatedText = `${ribbonText} \u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0 `;

  return (
    <div
      className="fixed top-[4rem] left-0 w-full h-screen z-40 pointer-events-none "
      style={{ filter: `blur(${blurAmount}px)` }}
      opacity={opacity}
    >
      {/* Clock on top left of hero section */}
      <div className="absolute top-12 left-6 bg-card/70 backdrop-blur-sm p-4 rounded-lg flex items-center space-x-3 pointer-events-auto ">
        <Clock className="h-6 w-6 text-accent animate-pulse" />
        <div className="text-foreground">
          <p className="text-xs font-semibold uppercase">Drop Ends In</p>
          <div className="font-bold text-lg md:text-xl font-mono">
            <span>{String(timeLeft.days).padStart(2, "0")}</span>d :{" "}
            <span>{String(timeLeft.hours).padStart(2, "0")}</span>h :{" "}
            <span>{String(timeLeft.minutes).padStart(2, "0")}</span>m :{" "}
            <span>{String(timeLeft.seconds).padStart(2, "0")}</span>s
          </div>
        </div>
      </div>
      {/* Ribbon-like structure */}
      <div
        className="absolute top-0 w-full h-8 overflow-hidden mt-2 flex items-center justify-center pointer-events-auto"
        style={{ backgroundColor: "#e89846" }}
      >
        <div
          className="ribbon-animation whitespace-nowrap px-2  text-black text-lg font-bold"
          // style={{ backgroundColor: "#ffffff" }}
        >
          {repeatedText}
        </div>
        <div
          className="ribbon-animation whitespace-nowrap px-2  text-black text-lg font-bold"
          // style={{ backgroundColor: "#000000" }}
        >
          {repeatedText}
        </div>
        <div
          className="ribbon-animation whitespace-nowrap px-2  text-black text-lg font-bold"
          // style={{ backgroundColor: "#2f3241" }}
        >
          {repeatedText}
        </div>
        <div
          className="ribbon-animation whitespace-nowrap px-2  text-black text-lg font-bold"
          // style={{ backgroundColor: "#ffd7b3" }}
        >
          {repeatedText}
        </div>
        <div
          className="ribbon-animation whitespace-nowrap px-2  text-black text-lg font-bold"
          // style={{ backgroundColor: "#ffffff" }}
        >
          {repeatedText}
        </div>
        <div
          className="ribbon-animation whitespace-nowrap px-2  text-black text-lg font-bold"
          // style={{ backgroundColor: "#000000" }}
        >
          {repeatedText}
        </div>
        <div
          className="ribbon-animation whitespace-nowrap px-2  text-black text-lg font-bold"
          // style={{ backgroundColor: "#2f3241" }}
        >
          {repeatedText}
        </div>
        <div
          className="ribbon-animation whitespace-nowrap px-2  text-black text-lg font-bold"
          // style={{ backgroundColor: "#ffd7b3" }}
        >
          {repeatedText}
        </div>
      </div>
    </div>
  );
};

export default DropCountdown;
