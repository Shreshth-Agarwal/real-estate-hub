import type { Metadata } from "next";
import "@repo/ui/globals.css";

export const metadata: Metadata = {
  title: "Hub4Estate Business - Manage Your Listings & Leads",
  description: "Business portal for providers to manage catalogs, respond to quotes, and grow your real estate business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="royal-theme antialiased">
        {children}
      </body>
    </html>
  );
}