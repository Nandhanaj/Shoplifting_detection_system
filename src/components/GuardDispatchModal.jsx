import React, { useState } from 'react';
import { X, UserCheck, Shield, Send, Radio, AlertTriangle } from 'lucide-react';
import { audioAlertEngine } from '../engine/audioAlerts';

export default function GuardDispatchModal({ incident, guards, onConfirmDispatch, onClose }) {
  const [selectedGuard, setSelectedGuard] = useState(guards[0]?.id || '');
  const [priorityNote, setPriorityNote] = useState('Intercept suspect calmly at zone perimeter. Observe for concealed merchandise.');

  const handleDispatch = (e) => {
    e.preventDefault();
    const guardObj = guards.find(g => g.id === selectedGuard);
    onConfirmDispatch({
      incidentId: incident.id,
      guardId: selectedGuard,
      guardName: guardObj ? guardObj.name : 'Floor Guard',
      priorityNote
    });
    audioAlertEngine.playAcknowledge();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-[#0B0F19] px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Radio className="w-5 h-5 text-red-400 animate-pulse" />
            <h3 className="text-base font-bold text-white tracking-wide">DISPATCH FLOOR SECURITY</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleDispatch} className="p-6 space-y-4 text-xs font-mono">
          
          {/* Target Threat Summary */}
          <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-400 uppercase text-xs flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1 text-red-400 inline" />
                {incident.behavior}
              </span>
              <span className="text-white bg-black/50 px-2 py-0.5 rounded text-[10px]">
                {incident.camera}
              </span>
            </div>
            <p className="text-gray-300 font-sans text-xs">{incident.location}</p>
            <p className="text-gray-400 text-[11px] mt-1">{incident.description}</p>
          </div>

          {/* Select Guard */}
          <div>
            <label className="text-gray-300 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">
              Assign Floor Security Officer
            </label>
            <div className="space-y-2">
              {guards.map((guard) => (
                <label
                  key={guard.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedGuard === guard.id 
                      ? 'bg-cyan-950/50 border-cyan-500 text-white' 
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="guardSelect"
                      value={guard.id}
                      checked={selectedGuard === guard.id}
                      onChange={() => setSelectedGuard(guard.id)}
                      className="accent-cyan-500"
                    />
                    <div>
                      <span className="font-bold text-white block">{guard.name}</span>
                      <span className="text-[10px] text-gray-400 font-sans">{guard.location}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    guard.status === 'PATROLLING' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-gray-800 text-gray-300'
                  }`}>
                    {guard.status}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Radio Transmission Order */}
          <div>
            <label className="text-gray-300 block mb-1 font-bold uppercase tracking-wider text-[11px]">
              Radio Transmission Directive
            </label>
            <textarea
              value={priorityNote}
              onChange={(e) => setPriorityNote(e.target.value)}
              rows="2"
              className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-gray-200 focus:outline-none focus:border-red-500 font-sans text-xs"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center space-x-1.5 shadow-lg shadow-red-600/30 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Guard Dispatch</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
