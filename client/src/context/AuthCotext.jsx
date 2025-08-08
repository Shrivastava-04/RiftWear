import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingInitialUser, setLoadingInitialUser] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Configure Axios to send cookies with requests
  axios.defaults.withCredentials = true; // Enable sending cookies with requests

  const checkUserSession = useCallback(async () => {
    try {
      setLoadingInitialUser(true);
      const response = await axios.get(`${API_BASE_URL}/user/profile`);
      if (response.status === 200) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      if (
        (error.response && error.response.status === 401) ||
        error.response.status === 403
      ) {
        setUser(null);
      } else {
        console.log("Error checking user session:", error);
      }
    } finally {
      setLoadingInitialUser(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  const login = async (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/logout`);
      if (response.status === 200) {
        setUser(null);
      }
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  const contextValue = {
    user,
    isUserAuthenticated: !!user,
    login,
    logout,
    loading: loadingInitialUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/* Render children only when the initial user loading is complete */}
      {loadingInitialUser ? <div>Loading application...</div> : children}
    </AuthContext.Provider>
  );
};
