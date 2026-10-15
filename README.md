# SentinelShield AI — Shoplifting Detection & Retail Loss Prevention System

**SentinelShield AI** is an enterprise-grade AI surveillance and retail loss prevention web application designed for security operations centers (SOC), asset protection managers, and retail loss prevention officers.

It monitors surveillance feeds, executes real-time behavioral computer vision heuristics to detect shoplifting (pocket concealment, bulk shelf sweeping, barcode bypass, and blind-spot loitering), triggers tactical audio-visual alarms, manages security guard dispatches, and maintains an evidentiary audit log.

---

## Key Features

1. **Multi-Channel CCTV Grid (6 Feeds)**
   - High-shrinkage store zones: Consumer Electronics (CAM-01), Luxury Perfumes & Cosmetics (CAM-02), Self-Checkout Register (CAM-03), Premium Spirits (CAM-04), Designer Apparel Perimeter (CAM-05), and Main EAS Sensor Exit (CAM-06).
   - Real-time animated patrons, shelving, and merchandise tracking with On-Screen Display (OSD) timecodes.

2. **Live Webcam AI Computer Vision**
   - Click **"Use Webcam"** on any feed to activate your actual device camera.
   - Powered by real-time computer vision (TensorFlow.js COCO-SSD / heuristic neural tracker) directly in the browser with zero server latency.
   - Detects persons, held items (bottles, cell phones, boxes, bags), and analyzes hand-to-pocket/clothing vector movements to flag suspicious concealment.

3. **Behavioral AI Shoplifting Detection Models**
   - **Pocket & Coat Concealment**: Flags when merchandise is slipped inside clothing or bags without checkout queueing.
   - **Bulk Shelf Sweeping**: Identifies rapid multi-item clearance from display pegs within seconds.
   - **Non-Scan Bagging**: Flags items placed on bagging scales while avoiding barcode optical scan.
   - **Blind-Spot Loitering**: Dwell time tracker monitoring high-risk alcoves.

4. **Security Operations & Dispatch Deck**
   - **Audio Alert Synthesizer**: Tactical two-tone security alarm chimes generated via the Web Audio API.
   - **Store PA Audio Deterrent**: Plays simulated public address announcements ("Attention store personnel: Customer assistance requested in Zone...").
   - **Floor Guard Dispatch**: Radio transmission modal assigning nearest patrolling officer (e.g. Officer Sarah Vance, Officer Dave Martinez).

5. **Incident Evidence Vault & Audit Log**
   - Searchable, filterable repository of all detected shoplifting incidents.
   - Officer notes field, loss value estimates ($), suspect profiles, and camera timestamps.
   - **Export to JSON** and **Print Report** for law enforcement and insurance documentation.

6. **Store Loss Prevention Analytics & Blueprint Heatmap**
   - KPI metrics: Prevented shrinkage ($), flagged incidents, average guard response time, and AI precision.
   - Department loss vulnerability breakdown and 24-hour peak theft curves.
   - Interactive 2D floorplan blueprint heatmap highlighting high-theft zones and active guard patrol locations.

---

## How to Run the Application

You have two ways to run this application:

### Option 1: Instant Launch (Zero Dependencies)
You can directly open `standalone-preview.html` in any web browser (Google Chrome, Microsoft Edge, Firefox, Brave, Safari):
- Navigate to:
  `C:\Users\jayap\.gemini\antigravity\scratch\shoplifting-detection-system\standalone-preview.html`
- Double-click the file, or right-click and choose **"Open with Google Chrome"** (or Edge).
- The complete application with the 6-channel CCTV matrix, live webcam AI mode, audio synthesizer, and evidence vault runs immediately with no installation required!

### Option 2: Run via Node.js / Vite
If you have Node.js installed and wish to run the modular Vite React project:
```bash
# Navigate to the project directory
cd "C:\Users\jayap\.gemini\antigravity\scratch\shoplifting-detection-system"

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Interactive Testing Guide

- **Test Simulated Shoplifting Threat**:
  Click the red **"Simulate Threat"** button on CAM-01 (Electronics) or CAM-02 (Cosmetics), or click **"Simulate Incident"** in the top navigation bar. Notice the camera border flash red, the tactical alarm chime sound, and the incident appear in the **Active Threats** stream.
- **Dispatch Security Guard**:
  In the Active Threats tab or on the focused camera feed, click **"Dispatch Guard"** to assign an officer and send the directive.
- **Test In-Store Deterrent**:
  Click **"PA Deterrent"** to hear the automated security voice announcement.
- **Test Real Webcam AI**:
  On any camera card, click **"Use Webcam"**. Allow browser camera access. Hold an object (phone, bottle, book) and bring it towards your pocket/jacket.
- **View Past Cases**:
  Open the **Evidence Vault** tab to filter and review archived theft incidents or export the report as JSON.
