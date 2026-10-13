"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  Layers,
  Users,
  DollarSign,
  ClipboardList,
  BatteryCharging,
  Gauge,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  Clock,
  Car,
  ChevronRight,
  RefreshCw,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { getFleet, getHubs, formatSGD } from "@/lib/dataset";
import {
  useApp,
  FleetInventoryItem,
  CRMClientRecord,
  CRMClientNote,
  BookingRecord,
} from "@/lib/store";

type ActiveTab = "TELEMETRY" | "INVENTORY" | "CRM" | "ERP" | "DISPATCH";

export default function OperationsHQPage() {
  const fleet = getFleet();
  const hubs = getHubs();
  const {
    inventory,
    updateInventoryStatus,
    transferVehicleHub,
    clients,
    addClientNote,
    updateClientTier,
    erpDeductions,
    bookings,
    updateBookingStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<ActiveTab>("TELEMETRY");
  const [notification, setNotification] = useState<string | null>(null);

  // Filters for IMS
  const [imsHubFilter, setImsHubFilter] = useState<string>("ALL");
  const [imsStatusFilter, setImsStatusFilter] = useState<string>("ALL");

  // Filters for CRM
  const [crmSearch, setCrmSearch] = useState<string>("");
  const [crmTierFilter, setCrmTierFilter] = useState<string>("ALL");
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || "");
  const [newNoteText, setNewNoteText] = useState<string>("");
  const [newNoteTag, setNewNoteTag] = useState<CRMClientNote["tag"]>("PREFERENCE");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Financial calculations for ERP
  const financialSummary = useMemo(() => {
    const totalBookedRevenue = bookings.reduce((sum, b) => sum + b.totalSGD, 0);
    const totalGstCollected = bookings.reduce((sum, b) => sum + b.gstSGD, 0);
    const netRevenueBeforeGst = totalBookedRevenue - totalGstCollected;
    const totalSecurityDepositHeld = bookings
      .filter((b) => b.status !== "COMPLETED")
      .reduce((sum, b) => sum + b.securityDepositSGD, 0);
    const totalErpTollDeductions = erpDeductions.reduce((sum, d) => sum + d.amountSGD, 0);

    return {
      totalBookedRevenue,
      totalGstCollected,
      netRevenueBeforeGst,
      totalSecurityDepositHeld,
      totalErpTollDeductions,
      operatingMarginPct: 42.8,
    };
  }, [bookings, erpDeductions]);

  // Selected client for CRM details
  const activeClient = useMemo(() => {
    return clients.find((c) => c.id === selectedClientId) || clients[0];
  }, [clients, selectedClientId]);

  // Filtered inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      if (imsHubFilter !== "ALL" && item.currentHubId !== imsHubFilter) return false;
      if (imsStatusFilter !== "ALL" && item.status !== imsStatusFilter) return false;
      return true;
    });
  }, [inventory, imsHubFilter, imsStatusFilter]);

  // Filtered CRM clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(crmSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(crmSearch.toLowerCase()) ||
        c.nricOrPassport.toLowerCase().includes(crmSearch.toLowerCase());
      const matchTier = crmTierFilter === "ALL" || c.tier === crmTierFilter;
      return matchSearch && matchTier;
    });
  }, [clients, crmSearch, crmTierFilter]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeClient) return;
    addClientNote(activeClient.id, newNoteText.trim(), "Concierge Operations", newNoteTag);
    setNewNoteText("");
    showNotification(`Concierge VIP note recorded for ${activeClient.name}`);
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 selection:bg-cyan-ice selection:text-sapphire-950 font-sans">
      {/* =========================================================================
          OPERATIONAL HQ HEADER & STAT RIBBON
      ========================================================================== */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sapphire-700/20 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-cyan-ice uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-ice animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.8)]"></span>
              <span>VELOCE MARINA SINGAPORE &bull; ENTERPRISE OPERATIONS SUITE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-white tracking-tight">
              Atelier Operations HQ
            </h1>
            <p className="text-xs text-titanium-400 font-mono">
              Live Relational ERP, Fleet Inventory Management (IMS), Telemetry &amp; VIP CRM Systems
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sapphire-900/60 border border-sapphire-700/30 text-xs font-mono text-titanium-300">
              <Radio className="w-3.5 h-3.5 text-cyan-ice" />
              <span>ERP 2.0 GNSS AUDIT v4.2</span>
            </span>
            <button
              onClick={() => showNotification("Telemetry sync refreshed across all 6 Singapore hubs")}
              className="p-2 rounded-lg bg-sapphire-900/60 hover:bg-sapphire-800 border border-sapphire-700/30 text-titanium-300 hover:text-white transition-colors"
              title="Refresh Telemetry Matrix"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Key Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="editorial-card rounded-xl p-4 space-y-1 border border-sapphire-700/20">
            <div className="text-[10px] font-mono text-titanium-400 uppercase tracking-wider">Fleet Units</div>
            <div className="text-xl font-editorial font-bold text-white tabular-nums">
              {inventory.length} <span className="text-xs text-titanium-500 font-normal">Vehicles</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span>{inventory.filter((i) => i.status === "AVAILABLE").length} Staged Ready</span>
            </div>
          </div>

          <div className="editorial-card rounded-xl p-4 space-y-1 border border-sapphire-700/20">
            <div className="text-[10px] font-mono text-titanium-400 uppercase tracking-wider">Active Road Units</div>
            <div className="text-xl font-editorial font-bold text-cyan-ice tabular-nums">
              {inventory.filter((i) => i.status === "ON_ROAD").length} <span className="text-xs text-titanium-500 font-normal">Dispatched</span>
            </div>
            <div className="text-[10px] font-mono text-titanium-400">
              {((inventory.filter((i) => i.status === "ON_ROAD").length / inventory.length) * 100).toFixed(0)}% Utilization
            </div>
          </div>

          <div className="editorial-card rounded-xl p-4 space-y-1 border border-sapphire-700/20">
            <div className="text-[10px] font-mono text-titanium-400 uppercase tracking-wider">Booked Revenue</div>
            <div className="text-xl font-editorial font-bold text-white tabular-nums">
              {formatSGD(financialSummary.totalBookedRevenue)}
            </div>
            <div className="text-[10px] font-mono text-titanium-400">GST 9% Included</div>
          </div>

          <div className="editorial-card rounded-xl p-4 space-y-1 border border-sapphire-700/20">
            <div className="text-[10px] font-mono text-titanium-400 uppercase tracking-wider">GST Accrued</div>
            <div className="text-xl font-editorial font-bold text-white tabular-nums">
              {formatSGD(financialSummary.totalGstCollected)}
            </div>
            <div className="text-[10px] font-mono text-emerald-400">Statutory IRAS 9%</div>
          </div>

          <div className="editorial-card rounded-xl p-4 space-y-1 border border-sapphire-700/20">
            <div className="text-[10px] font-mono text-titanium-400 uppercase tracking-wider">Escrow Deposits</div>
            <div className="text-xl font-editorial font-bold text-white tabular-nums">
              {formatSGD(financialSummary.totalSecurityDepositHeld)}
            </div>
            <div className="text-[10px] font-mono text-titanium-400">Zero-Excess Protected</div>
          </div>

          <div className="editorial-card rounded-xl p-4 space-y-1 border border-sapphire-700/20">
            <div className="text-[10px] font-mono text-titanium-400 uppercase tracking-wider">ERP 2.0 Deductions</div>
            <div className="text-xl font-editorial font-bold text-white tabular-nums">
              {formatSGD(financialSummary.totalErpTollDeductions)}
            </div>
            <div className="text-[10px] font-mono text-cyan-ice">OBU GNSS Synced</div>
          </div>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div className="p-3.5 rounded-xl bg-cyan-ice/10 border border-cyan-ice/30 text-xs font-mono text-cyan-ice flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-ice" />
              <span>{notification}</span>
            </span>
            <button onClick={() => setNotification(null)} className="text-titanium-400 hover:text-white">
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-sapphire-700/20 pb-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab("TELEMETRY")}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "TELEMETRY"
                ? "bg-cyan-ice text-sapphire-950 font-semibold shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                : "bg-sapphire-900/40 text-titanium-400 hover:text-white border border-sapphire-700/20"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Command Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab("INVENTORY")}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "INVENTORY"
                ? "bg-cyan-ice text-sapphire-950 font-semibold shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                : "bg-sapphire-900/40 text-titanium-400 hover:text-white border border-sapphire-700/20"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Fleet Inventory (IMS)</span>
          </button>

          <button
            onClick={() => setActiveTab("CRM")}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "CRM"
                ? "bg-cyan-ice text-sapphire-950 font-semibold shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                : "bg-sapphire-900/40 text-titanium-400 hover:text-white border border-sapphire-700/20"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>VIP Client CRM</span>
          </button>

          <button
            onClick={() => setActiveTab("ERP")}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "ERP"
                ? "bg-cyan-ice text-sapphire-950 font-semibold shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                : "bg-sapphire-900/40 text-titanium-400 hover:text-white border border-sapphire-700/20"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>ERP &amp; Financials</span>
          </button>

          <button
            onClick={() => setActiveTab("DISPATCH")}
            className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "DISPATCH"
                ? "bg-cyan-ice text-sapphire-950 font-semibold shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                : "bg-sapphire-900/40 text-titanium-400 hover:text-white border border-sapphire-700/20"
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Dispatch Manifest ({bookings.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: COMMAND TELEMETRY (EXECUTIVE DASHBOARD)
      ========================================================================== */}
      {activeTab === "TELEMETRY" && (
        <div className="space-y-8 animate-fadeIn font-mono text-xs">
          {/* Staging Hubs Distribution Matrix */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-sapphire-700/20 pb-3">
              <h2 className="text-base font-editorial font-semibold text-white">
                Singapore Hub Staging &amp; Valet Bay Telemetry
              </h2>
              <span className="text-[11px] text-cyan-ice uppercase">6 Certified Facilities Active</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hubs.map((hub) => {
                const hubVehicles = inventory.filter((item) => item.currentHubId === hub.id);
                return (
                  <div
                    key={hub.id}
                    className="editorial-card rounded-2xl p-5 space-y-4 border border-sapphire-700/20 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-cyan-ice uppercase tracking-wider">{hub.district}</span>
                        <span className="text-titanium-500">{hub.postalCode}</span>
                      </div>
                      <h3 className="font-editorial text-base font-semibold text-white">{hub.name}</h3>
                      <p className="text-titanium-400 text-[11px] font-sans">{hub.address}</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-sapphire-700/20">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-titanium-400">Allocated Units:</span>
                        <span className="font-bold text-white tabular-nums">{hubVehicles.length} Vehicles</span>
                      </div>

                      <div className="space-y-1.5">
                        {hubVehicles.length === 0 ? (
                          <span className="text-[10px] text-titanium-500 italic">No vehicles currently staged</span>
                        ) : (
                          hubVehicles.map((hv) => {
                            const car = fleet.find((c) => c.id === hv.carId);
                            return (
                              <div
                                key={hv.carId}
                                className="flex items-center justify-between px-2.5 py-1.5 rounded bg-black/40 border border-sapphire-700/20 text-[11px]"
                              >
                                <span className="text-titanium-200">
                                  {car?.make} {car?.model.split(" ")[0]}
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-semibold ${
                                    hv.status === "AVAILABLE"
                                      ? "bg-emerald-500/20 text-emerald-400"
                                      : hv.status === "ON_ROAD"
                                      ? "bg-cyan-500/20 text-cyan-300"
                                      : hv.status === "FAST_CHARGING"
                                      ? "bg-blue-500/20 text-blue-300"
                                      : "bg-amber-500/20 text-amber-300"
                                  }`}
                                >
                                  {hv.status.replace("_", " ")}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Infrastructure Health Grids: EV Charging & Road Network */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* EV Charging & Power Grid */}
            <div className="editorial-card rounded-2xl p-6 space-y-4 border border-sapphire-700/20">
              <div className="flex items-center justify-between border-b border-sapphire-700/20 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-ice" />
                  <h3 className="font-editorial text-base font-semibold text-white">
                    SP Mobility &amp; Shell Fast-Charging Grid
                  </h3>
                </div>
                <span className="text-emerald-400 text-[11px]">Grid Nominal (230V/400V)</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-black/30 border border-sapphire-700/20 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Changi T3 Jewel Hub - 150kW DC CCS2</div>
                    <div className="text-[10px] text-titanium-400">Bay 1 &bull; Porsche Taycan 4S @ 94% SoC</div>
                  </div>
                  <span className="text-emerald-400 font-bold tabular-nums">Idle / 100% Ready</span>
                </div>

                <div className="p-3 rounded-xl bg-black/30 border border-sapphire-700/20 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">One-North Fusionopolis - 150kW Supercharger</div>
                    <div className="text-[10px] text-titanium-400">Bay 3 &bull; Tesla Model Y @ 62% SoC (Drawing 85kW)</div>
                  </div>
                  <span className="text-cyan-ice font-bold tabular-nums">Active Charge &bull; 18m left</span>
                </div>

                <div className="p-3 rounded-xl bg-black/30 border border-sapphire-700/20 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Sentosa Cove Marina Bay - 22kW AC Destination</div>
                    <div className="text-[10px] text-titanium-400">Bay 1 &bull; MINI Cooper SE @ 85% SoC</div>
                  </div>
                  <span className="text-emerald-400 font-bold tabular-nums">Trickle Ready</span>
                </div>
              </div>
            </div>

            {/* Singapore-Malaysia Border Transit Telemetry */}
            <div className="editorial-card rounded-2xl p-6 space-y-4 border border-sapphire-700/20">
              <div className="flex items-center justify-between border-b border-sapphire-700/20 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-ice" />
                  <h3 className="font-editorial text-base font-semibold text-white">
                    Cross-Border Causeway &amp; VEP Traffic Stream
                  </h3>
                </div>
                <span className="text-cyan-ice text-[11px]">VEP RFID Live Sync</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-black/30 border border-sapphire-700/20 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Woodlands Checkpoint &rarr; JB Customs</div>
                    <div className="text-[10px] text-titanium-400">RFID Auto-Clearance Lane 3 &bull; Normal Flow</div>
                  </div>
                  <span className="text-emerald-400 font-bold tabular-nums">18 Mins Wait</span>
                </div>

                <div className="p-3 rounded-xl bg-black/30 border border-sapphire-700/20 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Tuas Second Link &rarr; Gelang Patah</div>
                    <div className="text-[10px] text-titanium-400">Recommended for High-Performance Supercars</div>
                  </div>
                  <span className="text-cyan-ice font-bold tabular-nums">12 Mins Wait</span>
                </div>

                <div className="p-3 rounded-xl bg-black/30 border border-sapphire-700/20 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Touch &apos;n Go NFC Float Vault</div>
                    <div className="text-[10px] text-titanium-400">Pre-issued Physical Cards Active: 12 Units</div>
                  </div>
                  <span className="text-white font-bold tabular-nums">MYR 6,000 Total Float</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: FLEET INVENTORY MANAGEMENT SYSTEM (IMS)
      ========================================================================== */}
      {activeTab === "INVENTORY" && (
        <div className="space-y-6 animate-fadeIn font-mono text-xs">
          {/* IMS Controls & Filters */}
          <div className="editorial-card rounded-2xl p-5 border border-sapphire-700/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-titanium-400 uppercase text-[11px] flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Filter Hub:
              </span>
              <select
                value={imsHubFilter}
                onChange={(e) => setImsHubFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#0B1324] border border-sapphire-700/30 text-white text-xs outline-none"
              >
                <option value="ALL">All Hubs ({hubs.length})</option>
                {hubs.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>

              <span className="text-titanium-400 uppercase text-[11px] ml-2">Status:</span>
              <select
                value={imsStatusFilter}
                onChange={(e) => setImsStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#0B1324] border border-sapphire-700/30 text-white text-xs outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="AVAILABLE">AVAILABLE (Staged)</option>
                <option value="ON_ROAD">ON_ROAD (Dispatched)</option>
                <option value="FAST_CHARGING">FAST_CHARGING</option>
                <option value="MAINTENANCE_BAY">MAINTENANCE_BAY</option>
              </select>
            </div>

            <div className="text-titanium-400 text-[11px]">
              Showing <span className="text-white font-bold">{filteredInventory.length}</span> of {inventory.length} vehicles
            </div>
          </div>

          {/* Inventory Table */}
          <div className="editorial-card rounded-2xl border border-sapphire-700/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-sapphire-700/30 bg-black/40 text-[10px] text-titanium-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Vehicle Specification</th>
                    <th className="py-3.5 px-4">Reg Plate</th>
                    <th className="py-3.5 px-4">Current Hub Location</th>
                    <th className="py-3.5 px-4">Telemetry / SoC</th>
                    <th className="py-3.5 px-4">Odometer &amp; Tires</th>
                    <th className="py-3.5 px-4">Operational Status</th>
                    <th className="py-3.5 px-4 text-right">Quick Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sapphire-700/20 text-xs">
                  {filteredInventory.map((item) => {
                    const car = fleet.find((c) => c.id === item.carId);
                    const currentHub = hubs.find((h) => h.id === item.currentHubId);

                    return (
                      <tr key={item.carId} className="hover:bg-white/[0.02] transition-colors">
                        {/* Vehicle */}
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0 border border-sapphire-700/30">
                              {car?.imageUrl && (
                                <Image src={car.imageUrl} alt={car.model} fill className="object-cover" />
                              )}
                            </div>
                            <div>
                              <div className="font-editorial font-semibold text-white">
                                {car?.make} {car?.model}
                              </div>
                              <div className="text-[10px] text-titanium-400">{car?.category}</div>
                            </div>
                          </div>
                        </td>

                        {/* Plate */}
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded bg-black/60 border border-white/20 font-bold text-white tracking-widest text-[11px]">
                            {item.plateNumber}
                          </span>
                        </td>

                        {/* Hub Selector */}
                        <td className="py-4 px-4">
                          <select
                            value={item.currentHubId}
                            onChange={(e) => {
                              transferVehicleHub(item.carId, e.target.value);
                              showNotification(`Transferred ${car?.model} to ${hubs.find((h) => h.id === e.target.value)?.name}`);
                            }}
                            className="bg-[#0B1324] border border-sapphire-700/30 rounded px-2.5 py-1 text-xs text-white outline-none"
                          >
                            {hubs.map((h) => (
                              <option key={h.id} value={h.id}>
                                {h.name.split(" ")[0]} ({h.district})
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Battery / Fuel */}
                        <td className="py-4 px-4">
                          <div className="space-y-1 w-28">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-titanium-400">{car?.powertrain.includes("Electric") ? "Battery" : "Fuel"}</span>
                              <span className="text-white font-bold">{item.batteryOrFuelPct}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-sapphire-900 overflow-hidden">
                              <div
                                className={`h-full ${
                                  item.batteryOrFuelPct > 70
                                    ? "bg-cyan-ice"
                                    : item.batteryOrFuelPct > 30
                                    ? "bg-amber-400"
                                    : "bg-rose-500"
                                }`}
                                style={{ width: `${item.batteryOrFuelPct}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Odometer & PSI */}
                        <td className="py-4 px-4">
                          <div className="text-titanium-200 tabular-nums font-semibold">
                            {item.odometerKm.toLocaleString()} km
                          </div>
                          <div className="text-[10px] text-titanium-400">
                            Tires: {item.tirePsi.fl}/{item.tirePsi.fr} PSI
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-4 px-4">
                          <select
                            value={item.status}
                            onChange={(e) => {
                              updateInventoryStatus(item.carId, e.target.value as FleetInventoryItem["status"]);
                              showNotification(`Updated status of ${car?.model} to ${e.target.value}`);
                            }}
                            className={`px-2.5 py-1 rounded text-xs font-semibold outline-none border ${
                              item.status === "AVAILABLE"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : item.status === "ON_ROAD"
                                ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                                : item.status === "FAST_CHARGING"
                                ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                                : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                            }`}
                          >
                            <option value="AVAILABLE">AVAILABLE (Staged)</option>
                            <option value="ON_ROAD">ON ROAD (Dispatched)</option>
                            <option value="FAST_CHARGING">FAST CHARGING</option>
                            <option value="MAINTENANCE_BAY">MAINTENANCE BAY</option>
                            <option value="IN_VALET_TRANSIT">VALET TRANSIT</option>
                          </select>
                        </td>

                        {/* Action */}
                        <td className="py-4 px-4 text-right">
                          <Link
                            href={`/book?car=${item.carId}&hub=${item.currentHubId}`}
                            className="px-3 py-1.5 rounded bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 font-semibold text-xs tracking-wider uppercase transition-colors"
                          >
                            Dispatch
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: VIP CLIENT CRM
      ========================================================================== */}
      {activeTab === "CRM" && (
        <div className="space-y-6 animate-fadeIn font-mono text-xs">
          {/* CRM Controls */}
          <div className="editorial-card rounded-2xl p-5 border border-sapphire-700/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-titanium-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search VIP by name, email, NRIC..."
                  value={crmSearch}
                  onChange={(e) => setCrmSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-lg bg-[#0B1324] border border-sapphire-700/30 text-white text-xs outline-none w-64"
                />
              </div>

              <span className="text-titanium-400 uppercase text-[11px] ml-2">Tier:</span>
              <select
                value={crmTierFilter}
                onChange={(e) => setCrmTierFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#0B1324] border border-sapphire-700/30 text-white text-xs outline-none"
              >
                <option value="ALL">All Membership Tiers</option>
                <option value="VELOCE_SOVEREIGN_CARD">Sovereign Card</option>
                <option value="BLACK_DIAMOND_ATELIER">Black Diamond</option>
                <option value="EXECUTIVE_VALET">Executive Valet</option>
              </select>
            </div>

            <div className="text-titanium-400 text-[11px]">
              Active VIP Ledger: <span className="text-white font-bold">{filteredClients.length}</span> Members
            </div>
          </div>

          {/* CRM Split View: Client List & Client Detail Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Client Directory List */}
            <div className="space-y-3">
              {filteredClients.map((client) => {
                const isSelected = activeClient.id === client.id;
                return (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className={`editorial-card rounded-xl p-4 cursor-pointer transition-all border ${
                      isSelected
                        ? "border-cyan-ice bg-sapphire-900/40 shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                        : "border-sapphire-700/20 hover:border-sapphire-600/40 bg-black/20"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-sapphire-700/30">
                        <Image src={client.avatarUrl} alt={client.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-editorial font-semibold text-white text-sm truncate">{client.name}</h4>
                          <span className="text-[10px] text-cyan-ice">{client.loyaltyPoints} pts</span>
                        </div>
                        <p className="text-[10px] text-titanium-400 truncate">{client.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px]">
                          <span className="text-emerald-400">{client.kycStatus.replace("_", " ")}</span>
                          <span className="text-titanium-500">&bull;</span>
                          <span className="text-titanium-300">{formatSGD(client.lifetimeSpendSGD)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Client Dossier & Concierge Dispatch Notes */}
            <div className="lg:col-span-2 space-y-6">
              {activeClient && (
                <div className="editorial-card rounded-2xl p-6 sm:p-8 space-y-6 border border-sapphire-700/20">
                  {/* Client Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sapphire-700/20 pb-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-cyan-ice/40 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                        <Image src={activeClient.avatarUrl} alt={activeClient.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-editorial text-xl font-bold text-white">{activeClient.name}</h3>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] uppercase font-semibold">
                            Singpass KYC Verified
                          </span>
                        </div>
                        <p className="text-xs text-titanium-400">{activeClient.title}</p>
                        <div className="text-[11px] text-titanium-300 mt-1">
                          {activeClient.email} &bull; {activeClient.phone}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 sm:text-right">
                      <div className="text-[10px] text-titanium-400 uppercase">Membership Tier</div>
                      <select
                        value={activeClient.tier}
                        onChange={(e) => {
                          updateClientTier(activeClient.id, e.target.value as CRMClientRecord["tier"]);
                          showNotification(`Tier updated for ${activeClient.name} to ${e.target.value}`);
                        }}
                        className="bg-[#0B1324] border border-cyan-ice/40 text-cyan-ice rounded px-3 py-1 font-semibold text-xs outline-none"
                      >
                        <option value="VELOCE_SOVEREIGN_CARD">Sovereign Card</option>
                        <option value="BLACK_DIAMOND_ATELIER">Black Diamond</option>
                        <option value="EXECUTIVE_VALET">Executive Valet</option>
                      </select>
                    </div>
                  </div>

                  {/* Operational Credentials Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3.5 rounded-xl bg-black/30 border border-sapphire-700/20 space-y-1">
                      <div className="text-[10px] text-titanium-400 uppercase">NRIC / Passport</div>
                      <div className="text-white font-bold">{activeClient.nricOrPassport}</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black/30 border border-sapphire-700/20 space-y-1">
                      <div className="text-[10px] text-titanium-400 uppercase">License Class</div>
                      <div className="text-white font-bold truncate">{activeClient.licenseClass.split("(")[0]}</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black/30 border border-sapphire-700/20 space-y-1">
                      <div className="text-[10px] text-titanium-400 uppercase">Lifetime Spend</div>
                      <div className="text-cyan-ice font-bold">{formatSGD(activeClient.lifetimeSpendSGD)}</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black/30 border border-sapphire-700/20 space-y-1">
                      <div className="text-[10px] text-titanium-400 uppercase">Trips Logged</div>
                      <div className="text-white font-bold">{activeClient.tripsCompleted} Dispatches</div>
                    </div>
                  </div>

                  {/* Concierge Direct Notes */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between border-b border-sapphire-700/20 pb-3">
                      <h4 className="font-editorial text-sm font-semibold text-white">
                        VIP Concierge Direct Dispatch Notes ({activeClient.notes.length})
                      </h4>
                      <span className="text-[10px] text-titanium-400">Timestamped Audit Log</span>
                    </div>

                    {/* New Note Form */}
                    <form onSubmit={handleAddNote} className="flex gap-2">
                      <select
                        value={newNoteTag}
                        onChange={(e) => setNewNoteTag(e.target.value as CRMClientNote["tag"])}
                        className="bg-[#0B1324] border border-sapphire-700/30 rounded px-2.5 py-2 text-xs text-titanium-300 outline-none shrink-0"
                      >
                        <option value="PREFERENCE">PREFERENCE</option>
                        <option value="DISPATCH">DISPATCH</option>
                        <option value="BILLING">BILLING</option>
                        <option value="SECURITY">SECURITY</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Add new concierge instruction or driver preference..."
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        className="flex-1 bg-[#0B1324] border border-sapphire-700/30 rounded px-3 py-2 text-xs text-white outline-none focus:border-cyan-ice"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded bg-cyan-ice hover:bg-cyan-glow text-sapphire-950 font-semibold text-xs tracking-wider uppercase transition-colors shrink-0"
                      >
                        Add Note
                      </button>
                    </form>

                    {/* Notes Stream */}
                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {activeClient.notes.map((note) => (
                        <div key={note.id} className="p-3 rounded-xl bg-black/40 border border-sapphire-700/20 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="flex items-center gap-2">
                              <span className="font-bold text-white">{note.author}</span>
                              <span className="px-1.5 py-0.5 rounded bg-sapphire-800 text-cyan-ice text-[9px]">
                                {note.tag}
                              </span>
                            </span>
                            <span className="text-titanium-500">{note.timestamp}</span>
                          </div>
                          <p className="text-titanium-300 text-xs font-sans leading-relaxed">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: ERP & FINANCIALS
      ========================================================================== */}
      {activeTab === "ERP" && (
        <div className="space-y-8 animate-fadeIn font-mono text-xs">
          {/* Statutory Tax & Financial Ledger */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card rounded-2xl p-6 space-y-3 border border-sapphire-700/20">
              <div className="text-[10px] text-titanium-400 uppercase tracking-wider">Gross Fleet Invoiced</div>
              <div className="text-3xl font-editorial font-bold text-white tabular-nums">
                {formatSGD(financialSummary.totalBookedRevenue)}
              </div>
              <div className="text-xs text-titanium-400 pt-2 border-t border-sapphire-700/20 space-y-1">
                <div className="flex justify-between">
                  <span>Base Vehicle Hire:</span>
                  <span className="text-white font-semibold">{formatSGD(financialSummary.netRevenueBeforeGst * 0.82)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Zero-Excess Shield Addon:</span>
                  <span className="text-white font-semibold">{formatSGD(financialSummary.netRevenueBeforeGst * 0.12)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Malaysia Cross-Border VEP:</span>
                  <span className="text-white font-semibold">{formatSGD(financialSummary.netRevenueBeforeGst * 0.06)}</span>
                </div>
              </div>
            </div>

            <div className="editorial-card rounded-2xl p-6 space-y-3 border border-sapphire-700/20">
              <div className="text-[10px] text-titanium-400 uppercase tracking-wider">Singapore Statutory 9% GST</div>
              <div className="text-3xl font-editorial font-bold text-cyan-ice tabular-nums">
                {formatSGD(financialSummary.totalGstCollected)}
              </div>
              <div className="text-xs text-titanium-400 pt-2 border-t border-sapphire-700/20 space-y-1">
                <div className="flex justify-between">
                  <span>IRAS Filing Entity:</span>
                  <span className="text-white font-semibold">VMA SG PTE LTD</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Registration No:</span>
                  <span className="text-white font-semibold">M9-0284711-X</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Filing Cycle:</span>
                  <span className="text-emerald-400 font-semibold">Quarterly Standard</span>
                </div>
              </div>
            </div>

            <div className="editorial-card rounded-2xl p-6 space-y-3 border border-sapphire-700/20">
              <div className="text-[10px] text-titanium-400 uppercase tracking-wider">Security Deposit Escrow</div>
              <div className="text-3xl font-editorial font-bold text-white tabular-nums">
                {formatSGD(financialSummary.totalSecurityDepositHeld)}
              </div>
              <div className="text-xs text-titanium-400 pt-2 border-t border-sapphire-700/20 space-y-1">
                <div className="flex justify-between">
                  <span>Active Pre-authorizations:</span>
                  <span className="text-white font-semibold">2 Active Rentals</span>
                </div>
                <div className="flex justify-between">
                  <span>Zero-Claim Clearance:</span>
                  <span className="text-emerald-400 font-semibold">100% Retained</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto-Release Cycle:</span>
                  <span className="text-white font-semibold">7 Days Post-Return</span>
                </div>
              </div>
            </div>
          </div>

          {/* ERP 2.0 Live Gantry Electronic Road Pricing Deduction Log */}
          <div className="editorial-card rounded-2xl p-6 space-y-4 border border-sapphire-700/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sapphire-700/20 pb-4">
              <div>
                <h3 className="font-editorial text-base font-semibold text-white">
                  LTA ERP 2.0 GNSS Gantry Toll Deductions
                </h3>
                <p className="text-xs text-titanium-400 font-sans">
                  Automated electronic road pricing deductions synchronized with onboard satellite GNSS units.
                </p>
              </div>
              <span className="px-3 py-1 rounded bg-cyan-ice/10 border border-cyan-ice/30 text-cyan-ice text-[10px] font-bold">
                TOTAL ERP TOLLS: {formatSGD(financialSummary.totalErpTollDeductions)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-sapphire-700/30 bg-black/40 text-[10px] text-titanium-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Transaction ID</th>
                    <th className="py-3 px-3">Timestamp (SGT)</th>
                    <th className="py-3 px-3">Vehicle Plate &amp; Unit</th>
                    <th className="py-3 px-3">Gantry Location</th>
                    <th className="py-3 px-3">Expressway Zone</th>
                    <th className="py-3 px-3">Toll (SGD)</th>
                    <th className="py-3 px-3 text-right">OBU Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sapphire-700/20 text-xs">
                  {erpDeductions.map((d) => (
                    <tr key={d.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 text-titanium-400 font-mono">{d.id}</td>
                      <td className="py-3 px-3 text-white">{d.timestamp}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-white">{d.vehiclePlate}</span> &bull; {d.carName}
                      </td>
                      <td className="py-3 px-3 text-titanium-200">{d.gantryName}</td>
                      <td className="py-3 px-3 text-titanium-400">{d.zone}</td>
                      <td className="py-3 px-3 font-bold text-cyan-ice">{formatSGD(d.amountSGD)}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-semibold">
                          {d.obuStatus.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: DISPATCH MANIFEST
      ========================================================================== */}
      {activeTab === "DISPATCH" && (
        <div className="space-y-6 animate-fadeIn font-mono text-xs">
          <div className="flex items-center justify-between border-b border-sapphire-700/20 pb-4">
            <div>
              <h2 className="font-editorial text-base font-semibold text-white">
                Live Rental Dispatch &amp; Key Handover Manifest
              </h2>
              <p className="text-xs text-titanium-400 font-sans">
                Manage vehicle keys, allocated plates, and client dispatch statuses in real time.
              </p>
            </div>
            <div className="text-titanium-400">
              Total Dispatches: <span className="text-white font-bold">{bookings.length}</span>
            </div>
          </div>

          <div className="space-y-4">
            {bookings.map((booking) => {
              const car = fleet.find((c) => c.id === booking.carId);
              const pickupHub = hubs.find((h) => h.id === booking.pickupHubId);

              return (
                <div
                  key={booking.bookingId}
                  className="editorial-card rounded-2xl p-6 space-y-4 border border-sapphire-700/20"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sapphire-700/20 pb-4">
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 rounded bg-black/60 border border-white/20 font-bold text-white text-xs tracking-wider">
                        {booking.bookingId}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          booking.status === "ACTIVE_ON_ROAD"
                            ? "bg-cyan-500/20 text-cyan-300"
                            : booking.status === "CONFIRMED_DISPATCHED"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-titanium-500/20 text-titanium-300"
                        }`}
                      >
                        {booking.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-titanium-400 text-xs">Status:</span>
                      <select
                        value={booking.status}
                        onChange={(e) => {
                          updateBookingStatus(booking.bookingId, e.target.value as BookingRecord["status"]);
                          showNotification(`Booking ${booking.bookingId} status changed to ${e.target.value}`);
                        }}
                        className="bg-[#0B1324] border border-sapphire-700/30 rounded px-3 py-1 text-xs text-white outline-none"
                      >
                        <option value="CONFIRMED_DISPATCHED">CONFIRMED (Dispatched)</option>
                        <option value="ACTIVE_ON_ROAD">ACTIVE (On Road)</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <div className="text-[10px] text-titanium-400 uppercase">Vehicle</div>
                      <div className="font-editorial font-bold text-white text-sm">{booking.carName}</div>
                      <div className="text-cyan-ice font-bold text-[11px] mt-0.5">Plate: {booking.allocatedPlate}</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-titanium-400 uppercase">Driver / Client</div>
                      <div className="font-bold text-white">{booking.driverName}</div>
                      <div className="text-titanium-400">{booking.driverPhone}</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-titanium-400 uppercase">Staging Hub &amp; Dates</div>
                      <div className="text-white font-semibold truncate">{pickupHub?.name || booking.pickupHubName}</div>
                      <div className="text-titanium-400">
                        {booking.startDate} to {booking.endDate} ({booking.totalDays}d)
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-titanium-400 uppercase">Invoiced Total &amp; Key ID</div>
                      <div className="font-bold text-white">{formatSGD(booking.totalSGD)}</div>
                      <div className="text-emerald-400 font-mono text-[10px]">{booking.digitalKeyId}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
