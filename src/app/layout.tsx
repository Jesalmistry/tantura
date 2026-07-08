import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tantura | Premium Luxury Fashion & Custom Design House",
  description: "Explore world-class luxury apparel, premium streetwear, and bespoke garments. Customize your own pieces online and collaborate in real-time with professional fashion designers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-foreground selection:bg-gold selection:text-luxury-black transition-colors duration-500">
        <AppProvider>
          <div className="flex flex-col min-h-screen w-full overflow-x-hidden relative">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}

