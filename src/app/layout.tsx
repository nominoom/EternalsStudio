import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "../context/CartContext";
import { AdminProvider } from "../context/AdminContext";
import CartDrawer from "../components/CartDrawer";
import AdminSidebar from "../components/AdminSidebar";
import BubbleBackground from "../components/BubbleBackground";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eternals Studio",
  description: "Professional graphic design, web development, and creative solutions for your business needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50`}>
          <AdminProvider>
            <CartProvider>
              <BubbleBackground />
              {children}
              <CartDrawer />
              <AdminSidebar />
            </CartProvider>
          </AdminProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
