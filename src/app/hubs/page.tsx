"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Clock, Phone } from "lucide-react";
import { getHubs, getFleet } from "@/lib/dataset";
import { useApp } from "@/lib/store";

export default function HubsDirectoryPage() {
  const hubs = getHubs();
  const fleet = getFleet();
  const { setSelectedDraftPickupHubId } = useApp();

  const [selectedDistrict, setSelectedDistrict] = useState<string>("ALL");
  const districts = ["ALL", "East", "Downtown Core", "Central", "South-West", "South", "North"];

  const filteredHubs = hubs.filter((hub) => {
    if (selectedDistrict === "ALL") return true;
    return hub.district.toLowerCase().includes(selectedDistrict.toLowerCase());
  });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-sapphire-700/20 pb-6">
        <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-ice uppercase block">
          SINGAPORE VALET INFRASTRUCTURE
        </span>
        <h1 className="text-4xl sm:text-5xl font-editorial font-bold text-white tracking-tight">
          Pick-up Hubs &amp; Aviation Terminals
        </h1>
        <p className="text-xs text-titanium-400 max-w-2xl font-sans leading-relaxed">
          Six certified staging facilities across Singapore featuring 24/7 curbside flight meet &amp; greet at Changi Jewel, Marina Bay Sands VIP supercar porte cochère, and the Woodlands Causeway gateway.
        </p>

        {/* Clean District Tabs */}
        <div className="flex flex-wrap gap-2 pt-4">
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedDistrict === d
                  ? "bg-cyan-ice text-sapphire-950 font-semibold shadow-[0_0_12px_rgba(0,229,255,0.3)]"
                  : "bg-sapphire-900/60 text-titanium-400 hover:text-white border border-sapphire-700/20"
              }`}
            >
              {d === "ALL" ? "All Districts" : d}
            </button>
          ))}
        </div>
      </div>

      {/* Hubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHubs.map((hub) => {
          const stagedCars = fleet.filter((c) => c.availableLocations.includes(hub.id));

          return (
            <div
              key={hub.id}
              className="editorial-card rounded-2xl p-6 flex flex-col justify-between space-y-6 group border border-sapphire-700/20 overflow-hidden"
            >
              {hub.imageUrl && (
                <div className="relative h-44 -mx-6 -mt-6 mb-2 overflow-hidden border-b border-sapphire-700/20">
                  <Image
                    src={hub.imageUrl}
                    alt={hub.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1324] via-transparent to-black/30" />
                </div>
              )}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-ice uppercase tracking-wider">{hub.district}</span>
                  <span className="text-titanium-500">{hub.postalCode}</span>
                </div>

                <h2 className="text-xl font-editorial font-semibold text-white group-hover:text-cyan-ice transition-colors">
                  {hub.name}
                </h2>

                <p className="text-xs text-titanium-300 font-sans leading-relaxed">
                  {hub.address}
                </p>

                <div className="space-y-1.5 pt-3 border-t border-sapphire-700/20 font-mono text-xs text-titanium-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-titanium-500 shrink-0" />
                    <span>{hub.mrt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-titanium-500 shrink-0" />
                    <span>{hub.operatingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-titanium-500 shrink-0" />
                    <span className="text-white">{hub.phone}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-mono text-titanium-500 uppercase block mb-1.5">
                    Staged Fleet ({stagedCars.length} Units):
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-titanium-300">
                    {stagedCars.map((c) => (
                      <span key={c.id} className="px-2 py-0.5 rounded bg-black/30 border border-sapphire-700/20">
                        {c.make} {c.model.split(" ")[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-sapphire-700/20">
                <Link
                  href={`/hubs/${hub.id}`}
                  className="flex-1 py-2.5 rounded bg-sapphire-900/60 hover:bg-sapphire-800/80 text-white text-center font-mono text-xs border border-sapphire-700/20 transition-colors"
                >
                  Terminal Details
                </Link>
                <Link
                  href={`/book?hub=${hub.id}`}
                  onClick={() => setSelectedDraftPickupHubId(hub.id)}
                  className="flex-1 py-2.5 rounded bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 text-center font-mono text-xs font-semibold uppercase tracking-wider shadow-[0_0_12px_rgba(0,229,255,0.2)] transition-colors"
                >
                  Book Here
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
