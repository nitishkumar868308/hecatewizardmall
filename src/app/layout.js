"use client";

import { Fira_Sans, Fira_Code } from "next/font/google";
import "./globals.css";
import DefaultPage from "@/components/Include/DefaultPage";
import Footer from "@/components/Include/Footer";
import { usePathname } from "next/navigation";
import { Provider } from 'react-redux';
import store from './redux/store';
import { Toaster } from 'react-hot-toast';
import "react-international-phone/style.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "@/utils/CartContext";

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});
const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";
  const isJyotish = pathname.startsWith("/jyotish");
  const isJyotishRegtister = pathname.startsWith("/register-jyotish");
  const hideLayout = pathname.startsWith("/admin") || pathname.startsWith("/payment-success") || isJyotish || isJyotishRegtister;


  return (
    <html lang="en">
      <body className={`${firaSans.variable} ${firaCode.variable} antialiased`}>
        <Provider store={store}>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <CartProvider>
              {!hideLayout && <DefaultPage />}
              {/* <main className="pt-[60px] md:pt-0 sm:pt-0"> */}
              <main className={`${isJyotish ? 'md:pt-0 pt-[40px]' : 'md:pt-0 pt-[160px]'}`}>
                {children}
              </main>
              {!hideLayout && <Footer />}
              <Toaster position="top-right" reverseOrder={false} />
            </CartProvider>
          </GoogleOAuthProvider>
        </Provider>
      </body>
    </html>
  );
}
