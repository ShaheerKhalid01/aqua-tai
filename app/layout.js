import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { ProductsProvider } from "@/context/ProductsContext";

export const metadata = {
  title: "AquaTai - Pure Water Solutions",
  description: "Pakistan's leading water filtration store.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ProductsProvider>
            <OrdersProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </OrdersProvider>
          </ProductsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}