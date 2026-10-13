# Veloce Marina Atelier Singapore (VMA)
> **Ultra-Luxury Automotive Mobility Atelier & Enterprise Operations Suite**

![VMA Banner](public/images/hero/porsche-cinematic-night.jpg)

Veloce Marina Atelier Singapore is a production-grade luxury automotive mobility platform and enterprise management system built for Singapore's high-net-worth clientele and operations directors.

Designed with a bespoke **Midnight Sapphire & Ice Cyan** aesthetic (`#060A12`, `#0B1324`, `#00E5FF`), the application combines high-performance client booking with real-time operations, inventory, ERP, and CRM capabilities.

---

## ✨ Features & Architecture

### 1. Client Cockpit Experience
- **Cinematic Atelier Hero**: Dynamic telemetry pills, high-contrast typography, and atmospheric automotive photography.
- **Fleet Showcase (`/fleet` & `/fleet/[id]`)**: Detailed vehicle telemetry comparison matrix, authentic photography, technical specifications, and real-time dispatch calculator.
- **Singapore Pick-up Hubs (`/hubs` & `/hubs/[id]`)**: 6 prime Singapore hubs (Changi Airport VIP Terminal, Marina Bay Sands SkyPark, Orchard Paragon, One-North Fusionopolis, Sentosa Cove Marina, and Woodlands Causeway Gateway) with verified 6-digit postal codes and amenities.
- **Malaysia Cross-Border Planner (`/cross-border`)**: Real-time Causeway and Tuas Second Link checkpoint transit simulations with Singapore/Malaysia road regulations, VEP permits, and Touch 'n Go perks.
- **Instant Dispatch Engine (`/book`)**: 3-step booking flow with Singpass MyInfo mock integration, conflict validation against vehicle schedules, and instant digital NFC key generation.
- **VIP Personal Garage (`/profile`)**: Member tier status (`SOVEREIGN`, `CREST_FOUNDER`, `APEX_CIRCUIT`), GNSS satellite ERP toll logs, SP Mobility 150kW fast-charging records, and VIP Director concierge channel.

### 2. Enterprise Operations HQ (`/operations` & `/admin`)
- **Command Telemetry Dashboard**: Live KPI ribbon (units, on-road utilization %, gross SGD revenue, statutory 9% GST accruals, security escrow pools, GNSS toll deductions), Singapore hub vehicle distribution matrix, and SP/Shell fast-charging grid health.
- **Fleet Inventory Management System (IMS)**: Full ledger of Singapore-registered vehicles with plate numbers (e.g., `SMF 9821 Z`), SoC/fuel gauges, odometers, and tire pressure (PSI) monitors. Interactive status mutator (`AVAILABLE`, `ON_ROAD`, `FAST_CHARGING`, `MAINTENANCE_BAY`, `IN_VALET_TRANSIT`) and cross-hub relocation with persistent browser storage.
- **VIP Client Relationship Management (CRM)**: Searchable client database with Singpass KYC verification badges, membership tiers, lifetime spend meters, and chronological concierge interaction notes with instant note creation.
- **ERP & Statutory Financials**: Automatic Singapore 9% GST computation, breakdown of booking revenues vs damage waivers vs transit surcharges, security deposit escrow audit, and live LTA ERP 2.0 GNSS gantry deduction feed across CTE, MCE, ECP, AYE, and BKE.
- **Live Dispatch Manifest**: Real-time reservation status controller (`CONFIRMED_DISPATCHED`, `ACTIVE_ON_ROAD`, `COMPLETED`) with digital NFC hardware keys.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Midnight Sapphire & Ice Cyan theme tokens
- **Icons**: Lucide React
- **State Management**: React Context with automatic `localStorage` persistence
- **Server Deployment**: Node.js production server

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/MEHARDEEPSINGH123/car-rental.git
cd car-rental

# Install dependencies
npm install
```

### Running Locally
```bash
# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Building for Production
```bash
# Build the production application
npm run build

# Start the production server
npm run start
```

---

## 📂 Project Structure

```text
├── public/                     # Authentic photography (cars, hubs, portraits)
│   ├── images/
│   │   ├── cars/               # Real exterior vehicle photography
│   │   ├── hero/               # High-resolution hero backdrop
│   │   └── hubs/               # Authentic Singapore landmark captures
│   └── avatars/                # Real portrait photography for VIPs & directors
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Operations redirect route
│   │   ├── book/               # 3-step booking engine
│   │   ├── cross-border/       # Malaysia Causeway/Tuas planner
│   │   ├── fleet/              # Fleet catalog & dynamic [id] specs
│   │   ├── hubs/               # Singapore hubs & dynamic [id] views
│   │   ├── operations/         # Enterprise Suite (CRM, ERP, IMS, Dashboard)
│   │   ├── profile/            # Personal garage & VIP concierge
│   │   ├── layout.tsx          # Root layout with font and HUD providers
│   │   └── page.tsx            # Cinematic Cockpit landing page
│   ├── components/             # Reusable UI components
│   │   ├── CockpitHUD.tsx      # Minimalist fixed frosted glass navigation bar
│   │   └── Footer.tsx          # Atelier footer with Singapore hub contacts
│   └── lib/                    # State management & datasets
│       └── store.tsx           # Global reactive store with localStorage persistence
├── veloce_marina_singapore_dataset.json # Ground-truth Singapore automotive dataset
├── tailwind.config.ts          # Midnight Sapphire & Ice Cyan design tokens
└── package.json
```

---

## 🛡️ License

Private luxury mobility atelier application. All rights reserved.
