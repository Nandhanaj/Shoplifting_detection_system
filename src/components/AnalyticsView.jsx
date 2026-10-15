import React from 'react';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  MapPin, 
  Flame, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';

export default function AnalyticsView({ analytics }) {
  const { 
    shrinkagePreventedToday, 
    incidentsFlaggedToday, 
    averageResponseSeconds, 
    aiPrecisionRate, 
    departmentRisk, 
    hourlyTrend,
    activeGuards 
  } = analytics;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide">STORE LOSS PREVENTION ANALYTICS</h2>
          <p className="text-xs text-gray-400 font-mono">
            REAL-TIME METRICS // THEFT REDUCTION ROI // AI AUDIT TELEMETRY
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800 flex items-center">
          <ShieldCheck className="w-4 h-4 mr-1.5" />
          AI ENGINE PERFORMANCE: OPTIMAL
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Prevented Loss */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>PREVENTED SHRINKAGE</span>
            <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              ${shrinkagePreventedToday.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="block text-[11px] text-gray-400 mt-1 font-mono">Recovered merchandise value today</span>
          </div>
        </div>

        {/* Flagged Incidents */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>INCIDENTS FLAGGED</span>
            <div className="p-1.5 rounded-lg bg-red-950 text-red-400 border border-red-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-red-400">{incidentsFlaggedToday}</span>
            <span className="block text-[11px] text-gray-400 mt-1 font-mono">High-confidence detections (24h)</span>
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>AVG GUARD DISPATCH</span>
            <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-cyan-400">{averageResponseSeconds}s</span>
            <span className="block text-[11px] text-gray-400 mt-1 font-mono">Alert to on-floor interception</span>
          </div>
        </div>

        {/* AI Precision */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>MODEL PRECISION</span>
            <div className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-indigo-400">{aiPrecisionRate}%</span>
            <span className="block text-[11px] text-gray-400 mt-1 font-mono">Verified true positive rate</span>
          </div>
        </div>
      </div>

      {/* Charts & Store Blueprint Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Department Breakdown & Hourly Trends */}
        <div className="space-y-6">
          {/* Department Breakdown */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center">
              <Layers className="w-4 h-4 text-cyan-400 mr-2" />
              Department Shrinkage Exposure Breakdown
            </h3>

            <div className="space-y-3">
              {departmentRisk.map((dept) => (
                <div key={dept.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-200">{dept.name}</span>
                    <span className="text-gray-400 font-bold">{dept.value}%</span>
                  </div>
                  <div className="w-full bg-gray-950 rounded-full h-2.5 overflow-hidden border border-gray-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${dept.value}%`, backgroundColor: dept.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly Timeline Curve */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center">
              <Clock className="w-4 h-4 text-cyan-400 mr-2" />
              Peak Shoplifting Hourly Risk Curve
            </h3>

            <div className="flex items-end justify-between h-36 pt-4 px-2 border-b border-gray-800">
              {hourlyTrend.map((point) => {
                const maxVal = 10;
                const heightPercent = Math.max(12, (point.incidents / maxVal) * 100);
                return (
                  <div key={point.hour} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{point.incidents}</span>
                    <div 
                      className="w-5 sm:w-8 rounded-t bg-gradient-to-t from-cyan-600 to-red-500 transition-all duration-300 hover:brightness-125"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                    <span className="text-[10px] font-mono text-gray-400 mt-1">{point.hour}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Store Floorplan Heatmap */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center">
              <Flame className="w-4 h-4 text-red-400 mr-2" />
              Store Floorplan Loss Heatmap
            </h3>
            <span className="text-[10px] font-mono text-gray-400">RED = CRITICAL HOTSPOT</span>
          </div>

          {/* Interactive 2D Blueprint Graphic */}
          <div className="relative flex-1 min-h-[300px] bg-slate-950 rounded-xl border border-gray-800 p-4 overflow-hidden">
            {/* Store Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>

            {/* Department Zones */}
            {/* Zone B: Electronics */}
            <div className="absolute top-6 left-6 w-36 h-28 border border-red-500/50 bg-red-950/20 rounded-lg p-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-red-400 font-bold block">ZONE B // ELECTRONICS</span>
                <span className="text-[9px] text-gray-400">Smartphones & Audio</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-[9px] font-mono text-red-300 font-bold">HOTSPOT 31%</span>
              </div>
            </div>

            {/* Zone C: Cosmetics */}
            <div className="absolute top-6 right-6 w-40 h-28 border border-red-500/80 bg-red-950/30 rounded-lg p-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-red-400 font-bold block">ZONE C // COSMETICS</span>
                <span className="text-[9px] text-gray-400">Designer Fragrance Island</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-[9px] font-mono text-red-400 font-bold">CRITICAL HOTSPOT 38%</span>
              </div>
            </div>

            {/* Zone D: Liquor */}
            <div className="absolute bottom-24 left-6 w-36 h-24 border border-amber-500/50 bg-amber-950/20 rounded-lg p-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold block">ZONE D // SPIRITS</span>
                <span className="text-[9px] text-gray-400">Single Malt & Cognac</span>
              </div>
              <span className="text-[9px] font-mono text-amber-300">RISK 18%</span>
            </div>

            {/* Zone E: Apparel */}
            <div className="absolute bottom-24 right-6 w-40 h-24 border border-indigo-500/50 bg-indigo-950/20 rounded-lg p-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold block">ZONE E // APPAREL</span>
                <span className="text-[9px] text-gray-400">Fitting Stalls Perimeter</span>
              </div>
              <span className="text-[9px] font-mono text-indigo-300">RISK 13%</span>
            </div>

            {/* Zone A: Checkout & Zone F: Exit */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 h-14 border border-cyan-500/60 bg-cyan-950/30 rounded-lg p-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold block">ZONE A & F // REGISTERS & EXIT</span>
                <span className="text-[9px] text-gray-400">Self-Checkout 01-08 • EAS Pedestals</span>
              </div>
              <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                ACTIVE RADAR
              </span>
            </div>

            {/* Guard Location Blips */}
            {activeGuards.map((g, idx) => (
              <div 
                key={g.id}
                className="absolute flex items-center space-x-1 z-10"
                style={{
                  top: idx === 0 ? '45%' : idx === 1 ? '70%' : '20%',
                  left: idx === 0 ? '42%' : idx === 1 ? '50%' : '52%'
                }}
              >
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse border border-white shadow"></div>
                <span className="text-[9px] font-mono font-bold bg-black/80 px-1 py-0.2 rounded text-cyan-300 border border-cyan-900">
                  {g.id}
                </span>
              </div>
            ))}
          </div>

          {/* Active Guards List */}
          <div className="mt-4 pt-3 border-t border-gray-800">
            <span className="text-[11px] font-mono text-gray-400 block mb-2">ON-DUTY FLOOR PATROL ASSETS</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {activeGuards.map((g) => (
                <div key={g.id} className="bg-gray-950 p-2 rounded-lg border border-gray-800 text-[11px] font-mono">
                  <span className="text-white font-bold block">{g.name}</span>
                  <span className="text-cyan-400 text-[10px]">{g.location}</span>
                  <span className="text-gray-500 block text-[9px]">{g.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
