"use client";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function AuthWrapper({ children }) {
  const [sessionError, setSessionError] = useState(null);

  useEffect(() => {
    // Handle any session errors
    if (sessionError) {
      console.error("Session error:", sessionError);
    }
  }, [sessionError]);

  return (
    <SessionProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}
