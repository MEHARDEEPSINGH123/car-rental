import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import CockpitHUD from "@/components/CockpitHUD";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Veloce Marina Atelier Singapore | Bespoke Supercar & Electric Mobility",
  description:
    "Ultra-luxury, high-performance, and sustainable car rental platform in Singapore. Ferrari 296 GTB, Porsche Taycan Cross Turismo, Mercedes EQS, Alphard VIP MPV with 24/7 Changi Aviation Valet and Malaysia Causeway VEP clearance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#060A12] text-titanium-100 flex flex-col selection:bg-cyan-ice selection:text-sapphire-950">
        <AppProvider>
          <CockpitHUD />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
