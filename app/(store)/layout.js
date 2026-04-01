"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import "../globals.css";

export default function StoreLayout({ children }) {
  const pathname = usePathname();
  
  // Hide navbar, footer, and WhatsApp button on login and register pages
  const isAuthPage = pathname === "/login" || pathname === "/register";
  
  return (
    <>
      {!isAuthPage && <Navbar />}
      <main>{children}</main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <WhatsAppButton />}
    </>
  );
}