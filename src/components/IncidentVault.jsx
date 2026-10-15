import React, { useState } from 'react';
import { 
  Archive, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Printer,
  ChevronRight,
  X
} from 'lucide-react';

export default function IncidentVault({ incidents, onUpdateIncident }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [editNotes, setEditNotes] = useState('');

  const filteredIncidents = incidents.filter(inc => {
    const matchesFilter = filterStatus === 'ALL' || inc.status === filterStatus;
    const matchesSearch = 
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.behavior.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inc.suspectProfile && inc.suspectProfile.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleOpenDetail = (inc) => {
    setSelectedIncident(inc);
    setEditNotes(inc.officerNotes || '');
  };

  const handleSaveNotes = () => {
    if (selectedIncident && onUpdateIncident) {
      onUpdateIncident({
        ...selectedIncident,
        officerNotes: editNotes
      });
      setSelectedIncident(prev => ({ ...prev, officerNotes: editNotes }));
    }
  };

  const exportToJson = () => {
    const blob = new Blob([JSON.stringify(incidents, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loss-prevention-incidents-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-xs font-mono font-bold">ACTIVE</span>;
      case 'DISPATCHED':
        return <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-xs font-mono font-bold">DISPATCHED</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">RESOLVED</span>;
      case 'FALSE_ALARM':
        return <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700 text-xs font-mono">DISMISSED</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Bar with Search & Filters */}
      <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-800 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-cyan-400 border border-gray-700">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">INCIDENT EVIDENCE VAULT</h2>
            <p className="text-xs text-gray-400 font-mono">
              SECURE LOSS PREVENTION AUDIT LOG // {incidents.length} RECORDS ARCHIVED
            </p>
          </div>
        </div>

        {/* Right: Actions & Export */}
        <div className="flex items-center space-x-2">
          <button
            onClick={exportToJson}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-cyan-800/80 text-xs font-medium transition-all"
            title="Export full incident archive to JSON"
          >
            <Download className="w-4 h-4" />
            <span>Export Archive</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-xs font-medium transition-all"
            title="Print incident summary"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>

      </div>

      {/* Filter and Search Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-900/50 p-3 rounded-xl border border-gray-800 text-xs">
        
        {/* Status Filters */}
        <div className="flex items-center space-x-1 overflow-x-auto">
          {['ALL', 'ACTIVE', 'DISPATCHED', 'RESOLVED', 'FALSE_ALARM'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg font-mono transition-all ${
                filterStatus === status 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, camera, behavior..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* Incidents Table / List */}
      <div className="bg-gray-900/70 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-950/80 text-gray-400 font-mono border-b border-gray-800 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Camera / Zone</th>
                <th className="py-3 px-4">Behavior Flag</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Est. Loss</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-mono">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500">
                    No incidents match your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr 
                    key={inc.id}
                    onClick={() => handleOpenDetail(inc)}
                    className="hover:bg-gray-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-cyan-400">{inc.id}</td>
                    <td className="py-3 px-4 text-gray-300">{inc.timestamp}</td>
                    <td className="py-3 px-4 text-gray-200">
                      <span className="font-bold text-white mr-1.5">{inc.camera}</span>
                      <span className="text-gray-400 text-[11px]">({inc.location})</span>
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-gray-100">{inc.behavior}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inc.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                        inc.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-cyan-950 text-cyan-400 border border-cyan-800'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">
                      ${inc.stolenEstimate ? inc.stolenEstimate.toFixed(2) : '0.00'}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(inc.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-gray-400 hover:text-cyan-400">
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail Drawer / Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            
            {/* Header */}
            <div className="bg-[#0B0F19] px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-base font-bold text-cyan-400">{selectedIncident.id}</span>
                  {getStatusBadge(selectedIncident.status)}
                </div>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{selectedIncident.timestamp}</p>
              </div>

              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Snapshot View (if available) */}
              {selectedIncident.snapshotUrl && (
                <div className="rounded-xl overflow-hidden border border-gray-800">
                  <img
                    src={selectedIncident.snapshotUrl}
                    alt="Incident Snapshot"
                    className="w-full h-auto object-cover"
                  />
                  <div className="bg-black/80 p-2 text-center text-xs font-mono text-cyan-400">
                    EVIDENCE SNAPSHOT // AI BOUNDING BOX VERIFIED
                  </div>
                </div>
              )}

              {/* Behavior & Camera */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-gray-950 p-3 rounded-lg border border-gray-800">
                  <span className="text-gray-500 block mb-1">LOCATION FEED</span>
                  <span className="text-white font-bold">{selectedIncident.camera}</span>
                  <p className="text-gray-400 mt-0.5">{selectedIncident.location}</p>
                </div>

                <div className="bg-gray-950 p-3 rounded-lg border border-gray-800">
                  <span className="text-gray-500 block mb-1">BEHAVIOR DETECTED</span>
                  <span className="text-red-400 font-bold">{selectedIncident.behavior}</span>
                  <p className="text-gray-400 mt-0.5">Confidence: {Math.round((selectedIncident.confidence || 0.9) * 100)}%</p>
                </div>
              </div>

              {/* Narrative Description */}
              <div className="bg-gray-950 p-3 rounded-lg border border-gray-800 text-xs">
                <span className="text-gray-500 font-mono block mb-1">EVENT NARRATIVE</span>
                <p className="text-gray-200">{selectedIncident.description}</p>
              </div>

              {/* Suspect Profile */}
              <div className="bg-gray-950 p-3 rounded-lg border border-gray-800 text-xs">
                <span className="text-gray-500 font-mono block mb-1">SUSPECT PROFILE DESCRIPTION</span>
                <p className="text-gray-200">{selectedIncident.suspectProfile || "Visual signature recorded by AI object classifier."}</p>
              </div>

              {/* Officer Notes Editor */}
              <div className="text-xs">
                <label className="text-gray-400 font-mono block mb-1.5">INVESTIGATOR / OFFICER LOGS</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows="3"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-cyan-500 font-mono"
                  placeholder="Enter security officer follow-up actions, police report number, merchandise recovery notes..."
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold font-mono text-xs transition-all shadow"
                  >
                    Save Notes to Evidence
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
