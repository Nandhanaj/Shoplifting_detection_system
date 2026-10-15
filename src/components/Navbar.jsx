import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Video, 
  AlertTriangle, 
  Archive, 
  BarChart3, 
  Volume2, 
  VolumeX, 
  Settings, 
  Radio,
  Zap
} from 'lucide-react';
import { audioAlertEngine } from '../engine/audioAlerts';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  activeAlertsCount, 
  threatLevel, 
  onTriggerRandomIncident,
  onOpenSettings 
}) {
  const [timeStr, setTimeStr] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }) + ' UTC+' + (-(now.getTimezoneOffset() / 60)));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioAlertEngine.setMuted(next);
    if (!next) {
      audioAlertEngine.playAcknowledge();
    }
  };

  const getThreatColor = () => {
    if (threatLevel === 'CRITICAL') return 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse';
    if (threatLevel === 'ELEVATED') return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
  };

  return (
    <header className="bg-[#0B0F19] border-b border-gray-800 text-slate-100 px-4 py-2.5 sticky top-0 z-50 select-none">
      <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & System Status */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-wider text-base text-white">SENTINELSHIELD</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-medium">AI v2.4</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block mr-1.5"></span>
                CORE: ONLINE
              </span>
              <span>•</span>
              <span>{timeStr}</span>
            </div>
          </div>

          {/* Threat Level Badge */}
          <div className={`ml-4 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border flex items-center space-x-1.5 ${getThreatColor()}`}>
            <Radio className="w-3.5 h-3.5" />
            <span>THREAT LEVEL: {threatLevel}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 bg-gray-900/80 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => setCurrentTab('surveillance')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'surveillance' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Surveillance Grid</span>
          </button>

          <button
            onClick={() => setCurrentTab('alerts')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
              currentTab === 'alerts' 
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Active Threats</span>
            {activeAlertsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold animate-pulse">
                {activeAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('vault')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'vault' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
            }`}
          >
            <Archive className="w-4 h-4" />
            <span>Evidence Vault</span>
          </button>

          <button
            onClick={() => setCurrentTab('analytics')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'analytics' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Loss Analytics</span>
          </button>
        </nav>

        {/* Global Controls */}
        <div className="flex items-center space-x-2">
          {/* Quick Demo Trigger */}
          <button
            onClick={onTriggerRandomIncident}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-semibold hover:brightness-110 shadow-md shadow-red-600/30 transition-all active:scale-95"
            title="Inject a realistic simulated shoplifting incident for testing"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Incident</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border text-xs transition-all ${
              isMuted 
                ? 'bg-gray-800/80 text-gray-500 border-gray-700 hover:text-gray-300' 
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20'
            }`}
            title={isMuted ? "Unmute Alarm Sounds" : "Mute Alarm Sounds"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-700 text-xs transition-all"
            title="AI Detection Configuration"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
