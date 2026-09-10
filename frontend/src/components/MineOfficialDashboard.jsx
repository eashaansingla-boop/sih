import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  AlertOctagon, 
  CheckCircle, 
  Clock, 
  FilePlus, 
  Wind, 
  Droplet, 
  Thermometer, 
  UserCheck 
} from 'lucide-react';

export default function MineOfficialDashboard({ data, onOpenFieldApp, onResolveIncident }) {
  if (!data || !data.mine) {
    return <div className="p-8 text-center text-slate-400">Loading Mine Official Telemetry...</div>;
  }

  const { mine, compliance_summary, active_incidents, recent_alerts } = data;

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white">{mine.name}</h2>
            <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-2.5 py-1 rounded-lg border border-amber-500/30">
              Code: {mine.code} ({mine.subsidiary})
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manager: <strong>{mine.manager}</strong> | Status: <span className="text-emerald-400 font-semibold">{mine.status}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenFieldApp}
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition"
          >
            <FilePlus className="w-4 h-4" />
            <span>Submit Inspection Report</span>
          </button>
        </div>
      </div>

      {/* Telemetry Sensor Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Risk Score */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          mine.risk_level === 'Critical' || mine.risk_level === 'High' 
            ? 'bg-rose-950/40 border-rose-800 text-rose-200' 
            : 'bg-slate-900 border-slate-800 text-slate-200'
        }`}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Risk Score</span>
            <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{mine.risk_score}</span>
            <span className="text-xs text-slate-400">/ 100 ({mine.risk_level})</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Methane gas spike & SPM non-compliance detected.</p>
        </div>

        {/* Methane Telemetry */}
        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Methane (CH4) Sensor</span>
            <Wind className={`w-5 h-5 ${mine.telemetry.methane_ppm > 500 ? 'text-rose-400' : 'text-emerald-400'}`} />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-extrabold ${mine.telemetry.methane_ppm > 500 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {mine.telemetry.methane_ppm}
            </span>
            <span className="text-xs text-slate-400">ppm (Limit: 500)</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full ${mine.telemetry.methane_ppm > 500 ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min((mine.telemetry.methane_ppm / 1000) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* SPM Dust Telemetry */}
        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">SPM Dust Level</span>
            <Activity className={`w-5 h-5 ${mine.telemetry.spm_ug_m3 > 250 ? 'text-amber-400' : 'text-emerald-400'}`} />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-extrabold ${mine.telemetry.spm_ug_m3 > 250 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {mine.telemetry.spm_ug_m3}
            </span>
            <span className="text-xs text-slate-400">µg/m³ (Limit: 250)</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full ${mine.telemetry.spm_ug_m3 > 250 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min((mine.telemetry.spm_ug_m3 / 400) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Water pH Telemetry */}
        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Effluent Water pH</span>
            <Droplet className="w-5 h-5 text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-blue-400">{mine.telemetry.water_ph}</span>
            <span className="text-xs text-slate-400">pH (Standard 6.5 - 8.5)</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Discharge water quality verified.</div>
        </div>
      </div>

      {/* Compliance Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Compliance Summary Card */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-amber-400 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-amber-400" />
            <span>Statutory Compliance Matrix</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl">
              <span className="text-2xl font-bold text-emerald-400">{compliance_summary.compliant}</span>
              <p className="text-[11px] text-emerald-300 font-semibold mt-1">Compliant Rules</p>
            </div>
            <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl">
              <span className="text-2xl font-bold text-amber-400">{compliance_summary.due_soon}</span>
              <p className="text-[11px] text-amber-300 font-semibold mt-1">Due Soon (7 Days)</p>
            </div>
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl">
              <span className="text-2xl font-bold text-rose-400">{compliance_summary.overdue}</span>
              <p className="text-[11px] text-rose-300 font-semibold mt-1">Overdue Items</p>
            </div>
            <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl">
              <span className="text-2xl font-bold text-red-500">{compliance_summary.violated}</span>
              <p className="text-[11px] text-red-300 font-semibold mt-1">Violated Directives</p>
            </div>
          </div>
        </div>

        {/* Active Incidents & Actionable Tasks */}
        <div className="md:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-rose-400 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Active Field Incidents & Corrective Actions</span>
            </h3>
            <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full">
              {active_incidents.length} Pending
            </span>
          </div>

          {active_incidents.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-xs">No active unresolved incidents.</div>
          ) : (
            <div className="space-y-3">
              {active_incidents.map(inc => (
                <div key={inc.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                        {inc.severity} Severity
                      </span>
                      <h4 className="font-bold text-xs text-white">{inc.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{inc.description}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Contractor: {inc.contractor_name} | Reported by: {inc.reported_by}</p>
                  </div>

                  <button
                    onClick={() => onResolveIncident(inc.id)}
                    className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition"
                  >
                    Mark Resolved & Signoff
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
