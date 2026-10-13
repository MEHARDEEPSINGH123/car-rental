"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  X,
  ArrowRight,
  SlidersHorizontal,
  Check,
  Zap,
} from "lucide-react";
import { getFleet, formatSGD, GST_RATE } from "@/lib/dataset";
import { useApp } from "@/lib/store";

function FleetAtelierContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fleet = getFleet();
  const { setSelectedDraftCarId } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedMalaysiaFilter, setSelectedMalaysiaFilter] = useState<string>("ALL");

  const [compareCarIds, setCompareCarIds] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);

  const categories = useMemo(() => {
    return Array.from(new Set(fleet.map((c) => c.category)));
  }, [fleet]);

  const filteredVehicles = useMemo(() => {
    return fleet.filter((car) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          car.make.toLowerCase().includes(q) ||
          car.model.toLowerCase().includes(q) ||
          car.category.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedCategory !== "ALL" && car.category !== selectedCategory) {
        return false;
      }
      if (selectedMalaysiaFilter === "ALLOWED" && !car.malaysiaEntryAllowed) {
        return false;
      }
      if (selectedMalaysiaFilter === "RESTRICTED" && car.malaysiaEntryAllowed) {
        return false;
      }
      return true;
    });
  }, [fleet, searchQuery, selectedCategory, selectedMalaysiaFilter]);

  const toggleCompare = (carId: string) => {
    setCompareCarIds((prev) => {
      if (prev.includes(carId)) return prev.filter((id) => id !== carId);
      if (prev.length >= 3) return [...prev.slice(1), carId];
      return [...prev, carId];
    });
  };

  const handleBookNow = (carId: string) => {
    setSelectedDraftCarId(carId);
    router.push(`/book?car=${carId}`);
  };

  const comparisonVehicles = fleet.filter((c) => compareCarIds.includes(c.id));
  const leadCar = filteredVehicles[0] || fleet[0];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header Band */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-sapphire-700/20 pb-6 gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-ice uppercase block">
            ATELIER CATALOGUE
          </span>
          <h1 className="text-4xl sm:text-5xl font-editorial font-bold text-white tracking-tight">
            The Fleet
          </h1>
          <p className="text-xs text-titanium-400 max-w-lg font-sans leading-relaxed">
            Every vehicle represents calibrated engineering, transparent Singapore Dollar pricing, and certified zero-excess options.
          </p>
        </div>

        {compareCarIds.length > 0 && (
          <div className="flex items-center gap-3 bg-[#0B1324] p-2.5 rounded-xl border border-sapphire-700/30">
            <span className="text-xs font-mono text-titanium-300">
              Comparing {compareCarIds.length}/3 Models
            </span>
            <button
              onClick={() => setShowComparisonModal(true)}
              className="px-4 py-1.5 rounded bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 font-mono text-xs font-semibold uppercase tracking-wider shadow-[0_0_12px_rgba(0,229,255,0.25)] transition-colors"
            >
              Compare
            </button>
            <button
              onClick={() => setCompareCarIds([])}
              className="text-titanium-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Editorial Lead Spotlight (If no search query active) */}
      {!searchQuery && selectedCategory === "ALL" && (
        <div className="editorial-card rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-sapphire-700/20">
          <div className="lg:col-span-7 relative h-72 sm:h-96 rounded-xl overflow-hidden bg-[#111C35]">
            <Image
              src={leadCar.imageUrl}
              alt={`${leadCar.make} ${leadCar.model}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded bg-[#060A12]/85 backdrop-blur-sm text-[10px] font-mono text-white border border-sapphire-700/30">
              Featured Flagship &bull; {leadCar.category}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-ice uppercase">
              RESERVE TODAY
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-white">
              {leadCar.make} {leadCar.model}
            </h2>
            <p className="text-xs text-titanium-400 font-sans leading-relaxed">
              {leadCar.powertrain}. Accelerates from 0–100 km/h in {leadCar.acceleration0To100}. Equipped with LTA ERP 2.0 transponder and complimentary SP Mobility fast-charging access.
            </p>

            <div className="pt-2 border-t border-sapphire-700/20 flex items-baseline justify-between font-mono">
              <div>
                <span className="text-2xl font-bold text-white">{formatSGD(leadCar.dailyRateSGD)}</span>
                <span className="text-xs text-titanium-400"> /day</span>
                <div className="text-[10px] text-titanium-500">
                  Incl. 9% GST: {formatSGD(leadCar.dailyRateSGD * 1.09)}
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/fleet/${leadCar.id}`}
                  className="px-4 py-2 rounded bg-sapphire-900/60 hover:bg-sapphire-800/80 text-white font-mono text-xs border border-sapphire-700/20 transition-colors"
                >
                  Details
                </Link>
                <button
                  onClick={() => handleBookNow(leadCar.id)}
                  className="px-4 py-2 rounded bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 font-mono text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-colors"
                >
                  Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refined Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pt-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-titanium-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search make or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 rounded-lg text-xs font-mono"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedMalaysiaFilter}
            onChange={(e) => setSelectedMalaysiaFilter(e.target.value)}
            className="px-3.5 py-2 rounded-lg text-xs font-mono"
          >
            <option value="ALL">All Jurisdictions</option>
            <option value="ALLOWED">Malaysia VEP Ready</option>
            <option value="RESTRICTED">Singapore Mainland Only</option>
          </select>

          {(selectedCategory !== "ALL" || selectedMalaysiaFilter !== "ALL" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSelectedMalaysiaFilter("ALL");
                setSearchQuery("");
              }}
              className="px-3 py-2 text-titanium-400 hover:text-white text-xs"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Catalogue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVehicles.map((car) => {
          const isComparing = compareCarIds.includes(car.id);
          return (
            <div
              key={car.id}
              className={`editorial-card rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 ${
                isComparing ? "border-cyan-ice shadow-[0_0_20px_rgba(0,229,255,0.25)]" : "border-sapphire-700/20"
              }`}
            >
              {/* Car photo */}
              <div className="relative w-full h-64 bg-[#0B1324] overflow-hidden">
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
                  {car.malaysiaEntryAllowed ? (
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-emerald-950/80 backdrop-blur-sm text-emerald-400 border border-emerald-500/20">
                      VEP Ready
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-rose-950/80 backdrop-blur-sm text-rose-400 border border-rose-500/20">
                      SG Only
                    </span>
                  )}
                </div>
              </div>

              {/* Information */}
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-editorial font-semibold text-white group-hover:text-cyan-ice transition-colors">
                    {car.make} {car.model}
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-mono text-titanium-400 mt-1">
                    <span>0–100: {car.acceleration0To100}</span>
                    <span>&bull;</span>
                    <span>{car.rangeKm} km</span>
                    <span>&bull;</span>
                    <span>Min age {car.minimumAge}+</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-sapphire-700/20 flex items-baseline justify-between font-mono">
                  <div>
                    <span className="text-xl font-bold text-white">{formatSGD(car.dailyRateSGD)}</span>
                    <span className="text-xs text-titanium-400"> /day</span>
                    <div className="text-[10px] text-titanium-500">
                      Total w/ 9% GST: {formatSGD(car.dailyRateSGD * 1.09)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/fleet/${car.id}`}
                      className="px-3.5 py-2 rounded bg-sapphire-900/60 hover:bg-sapphire-800/80 text-xs font-mono text-white border border-sapphire-700/20 transition-colors"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => handleBookNow(car.id)}
                      className="px-3.5 py-2 rounded bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 text-xs font-mono font-semibold uppercase tracking-wider shadow-[0_0_12px_rgba(0,229,255,0.2)] transition-colors"
                    >
                      Reserve
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => toggleCompare(car.id)}
                  className={`w-full py-1.5 rounded text-[11px] font-mono text-center border transition-colors ${
                    isComparing
                      ? "border-cyan-ice/60 text-cyan-ice bg-cyan-ice/10 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                      : "border-sapphire-700/20 text-titanium-400 hover:text-white"
                  }`}
                >
                  {isComparing ? "Selected for comparison" : "+ Compare specifications"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Modal */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl rounded-2xl bg-[#0B1324] border border-sapphire-700/30 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-[0_10px_40px_rgba(0,10,30,0.8)]">
            <div className="flex items-center justify-between border-b border-sapphire-700/20 pb-4">
              <h3 className="text-base font-editorial font-semibold text-white">
                Vehicle Telemetry Comparison
              </h3>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="text-titanium-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className="border-b border-sapphire-700/20">
                    <th className="p-3 text-titanium-400">Metric</th>
                    {comparisonVehicles.map((c) => (
                      <th key={c.id} className="p-3 text-white font-semibold min-w-[200px]">
                        {c.make} {c.model}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sapphire-800/20">
                  <tr>
                    <td className="p-3 text-titanium-400">0–100 km/h</td>
                    {comparisonVehicles.map((c) => (
                      <td key={c.id} className="p-3 text-cyan-ice font-bold">
                        {c.acceleration0To100}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-titanium-400">Range</td>
                    {comparisonVehicles.map((c) => (
                      <td key={c.id} className="p-3 text-white">
                        {c.rangeKm} km
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-titanium-400">Powertrain</td>
                    {comparisonVehicles.map((c) => (
                      <td key={c.id} className="p-3 text-titanium-300">
                        {c.powertrain}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-titanium-400">Daily Rate</td>
                    {comparisonVehicles.map((c) => (
                      <td key={c.id} className="p-3 text-white font-semibold">
                        {formatSGD(c.dailyRateSGD)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-titanium-400">With 9% GST</td>
                    {comparisonVehicles.map((c) => (
                      <td key={c.id} className="p-3 text-titanium-300">
                        {formatSGD(c.dailyRateSGD * 1.09)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-titanium-400">Security Deposit</td>
                    {comparisonVehicles.map((c) => (
                      <td key={c.id} className="p-3 text-titanium-300">
                        {formatSGD(c.securityDepositSGD)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-titanium-400">Malaysia VEP</td>
                    {comparisonVehicles.map((c) => (
                      <td key={c.id} className="p-3">
                        {c.malaysiaEntryAllowed ? (
                          <span className="text-emerald-400">Approved</span>
                        ) : (
                          <span className="text-rose-400">Restricted</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-titanium-400">Dispatch</td>
                    {comparisonVehicles.map((c) => (
                      <td key={c.id} className="p-3">
                        <button
                          onClick={() => {
                            setShowComparisonModal(false);
                            handleBookNow(c.id);
                          }}
                          className="w-full py-2 rounded bg-cyan-ice text-sapphire-950 font-semibold uppercase text-xs shadow-[0_0_12px_rgba(0,229,255,0.25)]"
                        >
                          Book Now
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FleetAtelierPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen max-w-7xl mx-auto px-4 py-20 text-center font-mono text-xs text-titanium-400">
          Loading fleet inventory...
        </div>
      }
    >
      <FleetAtelierContent />
    </Suspense>
  );
}
