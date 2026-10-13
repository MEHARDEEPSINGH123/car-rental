import React from "react";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#040711] border-t border-sapphire-700/20 text-titanium-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-2">
            <div className="font-display text-base font-semibold text-white tracking-wider">
              VELOCE MARINA ATELIER
            </div>
            <p className="text-xs text-titanium-400 font-sans leading-relaxed">
              Bespoke electric, supercar, and VIP MPV mobility in Singapore. Fully compliant with Land Transport Authority (LTA) regulations.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <div className="text-white font-semibold text-xs tracking-wider uppercase text-cyan-ice">Navigation</div>
            <div className="flex flex-col space-y-1.5 text-xs text-titanium-400">
              <Link href="/" className="hover:text-cyan-ice transition-colors">Home</Link>
              <Link href="/fleet" className="hover:text-cyan-ice transition-colors">Fleet Atelier</Link>
              <Link href="/hubs" className="hover:text-cyan-ice transition-colors">Pick-up Hubs</Link>
              <Link href="/cross-border" className="hover:text-cyan-ice transition-colors">Malaysia VEP Transit</Link>
              <Link href="/book" className="hover:text-cyan-ice transition-colors">Instant Booking</Link>
              <Link href="/profile" className="hover:text-cyan-ice transition-colors">Sovereign Account</Link>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="space-y-2">
            <div className="text-white font-semibold text-xs">Headquarters</div>
            <p className="text-xs text-titanium-400 leading-relaxed font-sans">
              Marina Bay Financial Centre Tower 3, Singapore 018982
            </p>
            <div className="text-xs text-titanium-300 pt-1">
              Valet Dispatch: <span className="text-white font-medium">+65 6542 8811</span>
            </div>
            <div className="text-[11px] text-titanium-500">
              All prices in SGD inclusive of 9% GST.
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-titanium-500">
          <div>
            &copy; {new Date().getFullYear()} Veloce Marina Atelier Singapore.
          </div>
          <div className="flex gap-3 text-titanium-400 mt-2 sm:mt-0">
            <span>ERP 2.0 Integrated</span>
            <span>&bull;</span>
            <span>SP Mobility Grid</span>
            <span>&bull;</span>
            <span>LTA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
