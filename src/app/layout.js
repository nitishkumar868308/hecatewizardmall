"use client";

import { Fira_Sans, Fira_Code } from "next/font/google";
import "./globals.css";
import DefaultPage from "@/components/Include/DefaultPage";
import Footer from "@/components/Include/Footer";
import { usePathname } from "next/navigation";

// Use Fira Sans for general text (like Function Pro regular)
const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Use Fira Code for monospace / technical text (like Function Pro mono)
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
      <body
        className={`${firaSans.variable} ${firaCode.variable} antialiased`}
      >
        {!isAdmin && <DefaultPage />}
        {children}
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}
