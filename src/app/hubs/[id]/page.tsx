"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { getHubById, getFleet, formatSGD } from "@/lib/dataset";
import { useApp } from "@/lib/store";

export default function HubDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hubId = (params?.id as string) || "LOC-SIN-01";
  const hub = getHubById(hubId);
  const fleet = getFleet();

  const { setSelectedDraftPickupHubId, setSelectedDraftCarId } = useApp();

  if (!hub) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-24 text-center font-mono text-xs">
        <h1 className="text-xl font-editorial font-semibold text-white">Hub Terminal Not Found</h1>
        <Link href="/hubs" className="text-cyan-ice hover:underline mt-2 inline-block">
          &larr; Return to Hubs Directory
        </Link>
      </div>
    );
  }

  const stagedVehicles = fleet.filter((c) => c.availableLocations.includes(hub.id));

  const handleDispatchCar = (carId: string) => {
    setSelectedDraftCarId(carId);
    setSelectedDraftPickupHubId(hub.id);
    router.push(`/book?car=${carId}&hub=${hub.id}`);
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 font-mono text-xs">
      <div>
        <Link
          href="/hubs"
          className="text-titanium-400 hover:text-cyan-ice inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Pick-up Hubs
        </Link>
      </div>

      {/* Terminal Feature Card */}
      <div className="editorial-card rounded-2xl p-6 sm:p-10 space-y-6 border border-sapphire-700/20 overflow-hidden">
        {hub.imageUrl && (
          <div className="relative h-64 -mx-6 -mt-6 sm:-mx-10 sm:-mt-10 mb-6 overflow-hidden border-b border-sapphire-700/20">
            <Image
              src={hub.imageUrl}
              alt={hub.name}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1324] via-transparent to-black/30" />
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sapphire-700/20 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] text-cyan-ice uppercase tracking-[0.2em] font-semibold block">
              {hub.district} &bull; Postal Code {hub.postalCode}
            </span>
            <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-white tracking-tight">
              {hub.name}
            </h1>
            <p className="text-xs text-titanium-400 font-sans mt-0.5">
              {hub.hubType}
            </p>
          </div>

          <div className="font-mono text-left sm:text-right shrink-0">
            <span className="text-[10px] text-titanium-500 uppercase block">DIRECT VALET HOTLINE</span>
            <span className="text-base text-white font-bold">{hub.phone}</span>
          </div>
        </div>

        <p className="text-xs text-titanium-300 font-sans leading-relaxed">
          {hub.address}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-titanium-300">
          <div>Transit: <span className="text-white">{hub.mrt}</span></div>
          <div>Operating Hours: <span className="text-white">{hub.operatingHours}</span></div>
        </div>

        <div className="pt-3 border-t border-sapphire-700/20 space-y-2">
          <span className="text-[10px] text-titanium-500 uppercase block">
            Dedicated Amenities &amp; Protocols:
          </span>
          <div className="flex flex-wrap gap-2 text-titanium-300">
            {hub.amenities.map((a, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-black/30 border border-sapphire-700/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-ice" />
                <span>{a}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Staged Inventory Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-editorial font-bold text-white tracking-tight">
          Staged Inventory at {hub.name.split(" ")[0]} ({stagedVehicles.length} Units)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stagedVehicles.map((car) => (
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
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-editorial font-semibold text-white group-hover:text-cyan-ice transition-colors">
                    {car.make} {car.model}
                  </h3>
                  <div className="text-xs font-mono text-titanium-400 mt-1">
                    0–100: {car.acceleration0To100} &bull; {car.rangeKm} km range
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-sapphire-700/20">
                  <div>
                    <span className="text-base font-bold text-white">
                      {formatSGD(car.dailyRateSGD)}
                    </span>
                    <span className="text-[10px] text-titanium-400 font-normal"> /day</span>
                  </div>

                  <button
                    onClick={() => handleDispatchCar(car.id)}
                    className="px-4 py-2 rounded bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 font-semibold uppercase text-xs tracking-wider shadow-[0_0_12px_rgba(0,229,255,0.2)] transition-colors"
                  >
                    Dispatch
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
