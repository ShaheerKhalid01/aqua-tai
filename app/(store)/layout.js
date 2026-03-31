"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import "../globals.css";

export default function StoreLayout({ children }) {
  const pathname = usePathname();
  
  // Pages that should not show navbar
  const hideNavbarPages = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];
  const shouldHideNavbar = hideNavbarPages.some(page => pathname.startsWith(page));

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <main>{children}</main>
      {!shouldHideNavbar && <Footer />}
      {!shouldHideNavbar && <WhatsAppButton />}
    </>
  );
}