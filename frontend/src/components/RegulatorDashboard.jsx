import React from 'react';
import { 
  FileCheck, 
  ShieldAlert, 
  Download, 
  Lock, 
  CheckCircle2, 
  FileText, 
  AlertCircle 
} from 'lucide-react';

export default function RegulatorDashboard({ data }) {
  if (!data || !data.statutory_summary) {
    return <div className="p-8 text-center text-slate-400">Loading Regulatory Audit Suite...</div>;
  }

  const { statutory_summary, active_statutory_violations, scanned_documents } = data;

  const handleExportPDF = () => {
    alert("Generating Official DGMS Statutory Compliance Audit Report (PDF)... Download starting!");
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <FileCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Directorate General of Mines Safety (DGMS) Portal</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Official Statutory Audit, Violation Enforcement & Tamper-Evident Records</p>
        </div>

        <button
          onClick={handleExportPDF}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition"
        >
          <Download className="w-4 h-4" />
          <span>Export Official Statutory Audit (PDF)</span>
        </button>
      </div>

      {/* Audit & Integrity Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Mines Under Jurisdiction</span>
          <p className="text-3xl font-extrabold text-white mt-1">{statutory_summary.total_mines_under_jurisdiction}</p>
        </div>

        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Critical Statutory Violations</span>
          <p className="text-3xl font-extrabold text-rose-400 mt-1">{statutory_summary.critical_violations}</p>
        </div>

        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Cryptographic Audit Logs</span>
          <p className="text-3xl font-extrabold text-blue-400 mt-1">{statutory_summary.verified_audit_logs}</p>
        </div>

        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Audit Trail Integrity</span>
          <div className="flex items-center space-x-2 mt-1">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400">{statutory_summary.tamper_proof_status}</span>
          </div>
        </div>
      </div>

      {/* Active Violations Table */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-rose-400 flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Active Statutory Non-Compliance & Violations Register</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Rule Ref</th>
                <th className="p-3">Mine / Subsidiary</th>
                <th className="p-3">Statutory Standard</th>
                <th className="p-3">Status</th>
                <th className="p-3">Remarks / Inspector Findings</th>
                <th className="p-3">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {active_statutory_violations.map(v => (
                <tr key={v.id} className="hover:bg-slate-850 transition">
                  <td className="p-3 font-bold text-amber-400">{v.rule_code}</td>
                  <td className="p-3 font-semibold text-white">{v.mine_name} ({v.subsidiary})</td>
                  <td className="p-3 text-slate-400">{v.statutory_ref}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.status === 'Violated' ? 'bg-rose-500/20 text-rose-400 border border-rose-800' : 'bg-amber-500/20 text-amber-400 border border-amber-800'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300 max-w-xs">{v.remarks}</td>
                  <td className="p-3 text-slate-400">{v.next_due_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
