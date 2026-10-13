export interface PlatformMetadata {
  brandName: string;
  entityType: string;
  headquarters: string;
  jurisdiction: string;
  currency: string;
  gstRatePercentage: number;
  erpSystem: string;
  schemaVersion: string;
  totalVehicles: number;
  totalHubs: number;
  totalSchedules: number;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  transmission: string;
  seats: number;
  luggageCapacity: string;
  powertrain: string;
  rangeKm: number;
  acceleration0To100: string;
  dailyRateSGD: number;
  weekendRateSGD: number;
  securityDepositSGD: number;
  excessSGD: number;
  zeroExcessAddonDailySGD: number;
  malaysiaEntryAllowed: boolean;
  malaysiaEntrySurchargeDailySGD: number;
  erpOnboardUnit: string;
  includedMileageKmPerDay: number;
  extraKmRateSGD: number;
  chargingAccess: string[];
  imageUrl: string;
  availableLocations: string[];
  telemetryFeatures: string[];
  minimumAge: number;
  minimumDrivingExperienceYears: number;
  isFeatured: boolean;
}

export interface Hub {
  id: string;
  name: string;
  district: string;
  address: string;
  postalCode: string;
  mrt: string;
  hubType: string;
  operatingHours: string;
  phone: string;
  amenities: string[];
  imageUrl?: string;
}

export interface AddOn {
  id: string;
  name: string;
  code: string;
  dailyCostSGD: number;
  description: string;
  category: string;
}

export interface Concierge {
  id: string;
  fullName: string;
  role: string;
  baseHub: string;
  languages: string[];
  phone: string;
  avatarUrl: string;
  bio: string;
}

export interface ReservationSchedule {
  bookingId: string;
  carId: string;
  pickupLocationId: string;
  returnLocationId: string;
  date: string;
  status: "CONFIRMED_RESERVED" | "AVAILABLE_FOR_DISPATCH";
  customerTier: string | null;
  dispatchedWithZeroExcess: boolean;
  malaysiaTripApproved: boolean;
  allocatedPlate: string;
}

export interface PatientReview {
  id: string;
  carId: string;
  userName: string;
  userLocation: string;
  rating: number;
  reviewDate: string;
  comment: string;
  milesDriven: number;
}

export interface Dataset {
  platformMetadata: PlatformMetadata;
  fleet: Vehicle[];
  hubs: Hub[];
  addOns: AddOn[];
  conciergeTeam: Concierge[];
  reservationSchedules: ReservationSchedule[];
  patientReviews: PatientReview[];
}
