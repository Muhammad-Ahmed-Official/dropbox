import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientLayout from "./client-layout";
import { HeroUIProvider } from "@heroui/react";


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
    <html lang="en" className={`dark h-full`}>
        <body className={`h-full antialiased text-foreground bg-background`}>
        <HeroUIProvider>
        <ClientLayout>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </div>
        </ClientLayout>
        </HeroUIProvider>
        </body>
      </html>
  );
}
