import rawData from "@/data/veloce_marina_singapore_dataset.json";
import {
  Dataset,
  Vehicle,
  Hub,
  AddOn,
  Concierge,
  ReservationSchedule,
  PatientReview,
} from "@/types/dataset";

export const dataset: Dataset = rawData as Dataset;

export const GST_RATE = dataset.platformMetadata.gstRatePercentage; // 9%

export function getFleet(): Vehicle[] {
  return dataset.fleet;
}

export function getVehicleById(id: string): Vehicle | undefined {
  return dataset.fleet.find((car) => car.id === id);
}

export function getFeaturedVehicles(): Vehicle[] {
  return dataset.fleet.filter((car) => car.isFeatured);
}

export function getHubs(): Hub[] {
  return dataset.hubs;
}

export function getHubById(id: string): Hub | undefined {
  return dataset.hubs.find((h) => h.id === id);
}

export function getAddOns(): AddOn[] {
  return dataset.addOns;
}

export function getAddOnById(id: string): AddOn | undefined {
  return dataset.addOns.find((addon) => addon.id === id);
}

export function getConciergeTeam(): Concierge[] {
  // Map high-res generated portraits if available
  return dataset.conciergeTeam.map((c) => {
    let localAvatar = c.avatarUrl;
    if (c.id === "CON-SG-01") localAvatar = "/avatars/alistair.jpg";
    if (c.id === "CON-SG-02") localAvatar = "/avatars/evelyn.jpg";
    if (c.id === "CON-SG-03") localAvatar = "/avatars/danial.jpg";
    return {
      ...c,
      avatarUrl: localAvatar,
    };
  });
}

export function getReviews(): PatientReview[] {
  return dataset.patientReviews;
}

export function getReviewsForVehicle(carId: string): PatientReview[] {
  return dataset.patientReviews.filter((r) => r.carId === carId);
}

export function getSchedules(): ReservationSchedule[] {
  return dataset.reservationSchedules;
}

export function checkVehicleAvailability(
  carId: string,
  pickupHubId: string,
  startDateStr: string,
  endDateStr: string
): { isAvailable: boolean; reason?: string; allocatedPlate?: string } {
  const vehicle = getVehicleById(carId);
  if (!vehicle) {
    return { isAvailable: false, reason: "Vehicle specification not found in Atelier fleet." };
  }

  // Check if pickup hub is supported by this vehicle
  if (pickupHubId && !vehicle.availableLocations.includes(pickupHubId)) {
    const hub = getHubById(pickupHubId);
    return {
      isAvailable: false,
      reason: `${vehicle.make} ${vehicle.model} is not staged at ${hub?.name || "selected hub"}. Available hubs: ${vehicle.availableLocations.map((hId) => getHubById(hId)?.name).join(", ")}.`,
    };
  }

  // Check dates against reservation schedules
  const schedules = dataset.reservationSchedules.filter(
    (s) => s.carId === carId && (!pickupHubId || s.pickupLocationId === pickupHubId)
  );

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isAvailable: true, allocatedPlate: "SJB 6001Z" };
  }

  // Iterate over date range
  let curr = new Date(start);
  let availablePlate = "SKE 6002Z";

  while (curr <= end) {
    const dateFormatted = curr.toISOString().split("T")[0];
    const match = schedules.find((s) => s.date === dateFormatted);
    if (match) {
      if (match.status === "CONFIRMED_RESERVED") {
        return {
          isAvailable: false,
          reason: `Fleet unit already dispatched on ${dateFormatted} at ${getHubById(match.pickupLocationId)?.name || "hub"}. Please select an alternative dispatch window.`,
        };
      }
      if (match.allocatedPlate) {
        availablePlate = match.allocatedPlate;
      }
    }
    curr.setDate(curr.getDate() + 1);
  }

  return { isAvailable: true, allocatedPlate: availablePlate };
}

export function formatSGD(amount: number): string {
  return `S$ ${amount.toLocaleString("en-SG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export interface QuoteCalculation {
  car: Vehicle;
  days: number;
  weekdayDays: number;
  weekendDays: number;
  baseRental: number;
  zeroExcessRate: number;
  zeroExcessTotal: number;
  malaysiaSurchargeTotal: number;
  addOnsTotal: number;
  subtotalBeforeGst: number;
  gstAmount: number;
  totalWithGst: number;
  securityDeposit: number;
  totalPayableNow: number; // Subtotal + GST (Deposit held separately)
}

export function calculateBookingQuote({
  car,
  startDateStr,
  endDateStr,
  includeZeroExcess = false,
  includeMalaysiaPass = false,
  selectedAddOnIds = [],
}: {
  car: Vehicle;
  startDateStr: string;
  endDateStr: string;
  includeZeroExcess?: boolean;
  includeMalaysiaPass?: boolean;
  selectedAddOnIds?: string[];
}): QuoteCalculation {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  let days = 1;
  let weekdayDays = 1;
  let weekendDays = 0;

  if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
    const diffTime = Math.max(end.getTime() - start.getTime(), 0);
    days = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);

    weekdayDays = 0;
    weekendDays = 0;
    const cur = new Date(start);
    for (let i = 0; i < days; i++) {
      const dayOfWeek = cur.getDay(); // 0 is Sun, 6 is Sat
      if (dayOfWeek === 0 || dayOfWeek === 6 || dayOfWeek === 5) {
        // Friday, Saturday, Sunday counted as weekend rate in luxury Singapore atelier
        weekendDays++;
      } else {
        weekdayDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }
  }

  const baseRental = weekdayDays * car.dailyRateSGD + weekendDays * car.weekendRateSGD;
  
  const zeroExcessRate = car.zeroExcessAddonDailySGD;
  const zeroExcessTotal = includeZeroExcess ? zeroExcessRate * days : 0;

  // Malaysia pass: only allowed if car.malaysiaEntryAllowed is true
  const malaysiaRate = car.malaysiaEntryAllowed ? car.malaysiaEntrySurchargeDailySGD : 0;
  const malaysiaSurchargeTotal = includeMalaysiaPass && car.malaysiaEntryAllowed ? malaysiaRate * days : 0;

  let addOnsTotal = 0;
  selectedAddOnIds.forEach((id) => {
    // If it's zero excess or malaysia pass, skip if already handled
    if (id === "ADD-ZERO-EXCESS") {
      if (!includeZeroExcess) addOnsTotal += zeroExcessTotal;
      return;
    }
    if (id === "ADD-MY-PASS") {
      if (!includeMalaysiaPass && car.malaysiaEntryAllowed) {
        addOnsTotal += malaysiaSurchargeTotal;
      }
      return;
    }
    const addon = getAddOnById(id);
    if (addon) {
      addOnsTotal += addon.dailyCostSGD * days;
    }
  });

  const subtotalBeforeGst = baseRental + zeroExcessTotal + malaysiaSurchargeTotal + addOnsTotal;
  const gstAmount = Number((subtotalBeforeGst * (GST_RATE / 100)).toFixed(2));
  const totalWithGst = Number((subtotalBeforeGst + gstAmount).toFixed(2));
  const securityDeposit = car.securityDepositSGD;

  return {
    car,
    days,
    weekdayDays,
    weekendDays,
    baseRental,
    zeroExcessRate,
    zeroExcessTotal,
    malaysiaSurchargeTotal,
    addOnsTotal,
    subtotalBeforeGst,
    gstAmount,
    totalWithGst,
    securityDeposit,
    totalPayableNow: totalWithGst,
  };
}
