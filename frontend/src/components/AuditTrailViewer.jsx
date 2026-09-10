import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, Search, RefreshCw, Key } from 'lucide-react';

export default function AuditTrailViewer({ auditData, onVerifyIntegrity }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationResult, setVerificationResult] = useState(auditData?.integrity || { valid: true });

  const logs = auditData?.data || [];

  const filteredLogs = logs.filter(
    l =>
      l.actor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.entity_target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.current_hash.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerify = async () => {
    const result = await onVerifyIntegrity();
    setVerificationResult(result);
    alert(result.valid ? "✅ SHA-256 Cryptographic Chain Integrity Verified! All log records are tamper-proof." : "❌ Tamper Warning! Cryptographic hash mismatch detected.");
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      {/* Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Tamper-Evident Cryptographic Audit Trail</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">SHA-256 hash-chained immutable event ledger for government regulatory verification</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center space-x-2 ${
            verificationResult.valid ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-rose-950 text-rose-400 border-rose-800'
          }`}>
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>{verificationResult.valid ? 'Integrity: SHA-256 Verified' : 'Integrity Broken'}</span>
          </div>

          <button
            onClick={handleVerify}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Verify Cryptographic Integrity</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by actor, action type, mine, or SHA-256 hash..."
          className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs focus:ring-amber-500"
        />
      </div>

      {/* Audit Log Timeline */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity Target</th>
                <th className="p-4">Details</th>
                <th className="p-4">Cryptographic Hash (SHA-256)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-850 transition">
                  <td className="p-4 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-white">
                    {log.actor_name}
                    <span className="block text-[10px] text-slate-500 font-normal">{log.actor_role}</span>
                  </td>
                  <td className="p-4 text-amber-400 font-semibold">{log.action_type}</td>
                  <td className="p-4 text-slate-200">{log.entity_target}</td>
                  <td className="p-4 text-slate-300 max-w-xs font-mono text-[11px]">
                    {JSON.stringify(log.details_json)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400 bg-slate-950 px-2 py-1 rounded border border-slate-800 max-w-xs truncate">
                      <Key className="w-3 h-3 shrink-0 text-emerald-500" />
                      <span className="truncate">{log.current_hash}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
