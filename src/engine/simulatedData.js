// Simulated Store Data, Cameras, Past Incidents & Analytics
export const INITIAL_CAMERAS = [
  {
    id: "CAM-01",
    name: "Aisle 04 // High-End Electronics",
    department: "Consumer Electronics",
    zone: "Zone B",
    riskLevel: "CRITICAL",
    resolution: "1080p 30fps",
    status: "ONLINE",
    feedType: "simulated", // 'simulated' or 'webcam'
    modelConfidence: 0.94,
    focalZone: "Smartphones & Audio",
    activeIncident: null,
    scenarioType: "concealment",
    description: "Monitors locked display cases and open peg hooks for high-shrinkage smart accessories."
  },
  {
    id: "CAM-02",
    name: "Aisle 07 // Luxury Cosmetics & Perfume",
    department: "Cosmetics & Fragrances",
    zone: "Zone C",
    riskLevel: "HIGH",
    resolution: "1080p 30fps",
    status: "ONLINE",
    feedType: "simulated",
    modelConfidence: 0.91,
    focalZone: "Designer Fragrances",
    activeIncident: null,
    scenarioType: "sweeping",
    description: "High-density shelving area prone to rapid bulk-sweeping of luxury perfume bottles."
  },
  {
    id: "CAM-03",
    name: "Checkout Zone 02 // Self-Scan Kiosk 04",
    department: "Self-Checkout Area",
    zone: "Zone A",
    riskLevel: "HIGH",
    resolution: "4K 60fps",
    status: "ONLINE",
    feedType: "simulated",
    modelConfidence: 0.89,
    focalZone: "Bagging Scale & Scanner",
    activeIncident: null,
    scenarioType: "checkout_bypass",
    description: "Direct overhead view of barcode scanner and bagging platform detecting un-scanned additions."
  },
  {
    id: "CAM-04",
    name: "Aisle 12 // Premium Liquor & Spirits",
    department: "Beverages & Spirits",
    zone: "Zone D",
    riskLevel: "MEDIUM",
    resolution: "1080p 30fps",
    status: "ONLINE",
    feedType: "simulated",
    modelConfidence: 0.87,
    focalZone: "Top-Shelf Whiskey & Vodka",
    activeIncident: null,
    scenarioType: "loitering",
    description: "Blind-spot monitoring near rear exit with bottle cap sensor tracking."
  },
  {
    id: "CAM-05",
    name: "Apparel Perimeter // Fitting Room Entry",
    department: "Designer Apparel",
    zone: "Zone E",
    riskLevel: "MEDIUM",
    resolution: "1080p 30fps",
    status: "ONLINE",
    feedType: "simulated",
    modelConfidence: 0.85,
    focalZone: "Dressing Room Gate",
    activeIncident: null,
    scenarioType: "tag_tamper",
    description: "Garment count tracking prior to entering fitting stalls with magnetic tag detachment alerts."
  },
  {
    id: "CAM-06",
    name: "Main Entrance / Exit // Pedestal Sensors",
    department: "Front Perimeter",
    zone: "Zone F",
    riskLevel: "CRITICAL",
    resolution: "4K 60fps",
    status: "ONLINE",
    feedType: "simulated",
    modelConfidence: 0.96,
    focalZone: "Anti-Theft EAS Gates",
    activeIncident: null,
    scenarioType: "exit_run",
    description: "Fast-motion tracking near exit turnstiles correlating with unpaid POS basket triggers."
  }
];

export const INITIAL_INCIDENTS = [
  {
    id: "INC-2026-881",
    timestamp: "2026-09-23 18:42:15",
    camera: "CAM-01",
    location: "Aisle 04 // High-End Electronics",
    department: "Consumer Electronics",
    behavior: "Pocket Concealment",
    description: "Suspect slipped 2x Wireless Earbuds into inner coat pocket after scanning surroundings.",
    severity: "CRITICAL",
    confidence: 0.94,
    status: "DISPATCHED", // ACTIVE, DISPATCHED, RESOLVED, FALSE_ALARM
    stolenEstimate: 349.99,
    suspectProfile: "Male, approx 25-35, black hoodie, grey jeans, sling backpack",
    officerNotes: "Floor Guard Sarah intercepted suspect at north entrance. Merchandise recovered intact.",
    snapshotUrl: null
  },
  {
    id: "INC-2026-879",
    timestamp: "2026-09-23 17:15:32",
    camera: "CAM-02",
    location: "Aisle 07 // Luxury Cosmetics",
    department: "Cosmetics & Fragrances",
    behavior: "Shelf Sweeping",
    description: "Suspect rapidly loaded 6x Eau de Parfum bottles directly into oversized shopping tote.",
    severity: "HIGH",
    confidence: 0.92,
    status: "RESOLVED",
    stolenEstimate: 620.00,
    suspectProfile: "Female, blonde hair, beige trench coat, large canvas tote",
    officerNotes: "Audible PA deterrent triggered. Suspect abandoned bag on display table and exited.",
    snapshotUrl: null
  },
  {
    id: "INC-2026-875",
    timestamp: "2026-09-23 15:08:44",
    camera: "CAM-03",
    location: "Checkout Zone 02 // Self-Scan 04",
    department: "Self-Checkout Area",
    behavior: "Barcode Bypass / Non-Scan Bagging",
    description: "Item placed in bagging zone with barcode obstructed by customer palm.",
    severity: "MEDIUM",
    confidence: 0.88,
    status: "RESOLVED",
    stolenEstimate: 84.50,
    suspectProfile: "Male, red baseball cap, denim jacket",
    officerNotes: "Cashier assisted customer at terminal. Customer scanned missed item.",
    snapshotUrl: null
  },
  {
    id: "INC-2026-870",
    timestamp: "2026-09-23 13:30:19",
    camera: "CAM-04",
    location: "Aisle 12 // Premium Liquor",
    department: "Beverages & Spirits",
    behavior: "Dwell Time / Loitering (> 4 min)",
    description: "Individual repeatedly pacing blind spot behind single-malt scotch cabinet.",
    severity: "LOW",
    confidence: 0.81,
    status: "FALSE_ALARM",
    stolenEstimate: 0.00,
    suspectProfile: "Customer comparing vintage labels on mobile phone.",
    officerNotes: "Verified via floor patrol as customer reading gift review online. Dismissed.",
    snapshotUrl: null
  }
];

export const INITIAL_ANALYTICS = {
  shrinkagePreventedToday: 1845.50,
  incidentsFlaggedToday: 14,
  averageResponseSeconds: 19.4,
  aiPrecisionRate: 94.6,
  departmentRisk: [
    { name: "Cosmetics & Perfume", value: 38, color: "#EF4444" },
    { name: "Consumer Electronics", value: 31, color: "#F59E0B" },
    { name: "Premium Spirits", value: 18, color: "#06B6D4" },
    { name: "Designer Apparel", value: 13, color: "#8B5CF6" }
  ],
  hourlyTrend: [
    { hour: "08:00", incidents: 0 },
    { hour: "10:00", incidents: 1 },
    { hour: "12:00", incidents: 3 },
    { hour: "14:00", incidents: 2 },
    { hour: "16:00", incidents: 6 },
    { hour: "18:00", incidents: 8 },
    { hour: "20:00", incidents: 4 }
  ],
  activeGuards: [
    { id: "G-101", name: "Officer Sarah Vance", location: "Floor Section A/B", status: "PATROLLING" },
    { id: "G-102", name: "Officer Dave Martinez", location: "Exit Gate & Registers", status: "DISPATCHED" },
    { id: "G-103", name: "Officer Marcus Chen", location: "Control Room / CCTV", status: "MONITORING" }
  ]
};
