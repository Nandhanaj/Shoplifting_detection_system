import React, { useState, useRef } from 'react';
import { 
  Maximize2, 
  Camera as CameraIcon, 
  Layers, 
  Video, 
  Zap, 
  AlertTriangle, 
  CheckCircle2,
  Eye
} from 'lucide-react';
import SimulatedFeed from './SimulatedFeed';
import LiveWebcamFeed from './LiveWebcamFeed';

export default function CameraCard({ 
  camera, 
  onToggleFeedType, 
  onTriggerIncident, 
  onDetectThreat,
  onFocusCamera,
  onSaveSnapshotToVault
}) {
  const [aiOverlay, setAiOverlay] = useState(true);
  const captureSnapshotRef = useRef(null);

  const getRiskBadge = (risk) => {
    switch(risk) {
      case 'CRITICAL':
        return <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-mono font-bold">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-mono font-bold">HIGH RISK</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">NORMAL</span>;
    }
  };

  const handleCaptureSnapshot = () => {
    if (captureSnapshotRef.current) {
      const dataUrl = captureSnapshotRef.current();
      if (dataUrl && onSaveSnapshotToVault) {
        onSaveSnapshotToVault(camera, dataUrl);
      }
    }
  };

  const isAlertActive = !!camera.activeIncident;

  return (
    <div className={`group relative rounded-xl overflow-hidden bg-gray-900 border transition-all duration-300 flex flex-col ${
      isAlertActive 
        ? 'border-red-500 shadow-lg shadow-red-500/25 ring-2 ring-red-500/50' 
        : 'border-gray-800 hover:border-gray-700'
    }`}>
      {/* Top Header Bar */}
      <div className="bg-[#0B0F19] px-3 py-2 border-b border-gray-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${isAlertActive ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></span>
          <span className="font-mono font-bold text-white tracking-wide">{camera.id}</span>
          <span className="text-gray-400 truncate max-w-[150px]">{camera.name}</span>
        </div>

        <div className="flex items-center space-x-2">
          {getRiskBadge(camera.riskLevel)}
          <span className="text-[10px] font-mono text-gray-400 px-1.5 py-0.5 bg-gray-800/70 rounded">
            {camera.feedType === 'webcam' ? 'LIVE WEBCAM' : 'CCTV-RTSP'}
          </span>
        </div>
      </div>

      {/* Main Video Screen Area */}
      <div className="relative aspect-video w-full bg-black overflow-hidden">
        {camera.feedType === 'webcam' ? (
          <LiveWebcamFeed
            camera={camera}
            onDetectThreat={onDetectThreat}
            onCaptureSnapshot={(fn) => { captureSnapshotRef.current = fn; }}
            isAiOverlayEnabled={aiOverlay}
          />
        ) : (
          <SimulatedFeed
            camera={camera}
            onTriggerIncident={onTriggerIncident}
            onCaptureSnapshot={(fn) => { captureSnapshotRef.current = fn; }}
            isAiOverlayEnabled={aiOverlay}
          />
        )}

        {/* Threat Banner (If Active Incident) */}
        {isAlertActive && (
          <div className="absolute top-2 left-2 right-2 bg-red-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg flex items-center justify-between border border-red-400 shadow-lg animate-pulse z-20">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-white" />
              <div className="text-xs font-mono font-bold uppercase tracking-wider">
                {camera.activeIncident.behavior}
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold bg-black/40 px-2 py-0.5 rounded">
              CONF: {Math.round((camera.activeIncident.confidence || 0.94) * 100)}%
            </span>
          </div>
        )}

        {/* Hover Action HUD Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex flex-col justify-end p-3 z-30">
          <div className="flex items-center justify-between pointer-events-auto">
            
            {/* Left Controls */}
            <div className="flex items-center space-x-1.5">
              {/* Trigger Simulated Incident */}
              <button
                onClick={() => onTriggerIncident(camera.id)}
                className="px-2.5 py-1 rounded bg-red-600/80 hover:bg-red-500 text-white text-[11px] font-medium flex items-center space-x-1 shadow transition-all"
                title="Simulate shoplifting event on this camera"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Threat</span>
              </button>

              {/* Switch Webcam / Simulated */}
              <button
                onClick={() => onToggleFeedType(camera.id)}
                className="px-2.5 py-1 rounded bg-gray-800/90 hover:bg-gray-700 text-cyan-400 text-[11px] font-medium border border-gray-700 flex items-center space-x-1 shadow transition-all"
                title={camera.feedType === 'webcam' ? "Switch to CCTV Simulator" : "Switch to Live Webcam"}
              >
                <Video className="w-3.5 h-3.5" />
                <span>{camera.feedType === 'webcam' ? 'Use CCTV' : 'Use Webcam'}</span>
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-1.5">
              {/* Toggle AI Bounding Boxes */}
              <button
                onClick={() => setAiOverlay(!aiOverlay)}
                className={`p-1.5 rounded text-xs transition-all ${
                  aiOverlay 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                    : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                }`}
                title="Toggle AI Bounding Boxes"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>

              {/* Capture Snapshot */}
              <button
                onClick={handleCaptureSnapshot}
                className="p-1.5 rounded bg-gray-800/90 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-all"
                title="Capture Snapshot to Evidence Locker"
              >
                <CameraIcon className="w-3.5 h-3.5" />
              </button>

              {/* Maximize / Focus */}
              <button
                onClick={() => onFocusCamera(camera)}
                className="p-1.5 rounded bg-gray-800/90 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-all"
                title="Focus Camera Feed"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Information Footer */}
      <div className="bg-[#0B0F19] px-3 py-1.5 border-t border-gray-800/70 text-[11px] flex items-center justify-between text-gray-400 font-mono">
        <span className="truncate">{camera.focalZone}</span>
        <div className="flex items-center space-x-2">
          <span>{camera.resolution}</span>
          <span>•</span>
          <span className="text-cyan-400">AI ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
