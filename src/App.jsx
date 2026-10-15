import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import CameraGrid from './components/CameraGrid';
import AlertFeed from './components/AlertFeed';
import IncidentVault from './components/IncidentVault';
import AnalyticsView from './components/AnalyticsView';
import SettingsModal from './components/SettingsModal';
import GuardDispatchModal from './components/GuardDispatchModal';

import { 
  INITIAL_CAMERAS, 
  INITIAL_INCIDENTS, 
  INITIAL_ANALYTICS 
} from './engine/simulatedData';
import { audioAlertEngine } from './engine/audioAlerts';

export default function App() {
  const [currentTab, setCurrentTab] = useState('surveillance');
  const [cameras, setCameras] = useState(INITIAL_CAMERAS);
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [threatLevel, setThreatLevel] = useState('NORMAL');
  const [analytics, setAnalytics] = useState(INITIAL_ANALYTICS);
  
  const [settings, setSettings] = useState({
    minConfidence: 75,
    loiteringSeconds: 90,
    detectConcealment: true,
    detectSweeping: true,
    detectCheckoutBypass: true,
    autoDispatchGuards: false
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dispatchModalIncident, setDispatchModalIncident] = useState(null);

  // Compute overall threat level based on active alerts
  useEffect(() => {
    if (activeAlerts.some(a => a.severity === 'CRITICAL')) {
      setThreatLevel('CRITICAL');
    } else if (activeAlerts.length > 0) {
      setThreatLevel('ELEVATED');
    } else {
      setThreatLevel('NORMAL');
    }
  }, [activeAlerts]);

  // Toggle Camera Feed (CCTV Simulator <-> Real Webcam)
  const handleToggleFeedType = (cameraId) => {
    setCameras(prev => prev.map(cam => {
      if (cam.id === cameraId) {
        const nextType = cam.feedType === 'webcam' ? 'simulated' : 'webcam';
        return { ...cam, feedType: nextType };
      }
      return cam;
    }));
    audioAlertEngine.playAcknowledge();
  };

  // Trigger a simulated shoplifting threat on a camera
  const handleTriggerIncident = useCallback((cameraId) => {
    const targetCam = cameras.find(c => c.id === cameraId) || cameras[0];
    const timestampStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const incidentId = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    let behavior = "Pocket Concealment";
    let desc = "Patron slipped high-value merchandise into jacket pocket after surveying camera angle.";
    let sev = "CRITICAL";
    let stolenVal = 249.99;

    if (targetCam.scenarioType === 'sweeping') {
      behavior = "Bulk Shelf Sweeping";
      desc = "Multiple items rapidly cleared off shelf hooks directly into oversized tote bag.";
      stolenVal = 580.00;
    } else if (targetCam.scenarioType === 'checkout_bypass') {
      behavior = "Self-Checkout Non-Scan Bagging";
      desc = "Item added to bagging scale area without barcode scan registration.";
      sev = "HIGH";
      stolenVal = 89.95;
    } else if (targetCam.scenarioType === 'loitering') {
      behavior = "Blind-Spot Loitering (> 3 min)";
      desc = "Subject lingering in alcohol alcove without shopping cart or basket.";
      sev = "HIGH";
      stolenVal = 120.00;
    }

    const newAlert = {
      id: incidentId,
      timestamp: timestampStr,
      camera: targetCam.id,
      location: targetCam.name,
      department: targetCam.department,
      behavior,
      description: desc,
      severity: sev,
      confidence: targetCam.modelConfidence || 0.94,
      status: "ACTIVE",
      stolenEstimate: stolenVal,
      suspectProfile: "Subject in dark clothing observed near primary display rack.",
      officerNotes: "",
      snapshotUrl: null
    };

    // Update camera state
    setCameras(prev => prev.map(c => c.id === targetCam.id ? { ...c, activeIncident: newAlert } : c));
    
    // Add to alerts
    setActiveAlerts(prev => [newAlert, ...prev]);

    // Update analytics
    setAnalytics(prev => ({
      ...prev,
      incidentsFlaggedToday: prev.incidentsFlaggedToday + 1
    }));

    // Play tactical sound alert
    audioAlertEngine.playThreatAlert();

    // Auto-dispatch if enabled
    if (settings.autoDispatchGuards) {
      setTimeout(() => {
        handleConfirmDispatch({
          incidentId: newAlert.id,
          guardId: "G-101",
          guardName: "Officer Sarah Vance",
          priorityNote: "Automatic AI dispatch triggered."
        });
      }, 1000);
    }
  }, [cameras, settings.autoDispatchGuards]);

  // Handle Threat Detected by Real Webcam Computer Vision
  const handleDetectThreatFromWebcam = ({ cameraId, behavior, confidence, description }) => {
    const targetCam = cameras.find(c => c.id === cameraId) || cameras[0];
    const timestampStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const incidentId = `INC-LIVE-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAlert = {
      id: incidentId,
      timestamp: timestampStr,
      camera: targetCam.id,
      location: `${targetCam.name} (Live Webcam)`,
      department: targetCam.department,
      behavior,
      description,
      severity: "CRITICAL",
      confidence,
      status: "ACTIVE",
      stolenEstimate: 150.00,
      suspectProfile: "Live webcam stream target.",
      officerNotes: "Identified via real-time browser Computer Vision neural network.",
      snapshotUrl: null
    };

    setCameras(prev => prev.map(c => c.id === targetCam.id ? { ...c, activeIncident: newAlert } : c));
    setActiveAlerts(prev => [newAlert, ...prev]);
    audioAlertEngine.playThreatAlert();
  };

  // Trigger Random Threat for quick demo
  const handleTriggerRandomIncident = () => {
    const randomCam = cameras[Math.floor(Math.random() * cameras.length)];
    handleTriggerIncident(randomCam.id);
  };

  // Dispatch Security Guard
  const handleOpenDispatchModal = (incident) => {
    setDispatchModalIncident(incident);
  };

  const handleConfirmDispatch = ({ incidentId, guardId, guardName, priorityNote }) => {
    // Update incident status
    setIncidents(prev => {
      const existing = prev.find(i => i.id === incidentId);
      if (existing) {
        return prev.map(i => i.id === incidentId ? { ...i, status: "DISPATCHED", officerNotes: priorityNote } : i);
      }
      // Or find in active alerts and add
      const alertObj = activeAlerts.find(a => a.id === incidentId);
      if (alertObj) {
        return [{ ...alertObj, status: "DISPATCHED", officerNotes: `Dispatched to ${guardName}. ${priorityNote}` }, ...prev];
      }
      return prev;
    });

    // Mark in alerts
    setActiveAlerts(prev => prev.filter(a => a.id !== incidentId));

    // Clear camera active incident
    setCameras(prev => prev.map(c => c.activeIncident?.id === incidentId ? { ...c, activeIncident: null } : c));

    // Update analytics prevented amount
    setAnalytics(prev => ({
      ...prev,
      shrinkagePreventedToday: prev.shrinkagePreventedToday + 249.99
    }));
  };

  // Play Store PA Audio Deterrent
  const handlePlayDeterrent = (zoneName) => {
    audioAlertEngine.playStoreDeterrent(zoneName);
  };

  // Save Incident to Evidence Vault
  const handleSaveToVault = (alert) => {
    setIncidents(prev => [
      { ...alert, status: "RESOLVED" },
      ...prev.filter(i => i.id !== alert.id)
    ]);
    setActiveAlerts(prev => prev.filter(a => a.id !== alert.id));
    setCameras(prev => prev.map(c => c.activeIncident?.id === alert.id ? { ...c, activeIncident: null } : c));
    audioAlertEngine.playAcknowledge();
  };

  // Save Snapshot directly to vault from CameraCard
  const handleSaveSnapshotToVault = (camera, dataUrl) => {
    const timestampStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newInc = {
      id: `SNAP-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: timestampStr,
      camera: camera.id,
      location: camera.name,
      department: camera.department,
      behavior: camera.activeIncident ? camera.activeIncident.behavior : "Manual Security Audit Snapshot",
      description: "Snapshot manually captured by security operator from live camera stream.",
      severity: camera.activeIncident ? camera.activeIncident.severity : "LOW",
      confidence: camera.activeIncident ? camera.activeIncident.confidence : 0.99,
      status: "RESOLVED",
      stolenEstimate: 0,
      suspectProfile: "Subject captured during active camera scan.",
      officerNotes: "Snapshot logged into evidence archive.",
      snapshotUrl: dataUrl
    };
    setIncidents(prev => [newInc, ...prev]);
    audioAlertEngine.playAcknowledge();
    alert(`Snapshot from ${camera.id} archived into Evidence Vault!`);
  };

  // Dismiss alert as false alarm
  const handleDismissAlert = (alertId) => {
    const alertObj = activeAlerts.find(a => a.id === alertId);
    if (alertObj) {
      setIncidents(prev => [{ ...alertObj, status: "FALSE_ALARM" }, ...prev]);
    }
    setActiveAlerts(prev => prev.filter(a => a.id !== alertId));
    setCameras(prev => prev.map(c => c.activeIncident?.id === alertId ? { ...c, activeIncident: null } : c));
    audioAlertEngine.playAcknowledge();
  };

  // Update existing incident in vault (e.g. editing officer notes)
  const handleUpdateIncident = (updated) => {
    setIncidents(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeAlertsCount={activeAlerts.length}
        threatLevel={threatLevel}
        onTriggerRandomIncident={handleTriggerRandomIncident}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-[1920px] w-full mx-auto">
        {currentTab === 'surveillance' && (
          <CameraGrid
            cameras={cameras}
            onToggleFeedType={handleToggleFeedType}
            onTriggerIncident={handleTriggerIncident}
            onDetectThreat={handleDetectThreatFromWebcam}
            onSaveSnapshotToVault={handleSaveSnapshotToVault}
            onDispatchGuard={handleOpenDispatchModal}
            onPlayDeterrent={handlePlayDeterrent}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertFeed
            alerts={activeAlerts}
            onDispatchGuard={handleOpenDispatchModal}
            onPlayDeterrent={handlePlayDeterrent}
            onSaveToVault={handleSaveToVault}
            onDismissAlert={handleDismissAlert}
          />
        )}

        {currentTab === 'vault' && (
          <IncidentVault
            incidents={incidents}
            onUpdateIncident={handleUpdateIncident}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView analytics={analytics} />
        )}
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onSave={(newSettings) => setSettings(newSettings)}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Guard Dispatch Modal */}
      {dispatchModalIncident && (
        <GuardDispatchModal
          incident={dispatchModalIncident}
          guards={analytics.activeGuards}
          onConfirmDispatch={handleConfirmDispatch}
          onClose={() => setDispatchModalIncident(null)}
        />
      )}

      {/* Bottom Footer Status Bar */}
      <footer className="bg-[#0B0F19] border-t border-gray-900 px-4 py-2 text-xs font-mono text-gray-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block mr-1.5 animate-pulse"></span>
            SENTINELSHIELD LOSS PREVENTION NETWORK
          </span>
          <span>•</span>
          <span>STORE ID: #9042-METRO</span>
          <span>•</span>
          <span>STATION: SOC-PRIMARY-01</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>AI VISION: TF-COCO-SSD v2</span>
          <span>•</span>
          <span className="text-gray-400">LATENCY: 12ms</span>
          <span>•</span>
          <span className="text-emerald-400">ENCRYPTION: AES-256</span>
        </div>
      </footer>
    </div>
  );
}
