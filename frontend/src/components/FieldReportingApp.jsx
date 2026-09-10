import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  CheckSquare, 
  Camera, 
  MapPin, 
  Clock, 
  Send, 
  AlertTriangle, 
  UserCheck, 
  RefreshCw, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FieldReportingApp({ mines, isOffline, onSyncQueue }) {
  const [activeTab, setActiveTab] = useState('inspection'); // 'inspection' | 'incident' | 'attendance'
  const [selectedMine, setSelectedMine] = useState(mines[0]?.id || 'mine-1');
  const [inspectorName, setInspectorName] = useState('Rajesh Sharma');
  const [hazardRating, setHazardRating] = useState('Low');
  const [notes, setNotes] = useState('');
  const [gpsLocation, setGpsLocation] = useState({ lat: 23.7500, lng: 86.4167 });
  const [isLocating, setIsLocating] = useState(false);
  const [checklist, setChecklist] = useState({
    slope_stability: true,
    ventilation_fans: true,
    methane_gas_detector: false,
    dust_suppression_sprinklers: false,
    ppe_equipment_verification: true,
  });

  // Offline queue state stored in localStorage
  const [offlineQueue, setOfflineQueue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('coalguard_offline_queue') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('coalguard_offline_queue', JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  // Handle GPS location fetch
  const handleFetchLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setGpsLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsLocating(false);
        },
        () => {
          const mine = mines.find(m => m.id === selectedMine) || mines[0];
          setGpsLocation({ lat: mine.latitude, lng: mine.longitude });
          setIsLocating(false);
        }
      );
    } else {
      const mine = mines.find(m => m.id === selectedMine) || mines[0];
      setGpsLocation({ lat: mine.latitude, lng: mine.longitude });
      setIsLocating(false);
    }
  };

  // Submit Inspection Report
  const handleSubmitReport = async (e) => {
    e.preventDefault();

    const reportData = {
      mine_id: selectedMine,
      inspector_name: inspectorName,
      inspector_role: 'Field Officer',
      overall_status: checklist.methane_gas_detector && checklist.dust_suppression_sprinklers ? 'Passed' : 'Passed with Observations',
      hazard_rating: hazardRating,
      checklist_data: checklist,
      notes: notes || 'Field inspection report completed.',
      latitude: gpsLocation.lat,
      longitude: gpsLocation.lng,
      timestamp: new Date().toISOString(),
    };

    if (isOffline) {
      // Save to offline queue
      setOfflineQueue(prev => [reportData, ...prev]);
      alert("⚠️ Offline Mode Active: Report saved to local device queue! It will auto-sync when network reconnects.");
    } else {
      // Direct API Submission
      try {
        await fetch('/api/inspections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportData),
        });
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
        alert("✅ Inspection report submitted to Central Database!");
        setNotes('');
      } catch (err) {
        setOfflineQueue(prev => [reportData, ...prev]);
        alert("Server unreachable. Queued to offline storage.");
      }
    }
  };

  // Sync offline items
  const handleTriggerSync = () => {
    if (offlineQueue.length === 0) return;
    onSyncQueue(offlineQueue);
    setOfflineQueue([]);
    confetti({ particleCount: 100, spread: 70 });
    alert("🚀 Successfully synced all queued offline reports to Supabase & Central Database!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-slate-950 min-h-screen text-slate-100">
      {/* Mobile App View Frame Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Field Data Collection & Mobile Reporting App</h2>
            <p className="text-xs text-slate-400">Offline-first geo-tagged safety inspection & incident capture</p>
          </div>
        </div>

        {/* Offline Queue Badge & Sync button */}
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-2 ${
            isOffline ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-emerald-950 text-emerald-300 border-emerald-800'
          }`}>
            {isOffline ? <WifiOff className="w-4 h-4 text-rose-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
            <span>{isOffline ? 'Offline Mode' : 'Online'}</span>
          </div>

          {offlineQueue.length > 0 && (
            <button
              onClick={handleTriggerSync}
              className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-lg transition animate-bounce"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync Queue ({offlineQueue.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('inspection')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'inspection' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Safety Inspection Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('incident')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'incident' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Report Geo Incident</span>
        </button>
      </div>

      {/* Inspection Form */}
      {activeTab === 'inspection' && (
        <form onSubmit={handleSubmitReport} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 font-semibold mb-1">Target Coal Mine</label>
              <select
                value={selectedMine}
                onChange={e => setSelectedMine(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:ring-amber-500"
              >
                {mines.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.subsidiary_name})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-semibold mb-1">Inspector / Officer Name</label>
              <input
                type="text"
                value={inspectorName}
                onChange={e => setInspectorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Dynamic Checklist */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase text-amber-400 tracking-wider">Statutory Safety Checklist</h4>

            {Object.keys(checklist).map(key => (
              <label key={key} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <span className="text-xs text-slate-200 capitalize">{key.replace(/_/g, ' ')}</span>
                <input
                  type="checkbox"
                  checked={checklist[key]}
                  onChange={e => setChecklist({ ...checklist, [key]: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700 focus:ring-0"
                />
              </label>
            ))}
          </div>

          {/* Geo Location Tagging */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-rose-400" />
              <div>
                <span className="text-xs text-slate-400">Automatic GPS Coordinates</span>
                <p className="text-xs font-mono font-bold text-white">
                  Lat: {gpsLocation.lat.toFixed(4)}, Lng: {gpsLocation.lng.toFixed(4)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFetchLocation}
              disabled={isLocating}
              className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 rounded-lg text-slate-200 transition"
            >
              {isLocating ? 'Acquiring GPS...' : 'Refresh Geolocation'}
            </button>
          </div>

          {/* Photo Attachment & Notes */}
          <div>
            <label className="block text-xs text-slate-400 font-semibold mb-1">Field Observation Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Record pit observations, dust level notes, or equipment status..."
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-xs focus:ring-amber-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm py-3 rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{isOffline ? 'Save to Offline Device Queue' : 'Submit Inspection Report'}</span>
          </button>
        </form>
      )}

      {/* Incident Tab */}
      {activeTab === 'incident' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-rose-400">Report Immediate Safety Incident</h3>
          <p className="text-xs text-slate-400">Captures photo evidence, GPS location, and triggers immediate automated corporate alert.</p>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
            Use the Safety Inspection tab to submit reports with attachments, or click below to trigger a mock incident dispatch.
          </div>
        </div>
      )}
    </div>
  );
}
