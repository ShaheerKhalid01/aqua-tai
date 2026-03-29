import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AuthWrapper from "@/components/AuthWrapper";
import "../globals.css";

export default function StoreLayout({ children }) {
  return (
    <AuthWrapper>
      <>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </>
    </AuthWrapper>
  );
}