"use client";
import { createContext, useContext, useReducer, useEffect } from "react";
import { loginUser, registerUser, loginAdmin } from "@/lib/api";

const AuthContext = createContext(null);

function authReducer(state, action) {
  switch (action.type) {
    case "SET_CLIENT":   return { ...state, clientUser: action.payload };
    case "LOGOUT_CLIENT": return { ...state, clientUser: null };
    case "SET_ADMIN":    return { ...state, adminLoggedIn: true };
    case "LOGOUT_ADMIN": return { ...state, adminLoggedIn: false };
    default: return state;
  }
}

// Read localStorage synchronously as initial state
// This prevents the flash/redirect on page refresh
function getInitialState() {
  if (typeof window === "undefined")
    return { clientUser: null, adminLoggedIn: false };
  try {
    const adminToken = localStorage.getItem("aquatai_admin_token");
    const token = localStorage.getItem("aquatai_token");
    const user = localStorage.getItem("aquatai_user");
    return {
      adminLoggedIn: !!adminToken,
      clientUser: token && user ? JSON.parse(user) : null,
    };
  } catch {
    return { clientUser: null, adminLoggedIn: false };
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, undefined, getInitialState);

  useEffect(() => {
    localStorage.removeItem("aquatai_auth"); // clean old pre-backend key
    
    // Session validation disabled temporarily to prevent conflicts
    // TODO: Re-enable when Edge-compatible session storage is implemented
    /*
    const checkSessionValidity = async () => {
      const token = localStorage.getItem("aquatai_token");
      if (token) {
        try {
          const response = await fetch('/api/auth/validate-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.status === 401) {
            // Session was invalidated, log out user
            console.log('🚫 Session invalidated by server, logging out...');
            logout();
          }
        } catch (error) {
          console.error('Session validation check failed:', error);
        }
      }
    };
    
    // Check session validity on mount and route changes
    checkSessionValidity();
    
    // Set up interval to check session periodically
    const interval = setInterval(checkSessionValidity, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
    */
  }, []);

  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    localStorage.setItem("aquatai_token", data.token);
    localStorage.setItem("aquatai_user", JSON.stringify(data.user));
    dispatch({ type: "SET_CLIENT", payload: data.user });
    return data;
  };

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem("aquatai_token", data.token);
    localStorage.setItem("aquatai_user", JSON.stringify(data.user));
    dispatch({ type: "SET_CLIENT", payload: data.user });
    return data;
  };

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem("aquatai_token");
    localStorage.removeItem("aquatai_user");
    localStorage.removeItem("aquatai_admin_token");
    
    // Also clear any other auth-related keys that might exist
    localStorage.removeItem("aquatai_auth");
    
    // Dispatch logout action
    dispatch({ type: "LOGOUT_CLIENT" });
    
    // Force a page reload to ensure clean state
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const adminLogin = async (id, password) => {
    const data = await loginAdmin(id, password);
    localStorage.setItem("aquatai_admin_token", data.token);
    dispatch({ type: "SET_ADMIN" });
    return data;
  };

  const adminLogout = () => {
    localStorage.removeItem("aquatai_admin_token");
    dispatch({ type: "LOGOUT_ADMIN" });
  };

  // Google Sign-In (removed NextAuth dependency)
  const googleSignIn = async () => {
    try {
      // For now, just throw an error since Google auth is not configured
      throw new Error("Google sign-in is not available");
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw new Error("Failed to sign in with Google");
    }
  };

  const signOutAll = async () => {
    // Clear all local auth state
    logout();
    adminLogout();
  };

  // Method to manually set client user (for Google OAuth)
  const setClientUser = (userData) => {
    localStorage.setItem('aquatai_user', JSON.stringify(userData));
    dispatch({ type: 'SET_CLIENT', payload: userData });
  };

  return (
    <AuthContext.Provider value={{ 
      state, 
      register, 
      login, 
      logout, 
      adminLogin, 
      adminLogout, 
      googleSignIn,
      signOutAll,
      setClientUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);