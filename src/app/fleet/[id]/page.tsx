"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Shield,
  Zap,
} from "lucide-react";
import {
  getVehicleById,
  getHubs,
  getHubById,
  formatSGD,
  calculateBookingQuote,
  checkVehicleAvailability,
} from "@/lib/dataset";
import { useApp } from "@/lib/store";

export default function VehicleDetailTelemetryPage() {
  const params = useParams();
  const router = useRouter();
  const carId = (params?.id as string) || "CAR-SG-01";
  const car = getVehicleById(carId);
  const hubs = getHubs();

  const {
    setSelectedDraftCarId,
    setSelectedDraftPickupHubId,
    setSelectedDraftReturnHubId,
    setSelectedStartDate,
    setSelectedEndDate,
  } = useApp();

  const [durationDays, setDurationDays] = useState<number>(3);
  const [pickupHubId, setPickupHubId] = useState<string>(
    car?.availableLocations[0] || "LOC-SIN-01"
  );
  const [returnHubId, setReturnHubId] = useState<string>(
    car?.availableLocations[0] || "LOC-SIN-01"
  );
  const [startDateStr, setStartDateStr] = useState<string>("2026-10-16");
  const [includeZeroExcess, setIncludeZeroExcess] = useState<boolean>(true);
  const [includeMalaysiaPass, setIncludeMalaysiaPass] = useState<boolean>(
    car?.malaysiaEntryAllowed ?? false
  );

  const endDateStr = useMemo(() => {
    const d = new Date(startDateStr);
    if (isNaN(d.getTime())) return "2026-10-19";
    d.setDate(d.getDate() + durationDays);
    return d.toISOString().split("T")[0];
  }, [startDateStr, durationDays]);

  const quote = useMemo(() => {
    if (!car) return null;
    return calculateBookingQuote({
      car,
      startDateStr,
      endDateStr,
      includeZeroExcess,
      includeMalaysiaPass: car.malaysiaEntryAllowed ? includeMalaysiaPass : false,
      selectedAddOnIds: [],
    });
  }, [car, startDateStr, endDateStr, includeZeroExcess, includeMalaysiaPass]);

  const availability = useMemo(() => {
    if (!car) return { isAvailable: false };
    return checkVehicleAvailability(car.id, pickupHubId, startDateStr, endDateStr);
  }, [car, pickupHubId, startDateStr, endDateStr]);

  if (!car) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-24 text-center space-y-4 font-mono text-xs">
        <h1 className="text-xl font-editorial font-semibold text-white">
          Vehicle Specification Not Found
        </h1>
        <Link href="/fleet" className="text-cyan-ice hover:underline inline-block">
          &larr; Return to Fleet Atelier
        </Link>
      </div>
    );
  }

  const selectedHub = getHubById(pickupHubId);

  const handleProceedToDispatch = () => {
    setSelectedDraftCarId(car.id);
    setSelectedDraftPickupHubId(pickupHubId);
    setSelectedDraftReturnHubId(returnHubId);
    setSelectedStartDate(startDateStr);
    setSelectedEndDate(endDateStr);
    router.push(
      `/book?car=${car.id}&hub=${pickupHubId}&days=${durationDays}&zeroExcess=${includeZeroExcess}&malaysiaPass=${includeMalaysiaPass}`
    );
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Editorial Breadcrumbs */}
      <div>
        <Link
          href="/fleet"
          className="text-xs font-mono text-titanium-400 hover:text-cyan-ice inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Fleet Atelier
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left 7 Columns: Editorial Vehicle Presentation */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Title & Price Header */}
          <div className="space-y-3 border-b border-sapphire-700/20 pb-6">
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-cyan-ice uppercase tracking-[0.2em]">
                {car.category}
              </span>
              <span className="text-titanium-500">&bull;</span>
              <span className="text-titanium-400">Model Year {car.year}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <h1 className="text-3xl sm:text-5xl font-editorial font-bold text-white tracking-tight leading-tight">
                {car.make} {car.model}
              </h1>

              <div className="font-mono text-left sm:text-right shrink-0">
                <div className="text-2xl font-bold text-white">
                  {formatSGD(car.dailyRateSGD)}
                  <span className="text-xs text-titanium-400 font-normal"> /day</span>
                </div>
                <div className="text-[11px] text-titanium-500">
                  Incl. 9% GST: {formatSGD(car.dailyRateSGD * 1.09)}
                </div>
              </div>
            </div>
          </div>

          {/* Large Cinematic Photo Spread */}
          <div className="relative w-full h-80 sm:h-[460px] rounded-2xl overflow-hidden bg-[#0B1324] border border-sapphire-700/20">
            <Image
              src={car.imageUrl}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute top-4 left-4">
              {car.malaysiaEntryAllowed ? (
                <span className="px-3 py-1 rounded bg-[#060A12]/85 backdrop-blur-sm text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                  Malaysia VEP RFID Certified
                </span>
              ) : (
                <span className="px-3 py-1 rounded bg-[#060A12]/85 backdrop-blur-sm text-[10px] font-mono text-rose-400 border border-rose-500/30">
                  Singapore Mainland Only
                </span>
              )}
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#0B1324] border border-sapphire-700/20">
              <span className="text-[10px] text-titanium-500 uppercase block">0–100 KM/H</span>
              <span className="text-2xl font-bold text-cyan-ice mt-1 block">{car.acceleration0To100}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0B1324] border border-sapphire-700/20">
              <span className="text-[10px] text-titanium-500 uppercase block">RANGE / TANK</span>
              <span className="text-2xl font-bold text-white mt-1 block">{car.rangeKm} km</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0B1324] border border-sapphire-700/20">
              <span className="text-[10px] text-titanium-500 uppercase block">CAPACITY</span>
              <span className="text-base font-semibold text-white mt-1 block">{car.seats} Adult Seats</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0B1324] border border-sapphire-700/20">
              <span className="text-[10px] text-titanium-500 uppercase block">DEPOSIT</span>
              <span className="text-base font-semibold text-white mt-1 block">{formatSGD(car.securityDepositSGD)}</span>
            </div>
          </div>

          {/* Comprehensive Specifications */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-mono uppercase tracking-[0.15em] text-white font-semibold">
              Technical Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#0B1324] border border-sapphire-700/20 space-y-1">
                <span className="text-[10px] text-titanium-500 uppercase">POWERTRAIN CONFIGURATION</span>
                <p className="text-white font-sans">{car.powertrain}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1324] border border-sapphire-700/20 space-y-1">
                <span className="text-[10px] text-titanium-500 uppercase">TRANSMISSION</span>
                <p className="text-white font-sans">{car.transmission}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1324] border border-sapphire-700/20 space-y-1">
                <span className="text-[10px] text-titanium-500 uppercase">LUGGAGE DIMENSIONS</span>
                <p className="text-white font-sans">{car.luggageCapacity}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1324] border border-sapphire-700/20 space-y-1">
                <span className="text-[10px] text-titanium-500 uppercase">SINGAPORE TOLL UNIT</span>
                <p className="text-white font-sans">{car.erpOnboardUnit}</p>
              </div>
            </div>
          </div>

          {/* Telemetry Features List */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-mono uppercase tracking-[0.15em] text-white font-semibold">
              Installed Factory Systems
            </h3>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-titanium-300">
              {car.telemetryFeatures.map((f, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-[#0B1324] border border-sapphire-700/20"
                >
                  &bull; {f}
                </span>
              ))}
            </div>
          </div>

          {/* Rental Conditions & Regulations */}
          <div className="p-5 rounded-xl bg-[#0B1324] border border-sapphire-700/20 space-y-2 text-xs font-mono text-titanium-400">
            <div className="text-white font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-ice" />
              <span>Singapore LTA &amp; Insurance Criteria</span>
            </div>
            <p className="text-titanium-300 font-sans leading-relaxed text-[11px]">
              Minimum driver age is {car.minimumAge} years with at least {car.minimumDrivingExperienceYears} years of licensed driving tenure. Complimentary mileage includes {car.includedMileageKmPerDay} km/day (additional mileage at {formatSGD(car.extraKmRateSGD)}/km).
            </p>
          </div>
        </div>

        {/* Right 5 Columns: Sticky Reservation Engine */}
        <div className="lg:col-span-5 space-y-6">
          <div className="editorial-card rounded-2xl p-6 sm:p-7 space-y-6 sticky top-24 border border-sapphire-700/30 shadow-[0_10px_35px_rgba(0,10,30,0.6)]">
            <div className="flex justify-between items-center border-b border-sapphire-700/20 pb-4">
              <h2 className="text-base font-editorial font-semibold text-white">
                Dispatch Calculator
              </h2>
              <span className="text-[10px] font-mono text-cyan-ice">
                GST 9% Calculated
              </span>
            </div>

            {/* Availability Pill */}
            {availability.isAvailable ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Available for dispatch &bull; Plate: {availability.allocatedPlate}</span>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs font-mono text-rose-400 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{availability.reason}</span>
              </div>
            )}

            {/* Pickup Hub Selection */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-titanium-400 block text-[11px]">PICKUP HUB</label>
              <select
                value={pickupHubId}
                onChange={(e) => setPickupHubId(e.target.value)}
                className="w-full rounded-lg px-3.5 py-2.5 text-xs bg-[#0B1324] border border-sapphire-700/30 focus:border-cyan-ice"
              >
                {hubs.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name.split(" ")[0]} ({h.postalCode})
                  </option>
                ))}
              </select>
              {selectedHub && (
                <div className="text-[10px] text-titanium-500 pt-0.5">
                  Transit: {selectedHub.mrt} &bull; {selectedHub.operatingHours.split("(")[0]}
                </div>
              )}
            </div>

            {/* Dates & Duration */}
            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-titanium-400 block text-[11px]">DISPATCH DATE</label>
                <input
                  type="date"
                  value={startDateStr}
                  onChange={(e) => setStartDateStr(e.target.value)}
                  min="2026-10-15"
                  max="2026-10-22"
                  className="w-full rounded-lg px-3.5 py-2.5 text-xs bg-[#0B1324] border border-sapphire-700/30 focus:border-cyan-ice"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-titanium-400">Duration</span>
                  <span className="text-white font-semibold">{durationDays} Days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-ice"
                />
              </div>
            </div>

            {/* Add-on Protections */}
            <div className="space-y-2.5 pt-3 border-t border-sapphire-700/20 font-mono text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-sapphire-950/40 border border-sapphire-700/20 cursor-pointer hover:border-cyan-ice/40 transition-colors">
                <div>
                  <span className="text-white font-medium block">Zero-Excess Sovereign Shield</span>
                  <span className="text-[10px] text-titanium-400">
                    Reduces excess from {formatSGD(car.excessSGD)} to S$ 0
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 pl-2">
                  <span className="text-titanium-300">+{formatSGD(car.zeroExcessAddonDailySGD)}/d</span>
                  <input
                    type="checkbox"
                    checked={includeZeroExcess}
                    onChange={(e) => setIncludeZeroExcess(e.target.checked)}
                    className="accent-cyan-ice"
                  />
                </div>
              </label>

              {car.malaysiaEntryAllowed && (
                <label className="flex items-center justify-between p-3 rounded-xl bg-sapphire-950/40 border border-sapphire-700/20 cursor-pointer hover:border-cyan-ice/40 transition-colors">
                  <div>
                    <span className="text-white font-medium block">Malaysia Causeway Pass</span>
                    <span className="text-[10px] text-titanium-400">
                      VEP RFID clearance + Touch &apos;n Go
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pl-2">
                    <span className="text-emerald-400">+{formatSGD(car.malaysiaEntrySurchargeDailySGD)}/d</span>
                    <input
                      type="checkbox"
                      checked={includeMalaysiaPass}
                      onChange={(e) => setIncludeMalaysiaPass(e.target.checked)}
                      className="accent-emerald-400"
                    />
                  </div>
                </label>
              )}
            </div>

            {/* Itemized Price Ledger */}
            {quote && (
              <div className="p-4 rounded-xl bg-[#060A12]/80 border border-sapphire-700/20 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-titanium-400">
                  <span>Base Rental ({quote.days} days):</span>
                  <span>{formatSGD(quote.baseRental)}</span>
                </div>

                {quote.zeroExcessTotal > 0 && (
                  <div className="flex justify-between text-titanium-400">
                    <span>Zero-Excess Shield:</span>
                    <span>+{formatSGD(quote.zeroExcessTotal)}</span>
                  </div>
                )}

                {quote.malaysiaSurchargeTotal > 0 && (
                  <div className="flex justify-between text-titanium-400">
                    <span>Malaysia VEP Pass:</span>
                    <span>+{formatSGD(quote.malaysiaSurchargeTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-titanium-400 pt-1 border-t border-sapphire-700/20">
                  <span>GST (9%):</span>
                  <span>+{formatSGD(quote.gstAmount)}</span>
                </div>

                <div className="flex justify-between text-sm font-semibold text-white pt-1 border-t border-sapphire-700/30">
                  <span>Total Payable Rental:</span>
                  <span className="text-cyan-ice font-bold">{formatSGD(quote.totalWithGst)}</span>
                </div>

                <div className="text-[10px] text-titanium-500 pt-1">
                  Refundable Security Deposit: {formatSGD(quote.securityDeposit)}
                </div>
              </div>
            )}

            {/* Action CTA */}
            <button
              disabled={!availability.isAvailable}
              onClick={handleProceedToDispatch}
              className={`w-full py-3.5 rounded-lg font-mono text-xs font-semibold uppercase tracking-[0.15em] transition-all ${
                availability.isAvailable
                  ? "bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transform hover:-translate-y-0.5"
                  : "bg-white/[0.06] text-titanium-500 cursor-not-allowed"
              }`}
            >
              Confirm Dispatch Reservation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
