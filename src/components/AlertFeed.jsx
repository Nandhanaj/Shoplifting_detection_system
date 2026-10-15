import React from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  UserCheck, 
  Volume2, 
  Archive, 
  XCircle, 
  Radio, 
  Clock, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export default function AlertFeed({ 
  alerts, 
  onDispatchGuard, 
  onPlayDeterrent, 
  onSaveToVault, 
  onDismissAlert 
}) {
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'border-red-500 bg-red-950/20 text-red-400';
      case 'HIGH':
        return 'border-amber-500 bg-amber-950/20 text-amber-400';
      default:
        return 'border-cyan-500 bg-cyan-950/20 text-cyan-400';
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <h2 className="text-base font-bold text-white tracking-wide">ACTIVE THREAT STREAM</h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time loss prevention incidents requiring operator verification or floor intervention.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-red-950/60 border border-red-800 text-red-300 font-bold">
            {alerts.length} THREATS PENDING
          </span>
        </div>
      </div>

      {/* Threats List */}
      {alerts.length === 0 ? (
        <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-center mb-4 text-emerald-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-gray-200">Perimeter Secure // Zero Active Threats</h3>
          <p className="text-xs text-gray-400 max-w-md mt-1.5">
            All camera feeds are normal. Use the "Simulate Incident" button on top or on any camera feed to test threat responses.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all duration-200 bg-gray-900/90 shadow-lg ${getSeverityStyle(alert.severity)}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Left: Metadata & Behavior */}
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-2 rounded-lg bg-red-950 border border-red-800/80 text-red-400 animate-bounce">
                    <AlertTriangle className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded border border-gray-700">
                        {alert.camera}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {alert.location}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        alert.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-600 text-black'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                        CONF: {Math.round(alert.confidence * 100)}%
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-1.5 uppercase tracking-wide">
                      {alert.behavior}
                    </h4>

                    <p className="text-xs text-gray-300 font-mono mt-1">
                      {alert.description}
                    </p>

                    <div className="flex items-center space-x-4 mt-2 text-[11px] text-gray-400 font-mono">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {alert.timestamp}
                      </span>
                      <span>•</span>
                      <span>Shrinkage Est: ${alert.stolenEstimate?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Operator Intervention Buttons */}
                <div className="flex flex-wrap items-center gap-2 md:self-center">
                  {/* Dispatch Floor Security */}
                  <button
                    onClick={() => onDispatchGuard(alert)}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-red-600/30 transition-all active:scale-95"
                    title="Dispatch nearest patrolling guard to intercept"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Dispatch Guard</span>
                  </button>

                  {/* Play PA Deterrent Announcement */}
                  <button
                    onClick={() => onPlayDeterrent(alert.location)}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-cyan-300 border border-cyan-800/80 text-xs font-medium flex items-center space-x-1.5 transition-all"
                    title="Trigger automated audio deterrent announcement over PA"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>PA Deterrent</span>
                  </button>

                  {/* Save to Evidence Vault */}
                  <button
                    onClick={() => onSaveToVault(alert)}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-xs font-medium flex items-center space-x-1.5 transition-all"
                    title="Commit incident and video frame to Evidence Locker"
                  >
                    <Archive className="w-4 h-4" />
                    <span>Log Incident</span>
                  </button>

                  {/* Dismiss (False Alarm) */}
                  <button
                    onClick={() => onDismissAlert(alert.id)}
                    className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-red-400 border border-gray-700 transition-all"
                    title="Dismiss as False Alarm"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
