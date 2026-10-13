"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Shield,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { getFleet, getHubById, formatSGD, getAddOnById } from "@/lib/dataset";
import { useApp } from "@/lib/store";

export default function CrossBorderPlannerPage() {
  const router = useRouter();
  const fleet = getFleet();
  const woodlandsHub = getHubById("LOC-WDL-06");
  const myAddon = getAddOnById("ADD-MY-PASS");

  const { setSelectedDraftCarId, setSelectedDraftPickupHubId } = useApp();

  const [selectedCheckpoint, setSelectedCheckpoint] = useState<"TUAS" | "WOODLANDS">("TUAS");
  const [selectedDestination, setSelectedDestination] = useState<"JB" | "DESARU" | "MELAKA" | "KL">("DESARU");

  const routeTelemetry = {
    JB: {
      name: "Johor Bahru City Centre",
      distanceKm: 32,
      estTime: selectedCheckpoint === "WOODLANDS" ? "35 mins" : "55 mins",
      tollMYR: selectedCheckpoint === "WOODLANDS" ? "MYR 12.50" : "MYR 26.80",
      notes: "Shopping, dining, and hotel corridors via the Woodlands Causeway.",
    },
    DESARU: {
      name: "Desaru Coast Luxury Resorts",
      distanceKm: 110,
      estTime: selectedCheckpoint === "TUAS" ? "1h 30m" : "1h 45m",
      tollMYR: "MYR 34.20",
      notes: "Direct high-speed expressway travel via Senai-Desaru Highway (E22).",
    },
    MELAKA: {
      name: "Melaka Heritage City",
      distanceKm: 245,
      estTime: "2h 45m",
      tollMYR: "MYR 48.60",
      notes: "Direct connection along the PLUS North-South Highway (E2).",
    },
    KL: {
      name: "Kuala Lumpur (Pavilion / KLCC)",
      distanceKm: 365,
      estTime: "3h 50m",
      tollMYR: "MYR 76.50",
      notes: "Intercity highway grand tour. Covered by 24/7 cross-border towing guarantee.",
    },
  };

  const activeRoute = routeTelemetry[selectedDestination];
  const eligibleFleet = fleet.filter((c) => c.malaysiaEntryAllowed);
  const restrictedFleet = fleet.filter((c) => !c.malaysiaEntryAllowed);

  const handleBookEligibleCar = (carId: string) => {
    setSelectedDraftCarId(carId);
    setSelectedDraftPickupHubId("LOC-WDL-06");
    router.push(`/book?car=${carId}&hub=LOC-WDL-06&malaysiaPass=true`);
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Editorial Header */}
      <div className="space-y-3 border-b border-sapphire-700/20 pb-6">
        <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-ice uppercase block">
          INTERNATIONAL PROTOCOLS
        </span>
        <h1 className="text-4xl sm:text-5xl font-editorial font-bold text-white tracking-tight">
          Malaysia Causeway &amp; Tuas Transit
        </h1>
        <p className="text-xs text-titanium-400 max-w-2xl font-sans leading-relaxed">
          Compliant cross-border mobility under Singapore LTA and Malaysian JPJ frameworks. All authorized vehicles carry active VEP RFID clearance and comprehensive international commercial insurance endorsements.
        </p>
      </div>

      {/* Transit Pass Spotlight Banner */}
      <div className="editorial-card rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-sapphire-700/20">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-ice font-semibold tracking-wider uppercase">
              Official Transit Add-on &bull; {myAddon?.id}
            </span>
          </div>
          <h2 className="text-2xl font-editorial font-bold text-white">
            {myAddon?.name}
          </h2>
          <p className="text-xs text-titanium-300 font-sans leading-relaxed">
            {myAddon?.description}
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-mono text-titanium-400 pt-1">
            <span className="flex items-center gap-1.5 text-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              VEP RFID Pre-registered
            </span>
            <span className="flex items-center gap-1.5 text-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-ice" />
              Touch &apos;n Go MYR 50.00
            </span>
            <span className="flex items-center gap-1.5 text-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              24/7 West Malaysia Recovery
            </span>
          </div>
        </div>

        <div className="font-mono text-left md:text-right shrink-0">
          <div className="text-3xl font-bold text-white">
            {formatSGD(myAddon?.dailyCostSGD || 65.0)}
            <span className="text-xs text-titanium-400 font-normal"> /day</span>
          </div>
          <div className="text-[11px] text-titanium-500">
            Incl. 9% GST: {formatSGD((myAddon?.dailyCostSGD || 65.0) * 1.09)}
          </div>
        </div>
      </div>

      {/* Checkpoint & Route Selector */}
      <div className="editorial-card rounded-2xl p-6 sm:p-8 space-y-6 font-mono text-xs border border-sapphire-700/20">
        <h2 className="text-base font-editorial font-semibold text-white border-b border-sapphire-700/20 pb-3">
          Route &amp; Corridor Simulator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-titanium-400 block text-[11px]">BORDER CHECKPOINT</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedCheckpoint("TUAS")}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  selectedCheckpoint === "TUAS"
                    ? "border-cyan-ice bg-sapphire-900/40 text-white shadow-[0_0_12px_rgba(0,229,255,0.2)]"
                    : "border-sapphire-700/20 bg-sapphire-950/30 text-titanium-400 hover:text-white"
                }`}
              >
                <div className="font-semibold text-white">Tuas Second Link</div>
                <div className="text-[10px] text-titanium-500 mt-0.5">Express flow to Desaru / KL</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCheckpoint("WOODLANDS")}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  selectedCheckpoint === "WOODLANDS"
                    ? "border-cyan-ice bg-sapphire-900/40 text-white shadow-[0_0_12px_rgba(0,229,255,0.2)]"
                    : "border-sapphire-700/20 bg-sapphire-950/30 text-titanium-400 hover:text-white"
                }`}
              >
                <div className="font-semibold text-white">Woodlands Causeway</div>
                <div className="text-[10px] text-titanium-500 mt-0.5">Direct to Johor Bahru City</div>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-titanium-400 block text-[11px]">TARGET DESTINATION</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["JB", "DESARU", "MELAKA", "KL"] as const).map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => setSelectedDestination(dest)}
                  className={`p-2.5 rounded-lg border text-center transition-colors ${
                    selectedDestination === dest
                      ? "border-cyan-ice text-cyan-ice bg-cyan-ice/10 font-semibold shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                      : "border-sapphire-700/20 text-titanium-400 hover:text-white bg-sapphire-950/30"
                  }`}
                >
                  {dest === "JB" ? "Johor Bahru" : dest === "DESARU" ? "Desaru" : dest === "MELAKA" ? "Melaka" : "Kuala Lumpur"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Route Readout */}
        <div className="p-4 rounded-xl bg-[#060A12]/80 border border-sapphire-700/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <div className="text-white font-semibold text-sm font-editorial">{activeRoute.name}</div>
            <div className="text-[11px] text-titanium-400 font-sans mt-0.5">{activeRoute.notes}</div>
          </div>
          <div className="flex items-center gap-6 text-titanium-300 shrink-0">
            <span>Distance: <strong className="text-white">{activeRoute.distanceKm} km</strong></span>
            <span>Est. Time: <strong className="text-cyan-ice">{activeRoute.estTime}</strong></span>
            <span>Toll: <strong className="text-emerald-400">{activeRoute.tollMYR}</strong></span>
          </div>
        </div>
      </div>

      {/* Eligible Fleet Inventory */}
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-ice uppercase block mb-1">
            AUTHORIZED INVENTORY
          </span>
          <h2 className="text-3xl font-editorial font-bold text-white tracking-tight">
            Malaysia VEP Approved Fleet ({eligibleFleet.length} Models)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eligibleFleet.map((car) => (
            <div
              key={car.id}
              className="editorial-card rounded-2xl overflow-hidden flex flex-col justify-between group border border-sapphire-700/20"
            >
              <div className="relative w-full h-56 bg-[#0B1324]">
                <Image
                  src={car.imageUrl}
                  alt={`${car.make} ${car.model}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-[#060A12]/85 backdrop-blur-sm text-emerald-400 border border-emerald-500/30">
                    VEP Certified
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-editorial font-semibold text-white group-hover:text-cyan-ice transition-colors">
                    {car.make} {car.model}
                  </h3>
                  <div className="text-xs font-mono text-titanium-400 mt-1">
                    Range: {car.rangeKm} km &bull; Surcharge: +{formatSGD(car.malaysiaEntrySurchargeDailySGD)}/d
                  </div>
                </div>

                <div className="pt-3 border-t border-sapphire-700/20 flex items-center justify-between font-mono">
                  <div>
                    <span className="text-base font-bold text-white">{formatSGD(car.dailyRateSGD)}</span>
                    <span className="text-xs text-titanium-400"> /day</span>
                  </div>

                  <button
                    onClick={() => handleBookEligibleCar(car.id)}
                    className="px-4 py-2 rounded bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 text-xs font-mono font-semibold uppercase tracking-wider shadow-[0_0_12px_rgba(0,229,255,0.2)] transition-colors"
                  >
                    Select Model
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restricted Vehicles Notice */}
      <div className="p-5 rounded-2xl bg-[#0B1324] border border-sapphire-700/20 font-mono text-xs space-y-2">
        <div className="flex items-center gap-2 text-rose-400 font-semibold">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Statutory Asset Protection Notice</span>
        </div>
        <p className="text-xs text-titanium-400 font-sans leading-relaxed">
          Under Singapore LTA and atelier asset protection covenants, the Ferrari 296 GTB and MINI Cooper SE Electric are strictly geo-fenced to Singapore and cannot be commissioned for Malaysia cross-border journeys.
        </p>
      </div>
    </div>
  );
}
