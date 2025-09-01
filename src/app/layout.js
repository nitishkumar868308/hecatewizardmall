"use client";

import { Fira_Sans, Fira_Code } from "next/font/google";
import "./globals.css";
import DefaultPage from "@/components/Include/DefaultPage";
import Footer from "@/components/Include/Footer";
import { usePathname } from "next/navigation";
import { Provider } from 'react-redux';
import store from './redux/store';
import { Toaster } from 'react-hot-toast';

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

  return (
    <html lang="en">
      <body className={`${firaSans.variable} ${firaCode.variable} antialiased`}>
        <Provider store={store}>
          {!isAdmin && <DefaultPage />}
          <main className="pt-[60px] md:pt-0">
            {children}
          </main>
          {!isAdmin && <Footer />}
          <Toaster position="top-right" reverseOrder={false} />
        </Provider>
      </body>
    </html>
  );
}
