import React, { useState } from 'react';
import { X, Sliders, Shield, Bell, Cpu, Save } from 'lucide-react';
import { audioAlertEngine } from '../engine/audioAlerts';

export default function SettingsModal({ settings, onSave, onClose }) {
  const [formData, setFormData] = useState({ ...settings });

  const handleChange = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(formData);
    audioAlertEngine.playAcknowledge();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-[#0B0F19] px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-wide">AI SURVEILLANCE SETTINGS</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 text-xs">
          
          {/* AI Confidence Threshold */}
          <div>
            <div className="flex justify-between font-mono mb-1.5">
              <span className="text-gray-300 font-semibold">Minimum Threat Confidence</span>
              <span className="text-cyan-400 font-bold">{formData.minConfidence}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={formData.minConfidence}
              onChange={(e) => handleChange('minConfidence', Number(e.target.value))}
              className="w-full accent-cyan-500 bg-gray-950 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Events with confidence below this threshold will not trigger audible store alarms.
            </p>
          </div>

          {/* Loitering / Dwell Time Alarm */}
          <div>
            <div className="flex justify-between font-mono mb-1.5">
              <span className="text-gray-300 font-semibold">Blind-Spot Loitering Alert Timer</span>
              <span className="text-cyan-400 font-bold">{formData.loiteringSeconds}s</span>
            </div>
            <input
              type="range"
              min="30"
              max="300"
              step="15"
              value={formData.loiteringSeconds}
              onChange={(e) => handleChange('loiteringSeconds', Number(e.target.value))}
              className="w-full accent-cyan-500 bg-gray-950 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Seconds a patron can remain stationary in a high-theft alcove before flagging security.
            </p>
          </div>

          {/* Behavioral Model Toggles */}
          <div className="space-y-2.5 pt-2 border-t border-gray-800">
            <span className="font-mono text-gray-400 font-semibold uppercase tracking-wider block">
              Active Behavioral Detection Engines
            </span>

            <label className="flex items-center justify-between p-2.5 rounded-lg bg-gray-950 border border-gray-800 cursor-pointer">
              <div>
                <span className="text-white font-medium block">Pocket & Bag Concealment Detection</span>
                <span className="text-[10px] text-gray-400">Tracks hand-to-torso items vanishing into clothing</span>
              </div>
              <input
                type="checkbox"
                checked={formData.detectConcealment}
                onChange={(e) => handleChange('detectConcealment', e.target.checked)}
                className="w-4 h-4 accent-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-lg bg-gray-950 border border-gray-800 cursor-pointer">
              <div>
                <span className="text-white font-medium block">Bulk Shelf Sweeping Detection</span>
                <span className="text-[10px] text-gray-400">Rapid repetitive multi-item removal from peg hooks</span>
              </div>
              <input
                type="checkbox"
                checked={formData.detectSweeping}
                onChange={(e) => handleChange('detectSweeping', e.target.checked)}
                className="w-4 h-4 accent-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-lg bg-gray-950 border border-gray-800 cursor-pointer">
              <div>
                <span className="text-white font-medium block">Self-Checkout Non-Scan Bagging</span>
                <span className="text-[10px] text-gray-400">Scans barcode camera correlation against bagging scale</span>
              </div>
              <input
                type="checkbox"
                checked={formData.detectCheckoutBypass}
                onChange={(e) => handleChange('detectCheckoutBypass', e.target.checked)}
                className="w-4 h-4 accent-cyan-500"
              />
            </label>
          </div>

          {/* Sound & Dispatch Automation */}
          <div className="space-y-2.5 pt-2 border-t border-gray-800">
            <label className="flex items-center justify-between p-2.5 rounded-lg bg-gray-950 border border-gray-800 cursor-pointer">
              <div>
                <span className="text-white font-medium block">Auto-Dispatch Floor Security</span>
                <span className="text-[10px] text-gray-400">Automatically ping guard handset on Critical threats</span>
              </div>
              <input
                type="checkbox"
                checked={formData.autoDispatchGuards}
                onChange={(e) => handleChange('autoDispatchGuards', e.target.checked)}
                className="w-4 h-4 accent-cyan-500"
              />
            </label>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-gray-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center space-x-1.5 transition-all shadow"
            >
              <Save className="w-4 h-4" />
              <span>Save AI Parameters</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
