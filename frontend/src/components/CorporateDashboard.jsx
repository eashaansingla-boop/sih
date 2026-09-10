import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  BarChart3 
} from 'lucide-react';

export default function CorporateDashboard({ data }) {
  if (!data || !data.kpis) {
    return <div className="p-8 text-center text-slate-400">Loading Corporate Analytics...</div>;
  }

  const { kpis, mines_overview, subsidiary_performance, contractors_ranking } = data;

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      {/* Title */}
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-amber-400" />
            <span>Coal India Corporate Governance Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Multi-subsidiary compliance analytics & cross-mine risk surveillance</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Overall Governance Score</span>
          <p className="text-2xl font-extrabold text-amber-400">{kpis.overall_compliance_rate}%</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Mines Monitored</span>
            <p className="text-3xl font-extrabold text-white mt-1">{kpis.total_mines}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">High/Critical Risk Mines</span>
            <p className="text-3xl font-extrabold text-rose-400 mt-1">{kpis.high_risk_mines}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Active Contractors</span>
            <p className="text-3xl font-extrabold text-amber-400 mt-1">{kpis.active_contractors}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Active Violations</span>
            <p className="text-3xl font-extrabold text-red-500 mt-1">{kpis.total_active_violations}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Subsidiary Breakdown & Contractor Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subsidiary Performance */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-amber-400 flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Subsidiary Compliance Index</span>
          </h3>

          <div className="space-y-3">
            {subsidiary_performance.map(sub => (
              <div key={sub.code} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white">{sub.name} ({sub.code})</h4>
                  <p className="text-[10px] text-slate-400">Active Mines: {sub.mines_count}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    sub.compliance_index > 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {sub.compliance_index}% Score
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Risk: {sub.risk_level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contractor Risk Scorecard */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-blue-400 flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Contractor Safety & Compliance Ranking</span>
          </h3>

          <div className="space-y-3">
            {contractors_ranking.map(c => (
              <div key={c.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white">{c.name}</h4>
                  <p className="text-[10px] text-slate-400">Deployed Workers: {c.workers}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    c.compliance_score >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                    c.compliance_score >= 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {c.compliance_score}% Compliance
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{c.risk_level} Risk Level</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
