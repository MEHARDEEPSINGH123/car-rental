"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Shield,
  UserCheck,
} from "lucide-react";
import {
  getFleet,
  getHubs,
  getAddOns,
  getVehicleById,
  getHubById,
  formatSGD,
  calculateBookingQuote,
  checkVehicleAvailability,
} from "@/lib/dataset";
import { useApp, BookingRecord } from "@/lib/store";

function InstantDispatchBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fleet = getFleet();
  const hubs = getHubs();
  const addOns = getAddOns();

  const {
    user,
    addBooking,
    selectedDraftCarId,
    selectedDraftPickupHubId,
    selectedDraftReturnHubId,
    selectedStartDate,
    selectedEndDate,
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);

  const initialCarId = searchParams.get("car") || selectedDraftCarId || "CAR-SG-01";
  const initialHubId = searchParams.get("hub") || selectedDraftPickupHubId || "LOC-SIN-01";
  const initialStartDate = searchParams.get("start") || selectedStartDate || "2026-10-16";
  const initialEndDate = searchParams.get("end") || selectedEndDate || "2026-10-18";
  const initialZeroExcess = searchParams.get("zeroExcess") === "true";
  const initialMalaysiaPass = searchParams.get("malaysiaPass") === "true";

  const [carId, setCarId] = useState<string>(initialCarId);
  const [pickupHubId, setPickupHubId] = useState<string>(initialHubId);
  const [returnHubId, setReturnHubId] = useState<string>(initialHubId);
  const [startDateStr, setStartDateStr] = useState<string>(initialStartDate);
  const [endDateStr, setEndDateStr] = useState<string>(initialEndDate);

  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>(() => {
    const ids: string[] = [];
    if (initialZeroExcess) ids.push("ADD-ZERO-EXCESS");
    if (initialMalaysiaPass) ids.push("ADD-MY-PASS");
    return ids;
  });

  const [driverName, setDriverName] = useState<string>(user.name);
  const [driverEmail, setDriverEmail] = useState<string>(user.email);
  const [driverPhone, setDriverPhone] = useState<string>(user.phone);
  const [driverIdNumber, setDriverIdNumber] = useState<string>(user.nricOrPassport);
  const [driverLicenseClass, setDriverLicenseClass] = useState<string>(user.drivingLicenseClass);

  const [dispatchedBooking, setDispatchedBooking] = useState<BookingRecord | null>(null);

  const car = getVehicleById(carId) || fleet[0];
  const pickupHub = getHubById(pickupHubId) || hubs[0];
  const returnHub = getHubById(returnHubId) || hubs[0];

  const availability = useMemo(() => {
    return checkVehicleAvailability(car.id, pickupHubId, startDateStr, endDateStr);
  }, [car.id, pickupHubId, startDateStr, endDateStr]);

  const quote = useMemo(() => {
    return calculateBookingQuote({
      car,
      startDateStr,
      endDateStr,
      includeZeroExcess: selectedAddOnIds.includes("ADD-ZERO-EXCESS"),
      includeMalaysiaPass:
        car.malaysiaEntryAllowed && selectedAddOnIds.includes("ADD-MY-PASS"),
      selectedAddOnIds,
    });
  }, [car, startDateStr, endDateStr, selectedAddOnIds]);

  const toggleAddOn = (addonId: string) => {
    if (addonId === "ADD-MY-PASS" && !car.malaysiaEntryAllowed) return;
    setSelectedAddOnIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleSingpassRetrieve = () => {
    setDriverName("Marcus Vance");
    setDriverEmail("marcus.vance@vma-atelier.sg");
    setDriverPhone("+65 9123 4567");
    setDriverIdNumber("S8920194D");
    setDriverLicenseClass("Class 3 (Motor Car Qualified - Singapore Traffic Police)");
  };

  const handleFinalDispatch = () => {
    if (!quote) return;
    const allocatedPlate = availability.allocatedPlate || "SKA 8821X";
    const bookingId = `VMA-RES-${Math.floor(5200 + Math.random() * 700)}`;
    const digitalKeyId = `VMA-KEY-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: BookingRecord = {
      bookingId,
      carId: car.id,
      carName: `${car.make} ${car.model}`,
      carImage: car.imageUrl,
      pickupHubId: pickupHub.id,
      pickupHubName: pickupHub.name,
      returnHubId: returnHub.id,
      returnHubName: returnHub.name,
      startDate: startDateStr,
      endDate: endDateStr,
      totalDays: quote.days,
      totalSGD: quote.totalWithGst,
      gstSGD: quote.gstAmount,
      securityDepositSGD: quote.securityDeposit,
      zeroExcessShield: selectedAddOnIds.includes("ADD-ZERO-EXCESS"),
      malaysiaPass: selectedAddOnIds.includes("ADD-MY-PASS"),
      allocatedPlate,
      driverName,
      driverPhone,
      digitalKeyId,
      status: "CONFIRMED_DISPATCHED",
      createdAt: new Date().toISOString().split("T")[0],
    };

    addBooking(newBooking);
    setDispatchedBooking(newBooking);
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Step Tracker */}
      <div className="flex items-center space-x-4 text-xs font-mono text-titanium-400 border-b border-white/[0.08] pb-6">
        {[
          { num: 1, label: "Vehicle & Hub" },
          { num: 2, label: "Protection" },
          { num: 3, label: "Driver Details" },
          { num: 4, label: "Confirmation" },
        ].map((item) => {
          const isActive = currentStep === item.num;
          const isDone = currentStep > item.num;
          return (
            <span
              key={item.num}
              className={`py-1.5 px-3 rounded transition-colors ${
                isActive
                  ? "bg-white text-obsidian-950 font-semibold"
                  : isDone
                  ? "text-emerald-400 bg-emerald-950/40"
                  : "text-titanium-500 bg-white/[0.02]"
              }`}
            >
              {item.num}. {item.label}
            </span>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Step Body */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: VEHICLE & HUB */}
          {currentStep === 1 && (
            <div className="editorial-card rounded-2xl p-6 sm:p-8 space-y-6 border border-sapphire-700/20">
              <div className="border-b border-sapphire-700/20 pb-4">
                <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-ice uppercase block mb-1">
                  STEP 01
                </span>
                <h2 className="text-2xl font-editorial font-bold text-white">
                  Vehicle Selection &amp; Staging Dates
                </h2>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <label className="text-titanium-400 block text-[11px]">COMMISSIONED MODEL</label>
                <select
                  value={carId}
                  onChange={(e) => setCarId(e.target.value)}
                  className="w-full rounded-lg px-3.5 py-2.5 text-xs font-mono bg-[#0B1324] border border-sapphire-700/30 focus:border-cyan-ice"
                >
                  {fleet.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.make} {c.model} &bull; {formatSGD(c.dailyRateSGD)}/day
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="text-titanium-400 block text-[11px]">PICKUP HUB</label>
                  <select
                    value={pickupHubId}
                    onChange={(e) => setPickupHubId(e.target.value)}
                    className="w-full rounded-lg px-3.5 py-2.5 text-xs font-mono bg-[#0B1324] border border-sapphire-700/30 focus:border-cyan-ice"
                  >
                    {hubs.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name.split(" ")[0]} ({h.postalCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-titanium-400 block text-[11px]">RETURN HUB</label>
                  <select
                    value={returnHubId}
                    onChange={(e) => setReturnHubId(e.target.value)}
                    className="w-full rounded-lg px-3.5 py-2.5 text-xs font-mono bg-[#0B1324] border border-sapphire-700/30 focus:border-cyan-ice"
                  >
                    {hubs.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name.split(" ")[0]} ({h.postalCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="text-titanium-400 block text-[11px]">DISPATCH DATE</label>
                  <input
                    type="date"
                    value={startDateStr}
                    onChange={(e) => setStartDateStr(e.target.value)}
                    min="2026-10-15"
                    max="2026-10-22"
                    className="w-full rounded-lg px-3.5 py-2.5 text-xs font-mono bg-[#0B1324] border border-sapphire-700/30 focus:border-cyan-ice"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-titanium-400 block text-[11px]">RETURN DATE</label>
                  <input
                    type="date"
                    value={endDateStr}
                    onChange={(e) => setEndDateStr(e.target.value)}
                    min={startDateStr}
                    max="2026-10-22"
                    className="w-full rounded-lg px-3.5 py-2.5 text-xs font-mono bg-[#0B1324] border border-sapphire-700/30 focus:border-cyan-ice"
                  />
                </div>
              </div>

              {/* Real Availability Feedback */}
              {availability.isAvailable ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Staging verified &bull; Assigned Plate: {availability.allocatedPlate}</span>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs font-mono text-rose-400 flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{availability.reason}</span>
                </div>
              )}

              <div className="flex justify-end pt-3">
                <button
                  disabled={!availability.isAvailable}
                  onClick={() => setCurrentStep(2)}
                  className={`px-6 py-3 rounded-lg font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                    availability.isAvailable
                      ? "bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 shadow-[0_0_15px_rgba(0,229,255,0.25)]"
                      : "bg-white/[0.05] text-titanium-500 cursor-not-allowed"
                  }`}
                >
                  Proceed to Protection Options
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ADD-ONS */}
          {currentStep === 2 && (
            <div className="editorial-card rounded-2xl p-6 sm:p-8 space-y-6 border border-sapphire-700/20">
              <div className="border-b border-sapphire-700/20 pb-4">
                <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-ice uppercase block mb-1">
                  STEP 02
                </span>
                <h2 className="text-2xl font-editorial font-bold text-white">
                  Protection &amp; Lifestyle Add-ons
                </h2>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {addOns.map((addon) => {
                  const isSelected = selectedAddOnIds.includes(addon.id);
                  const isBlocked = addon.id === "ADD-MY-PASS" && !car.malaysiaEntryAllowed;

                  return (
                    <label
                      key={addon.id}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        isBlocked
                          ? "opacity-40 cursor-not-allowed bg-black/20 border-white/[0.04]"
                          : isSelected
                          ? "border-cyan-ice/70 bg-sapphire-900/40 shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                          : "border-sapphire-700/20 bg-sapphire-950/30 hover:border-sapphire-600/40"
                      }`}
                    >
                      <div className="pr-4">
                        <div className="text-white font-medium text-sm font-sans">{addon.name}</div>
                        <p className="text-xs text-titanium-400 font-sans mt-0.5 leading-relaxed">
                          {addon.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-white font-semibold">
                          +{formatSGD(addon.dailyCostSGD)}/d
                        </span>
                        {!isBlocked && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleAddOn(addon.id)}
                            className="accent-cyan-ice block ml-auto mt-2"
                          />
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="flex justify-between pt-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded bg-sapphire-900/60 hover:bg-sapphire-800/80 text-white text-xs font-mono border border-sapphire-700/20 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-lg bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 font-mono text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-colors"
                >
                  Continue to Driver Verification
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DRIVER PARTICULARS */}
          {currentStep === 3 && (
            <div className="editorial-card rounded-2xl p-6 sm:p-8 space-y-6 border border-sapphire-700/20">
              <div className="flex justify-between items-center border-b border-sapphire-700/20 pb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-ice uppercase block mb-1">
                    STEP 03
                  </span>
                  <h2 className="text-2xl font-editorial font-bold text-white">
                    Driver Verification &amp; License
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleSingpassRetrieve}
                  className="px-4 py-2 rounded bg-rose-950/80 text-rose-300 border border-rose-500/20 text-xs font-mono flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Sync via Singpass</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="text-titanium-400 block text-[11px]">FULL NAME AS PER NRIC/PASSPORT</label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full rounded-lg px-3.5 py-2.5 text-xs font-mono bg-[#0B1324] border border-sapphire-700/30 focus:border-cyan-ice"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-titanium-400 block text-[11px]">SINGAPORE NRIC / PASSPORT NO.</label>
                  <input
                    type="text"
                    value={driverIdNumber}
                    onChange={(e) => setDriverIdNumber(e.target.value)}
                    className="w-full rounded-lg px-3.5 py-2.5 text-xs font-mono bg-[#0B1324] border border-sapphire-700/30 focus:border-cyan-ice"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-titanium-400 block text-[11px]">MOBILE CONTACT (+65 FORMAT)</label>
                  <input
                    type="text"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full rounded-lg px-3.5 py-2.5 text-xs font-mono bg-[#0B1324] border border-sapphire-700/30 focus:border-cyan-ice"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-titanium-400 block text-[11px]">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    value={driverEmail}
                    onChange={(e) => setDriverEmail(e.target.value)}
                    className="w-full rounded-lg px-3.5 py-2.5 text-xs font-mono bg-[#0B1324] border border-sapphire-700/30 focus:border-cyan-ice"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-titanium-400 block text-[11px]">TRAFFIC POLICE LICENSE QUALIFICATION</label>
                  <input
                    type="text"
                    value={driverLicenseClass}
                    onChange={(e) => setDriverLicenseClass(e.target.value)}
                    className="w-full rounded-lg px-3.5 py-2.5 text-xs font-mono bg-[#0B1324] border border-sapphire-700/30 focus:border-cyan-ice"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 rounded bg-sapphire-900/60 hover:bg-sapphire-800/80 text-white text-xs font-mono border border-sapphire-700/20 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleFinalDispatch}
                  className="px-6 py-3 rounded-lg bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 font-mono text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-colors"
                >
                  Confirm &amp; Issue Digital Key
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION */}
          {currentStep === 4 && dispatchedBooking && (
            <div className="editorial-card rounded-2xl p-8 sm:p-10 space-y-6 text-center border border-sapphire-700/20">
              <div className="inline-flex p-3 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h2 className="text-3xl font-editorial font-bold text-white">
                  Commission Confirmed
                </h2>
                <p className="text-xs font-mono text-titanium-400">
                  Ref: {dispatchedBooking.bookingId} &bull; Staged at {dispatchedBooking.pickupHubName}
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#060A12]/80 border border-sapphire-700/30 max-w-sm mx-auto space-y-2 font-mono shadow-[0_0_20px_rgba(0,10,30,0.6)]">
                <span className="text-[10px] text-titanium-500 uppercase tracking-widest">
                  ASSIGNED SINGAPORE REGISTRATION
                </span>
                <div className="text-3xl font-black text-cyan-ice tracking-widest">
                  {dispatchedBooking.allocatedPlate}
                </div>
                <div className="text-xs text-cyan-ice/80 pt-1">
                  Contactless Key: {dispatchedBooking.digitalKeyId}
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-3">
                <Link
                  href="/profile"
                  className="px-6 py-3 rounded-lg bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 font-mono text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-colors"
                >
                  View in Personal Garage
                </Link>
                <Link
                  href="/fleet"
                  className="px-6 py-3 rounded-lg bg-sapphire-900/60 hover:bg-sapphire-800/80 text-white font-mono text-xs border border-sapphire-700/20 transition-colors"
                >
                  Return to Fleet
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Columns: Summary Ledger */}
        <div className="lg:col-span-4">
          <div className="editorial-card rounded-2xl p-6 space-y-5 sticky top-24 font-mono text-xs border border-sapphire-700/20 shadow-[0_10px_35px_rgba(0,10,30,0.6)]">
            <h3 className="font-editorial text-base font-semibold text-white border-b border-sapphire-700/20 pb-3">
              Reservation Summary
            </h3>

            <div className="flex items-center gap-3">
              <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-black/30 shrink-0">
                <Image
                  src={car.imageUrl}
                  alt={car.model}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{car.make} {car.model}</div>
                <div className="text-[11px] text-titanium-400">{formatSGD(car.dailyRateSGD)} /day</div>
              </div>
            </div>

            <div className="space-y-1.5 text-titanium-300 text-xs pt-3 border-t border-sapphire-700/20">
              <div>Pickup: {pickupHub.name.split(" ")[0]} ({pickupHub.postalCode})</div>
              <div>Period: {startDateStr} to {endDateStr} ({quote?.days}d)</div>
            </div>

            {quote && (
              <div className="space-y-2 pt-3 border-t border-sapphire-700/20">
                <div className="flex justify-between text-titanium-400">
                  <span>Base Rate:</span>
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
                    <span>Malaysia VEP:</span>
                    <span>+{formatSGD(quote.malaysiaSurchargeTotal)}</span>
                  </div>
                )}

                {quote.addOnsTotal > 0 && (
                  <div className="flex justify-between text-titanium-400">
                    <span>Add-ons:</span>
                    <span>+{formatSGD(quote.addOnsTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-titanium-400 pt-1 border-t border-sapphire-700/20">
                  <span>GST (9%):</span>
                  <span>+{formatSGD(quote.gstAmount)}</span>
                </div>

                <div className="flex justify-between text-sm font-semibold text-white pt-1 border-t border-sapphire-700/30">
                  <span>Total Payable:</span>
                  <span className="text-cyan-ice font-bold">{formatSGD(quote.totalWithGst)}</span>
                </div>

                <div className="text-[10px] text-titanium-500 pt-1">
                  Refundable Deposit: {formatSGD(quote.securityDeposit)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InstantDispatchBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen max-w-7xl mx-auto px-4 py-20 text-center font-mono text-xs text-titanium-400">
          Loading reservation protocol...
        </div>
      }
    >
      <InstantDispatchBookingContent />
    </Suspense>
  );
}
