import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Database, 
  Wifi, 
  WifiOff, 
  Bell, 
  UserCheck, 
  ChevronDown, 
  Flame 
} from 'lucide-react';

export default function Navbar({ currentRole, setCurrentRole, alertCount, isOffline, setIsOffline, supabaseConnected }) {
  const roles = [
    { id: 'mine_official', label: 'Mine Official', desc: 'Jharia Open Cast Pit-3' },
    { id: 'corporate', label: 'Corporate Management', desc: 'Coal India HQ' },
    { id: 'regulator', label: 'DGMS Regulatory Authority', desc: 'Government Auditor' },
    { id: 'contractor', label: 'Contractor Manager', desc: 'MineTech Infra' },
  ];

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between text-slate-100 sticky top-0 z-50">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-amber-900/30">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-lg tracking-tight text-white">COALGUARD</h1>
            <span className="text-xs bg-amber-500/20 text-amber-400 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
              GOVERNANCE 2.0
            </span>
          </div>
          <p className="text-xs text-slate-400">AI Coal Mine Compliance & Safety Telemetry</p>
        </div>
      </div>

      {/* Center Metrics & Indicators */}
      <div className="hidden md:flex items-center space-x-6">
        {/* Supabase Status */}
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
          <Database className={`w-4 h-4 ${supabaseConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span>
            Database: <strong className={supabaseConnected ? 'text-emerald-400' : 'text-amber-400'}>
              {supabaseConnected ? 'Supabase Live' : 'Fallback Data Engine'}
            </strong>
          </span>
        </div>

        {/* Network / Offline Toggle */}
        <button
          onClick={() => setIsOffline(!isOffline)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
            isOffline 
              ? 'bg-rose-950/80 text-rose-300 border-rose-800' 
              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
          }`}
          title="Click to toggle simulated offline mode for field testing"
        >
          {isOffline ? <WifiOff className="w-4 h-4 text-rose-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
          <span>{isOffline ? 'Offline Mode (Queueing)' : 'Network Online'}</span>
        </button>

        {/* Real-time Alert Counter */}
        <div className="relative">
          <button className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-200 transition">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Alerts</span>
            {alertCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                {alertCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Role Selector Dropdown */}
      <div className="flex items-center space-x-3">
        <div className="relative group">
          <button className="flex items-center space-x-3 bg-slate-800 hover:bg-slate-750 px-4 py-2 rounded-xl border border-slate-700 transition">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <p className="text-xs font-semibold text-white">
                {roles.find(r => r.id === currentRole)?.label}
              </p>
              <p className="text-[10px] text-slate-400">
                {roles.find(r => r.id === currentRole)?.desc}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
          </button>

          {/* Role Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
            <div className="p-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700">
              Switch Access Role (Demo)
            </div>
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => setCurrentRole(r.id)}
                className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-slate-700/70 transition ${
                  currentRole === r.id ? 'bg-amber-500/10 text-amber-400 font-bold border-l-4 border-amber-500' : 'text-slate-300'
                }`}
              >
                <div>
                  <div className="font-medium">{r.label}</div>
                  <div className="text-[10px] text-slate-400">{r.desc}</div>
                </div>
                {currentRole === r.id && <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">Active</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
