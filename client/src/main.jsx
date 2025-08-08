// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // Assuming your main app component is App.jsx
import "./index.css"; // Make sure this path is correct for your main CSS file
import { AuthProvider } from "./context/AuthCotext.jsx"; // Import the AuthProvider from your context file
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";

axios.defaults.withCredentials = true; // Enable sending cookies with requests
const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    {/* Your main app components go here */}
    <React.StrictMode>
      <AuthProvider>
        {" "}
        {/* Wrap your App with AuthProvider to provide auth context */}
        <App />
      </AuthProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
