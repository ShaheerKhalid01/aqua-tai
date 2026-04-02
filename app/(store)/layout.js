"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useAuth } from "@/context/AuthContext";
import "../globals.css";

export default function StoreLayout({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const processedRef = useRef(false);
  
  // Handle Google OAuth success
  useEffect(() => {
    // Prevent infinite loop by checking if we've already processed
    if (processedRef.current) return;
    
    const authSuccess = searchParams.get('auth_success');
    const userParam = searchParams.get('user');
    const tokenParam = searchParams.get('token');
    
    if (authSuccess === 'true' && userParam && tokenParam) {
      processedRef.current = true; // Mark as processed
      
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        const token = decodeURIComponent(tokenParam);
        
        // Set localStorage
        localStorage.setItem('aquatai_token', token);
        localStorage.setItem('aquatai_user', JSON.stringify(userData));
        
        // Update AuthContext state using the new method
        auth.setClientUser(userData);
        
        // Clean URL parameters
        window.history.replaceState({}, '', pathname);
        
        console.log('Google OAuth user authenticated:', userData);
      } catch (error) {
        console.error('Failed to process Google OAuth response:', error);
      }
    }
  }, [searchParams.get('auth_success'), searchParams.get('user'), searchParams.get('token'), pathname, auth.setClientUser]);
  
  // Hide navbar, footer, and WhatsApp button on login, register, verify-email, and password reset pages
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname.startsWith("/verify-email") || pathname.startsWith("/reset-password") || pathname.startsWith("/forgot-password");
  
  return (
    <>
      {!isAuthPage && <Navbar />}
      <main>{children}</main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <WhatsAppButton />}
    </>
  );
}