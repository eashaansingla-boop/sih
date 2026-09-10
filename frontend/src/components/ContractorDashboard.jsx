import React from 'react';
import { Users, HardHat, CheckSquare, ShieldCheck, Award } from 'lucide-react';

export default function ContractorDashboard({ data }) {
  if (!data || !data.contractors) {
    return <div className="p-8 text-center text-slate-400">Loading Contractor Portal...</div>;
  }

  const { contractors } = data;

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <HardHat className="w-6 h-6 text-amber-400" />
            <span>Contractor Safety & Compliance Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Contractor performance, worker attendance & safety compliance verification</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contractors.map(c => (
          <div key={c.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                  Reg No: {c.registration_no}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{c.name}</h3>
                <p className="text-xs text-slate-400">Primary Mine: <strong>{c.primary_mine}</strong></p>
              </div>

              <div className="text-right">
                <span className={`text-sm font-extrabold px-3 py-1 rounded-xl ${
                  c.compliance_score >= 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-800' : 'bg-rose-500/20 text-rose-400 border border-rose-800'
                }`}>
                  {c.compliance_score}% Rating
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-950 p-3 rounded-xl">
              <div>
                <span className="text-slate-400 text-[10px]">Active Workers</span>
                <p className="font-bold text-white mt-0.5">{c.active_workers}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Shift Attendance</span>
                <p className="font-bold text-emerald-400 mt-0.5">{c.attendance_rate}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">PPE Audit</span>
                <p className="font-bold text-blue-400 mt-0.5">{c.ppe_audit_score}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
