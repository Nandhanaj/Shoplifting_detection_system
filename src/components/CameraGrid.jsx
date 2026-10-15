import React, { useState } from 'react';
import { LayoutGrid, Grid3X3, Square, X, ShieldAlert, Radio, AlertTriangle } from 'lucide-react';
import CameraCard from './CameraCard';

export default function CameraGrid({ 
  cameras, 
  onToggleFeedType, 
  onTriggerIncident, 
  onDetectThreat,
  onSaveSnapshotToVault,
  onDispatchGuard,
  onPlayDeterrent
}) {
  const [layout, setLayout] = useState('3x2'); // '3x2', '2x2', 'focus'
  const [focusedCamera, setFocusedCamera] = useState(null);

  const getGridClasses = () => {
    switch (layout) {
      case '2x2':
        return 'grid-cols-1 md:grid-cols-2';
      case 'focus':
        return 'grid-cols-1';
      case '3x2':
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  const displayedCameras = layout === '2x2' ? cameras.slice(0, 4) : cameras;

  return (
    <div className="space-y-4">
      {/* Grid Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-900/60 p-3 rounded-xl border border-gray-800">
        
        {/* Left: Summary */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="font-mono text-gray-300 font-semibold flex items-center">
            <Radio className="w-3.5 h-3.5 text-cyan-400 mr-1.5 animate-pulse" />
            MULTI-CHANNEL SURVEILLANCE MATRIX
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400 font-mono">CHANNELS: {cameras.length} ONLINE</span>
        </div>

        {/* Right: Layout Switcher */}
        <div className="flex items-center space-x-1 bg-gray-950 p-1 rounded-lg border border-gray-800 text-xs">
          <button
            onClick={() => setLayout('3x2')}
            className={`p-1.5 rounded flex items-center space-x-1 ${
              layout === '3x2' ? 'bg-cyan-500/20 text-cyan-400 font-medium' : 'text-gray-400 hover:text-white'
            }`}
            title="3x2 Enterprise Grid (All 6 Feeds)"
          >
            <Grid3X3 className="w-4 h-4" />
            <span className="hidden sm:inline">6-Grid</span>
          </button>

          <button
            onClick={() => setLayout('2x2')}
            className={`p-1.5 rounded flex items-center space-x-1 ${
              layout === '2x2' ? 'bg-cyan-500/20 text-cyan-400 font-medium' : 'text-gray-400 hover:text-white'
            }`}
            title="2x2 High-Shrinkage Focus"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">4-Grid</span>
          </button>
        </div>
      </div>

      {/* Grid Matrix */}
      <div className={`grid gap-4 ${getGridClasses()}`}>
        {displayedCameras.map((cam) => (
          <CameraCard
            key={cam.id}
            camera={cam}
            onToggleFeedType={onToggleFeedType}
            onTriggerIncident={onTriggerIncident}
            onDetectThreat={onDetectThreat}
            onFocusCamera={(c) => setFocusedCamera(c)}
            onSaveSnapshotToVault={onSaveSnapshotToVault}
          />
        ))}
      </div>

      {/* Focus Modal (Expanded View) */}
      {focusedCamera && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#0B0F19] px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-mono font-bold text-white text-base">{focusedCamera.id}</span>
                <span className="text-gray-300 font-medium">{focusedCamera.name}</span>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                  {focusedCamera.resolution}
                </span>
              </div>

              <button
                onClick={() => setFocusedCamera(null)}
                className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Feed Body */}
            <div className="p-4 bg-black flex-1 flex flex-col items-center">
              <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden border border-gray-800 shadow-lg">
                <CameraCard
                  camera={focusedCamera}
                  onToggleFeedType={onToggleFeedType}
                  onTriggerIncident={onTriggerIncident}
                  onDetectThreat={onDetectThreat}
                  onFocusCamera={() => {}}
                  onSaveSnapshotToVault={onSaveSnapshotToVault}
                />
              </div>

              {/* Threat Controls in Focused View */}
              {focusedCamera.activeIncident && (
                <div className="w-full max-w-4xl mt-4 bg-red-950/40 border border-red-500/50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
                    <div>
                      <h4 className="text-sm font-bold text-red-300 uppercase tracking-wide">
                        {focusedCamera.activeIncident.behavior}
                      </h4>
                      <p className="text-xs text-gray-300 font-mono">
                        {focusedCamera.activeIncident.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onDispatchGuard(focusedCamera.activeIncident)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md transition-all"
                    >
                      Dispatch Security Guard
                    </button>
                    <button
                      onClick={() => onPlayDeterrent(focusedCamera.zone)}
                      className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-cyan-300 border border-cyan-800 text-xs font-semibold transition-all"
                    >
                      Play Store Deterrent
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
