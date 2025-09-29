import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { getActiveDropDetails } from "@/api/apiService";

const ribbonStyles = `
@keyframes scrollLeft {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
}
.ribbon-animation {
    animation: scrollLeft 20s linear infinite;
    display: flex;
    width: fit-content;
}
`;

const DropCountdown = ({ blurAmount = 0, opacity = 1 }) => {
  const queryClient = useQueryClient();
  const [timeLeft, setTimeLeft] = useState(null);
  const [countdownStatus, setCountdownStatus] = useState("inactive");

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = ribbonStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const { data: response, isLoading } = useQuery({
    queryKey: ["activeDrop"],
    queryFn: getActiveDropDetails,
  });

  const drop = response?.data?.activeDrop;

  useEffect(() => {
    if (!drop) {
      setCountdownStatus("inactive");
      return;
    }

    const intervalId = setInterval(() => {
      const now = new Date();
      const startDate = new Date(drop.startDate);
      const endDate = new Date(drop.endDate);
      let targetDate;
      let newStatus;

      if (now < startDate) {
        targetDate = startDate;
        newStatus = "upcoming";
      } else if (now >= startDate && now < endDate) {
        targetDate = endDate;
        newStatus = "active";
      } else {
        clearInterval(intervalId);
        setTimeLeft(null);
        setCountdownStatus("inactive");
        queryClient.invalidateQueries({ queryKey: ["activeDrop"] });
        return;
      }

      setCountdownStatus(newStatus);
      const difference = targetDate.getTime() - now.getTime();

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [drop, queryClient]);

  if (isLoading || countdownStatus === "inactive" || !timeLeft) {
    return null;
  }

  const countdownText =
    countdownStatus === "upcoming" ? "Drop Starts In" : "Drop Ends In";
  const ribbonMessage =
    countdownStatus === "upcoming"
      ? "Upcoming Drop! Get ready for the launch."
      : `${drop.name || "Live Drop"}! Products are available now.`;
  const repeatedText = `${ribbonMessage} \u00a0\u00a0•\u00a0\u00a0 `;

  return (
    <div
      className="fixed top-[4rem] left-0 w-full h-screen z-40 pointer-events-none"
      style={{ filter: `blur(${blurAmount}px)`, opacity: opacity }}
    >
      {/* Ribbon - Replicated multiple times to ensure seamless scrolling */}
      <div
        className="absolute top-0 w-full h-8 overflow-hidden mt-2 flex items-center justify-center pointer-events-auto"
        style={{ backgroundColor: "#e89846" }}
      >
        <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
          {repeatedText.repeat(2)}
        </div>
        <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
          {repeatedText.repeat(2)}
        </div>
        <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
          {repeatedText.repeat(2)}
        </div>
        <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
          {repeatedText.repeat(2)}
        </div>
      </div>

      {/* Countdown and Message Boxes with Original Layout */}
      <div className="absolute top-12 left-0 w-full p-4 flex flex-col sm:flex-row sm:justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Countdown Box */}
        <div className="bg-card/70 backdrop-blur-sm p-4 rounded-lg flex items-center space-x-3 pointer-events-auto w-auto">
          <Clock className="h-6 w-6 text-accent animate-pulse" />
          <div className="text-foreground">
            <p className="text-xs font-semibold uppercase">{countdownText}</p>
            <div className="font-bold text-lg md:text-xl font-mono">
              <span>{String(timeLeft?.days || 0).padStart(2, "0")}</span>d :{" "}
              <span>{String(timeLeft?.hours || 0).padStart(2, "0")}</span>h :{" "}
              <span>{String(timeLeft?.minutes || 0).padStart(2, "0")}</span>m :{" "}
              <span>{String(timeLeft?.seconds || 0).padStart(2, "0")}</span>s
            </div>
          </div>
        </div>

        {/* Message Box */}
        <div className="flex bg-card/70 backdrop-blur-sm py-4 px-2 mt-2 rounded-lg items-center space-x-3 pointer-events-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-accent lucide-message-square"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <div className="text-foreground">
            <p className="text-sm font-semibold mb-1">
              For any Design requests or customisation,
            </p>
            <Link
              to="/#contact"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="flex items-center text-sm text-accent-500 hover:underline transition-colors"
            >
              <span>send us a message here</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 ml-2 lucide-send"
              >
                <path d="m22 2-7 19-3-6-6-3 19-7z" />
                <path d="M22 2 11 13" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropCountdown;
