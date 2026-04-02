"use client";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import "../globals.css";

// Separate component for OAuth handling
function OAuthHandler() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const auth = useAuth();
  const processedRef = useRef(false);
  
  useEffect(() => {
    if (processedRef.current) return;
    
    const authSuccess = searchParams.get('auth_success');
    const userParam = searchParams.get('user');
    const tokenParam = searchParams.get('token');
    
    if (authSuccess === 'true' && userParam && tokenParam) {
      processedRef.current = true;
      
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        const token = decodeURIComponent(tokenParam);
        
        localStorage.setItem('aquatai_token', token);
        localStorage.setItem('aquatai_user', JSON.stringify(userData));
        auth.setClientUser(userData);
        window.history.replaceState({}, '', pathname);
        
        console.log('Google OAuth user authenticated:', userData);
      } catch (error) {
        console.error('Failed to process Google OAuth response:', error);
      }
    }
  }, [searchParams, pathname, auth]);
  
  return null;
}

export default function StoreLayout({ children }) {
  const pathname = usePathname();
  
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname.startsWith("/verify-email") || pathname.startsWith("/reset-password") || pathname.startsWith("/forgot-password");
  
  return (
    <>
      <Suspense fallback={null}>
        <OAuthHandler />
      </Suspense>
      {!isAuthPage && <Navbar />}
      <main>{children}</main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <WhatsAppButton />}
    </>
  );
}