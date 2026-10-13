"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  KeyRound,
  Sparkles,
  Phone,
  CheckCircle2,
  Send,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { getConciergeTeam, formatSGD } from "@/lib/dataset";

export default function MemberProfileCommandCenterPage() {
  const { user, setUser, avatarRoster, cycleProfileAvatar, bookings } = useApp();
  const concierges = getConciergeTeam();

  const [activeTab, setActiveTab] = useState<"GARAGE" | "LOGS" | "CONCIERGE" | "SETTINGS">(
    "GARAGE"
  );
  const [notification, setNotification] = useState<string | null>(null);

  const [activeStaffId, setActiveStaffId] = useState<string | null>(null);
  const [msgInput, setMsgInput] = useState("");
  const [sentNotice, setSentNotice] = useState(false);

  const handleAvatarRefresh = (label: string) => {
    cycleProfileAvatar();
    setNotification(`Updated profile portrait: ${label}`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    setSentNotice(true);
    setMsgInput("");
    setTimeout(() => setSentNotice(false), 3000);
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* 1. PERSONAL GARAGE HEADER */}
      <div className="editorial-card rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-white/20">
            <Image
              src={user.avatarUrl}
              alt={user.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-ice uppercase font-semibold">
                {user.tier.replace(/_/g, " ")}
              </span>
              <span className="text-titanium-500 text-xs">&bull;</span>
              <span className="text-xs font-mono text-titanium-400">Singapore LTA Verified</span>
            </div>

            <h1 className="text-3xl font-editorial font-bold text-white tracking-tight">
              {user.name}
            </h1>

            <p className="text-xs text-titanium-400 font-mono">
              {user.title} &bull; {user.email}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
          <div className="px-4 py-2.5 rounded-xl bg-sapphire-950/40 border border-sapphire-700/20 text-center">
            <span className="text-[10px] text-titanium-500 uppercase block">SOVEREIGN BALANCE</span>
            <span className="text-sm font-semibold text-white">{user.loyaltyPoints.toLocaleString()} PTS</span>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-sapphire-950/40 border border-sapphire-700/20 text-center">
            <span className="text-[10px] text-titanium-500 uppercase block">RECORDED TRIPS</span>
            <span className="text-sm font-semibold text-white">{user.totalTripsLogged} EXPEDITIONS</span>
          </div>

          <button
            onClick={() => handleAvatarRefresh("New Executive Portrait")}
            className="px-4 py-2.5 rounded-xl bg-sapphire-900/60 hover:bg-sapphire-800/80 text-xs text-white font-mono border border-sapphire-700/20 transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-ice" />
            <span>Generate New Picture</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-cyan-ice/10 border border-cyan-ice/30 text-xs font-mono text-cyan-ice flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 2. TABS */}
      <div className="flex flex-wrap gap-2 border-b border-sapphire-700/20 pb-4 text-xs font-mono">
        {[
          { id: "GARAGE", label: `Personal Garage (${bookings.length})` },
          { id: "LOGS", label: "Toll & Charge Receipts" },
          { id: "CONCIERGE", label: "Concierge Directors" },
          { id: "SETTINGS", label: "Avatar & Identity Settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-cyan-ice text-sapphire-950 font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]"
                : "text-titanium-400 hover:text-white bg-sapphire-900/40 border border-sapphire-700/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: GARAGE RESERVATIONS */}
      {activeTab === "GARAGE" && (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.bookingId}
              className="editorial-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 font-mono text-xs border border-sapphire-700/20"
            >
              <div className="flex items-center space-x-5">
                <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-[#111C35] shrink-0 border border-sapphire-700/20">
                  <Image src={b.carImage} alt={b.carName} fill className="object-cover" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-titanium-400">{b.bookingId}</span>
                  <h3 className="text-base font-editorial font-semibold text-white">
                    {b.carName}
                  </h3>
                  <div className="text-[11px] text-titanium-400 flex items-center gap-3">
                    <span>{b.pickupHubName.split(" ")[0]} Hub</span>
                    <span>&bull;</span>
                    <span>{b.startDate} to {b.endDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-8">
                <div>
                  <span className="text-[10px] text-titanium-500 uppercase block">ASSIGNED PLATE</span>
                  <span className="text-white font-bold text-sm">{b.allocatedPlate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-titanium-500 uppercase block">NFC DIGITAL KEY</span>
                  <span className="text-cyan-ice font-medium">{b.digitalKeyId}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold text-sm block">{formatSGD(b.totalSGD)}</span>
                  <span className="text-[10px] text-titanium-500">Incl. 9% GST</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: TOLL & CHARGE LOGS */}
      {activeTab === "LOGS" && (
        <div className="editorial-card rounded-2xl p-6 space-y-4 font-mono text-xs border border-sapphire-700/20">
          <h2 className="text-sm font-editorial font-semibold text-white border-b border-sapphire-700/20 pb-3">
            Satellite Toll &amp; SP Mobility Charging History
          </h2>
          <div className="space-y-2.5 text-titanium-300">
            <div className="flex justify-between p-3 rounded-lg bg-sapphire-950/40 border border-sapphire-700/20">
              <div>
                <div className="text-white">SP Mobility 150kW DC Fast Hypercharge</div>
                <div className="text-[11px] text-titanium-400">Marina Bay Financial Centre Tower 3 &bull; 42.8 kWh</div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">S$ 27.82</div>
                <div className="text-[10px] text-emerald-400">Complimentary Network Card</div>
              </div>
            </div>

            <div className="flex justify-between p-3 rounded-lg bg-sapphire-950/40 border border-sapphire-700/20">
              <div>
                <div className="text-white">ERP 2.0 GNSS Satellite Gantry 48</div>
                <div className="text-[11px] text-titanium-400">Marina Coastal Expressway (MCE Eastbound)</div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">S$ 2.00</div>
                <div className="text-[10px] text-titanium-400">CashCard Auto-settled</div>
              </div>
            </div>

            <div className="flex justify-between p-3 rounded-lg bg-sapphire-950/40 border border-sapphire-700/20">
              <div>
                <div className="text-white">Malaysia Touch &apos;n Go Toll Plaza</div>
                <div className="text-[11px] text-titanium-400">Tuas Second Link Malaysia Customs</div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">S$ 6.20 (MYR 20.00)</div>
                <div className="text-[10px] text-emerald-400">Pre-loaded Transit Pass</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONCIERGE DIRECTORS */}
      {activeTab === "CONCIERGE" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {concierges.map((staff) => (
              <div
                key={staff.id}
                className="editorial-card rounded-2xl p-6 space-y-4 font-mono text-xs flex flex-col justify-between border border-sapphire-700/20"
              >
                <div className="space-y-3">
                  <div className="relative w-full h-48 rounded-xl overflow-hidden bg-[#111C35] border border-sapphire-700/20">
                    <Image src={staff.avatarUrl} alt={staff.fullName} fill className="object-cover object-top" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-base font-semibold text-white">{staff.fullName}</h3>
                    <div className="text-[11px] text-cyan-ice mt-0.5">{staff.role.split("&")[0]}</div>
                  </div>
                  <p className="text-xs text-titanium-400 font-sans leading-relaxed">
                    {staff.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-sapphire-700/20 space-y-2">
                  <div className="text-[11px] text-titanium-300">
                    Direct Line: <span className="text-white font-semibold">{staff.phone}</span>
                  </div>
                  <button
                    onClick={() => setActiveStaffId(staff.id)}
                    className="w-full py-2 rounded-lg bg-sapphire-900/60 hover:bg-sapphire-800/80 text-white text-xs border border-sapphire-700/20 transition-colors"
                  >
                    Direct Message
                  </button>
                </div>
              </div>
            ))}
          </div>

          {activeStaffId && (
            <form onSubmit={handleSendMsg} className="editorial-card rounded-2xl p-6 space-y-4 font-mono text-xs border border-sapphire-700/20">
              <div className="flex justify-between items-center text-white font-semibold">
                <span>Dispatch Request to Concierge Director</span>
                <button
                  type="button"
                  onClick={() => setActiveStaffId(null)}
                  className="text-titanium-400 hover:text-white"
                >
                  &times;
                </button>
              </div>
              <input
                type="text"
                placeholder="Enter flight arrival details or valet staging request..."
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                className="w-full rounded-lg px-3.5 py-2.5 text-xs font-mono bg-[#0B1324] border border-sapphire-700/30 focus:border-cyan-ice"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-cyan-ice text-sapphire-950 font-semibold text-xs shadow-[0_0_12px_rgba(0,229,255,0.25)]"
              >
                Transmit Note
              </button>
              {sentNotice && (
                <span className="text-emerald-400 text-xs ml-3">
                  Note dispatched to concierge director.
                </span>
              )}
            </form>
          )}
        </div>
      )}

      {/* TAB 4: AVATAR & IDENTITY SETTINGS */}
      {activeTab === "SETTINGS" && (
        <div className="editorial-card rounded-2xl p-6 sm:p-8 space-y-8 font-mono text-xs border border-sapphire-700/20">
          <div className="border-b border-sapphire-700/20 pb-4">
            <h2 className="text-lg font-editorial font-semibold text-white">
              Executive Driver Identity Management
            </h2>
            <p className="text-xs text-titanium-400 font-sans mt-1">
              Select or generate high-resolution editorial portraits for your Sovereign account.
            </p>
          </div>

          {/* Interactive Trigger Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleAvatarRefresh("generate new profile picture")}
              className="px-5 py-2.5 rounded-lg bg-cyan-ice text-sapphire-950 font-semibold text-xs hover:bg-cyan-glow shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-colors"
            >
              generate new profile picture
            </button>
            <button
              onClick={() => handleAvatarRefresh("please give me new profile picture")}
              className="px-5 py-2.5 rounded-lg bg-sapphire-900/60 hover:bg-sapphire-800/80 text-white text-xs border border-sapphire-700/20 transition-colors"
            >
              please give me new profile picture
            </button>
          </div>

          {/* Available Roster */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            {avatarRoster.map((av, i) => {
              const isSelected = user.avatarUrl === av.url;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setUser((prev) => ({
                      ...prev,
                      avatarUrl: av.url,
                      name: av.name,
                      title: av.desc,
                    }));
                    setNotification(`Active identity switched to ${av.name}`);
                  }}
                  className={`p-4 rounded-xl border text-left flex items-center space-x-4 transition-colors ${
                    isSelected
                      ? "border-cyan-ice bg-sapphire-900/40 shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                      : "border-sapphire-700/20 bg-sapphire-950/30 hover:border-sapphire-600/40"
                  }`}
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-sapphire-700/30">
                    <Image src={av.url} alt={av.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-editorial font-semibold text-white text-sm">{av.name}</div>
                    <div className="text-[11px] text-titanium-400 font-sans">{av.desc}</div>
                    {isSelected && (
                      <span className="text-[10px] text-cyan-ice block mt-1 font-semibold">
                        &bull; Active Driver
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Account Profile Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/[0.06]">
            <div>
              <label className="text-titanium-400 block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full rounded-lg px-3.5 py-2.5 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-titanium-400 block mb-1">Singapore Mobile</label>
              <input
                type="text"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                className="w-full rounded-lg px-3.5 py-2.5 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-titanium-400 block mb-1">Email Address</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full rounded-lg px-3.5 py-2.5 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-titanium-400 block mb-1">Singpass NRIC</label>
              <input
                type="text"
                disabled
                value={user.nricOrPassport}
                className="w-full rounded-lg px-3.5 py-2.5 text-xs font-mono opacity-50"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
