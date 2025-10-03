import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-body"
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-heading"
});

export const metadata: Metadata = {
  title: "Hub4Estate - Dashboard",
  description: "Your complete real estate workspace",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="royal-theme">
      <body className={`${inter.variable} ${playfair.variable} royal-theme`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}