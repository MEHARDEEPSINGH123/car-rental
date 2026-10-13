"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useApp } from "@/lib/store";

export default function CockpitHUD() {
  const pathname = usePathname();
  const { user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sgtTime, setSgtTime] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSgtTime(
        new Intl.DateTimeFormat("en-SG", {
          timeZone: "Asia/Singapore",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(now)
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: "/", label: "Atelier" },
    { href: "/fleet", label: "Fleet" },
    { href: "/hubs", label: "Hubs" },
    { href: "/cross-border", label: "Causeway VEP" },
    { href: "/book", label: "Reserve" },
    { href: "/profile", label: "Garage" },
    { href: "/operations", label: "Operations" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-colors duration-300 ${
        scrolled
          ? "bg-[#060A12]/85 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          : "bg-gradient-to-b from-[#060A12]/80 via-[#060A12]/40 to-transparent"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Mark */}
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="font-editorial text-lg tracking-[0.12em] text-white font-medium group-hover:text-cyan-ice transition-colors">
              VELOCE MARINA
            </span>
            <span className="hidden sm:inline-block text-[9px] font-mono tracking-[0.25em] text-titanium-400 border-l border-white/15 pl-3 uppercase">
              SINGAPORE
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-1 text-[11px] font-mono tracking-[0.15em] uppercase transition-colors outline-none focus:outline-none focus:ring-0 focus-visible:outline-none select-none group"
                >
                  <span
                    className={
                      isActive
                        ? "text-cyan-ice font-semibold tracking-wider"
                        : "text-titanium-400 group-hover:text-white"
                    }
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Status Pill & CTA */}
          <div className="hidden sm:flex items-center space-x-5">
            {/* Subtle Operational Badge */}
            <div className="hidden lg:flex items-center space-x-2 text-[10px] font-mono text-titanium-400 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-ice animate-pulse shadow-[0_0_6px_rgba(0,229,255,0.8)]"></span>
              <span>ERP 2.0 SGT {sgtTime || "15:26"}</span>
            </div>

            <Link
              href="/book"
              className="px-4 py-2 text-xs font-mono tracking-wider font-semibold uppercase bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 rounded shadow-[0_0_15px_rgba(0,229,255,0.25)] hover:shadow-[0_0_25px_rgba(0,229,255,0.45)] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Dispatch Fleet
            </Link>

            <Link
              href="/profile"
              className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 hover:border-cyan-ice transition-colors shrink-0"
              title="Personal Garage & Member Portal"
            >
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            <Link
              href="/book"
              className="px-3 py-1.5 text-xs font-mono font-medium rounded bg-cyan-ice text-sapphire-950 shadow-[0_0_12px_rgba(0,229,255,0.3)]"
            >
              Dispatch
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-titanium-300 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-[#060A12]/98 px-5 py-6 space-y-4 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-titanium-400 pb-2 border-b border-white/[0.06]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-ice shadow-[0_0_6px_rgba(0,229,255,0.8)]"></span>
                ERP 2.0 CONNECTED
              </span>
              <span>SGT {sgtTime} &bull; GST 9% INCL</span>
            </div>

            <div className="space-y-1">
              {navLinks.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-2.5 text-xs font-mono uppercase tracking-wider transition-colors outline-none focus:outline-none ${
                      isActive ? "text-cyan-ice font-semibold" : "text-titanium-300 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-titanium-500" />
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 text-xs font-mono text-titanium-200"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20">
                  <Image src={user.avatarUrl} alt={user.name} width={28} height={28} className="object-cover" />
                </div>
                <span>{user.name}</span>
              </Link>
              <span className="text-[10px] font-mono text-cyan-ice">Sovereign Card</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
