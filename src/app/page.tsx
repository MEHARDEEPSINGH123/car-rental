"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Shield,
  Zap,
  MapPin,
  Clock,
  Compass,
  Star,
} from "lucide-react";
import {
  getFleet,
  getHubs,
  getReviews,
  getConciergeTeam,
  formatSGD,
} from "@/lib/dataset";
import { useApp } from "@/lib/store";

export default function CinematicLandingPage() {
  const fleet = getFleet();
  const hubs = getHubs();
  const reviews = getReviews();
  const concierges = getConciergeTeam();
  const { setSelectedDraftCarId } = useApp();

  // Category filter for the curated showcase
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const categories = ["ALL", "Exotic Supercar", "High-Performance EV", "Ultra-Luxury VIP MPV"];

  const filteredFleet = activeCategory === "ALL"
    ? fleet
    : fleet.filter((c) => c.category.toLowerCase().includes(activeCategory.toLowerCase()));

  // Featured flagship car for editorial deep-dive
  const flagshipCar = fleet.find((c) => c.id === "CAR-SG-01") || fleet[0]; // Porsche Taycan 4S
  const supercarCar = fleet.find((c) => c.id === "CAR-SG-02") || fleet[1]; // Ferrari 296 GTB

  return (
    <div className="relative min-h-screen bg-[#060A12] text-[#F0F6FC] selection:bg-cyan-ice selection:text-sapphire-950">
      {/* =========================================================================
          1. CINEMATIC HERO (FULL-VIEWPORT EDITORIAL CAMPAIGN)
      ========================================================================== */}
      <section className="relative h-screen min-h-[700px] w-full flex items-end pb-20 sm:pb-24 overflow-hidden">
        {/* Full-bleed Background Hero Visual */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/porsche-cinematic-night.jpg"
            alt="Veloce Marina Singapore Performance Fleet"
            fill
            priority
            className="object-cover object-center scale-105 transition-transform duration-1000"
          />
          {/* Subtle Atmospheric Midnight Sapphire Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060A12] via-[#060A12]/60 to-[#060A12]/30"></div>
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#060A12]/30 to-[#060A12]/75"></div>
        </div>

        {/* Hero Typography & Primary CTA */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 max-w-4xl"
          >
            <div className="flex items-center space-x-3 text-xs font-mono tracking-[0.2em] uppercase text-titanium-400">
              <span className="w-2 h-2 rounded-full bg-cyan-ice shadow-[0_0_8px_rgba(0,229,255,0.8)]"></span>
              <span>SINGAPORE BESPOKE MOBILITY ATELIER</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-editorial font-bold text-white tracking-tight leading-[0.95]">
              ENGINEERED<br />
              <span className="text-white/80 font-normal">TO BE FELT.</span>
            </h1>

            <p className="text-base sm:text-lg text-titanium-300 font-sans max-w-xl font-normal leading-relaxed pt-2">
              Supercars, executive grand tourers, and sustainable performance vehicles staged at Changi Airport Jewel and Marina Bay Sands.
            </p>
          </motion.div>

          {/* Action Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-5 pt-2"
          >
            <Link
              href="/fleet"
              className="px-8 py-4 bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 font-mono text-xs font-semibold uppercase tracking-[0.15em] rounded shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Explore The Fleet
            </Link>

            <Link
              href="/book"
              className="px-8 py-4 bg-sapphire-800/40 hover:bg-sapphire-700/50 text-white border border-sapphire-600/30 font-mono text-xs font-medium uppercase tracking-[0.15em] rounded backdrop-blur-sm transition-all"
            >
              Direct Dispatch
            </Link>
          </motion.div>
        </div>

        {/* Discreet Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
          <span className="text-[9px] font-mono tracking-[0.25em] text-titanium-400 uppercase">
            SCROLL TO EXPLORE
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-titanium-400 animate-bounce" />
        </div>
      </section>

      {/* =========================================================================
          2. THE SINGAPORE HORIZON (EDITORIAL STATEMENT)
      ========================================================================== */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/[0.06]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-baseline">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-ice uppercase">
              // ARCHITECTURE OF PERFORMANCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-white tracking-tight leading-snug">
              Every route in Singapore.<br />
              Every corridor into Malaysia.
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-6 text-titanium-400 font-sans text-base leading-relaxed">
            <p>
              Veloce Marina operates outside the confines of traditional vehicle hire. In a jurisdiction defined by COE exclusivity, high-speed electronic road pricing (ERP 2.0), and rapid connectivity across the Straits of Johor, mobility requires absolute precision.
            </p>
            <p className="text-titanium-300">
              Each unit in our fleet arrives concourse-inspected, paired with Singapore satellite transponders, pre-cleared Malaysia VEP cross-border RFID clearance, and guaranteed curbside delivery at your arrival terminal.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-4 font-mono text-xs border-t border-white/[0.06]">
              <div>
                <div className="text-xl font-semibold text-white">99.4%</div>
                <div className="text-[10px] text-titanium-500 uppercase mt-0.5">SP Fast-Grid Access</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-white">24/7</div>
                <div className="text-[10px] text-titanium-500 uppercase mt-0.5">Changi Curbside Flight Meet</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-white">100%</div>
                <div className="text-[10px] text-titanium-500 uppercase mt-0.5">VEP RFID Pre-registered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURED EDITORIAL VEHICLE STORY (PORSCHE TAYCAN 4S)
      ========================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-ice uppercase block mb-1">
              EDITORIAL SPOTLIGHT
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-white tracking-tight">
              {flagshipCar.make} {flagshipCar.model}
            </h2>
          </div>

          <div className="text-left sm:text-right font-mono">
            <div className="text-2xl font-semibold text-white">
              {formatSGD(flagshipCar.dailyRateSGD)}
              <span className="text-xs text-titanium-400 font-normal"> /day</span>
            </div>
            <div className="text-[11px] text-titanium-500">
              Inclusive of 9% Singapore GST ({formatSGD(flagshipCar.dailyRateSGD * 1.09)})
            </div>
          </div>
        </div>

        {/* Large Cinematic Spread */}
        <div className="relative w-full h-[450px] sm:h-[600px] rounded-2xl overflow-hidden bg-[#0B1324] border border-sapphire-700/20">
          <Image
            src={flagshipCar.imageUrl}
            alt={`${flagshipCar.make} ${flagshipCar.model}`}
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060A12] via-transparent to-transparent"></div>

          {/* Telemetry Inset Bar */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-6 backdrop-blur-md bg-[#060A12]/80 p-6 rounded-xl border border-sapphire-700/30">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono text-xs">
              <div>
                <span className="text-[10px] text-titanium-500 uppercase block">0–100 KM/H</span>
                <span className="text-xl font-bold text-cyan-ice">{flagshipCar.acceleration0To100}</span>
              </div>
              <div>
                <span className="text-[10px] text-titanium-500 uppercase block">ELECTRIC RANGE</span>
                <span className="text-xl font-bold text-white">{flagshipCar.rangeKm} km</span>
              </div>
              <div>
                <span className="text-[10px] text-titanium-500 uppercase block">POWERTRAIN</span>
                <span className="text-xs font-semibold text-titanium-200">Dual Motor (530 PS)</span>
              </div>
              <div>
                <span className="text-[10px] text-titanium-500 uppercase block">MALAYSIA VEP</span>
                <span className="text-xs font-semibold text-emerald-400">Desaru / KL Approved</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href={`/fleet/${flagshipCar.id}`}
                className="px-5 py-2.5 rounded bg-sapphire-800/40 hover:bg-sapphire-700/50 text-white border border-sapphire-600/30 font-mono text-xs tracking-wider transition-colors"
              >
                Inspect Telemetry
              </Link>
              <Link
                href={`/book?car=${flagshipCar.id}`}
                className="px-5 py-2.5 rounded bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 font-mono text-xs font-semibold tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-colors"
              >
                Dispatch Vehicle
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SECONDARY SPOTLIGHT: EXOTIC SUPERCAR CAMPAIGN (FERRARI 296 GTB)
      ========================================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-ice uppercase">
              PURE HYBRID MOTORSPORT
            </span>

            <h2 className="text-3xl sm:text-5xl font-editorial font-bold text-white tracking-tight leading-none">
              {supercarCar.make} {supercarCar.model}
            </h2>

            <p className="text-sm text-titanium-400 font-sans leading-relaxed">
              3.0-litre Twin-Turbo V6 plug-in hybrid architecture producing 830 metric horsepower. Slide Slip Control 7.0 and carbon ceramic matrix brakes engineered for pure sensation under the Marina Bay street circuit tunnels.
            </p>

            <div className="grid grid-cols-3 gap-4 font-mono text-xs py-2 border-y border-white/[0.06]">
              <div>
                <span className="text-[10px] text-titanium-500 uppercase block">0–100 KM/H</span>
                <span className="text-2xl font-bold text-cyan-ice">{supercarCar.acceleration0To100}</span>
              </div>
              <div>
                <span className="text-[10px] text-titanium-500 uppercase block">OUTPUT</span>
                <span className="text-2xl font-bold text-white">830 cv</span>
              </div>
              <div>
                <span className="text-[10px] text-titanium-500 uppercase block">DAILY RATE</span>
                <span className="text-2xl font-bold text-white">{formatSGD(supercarCar.dailyRateSGD)}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                href={`/fleet/${supercarCar.id}`}
                className="px-6 py-3 rounded bg-sapphire-800/40 hover:bg-sapphire-700/50 text-white border border-sapphire-600/30 font-mono text-xs uppercase tracking-wider transition-colors"
              >
                Full Spec Sheet
              </Link>
              <Link
                href={`/book?car=${supercarCar.id}`}
                className="px-6 py-3 rounded bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 font-mono text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-colors"
              >
                Reserve Supercar
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative w-full h-80 sm:h-[450px] rounded-2xl overflow-hidden bg-[#0B1324] border border-sapphire-700/20">
              <Image
                src={supercarCar.imageUrl}
                alt={`${supercarCar.make} ${supercarCar.model}`}
                fill
                className="object-cover object-center"
              />
              <div className="absolute top-4 right-4 px-3 py-1 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-white border border-sapphire-700/30">
                Singapore Mainland Only &bull; Age 30+
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. CURATED FLEET CATALOGUE (VARIED EDITORIAL GRID)
      ========================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 border-t border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-ice uppercase block mb-1">
              THE FULL STABLE
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-white tracking-tight">
              Curated Fleet Inventory
            </h2>
          </div>

          {/* Clean Category Filter Navigation */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded transition-all ${
                  activeCategory === cat
                    ? "bg-cyan-ice text-sapphire-950 font-semibold shadow-[0_0_12px_rgba(0,229,255,0.3)]"
                    : "text-titanium-400 hover:text-white bg-sapphire-900/60 border border-sapphire-700/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Varied Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFleet.map((car, idx) => {
            const isFeatured = idx === 0 || idx === 3;
            return (
              <div
                key={car.id}
                className={`group flex flex-col justify-between transition-all duration-300 ${
                  isFeatured ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                {/* Photo container */}
                <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden bg-[#0B1324] border border-sapphire-700/20 mb-4">
                  <Image
                    src={car.imageUrl}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-[#060A12]/85 backdrop-blur-sm text-white border border-sapphire-700/30">
                      {car.category}
                    </span>
                    {car.malaysiaEntryAllowed && (
                      <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-emerald-950/80 backdrop-blur-sm text-emerald-400 border border-emerald-500/20">
                        VEP Ready
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-editorial font-semibold text-white group-hover:text-cyan-ice transition-colors">
                      {car.make} {car.model}
                    </h3>
                    <div className="font-mono text-sm font-semibold text-white">
                      {formatSGD(car.dailyRateSGD)}
                      <span className="text-[10px] text-titanium-400 font-normal"> /d</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-titanium-400 border-t border-white/[0.06] pt-2">
                    <span>0–100: {car.acceleration0To100}</span>
                    <span>&bull;</span>
                    <span>{car.rangeKm} km</span>
                    <span>&bull;</span>
                    <span>{car.seats} seats</span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Link
                      href={`/fleet/${car.id}`}
                      className="flex-1 py-2 text-center rounded bg-sapphire-900/60 hover:bg-sapphire-800/80 text-white text-xs font-mono border border-sapphire-700/20 transition-colors"
                    >
                      Specifications
                    </Link>
                    <Link
                      href={`/book?car=${car.id}`}
                      className="flex-1 py-2 text-center rounded bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 text-xs font-mono font-medium shadow-[0_0_12px_rgba(0,229,255,0.2)] transition-colors"
                    >
                      Reserve
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          6. PICKUP HUBS & AVIATION VALET
      ========================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 border-t border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-ice uppercase block mb-1">
              SINGAPORE TOPOLOGY
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-white tracking-tight">
              Pick-up Hubs &amp; Aviation Concierge
            </h2>
          </div>
          <Link
            href="/hubs"
            className="text-xs font-mono text-titanium-400 hover:text-cyan-ice inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View All 6 Hub Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hubs.map((hub) => (
            <Link
              key={hub.id}
              href={`/hubs/${hub.id}`}
              className="editorial-card rounded-xl p-6 space-y-3 group"
            >
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-cyan-ice">{hub.district}</span>
                <span className="text-titanium-500">{hub.postalCode}</span>
              </div>
              <h3 className="text-base font-editorial font-semibold text-white group-hover:text-cyan-ice transition-colors">
                {hub.name}
              </h3>
              <p className="text-xs text-titanium-400 font-sans leading-relaxed line-clamp-2">
                {hub.address}
              </p>
              <div className="pt-2 border-t border-sapphire-700/20 flex items-center justify-between text-xs font-mono text-titanium-400">
                <span>{hub.mrt}</span>
                <span className="text-cyan-ice group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. VERIFIED CLIENT LOGS (EDITORIAL TESTIMONIALS)
      ========================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 border-t border-white/[0.06]">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-ice uppercase block mb-1">
            CLIENT TELEMETRY LOGS
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-white tracking-tight">
            Track Experiences
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="editorial-card rounded-xl p-8 space-y-4"
            >
              <div className="flex justify-between items-baseline font-mono text-xs">
                <div className="font-semibold text-white text-sm">{rev.userName}</div>
                <div className="text-cyan-ice/80">{rev.userLocation}</div>
              </div>

              <p className="text-sm text-titanium-300 font-sans leading-relaxed italic">
                &ldquo;{rev.comment}&rdquo;
              </p>

              <div className="pt-3 border-t border-sapphire-700/20 flex justify-between items-center text-xs font-mono text-titanium-400">
                <span>{rev.milesDriven} km logged</span>
                <span className="text-cyan-ice/70">Verified Resident Track Record</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          8. CONCIERGE DIRECTORS
      ========================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 border-t border-white/[0.06]">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-ice uppercase block mb-1">
            DIRECTOR CADRE
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-white tracking-tight">
            Motorsport &amp; Aviation Concierge
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {concierges.map((staff) => (
            <div
              key={staff.id}
              className="editorial-card rounded-xl overflow-hidden flex flex-col justify-between"
            >
              <div className="relative w-full h-72 bg-[#0B1324]">
                <Image
                  src={staff.avatarUrl}
                  alt={staff.fullName}
                  fill
                  className="object-cover object-top"
                />
              </div>

              <div className="p-6 space-y-3">
                <div className="text-[10px] font-mono text-cyan-ice uppercase tracking-wider">
                  {staff.role}
                </div>
                <h3 className="text-lg font-editorial font-semibold text-white">
                  {staff.fullName}
                </h3>
                <p className="text-xs text-titanium-400 font-sans leading-relaxed">
                  {staff.bio}
                </p>
                <div className="pt-3 border-t border-sapphire-700/20 text-xs font-mono text-titanium-300">
                  Direct: {staff.phone}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          9. CLOSING COMMISSION CTA
      ========================================================================== */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-ice uppercase">
            RESERVATION PROTOCOL
          </span>
          <h2 className="text-4xl sm:text-5xl font-editorial font-bold text-white tracking-tight">
            Command the Singapore Horizon.
          </h2>
          <p className="text-sm text-titanium-400 font-sans leading-relaxed">
            Instant digital key pass issuance, Singpass MyInfo synchronization, and 24/7 curbside handover.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/book"
            className="px-8 py-4 bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 font-mono text-xs font-semibold uppercase tracking-[0.15em] rounded shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Initiate Dispatch
          </Link>
          <Link
            href="/fleet"
            className="px-8 py-4 bg-sapphire-800/40 hover:bg-sapphire-700/50 text-white border border-sapphire-600/30 font-mono text-xs uppercase tracking-[0.15em] rounded transition-colors"
          >
            Review All Models
          </Link>
        </div>
      </section>
    </div>
  );
}
