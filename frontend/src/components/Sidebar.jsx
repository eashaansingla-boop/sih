import React from 'react';
import { 
  Map, 
  LayoutDashboard, 
  Smartphone, 
  CheckSquare, 
  BrainCircuit, 
  FileText, 
  ShieldCheck, 
  Bot, 
  AlertTriangle 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, currentRole }) {
  const menuItems = [
    { id: 'gis', label: 'GIS Map Workspace', icon: Map, badge: 'Leaflet Live' },
    { id: 'dashboard', label: 'Role Dashboard', icon: LayoutDashboard, badge: currentRole.replace('_', ' ').toUpperCase() },
    { id: 'field_app', label: 'Field Reporting App', icon: Smartphone, badge: 'Offline Queue' },
    { id: 'compliance', label: 'Compliance Matrix', icon: CheckSquare, badge: 'DGMS Rules' },
    { id: 'ai_center', label: 'AI Risk & Anomalies', icon: BrainCircuit, badge: 'ML Engine' },
    { id: 'ocr_studio', label: 'OCR Document Studio', icon: FileText, badge: 'Digitize' },
    { id: 'audit_trail', label: 'Audit Trail', icon: ShieldCheck, badge: 'SHA-256' },
    { id: 'chatbot', label: 'CoalGuard AI Chat', icon: Bot, badge: 'Multilingual' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Navigation Workspaces
        </div>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400 font-bold border-l-4 border-amber-500 shadow-lg shadow-amber-950/20'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Card */}
      <div className="p-4 m-3 bg-gradient-to-br from-slate-800 to-slate-850 rounded-2xl border border-slate-700/80">
        <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs mb-1">
          <AlertTriangle className="w-4 h-4" />
          <span>Internal SIH Demo</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          AI Smart Governance Platform for Coal Mines. Integrated Leaflet GIS, Supabase DB & Cryptographic Audit Ledger.
        </p>
      </div>
    </aside>
  );
}
