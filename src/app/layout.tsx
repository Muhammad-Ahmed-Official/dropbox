import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";
import { HeroUIProvider } from "@heroui/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserProvider } from "@/contextApi/UserProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Droply",
  description: "Secure cloud storage for your images, powered by ImageKit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <ClerkProvider>
      <html lang="en" className="dark h-full">
        <body
          className={`${geistSans.variable} ${geistMono.variable} h-full antialiased text-foreground bg-background`}
        >
            <Providers>
              <UserProvider>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-1 flex flex-col">{children}</main>
                  <Footer />
                </div>
              </UserProvider>
            </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
