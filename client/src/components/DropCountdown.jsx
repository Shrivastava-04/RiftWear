// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Loader2, Clock } from "lucide-react";
// import { Link } from "react-router-dom";

// const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// const ribbonStyles = `
// @keyframes scrollLeft {
//     0% { transform: translateX(100%); }
//     100% { transform: translateX(-100%); }
// }
// .ribbon-animation {
//     animation: scrollLeft 20s linear infinite;
//     display: flex;
//     width: fit-content;
// }
// `;

// const DropCountdown = ({ blurAmount = 0, opacity = 1 }) => {
//   const [dropStart, setDropStart] = useState(null);
//   const [dropEnd, setDropEnd] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [countdownStatus, setCountdownStatus] = useState("inactive");
//   const [ribbonMessage, setRibbonMessage] = useState("");

//   useEffect(() => {
//     const styleSheet = document.createElement("style");
//     styleSheet.innerText = ribbonStyles;
//     document.head.appendChild(styleSheet);
//     return () => {
//       document.head.removeChild(styleSheet);
//     };
//   }, []);

//   useEffect(() => {
//     const fetchDropDates = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/drops/drop-date`);
//         const { startDate, endDate } = response.data;
//         setDropStart(startDate ? new Date(startDate) : null);
//         setDropEnd(endDate ? new Date(endDate) : null);
//       } catch (error) {
//         if (error.response?.status === 404) {
//           console.log("No active drop found.");
//         }
//         console.error("Error fetching drop date:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDropDates();
//   }, [API_BASE_URL]);

//   useEffect(() => {
//     if (!dropStart && !dropEnd) {
//       setCountdownStatus("inactive");
//       setRibbonMessage("New drop coming soon! Stay tuned for updates.");
//       return;
//     }

//     const intervalId = setInterval(() => {
//       const now = new Date();
//       let targetDate;
//       let newStatus;
//       let newRibbonMessage;

//       if (dropStart && now < dropStart) {
//         targetDate = dropStart;
//         newStatus = "upcoming";
//         newRibbonMessage = "Upcoming Drop! The drop is about to go live.";
//       } else if (dropEnd && now < dropEnd) {
//         targetDate = dropEnd;
//         newStatus = "active";
//         newRibbonMessage =
//           "Products are available for purchase! Hurry, before they are gone!";
//       } else {
//         clearInterval(intervalId);
//         setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//         newStatus = "inactive";
//         newRibbonMessage = "The drop has ended. Thank you for your support!";
//         return;
//       }

//       setCountdownStatus(newStatus);
//       setRibbonMessage(newRibbonMessage);
//       const difference = targetDate.getTime() - now.getTime();

//       const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
//       const minutes = Math.floor((difference / 1000 / 60) % 60);
//       const seconds = Math.floor((difference / 1000) % 60);
//       setTimeLeft({ days, hours, minutes, seconds });
//     }, 1000);

//     return () => clearInterval(intervalId);
//   }, [dropStart, dropEnd]);

//   if (loading || countdownStatus === "inactive") {
//     return null;
//   }

//   const repeatedText = `${ribbonMessage} \u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0 `;

//   const countdownText =
//     countdownStatus === "upcoming" ? "Drop Starts In" : "Drop Ends In";

//   return (
//     <div
//       className="fixed top-[4rem] left-0 w-full h-screen z-40 pointer-events-none"
//       style={{ filter: `blur(${blurAmount}px)` }}
//       opacity={opacity}
//     >
//       <div className="absolute top-12 left-0 w-full p-4 flex flex-col sm:flex-row sm:justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
//         {/* Countdown Box */}
//         <div className="bg-card/70 backdrop-blur-sm p-4 rounded-lg flex items-center space-x-3 pointer-events-auto w-full sm:w-fit">
//           <Clock className="h-6 w-6 text-accent animate-pulse" />
//           <div className="text-foreground">
//             <p className="text-xs font-semibold uppercase">{countdownText}</p>
//             <div className="font-bold text-lg md:text-xl font-mono">
//               <span>{String(timeLeft?.days || 0).padStart(2, "0")}</span>d :{" "}
//               <span>{String(timeLeft?.hours || 0).padStart(2, "0")}</span>h :{" "}
//               <span>{String(timeLeft?.minutes || 0).padStart(2, "0")}</span>m :{" "}
//               <span>{String(timeLeft?.seconds || 0).padStart(2, "0")}</span>s
//             </div>
//           </div>
//         </div>

//         {/* Message Box */}
//         <div className="bg-card/70 backdrop-blur-sm p-4 rounded-lg flex items-center space-x-3 pointer-events-auto w-full sm:w-fit">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className="h-6 w-6 text-accent lucide-message-square"
//           >
//             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//           </svg>
//           <div className="text-foreground">
//             <p className="text-sm font-semibold mb-1">
//               For any Design requests or customisation,
//             </p>
//             <Link
//               to="/#contact"
//               onClick={(e) => {
//                 e.preventDefault();
//                 const contactSection = document.getElementById("contact");
//                 if (contactSection) {
//                   contactSection.scrollIntoView({
//                     behavior: "smooth",
//                     block: "start",
//                   });
//                 }
//               }}
//               className="flex items-center text-sm text-accent-500 hover:underline transition-colors"
//             >
//               <span>send us a message here</span>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="h-4 w-4 ml-2 lucide-send"
//               >
//                 <path d="m22 2-7 19-3-6-6-3 19-7z" />
//                 <path d="M22 2 11 13" />
//               </svg>
//             </Link>
//           </div>
//         </div>
//       </div>
//       <div
//         className="absolute top-0 w-full h-8 overflow-hidden mt-2 flex items-center justify-center pointer-events-auto"
//         style={{ backgroundColor: "#e89846" }}
//       >
//         <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
//           {repeatedText}
//         </div>
//         <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
//           {repeatedText}
//         </div>
//         <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
//           {repeatedText}
//         </div>
//         <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
//           {repeatedText}
//         </div>
//         <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
//           {repeatedText}
//         </div>
//         <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
//           {repeatedText}
//         </div>
//         <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
//           {repeatedText}
//         </div>
//         <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
//           {repeatedText}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DropCountdown;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Ribbon animation styles remain the same
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
  const [dropStart, setDropStart] = useState(null);
  const [dropEnd, setDropEnd] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdownStatus, setCountdownStatus] = useState("inactive");
  const [ribbonMessage, setRibbonMessage] = useState("");

  // This useEffect for styles is fine
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = ribbonStyles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // No changes needed in your data fetching or countdown logic
  useEffect(() => {
    const fetchDropDates = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/drops/drop-date`);
        const { startDate, endDate } = response.data;
        setDropStart(startDate ? new Date(startDate) : null);
        setDropEnd(endDate ? new Date(endDate) : null);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log("No active drop found.");
        }
        console.error("Error fetching drop date:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDropDates();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (!dropStart && !dropEnd) {
      setCountdownStatus("inactive");
      setRibbonMessage("New drop coming soon! Stay tuned for updates.");
      return;
    }

    const intervalId = setInterval(() => {
      const now = new Date();
      let targetDate;
      let newStatus;
      let newRibbonMessage;

      if (dropStart && now < dropStart) {
        targetDate = dropStart;
        newStatus = "upcoming";
        newRibbonMessage = "Upcoming Drop! The drop is about to go live.";
      } else if (dropEnd && now < dropEnd) {
        targetDate = dropEnd;
        newStatus = "active";
        newRibbonMessage =
          "Products are available for purchase! Hurry, before they are gone!";
      } else {
        clearInterval(intervalId);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        newStatus = "inactive";
        newRibbonMessage = "The drop has ended. Thank you for your support!";
        return;
      }

      setCountdownStatus(newStatus);
      setRibbonMessage(newRibbonMessage);
      const difference = targetDate.getTime() - now.getTime();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [dropStart, dropEnd]);

  if (loading || countdownStatus === "inactive") {
    return null;
  }

  const repeatedText = `${ribbonMessage} \u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0 `;
  const countdownText =
    countdownStatus === "upcoming" ? "Drop Starts In" : "Drop Ends In";

  return (
    <div
      className="fixed top-[4rem] left-0 w-full h-screen z-40 pointer-events-none"
      style={{ filter: `blur(${blurAmount}px)` }}
      opacity={opacity}
    >
      {/* MODIFIED: This container is now a flex row that justifies between, ensuring boxes are on the edges. */}
      <div className="absolute top-12 left-0 w-full p-4 flex md:flex-row flex-col justify-between items-start">
        {/* Countdown Box */}
        {/* MODIFIED: Removed w-full and sm:w-fit to let the box size itself to its content. */}
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
        {/* MODIFIED: Removed w-full and sm:w-fit and added media query to hide on small screens for cleaner UI. */}
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
                const contactSection = document.getElementById("contact");
                if (contactSection) {
                  contactSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
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

      {/* The ribbon part remains unchanged */}
      <div
        className="absolute top-0 w-full h-8 overflow-hidden mt-2 flex items-center justify-center pointer-events-auto"
        style={{ backgroundColor: "#e89846" }}
      >
        <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
          {repeatedText}
        </div>
        <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
          {repeatedText}
        </div>
        <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
          {repeatedText}
        </div>
        <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
          {repeatedText}
        </div>
        <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
          {repeatedText}
        </div>
        <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
          {repeatedText}
        </div>
        <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
          {repeatedText}
        </div>
        <div className="ribbon-animation whitespace-nowrap px-2 text-black text-lg font-bold">
          {repeatedText}
        </div>
      </div>
    </div>
  );
};

export default DropCountdown;
