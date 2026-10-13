"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Vehicle, Hub, AddOn } from "@/types/dataset";
import { getFleet, getHubs, QuoteCalculation } from "@/lib/dataset";

export interface BookingRecord {
  bookingId: string;
  carId: string;
  carName: string;
  carImage: string;
  pickupHubId: string;
  pickupHubName: string;
  returnHubId: string;
  returnHubName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalSGD: number;
  gstSGD: number;
  securityDepositSGD: number;
  zeroExcessShield: boolean;
  malaysiaPass: boolean;
  allocatedPlate: string;
  driverName: string;
  driverPhone: string;
  digitalKeyId: string;
  status: "CONFIRMED_DISPATCHED" | "ACTIVE_ON_ROAD" | "COMPLETED";
  createdAt: string;
}

export interface UserProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  nricOrPassport: string;
  drivingLicenseClass: string;
  tier: "VELOCE_SOVEREIGN_CARD" | "BLACK_DIAMOND_ATELIER" | "EXECUTIVE_VALET";
  loyaltyPoints: number;
  avatarUrl: string;
  totalTripsLogged: number;
  totalKmTracked: number;
}

const AVATAR_ROSTER = [
  {
    url: "/avatars/marcus.jpg",
    name: "Marcus Vance",
    desc: "Venture Partner & GT Track Enthusiast",
  },
  {
    url: "/avatars/alyssa.jpg",
    name: "Dr. Alyssa Chen",
    desc: "Biotech Founder & Taycan EV Specialist",
  },
  {
    url: "/avatars/kenji.jpg",
    name: "Kenji Takahashi",
    desc: "Private Equity Principal & Motorsport Collector",
  },
];

export interface FleetInventoryItem {
  carId: string;
  plateNumber: string;
  currentHubId: string;
  status: "AVAILABLE" | "ON_ROAD" | "IN_VALET_TRANSIT" | "MAINTENANCE_BAY" | "FAST_CHARGING";
  batteryOrFuelPct: number;
  odometerKm: number;
  tirePsi: { fl: number; fr: number; rl: number; rr: number };
  lastInspection: string;
  telemetryHealth: "OPTIMAL" | "ATTENTION_REQUIRED" | "CALIBRATION_PENDING";
  assignedDriver?: string;
}

export interface CRMClientNote {
  id: string;
  timestamp: string;
  author: string;
  text: string;
  tag: "PREFERENCE" | "DISPATCH" | "BILLING" | "SECURITY";
}

export interface CRMClientRecord {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  nricOrPassport: string;
  licenseClass: string;
  tier: "VELOCE_SOVEREIGN_CARD" | "BLACK_DIAMOND_ATELIER" | "EXECUTIVE_VALET";
  loyaltyPoints: number;
  lifetimeSpendSGD: number;
  tripsCompleted: number;
  avatarUrl: string;
  kycStatus: "VERIFIED_SINGPASS" | "PASSPORT_ESCROW_VALIDATED" | "PENDING_REVIEW";
  crossBorderVePCleared: boolean;
  notes: CRMClientNote[];
}

export interface ERPGantryDeduction {
  id: string;
  timestamp: string;
  vehiclePlate: string;
  carName: string;
  gantryName: string;
  zone: string;
  amountSGD: number;
  obuStatus: "DEDUCTED_OBU_2.0" | "STORED_VALUE_AUTO_TOPUP";
}

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  avatarRoster: typeof AVATAR_ROSTER;
  cycleProfileAvatar: () => void;
  bookings: BookingRecord[];
  addBooking: (booking: BookingRecord) => void;
  updateBookingStatus: (bookingId: string, status: BookingRecord["status"]) => void;
  inventory: FleetInventoryItem[];
  updateInventoryStatus: (carId: string, status: FleetInventoryItem["status"]) => void;
  transferVehicleHub: (carId: string, newHubId: string) => void;
  clients: CRMClientRecord[];
  addClientNote: (clientId: string, noteText: string, author: string, tag?: CRMClientNote["tag"]) => void;
  updateClientTier: (clientId: string, tier: CRMClientRecord["tier"]) => void;
  erpDeductions: ERPGantryDeduction[];
  selectedDraftCarId: string;
  setSelectedDraftCarId: (id: string) => void;
  selectedDraftPickupHubId: string;
  setSelectedDraftPickupHubId: (id: string) => void;
  selectedDraftReturnHubId: string;
  setSelectedDraftReturnHubId: (id: string) => void;
  selectedStartDate: string;
  setSelectedStartDate: (d: string) => void;
  selectedEndDate: string;
  setSelectedEndDate: (d: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SEED_BOOKINGS: BookingRecord[] = [
  {
    bookingId: "VMA-RES-5001",
    carId: "CAR-SG-01",
    carName: "Porsche Taycan 4S Cross Turismo",
    carImage: "/images/cars/taycan.jpg",
    pickupHubId: "LOC-SIN-01",
    pickupHubName: "Changi Airport Jewel Concierge Terminal",
    returnHubId: "LOC-SIN-01",
    returnHubName: "Changi Airport Jewel Concierge Terminal",
    startDate: "2026-10-15",
    endDate: "2026-10-18",
    totalDays: 3,
    totalSGD: 1988.50,
    gstSGD: 164.19,
    securityDepositSGD: 1500.0,
    zeroExcessShield: true,
    malaysiaPass: true,
    allocatedPlate: "SJB 6001Z",
    driverName: "Marcus Vance",
    driverPhone: "+65 9123 4567",
    digitalKeyId: "VMA-NFC-TAYCAN-8812",
    status: "CONFIRMED_DISPATCHED",
    createdAt: "2026-10-10",
  },
  {
    bookingId: "VMA-RES-4982",
    carId: "CAR-SG-02",
    carName: "Ferrari 296 GTB Assetto Fiorano",
    carImage: "/images/cars/ferrari-296.jpg",
    pickupHubId: "LOC-MBS-02",
    pickupHubName: "Marina Bay Sands VIP SkyDrive Pavilion",
    returnHubId: "LOC-MBS-02",
    returnHubName: "Marina Bay Sands VIP SkyDrive Pavilion",
    startDate: "2026-09-28",
    endDate: "2026-09-30",
    totalDays: 2,
    totalSGD: 4512.60,
    gstSGD: 372.60,
    securityDepositSGD: 5000.0,
    zeroExcessShield: true,
    malaysiaPass: false,
    allocatedPlate: "SHV 6025Z",
    driverName: "Marcus Vance",
    driverPhone: "+65 9123 4567",
    digitalKeyId: "VMA-NFC-FERRARI-296GT",
    status: "COMPLETED",
    createdAt: "2026-09-20",
  },
];

const SEED_INVENTORY: FleetInventoryItem[] = [
  {
    carId: "CAR-SG-01",
    plateNumber: "SJB 6001Z",
    currentHubId: "LOC-SIN-01",
    status: "AVAILABLE",
    batteryOrFuelPct: 94,
    odometerKm: 14280,
    tirePsi: { fl: 36, fr: 36, rl: 38, rr: 38 },
    lastInspection: "2026-09-15",
    telemetryHealth: "OPTIMAL",
  },
  {
    carId: "CAR-SG-02",
    plateNumber: "SHV 6025Z",
    currentHubId: "LOC-MBS-02",
    status: "ON_ROAD",
    batteryOrFuelPct: 88,
    odometerKm: 6420,
    tirePsi: { fl: 32, fr: 32, rl: 34, rr: 34 },
    lastInspection: "2026-09-28",
    telemetryHealth: "OPTIMAL",
    assignedDriver: "Marcus Vance",
  },
  {
    carId: "CAR-SG-03",
    plateNumber: "SLD 4500E",
    currentHubId: "LOC-ORC-03",
    status: "AVAILABLE",
    batteryOrFuelPct: 100,
    odometerKm: 9810,
    tirePsi: { fl: 38, fr: 38, rl: 40, rr: 40 },
    lastInspection: "2026-10-02",
    telemetryHealth: "OPTIMAL",
  },
  {
    carId: "CAR-SG-04",
    plateNumber: "SKK 8888L",
    currentHubId: "LOC-SIN-01",
    status: "AVAILABLE",
    batteryOrFuelPct: 92,
    odometerKm: 22400,
    tirePsi: { fl: 35, fr: 35, rl: 35, rr: 35 },
    lastInspection: "2026-08-30",
    telemetryHealth: "OPTIMAL",
  },
  {
    carId: "CAR-SG-05",
    plateNumber: "SMQ 4004M",
    currentHubId: "LOC-ONE-04",
    status: "AVAILABLE",
    batteryOrFuelPct: 76,
    odometerKm: 11150,
    tirePsi: { fl: 34, fr: 34, rl: 36, rr: 36 },
    lastInspection: "2026-09-10",
    telemetryHealth: "OPTIMAL",
  },
  {
    carId: "CAR-SG-06",
    plateNumber: "SNE 9009Y",
    currentHubId: "LOC-ONE-04",
    status: "FAST_CHARGING",
    batteryOrFuelPct: 62,
    odometerKm: 18920,
    tirePsi: { fl: 42, fr: 42, rl: 42, rr: 42 },
    lastInspection: "2026-10-05",
    telemetryHealth: "OPTIMAL",
  },
  {
    carId: "CAR-SG-07",
    plateNumber: "SRB 1100D",
    currentHubId: "LOC-WDL-06",
    status: "AVAILABLE",
    batteryOrFuelPct: 95,
    odometerKm: 16300,
    tirePsi: { fl: 37, fr: 37, rl: 40, rr: 40 },
    lastInspection: "2026-09-22",
    telemetryHealth: "OPTIMAL",
  },
  {
    carId: "CAR-SG-08",
    plateNumber: "SCM 2024E",
    currentHubId: "LOC-SEN-05",
    status: "AVAILABLE",
    batteryOrFuelPct: 85,
    odometerKm: 8740,
    tirePsi: { fl: 36, fr: 36, rl: 36, rr: 36 },
    lastInspection: "2026-09-01",
    telemetryHealth: "OPTIMAL",
  },
];

const SEED_CLIENTS: CRMClientRecord[] = [
  {
    id: "CLI-SG-101",
    name: "Marcus Vance",
    title: "Venture Partner & Sovereign Collector",
    email: "marcus.vance@vma-atelier.sg",
    phone: "+65 9123 4567",
    nricOrPassport: "S****882D",
    licenseClass: "Class 3 (Motor Car Qualified)",
    tier: "VELOCE_SOVEREIGN_CARD",
    loyaltyPoints: 14250,
    lifetimeSpendSGD: 38450,
    tripsCompleted: 12,
    avatarUrl: "/avatars/marcus.jpg",
    kycStatus: "VERIFIED_SINGPASS",
    crossBorderVePCleared: true,
    notes: [
      {
        id: "NOTE-1",
        timestamp: "2026-10-10 14:30",
        author: "Alistair Sterling",
        text: "Prefers Ferrari 296 GTB in Assetto Fiorano spec with tire pressures set to warm track specs (32 PSI front).",
        tag: "PREFERENCE",
      },
      {
        id: "NOTE-2",
        timestamp: "2026-09-28 09:15",
        author: "Danial Aris",
        text: "Malaysia Causeway VEP RFID pass active. Pre-loaded Touch 'n Go NFC card issued with RM500 balance.",
        tag: "DISPATCH",
      },
    ],
  },
  {
    id: "CLI-SG-102",
    name: "Dr. Alyssa Chen",
    title: "Biotech Founder & Taycan EV Specialist",
    email: "alyssa.chen@synapse-bio.sg",
    phone: "+65 9876 5432",
    nricOrPassport: "S****419F",
    licenseClass: "Class 3A (Auto Qualified)",
    tier: "BLACK_DIAMOND_ATELIER",
    loyaltyPoints: 9800,
    lifetimeSpendSGD: 24600,
    tripsCompleted: 8,
    avatarUrl: "/avatars/alyssa.jpg",
    kycStatus: "VERIFIED_SINGPASS",
    crossBorderVePCleared: true,
    notes: [
      {
        id: "NOTE-3",
        timestamp: "2026-10-04 11:00",
        author: "Evelyn Lim",
        text: "Changi Terminal 3 VIP Meet & Greet required for all airport deliveries. Always requests battery SoC >= 95%.",
        tag: "PREFERENCE",
      },
    ],
  },
  {
    id: "CLI-SG-103",
    name: "Kenji Takahashi",
    title: "Private Equity Principal & Motorsport Collector",
    email: "k.takahashi@azalea-pe.sg",
    phone: "+65 9333 1122",
    nricOrPassport: "G****109K",
    licenseClass: "International Driving Permit (IDP Class B)",
    tier: "BLACK_DIAMOND_ATELIER",
    loyaltyPoints: 11400,
    lifetimeSpendSGD: 31200,
    tripsCompleted: 9,
    avatarUrl: "/avatars/kenji.jpg",
    kycStatus: "PASSPORT_ESCROW_VALIDATED",
    crossBorderVePCleared: false,
    notes: [
      {
        id: "NOTE-4",
        timestamp: "2026-10-08 17:20",
        author: "Alistair Sterling",
        text: "Frequently books BMW M4 Competition for Sepang Circuit weekend track sessions.",
        tag: "PREFERENCE",
      },
    ],
  },
  {
    id: "CLI-SG-104",
    name: "Datin Seri Melissa Ong",
    title: "Managing Director, Global Family Office",
    email: "melissa.ong@mayfair-sg.com",
    phone: "+65 8122 9900",
    nricOrPassport: "S****733A",
    licenseClass: "Class 3 Qualified",
    tier: "VELOCE_SOVEREIGN_CARD",
    loyaltyPoints: 18900,
    lifetimeSpendSGD: 46800,
    tripsCompleted: 14,
    avatarUrl: "/avatars/alyssa.jpg",
    kycStatus: "VERIFIED_SINGPASS",
    crossBorderVePCleared: true,
    notes: [
      {
        id: "NOTE-5",
        timestamp: "2026-10-08 19:45",
        author: "Evelyn Lim",
        text: "Exclusive user of Alphard Executive Lounge with private chauffeur. Requests chilled mineral water on pickup.",
        tag: "PREFERENCE",
      },
    ],
  },
  {
    id: "CLI-SG-105",
    name: "Guillaume B.",
    title: "Partner, Monaco Maritime Capital",
    email: "gb@monaco-maritime.mc",
    phone: "+65 9011 4455",
    nricOrPassport: "E****990P",
    licenseClass: "EU Driving License Category B",
    tier: "EXECUTIVE_VALET",
    loyaltyPoints: 5600,
    lifetimeSpendSGD: 14200,
    tripsCompleted: 4,
    avatarUrl: "/avatars/marcus.jpg",
    kycStatus: "PASSPORT_ESCROW_VALIDATED",
    crossBorderVePCleared: false,
    notes: [
      {
        id: "NOTE-6",
        timestamp: "2026-09-29 16:10",
        author: "Danial Aris",
        text: "Zero-Excess Sovereign Shield must be automatically bundled on all Ferrari bookings.",
        tag: "SECURITY",
      },
    ],
  },
];

const SEED_ERP_DEDUCTIONS: ERPGantryDeduction[] = [
  {
    id: "ERP-2026-8801",
    timestamp: "2026-10-13 10:14",
    vehiclePlate: "SHV 6025Z",
    carName: "Ferrari 296 GTB Assetto Fiorano",
    gantryName: "CTE Southbound (Braddell Road to PIE)",
    zone: "Central Expressway Corridor",
    amountSGD: 3.00,
    obuStatus: "DEDUCTED_OBU_2.0",
  },
  {
    id: "ERP-2026-8802",
    timestamp: "2026-10-13 09:42",
    vehiclePlate: "SHV 6025Z",
    carName: "Ferrari 296 GTB Assetto Fiorano",
    gantryName: "MCE Eastbound (Marina Boulevard Exit)",
    zone: "Marina Bay Downtown Core",
    amountSGD: 2.50,
    obuStatus: "DEDUCTED_OBU_2.0",
  },
  {
    id: "ERP-2026-8803",
    timestamp: "2026-10-13 08:30",
    vehiclePlate: "SJB 6001Z",
    carName: "Porsche Taycan 4S Cross Turismo",
    gantryName: "ECP Westbound (Fort Road Gantry)",
    zone: "East Coast Aviation Corridor",
    amountSGD: 2.00,
    obuStatus: "DEDUCTED_OBU_2.0",
  },
  {
    id: "ERP-2026-8804",
    timestamp: "2026-10-12 18:15",
    vehiclePlate: "SMQ 4004M",
    carName: "BMW M4 Competition M xDrive",
    gantryName: "AYE Eastbound (Alexandra Road)",
    zone: "One-North Tech Corridor",
    amountSGD: 1.50,
    obuStatus: "DEDUCTED_OBU_2.0",
  },
  {
    id: "ERP-2026-8805",
    timestamp: "2026-10-12 17:40",
    vehiclePlate: "SRB 1100D",
    carName: "Land Rover Defender 110 P400",
    gantryName: "BKE Northbound (Woodlands Checkpoint Flyover)",
    zone: "Causeway Gateway Transit",
    amountSGD: 2.00,
    obuStatus: "DEDUCTED_OBU_2.0",
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>({
    name: "Marcus Vance",
    title: "Venture Partner & Sovereign Collector",
    email: "marcus.vance@vma-atelier.sg",
    phone: "+65 9123 4567",
    nricOrPassport: "S****882D",
    drivingLicenseClass: "Class 3 (Motor Car Qualified)",
    tier: "VELOCE_SOVEREIGN_CARD",
    loyaltyPoints: 14250,
    avatarUrl: "/avatars/marcus.jpg",
    totalTripsLogged: 12,
    totalKmTracked: 3840,
  });

  const [bookings, setBookings] = useState<BookingRecord[]>(SEED_BOOKINGS);
  const [inventory, setInventory] = useState<FleetInventoryItem[]>(SEED_INVENTORY);
  const [clients, setClients] = useState<CRMClientRecord[]>(SEED_CLIENTS);
  const [erpDeductions] = useState<ERPGantryDeduction[]>(SEED_ERP_DEDUCTIONS);

  const [selectedDraftCarId, setSelectedDraftCarId] = useState<string>("CAR-SG-01");
  const [selectedDraftPickupHubId, setSelectedDraftPickupHubId] = useState<string>("LOC-SIN-01");
  const [selectedDraftReturnHubId, setSelectedDraftReturnHubId] = useState<string>("LOC-SIN-01");
  const [selectedStartDate, setSelectedStartDate] = useState<string>("2026-10-16");
  const [selectedEndDate, setSelectedEndDate] = useState<string>("2026-10-18");

  // Load from localStorage if present
  useEffect(() => {
    try {
      const storedBookings = localStorage.getItem("vma_bookings");
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
      const storedUser = localStorage.getItem("vma_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      const storedInventory = localStorage.getItem("vma_inventory");
      if (storedInventory) {
        setInventory(JSON.parse(storedInventory));
      }
      const storedClients = localStorage.getItem("vma_clients");
      if (storedClients) {
        setClients(JSON.parse(storedClients));
      }
    } catch (e) {
      // LocalStorage unavailable
    }
  }, []);

  const addBooking = (newBooking: BookingRecord) => {
    setBookings((prev) => {
      const updated = [newBooking, ...prev];
      try {
        localStorage.setItem("vma_bookings", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const updateBookingStatus = (bookingId: string, status: BookingRecord["status"]) => {
    setBookings((prev) => {
      const updated = prev.map((b) => (b.bookingId === bookingId ? { ...b, status } : b));
      try {
        localStorage.setItem("vma_bookings", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const updateInventoryStatus = (carId: string, status: FleetInventoryItem["status"]) => {
    setInventory((prev) => {
      const updated = prev.map((item) => (item.carId === carId ? { ...item, status } : item));
      try {
        localStorage.setItem("vma_inventory", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const transferVehicleHub = (carId: string, newHubId: string) => {
    setInventory((prev) => {
      const updated = prev.map((item) => (item.carId === carId ? { ...item, currentHubId: newHubId } : item));
      try {
        localStorage.setItem("vma_inventory", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const addClientNote = (
    clientId: string,
    noteText: string,
    author: string,
    tag: CRMClientNote["tag"] = "PREFERENCE"
  ) => {
    setClients((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== clientId) return c;
        const newNote: CRMClientNote = {
          id: `NOTE-${Date.now()}`,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
          author,
          text: noteText,
          tag,
        };
        return { ...c, notes: [newNote, ...c.notes] };
      });
      try {
        localStorage.setItem("vma_clients", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const updateClientTier = (clientId: string, tier: CRMClientRecord["tier"]) => {
    setClients((prev) => {
      const updated = prev.map((c) => (c.id === clientId ? { ...c, tier } : c));
      try {
        localStorage.setItem("vma_clients", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const cycleProfileAvatar = () => {
    setUser((prev) => {
      const currentIndex = AVATAR_ROSTER.findIndex((a) => a.url === prev.avatarUrl);
      const nextIndex = (currentIndex + 1) % AVATAR_ROSTER.length;
      const nextAvatar = AVATAR_ROSTER[nextIndex];
      const updated = {
        ...prev,
        avatarUrl: nextAvatar.url,
        name: nextAvatar.name,
        title: nextAvatar.desc,
      };
      try {
        localStorage.setItem("vma_user", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        avatarRoster: AVATAR_ROSTER,
        cycleProfileAvatar,
        bookings,
        addBooking,
        updateBookingStatus,
        inventory,
        updateInventoryStatus,
        transferVehicleHub,
        clients,
        addClientNote,
        updateClientTier,
        erpDeductions,
        selectedDraftCarId,
        setSelectedDraftCarId,
        selectedDraftPickupHubId,
        setSelectedDraftPickupHubId,
        selectedDraftReturnHubId,
        setSelectedDraftReturnHubId,
        selectedStartDate,
        setSelectedStartDate,
        selectedEndDate,
        setSelectedEndDate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
