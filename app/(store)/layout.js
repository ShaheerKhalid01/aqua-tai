"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import "../globals.css";

export default function StoreLayout({ children }) {
  const pathname = usePathname();
  
  // Hide navbar, footer, and WhatsApp button on login page
  const isLoginPage = pathname === "/login";
  
  return (
    <>
      {!isLoginPage && <Navbar />}
      <main>{children}</main>
      {!isLoginPage && <Footer />}
      {!isLoginPage && <WhatsAppButton />}
    </>
  );
}