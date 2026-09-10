import React, { useState } from 'react';
import { CheckSquare, Filter, AlertTriangle, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ComplianceMatrix({ matrixData, onUpdateStatus }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  if (!matrixData || !matrixData.data) {
    return <div className="p-8 text-center text-slate-400">Loading Statutory Compliance Matrix...</div>;
  }

  const categories = ['All', 'Safety', 'Environmental', 'Production', 'Labour'];
  const statuses = ['All', 'Compliant', 'Due Soon', 'Overdue', 'Violated'];

  let filtered = matrixData.data;
  if (selectedCategory !== 'All') {
    filtered = filtered.filter(item => item.category === selectedCategory);
  }
  if (selectedStatus !== 'All') {
    filtered = filtered.filter(item => item.status === selectedStatus);
  }

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <CheckSquare className="w-6 h-6 text-amber-400" />
            <span>DGMS & MOEF Statutory Compliance Rulebook</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Real-time status tracking for safety, environmental, labor & production regulations</p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="bg-emerald-950 text-emerald-400 font-bold px-3 py-1.5 rounded-lg border border-emerald-800">
            {matrixData.summary.compliant} Compliant
          </span>
          <span className="bg-amber-950 text-amber-400 font-bold px-3 py-1.5 rounded-lg border border-amber-800">
            {matrixData.summary.due_soon} Due Soon
          </span>
          <span className="bg-rose-950 text-rose-400 font-bold px-3 py-1.5 rounded-lg border border-rose-800">
            {matrixData.summary.violated + matrixData.summary.overdue} Violations
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs">
        <div className="flex items-center space-x-2 text-amber-400 font-bold mr-2">
          <Filter className="w-4 h-4" />
          <span>Category Filter:</span>
        </div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              selectedCategory === cat ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}

        <div className="h-4 w-px bg-slate-800 mx-2 hidden md:block"></div>

        <div className="flex items-center space-x-2 text-blue-400 font-bold mr-2">
          <span>Status Filter:</span>
        </div>
        {statuses.map(st => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              selectedStatus === st ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Rules Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Rule Code</th>
                <th className="p-4">Compliance Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Mine Location</th>
                <th className="p-4">Statutory Standard</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-850 transition">
                  <td className="p-4 font-bold text-amber-400">{item.rule_code}</td>
                  <td className="p-4">
                    <div className="font-bold text-white">{item.rule_title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.remarks}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-200">{item.mine_name}</td>
                  <td className="p-4 text-slate-400 max-w-xs">{item.remarks}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-flex items-center space-x-1 ${
                      item.status === 'Compliant' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-800' :
                      item.status === 'Due Soon' ? 'bg-amber-500/20 text-amber-400 border border-amber-800' :
                      'bg-rose-500/20 text-rose-400 border border-rose-800 animate-pulse'
                    }`}>
                      {item.status === 'Compliant' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {item.status === 'Due Soon' && <Clock className="w-3 h-3 mr-1" />}
                      {(item.status === 'Violated' || item.status === 'Overdue') && <AlertTriangle className="w-3 h-3 mr-1" />}
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => onUpdateStatus(item.id, item.status === 'Compliant' ? 'Violated' : 'Compliant')}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-2.5 py-1 rounded transition"
                    >
                      Toggle Status
                    </button>
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
