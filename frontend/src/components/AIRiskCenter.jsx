import React from 'react';
import { BrainCircuit, AlertTriangle, Zap, Activity, ShieldAlert, Cpu } from 'lucide-react';

export default function AIRiskCenter({ riskData, anomaliesData, recurringData }) {
  const risks = riskData?.data || [];
  const anomalies = anomaliesData?.data || [];
  const recurring = recurringData?.data || [];

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      {/* Title */}
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <BrainCircuit className="w-6 h-6 text-purple-400" />
            <span>AI Risk Assessment & Anomaly Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Predictive machine learning risk scoring, sensor anomaly detection & hazard cluster analytics</p>
        </div>
        <span className="text-xs bg-purple-500/20 text-purple-300 font-bold px-3 py-1.5 rounded-lg border border-purple-500/30 flex items-center space-x-1.5">
          <Cpu className="w-4 h-4 text-purple-400 animate-spin" />
          <span>ML Model: Active</span>
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Scores */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-purple-400 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span>Predicted Mine Risk Ranking (0-100)</span>
          </h3>

          <div className="space-y-3">
            {risks.map(r => (
              <div key={r.mine_id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-white">{r.mine_name}</h4>
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                    r.risk_level === 'Critical' || r.risk_level === 'High' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'
                  }`}>
                    {r.risk_score} / 100 ({r.risk_level})
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  <strong>Risk Factors:</strong> {r.factors.join('; ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Anomaly Feed */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-rose-400 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Telemetry Sensor & Production Anomaly Flags</span>
          </h3>

          <div className="space-y-3">
            {anomalies.map(anom => (
              <div key={anom.id} className="p-4 bg-rose-950/30 border border-rose-800/80 rounded-xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">
                    {anom.anomaly_type}
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-400">{anom.variance_percentage}</span>
                </div>
                <h4 className="font-bold text-xs text-white mt-1">{anom.mine_name} - {anom.sensor_name}</h4>
                <p className="text-[11px] text-slate-300">
                  Current Reading: <strong className="text-rose-400">{anom.current_value}</strong> (Statutory Limit: {anom.statutory_limit})
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recurring Hazard Clusters */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-amber-400 flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Recurring Violation & Spatial Hazard Cluster Analysis</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recurring.map(rec => (
            <div key={rec.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-amber-300">{rec.mine_name} ({rec.location})</h4>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded">
                  Repeated {rec.repeat_count_30_days}x in 30 Days
                </span>
              </div>
              <p className="text-xs text-slate-300">Hazard: <strong>{rec.hazard_category}</strong></p>
              <p className="text-[11px] text-slate-400">Impact: {rec.risk_impact}</p>
              <p className="text-[11px] text-emerald-400 font-semibold pt-1 border-t border-slate-850">
                AI Recommendation: {rec.recommended_action}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
