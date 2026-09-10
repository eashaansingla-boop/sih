import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Layers, 
  Radio, 
  Activity, 
  UserCheck, 
  FileText 
} from 'lucide-react';

// Custom Marker DivIcons with color coding
const createCustomIcon = (color, label) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid #0f172a;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 11px;
      ">
        ${label}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const greenIcon = createCustomIcon('#10b981', 'M');
const yellowIcon = createCustomIcon('#f59e0b', 'M');
const redIcon = createCustomIcon('#ef4444', 'M');
const incidentIcon = createCustomIcon('#ec4899', '!');
const inspectionIcon = createCustomIcon('#3b82f6', 'I');

export default function GISMap({ mines, inspections, incidents, onSelectMine, onTriggerReport }) {
  const [activeLayers, setActiveLayers] = useState({
    mines: true,
    inspections: true,
    incidents: true,
    gasZones: true,
  });

  // Center of Indian coalfields (Jharkhand/Dhanbad region)
  const defaultCenter = [23.2000, 86.2000];
  const defaultZoom = 8;

  const toggleLayer = (key) => {
    setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 flex flex-col overflow-hidden">
      {/* Map Control Overlay Header */}
      <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 shadow-2xl flex items-center space-x-4 text-xs text-slate-200">
        <div className="flex items-center space-x-2 font-bold text-amber-400">
          <Layers className="w-4 h-4" />
          <span>GIS Spatial Layers</span>
        </div>
        <div className="h-4 w-px bg-slate-700"></div>

        <label className="flex items-center space-x-1.5 cursor-pointer">
          <input 
            type="checkbox" 
            checked={activeLayers.mines} 
            onChange={() => toggleLayer('mines')}
            className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0" 
          />
          <span>Coal Mines ({mines.length})</span>
        </label>

        <label className="flex items-center space-x-1.5 cursor-pointer">
          <input 
            type="checkbox" 
            checked={activeLayers.inspections} 
            onChange={() => toggleLayer('inspections')}
            className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-0" 
          />
          <span>Inspections ({inspections.length})</span>
        </label>

        <label className="flex items-center space-x-1.5 cursor-pointer">
          <input 
            type="checkbox" 
            checked={activeLayers.incidents} 
            onChange={() => toggleLayer('incidents')}
            className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0" 
          />
          <span>Incidents ({incidents.length})</span>
        </label>

        <label className="flex items-center space-x-1.5 cursor-pointer">
          <input 
            type="checkbox" 
            checked={activeLayers.gasZones} 
            onChange={() => toggleLayer('gasZones')}
            className="rounded bg-slate-800 border-slate-700 text-purple-500 focus:ring-0" 
          />
          <span>Methane Hazard Zones</span>
        </label>
      </div>

      {/* Legend Card */}
      <div className="absolute bottom-6 right-6 z-20 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 shadow-2xl space-y-2 max-w-xs">
        <h4 className="font-bold text-amber-400 mb-2 flex items-center space-x-1.5">
          <Radio className="w-4 h-4 animate-pulse text-red-500" />
          <span>Real-time Risk Legend</span>
        </h4>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
          <span>Critical / High Risk Score (&gt;70)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
          <span>Moderate Risk Score (50-70)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          <span>Low Risk / Compliant (&lt;50)</span>
        </div>
        <div className="flex items-center space-x-2 pt-1 border-t border-slate-800">
          <span className="w-3 h-3 rounded-full bg-purple-500/40 border border-purple-500 inline-block"></span>
          <span>CH4 Gas Buffer (&gt;500 ppm limit)</span>
        </div>
      </div>

      {/* Leaflet Map */}
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        scrollWheelZoom={true} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Mines Markers */}
        {activeLayers.mines && mines.map(m => {
          let icon = greenIcon;
          if (m.risk_level === 'High') icon = yellowIcon;
          if (m.risk_level === 'Critical') icon = redIcon;

          return (
            <React.Fragment key={m.id}>
              <Marker position={[m.latitude, m.longitude]} icon={icon}>
                <Popup>
                  <div className="p-1 space-y-2 min-w-[240px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                        {m.subsidiary_name} ({m.code})
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        m.risk_level === 'Critical' ? 'bg-rose-500 text-white' :
                        m.risk_level === 'High' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
                      }`}>
                        Risk Score: {m.risk_score}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white">{m.name}</h3>
                    <p className="text-xs text-slate-300">{m.location_name}, {m.state}</p>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-800 p-2 rounded-lg text-slate-200">
                      <div>Methane CH4: <strong className={m.methane_ppm > 500 ? 'text-rose-400' : 'text-emerald-400'}>{m.methane_ppm} ppm</strong></div>
                      <div>SPM Dust: <strong className={m.spm_ug_m3 > 250 ? 'text-rose-400' : 'text-emerald-400'}>{m.spm_ug_m3} µg/m³</strong></div>
                      <div>Manager: <strong>{m.manager_name}</strong></div>
                      <div>Status: <strong>{m.operational_status}</strong></div>
                    </div>

                    <div className="flex space-x-2 pt-1">
                      <button
                        onClick={() => onSelectMine(m.id)}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-1.5 rounded-lg transition"
                      >
                        View Dashboard
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* Gas Hazard Circle Overlay */}
              {activeLayers.gasZones && (m.risk_level === 'High' || m.risk_level === 'Critical') && (
                <Circle 
                  center={[m.latitude, m.longitude]}
                  radius={12000}
                  pathOptions={{ color: '#a855f7', fillColor: '#c084fc', fillOpacity: 0.2, weight: 2, dashArray: '4, 4' }}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Inspections Pins */}
        {activeLayers.inspections && inspections.map(insp => (
          <Marker 
            key={insp.id} 
            position={[insp.latitude || 23.75, insp.longitude || 86.41]} 
            icon={inspectionIcon}
          >
            <Popup>
              <div className="p-1 space-y-1.5 min-w-[220px]">
                <div className="text-[10px] font-bold text-blue-400 uppercase">Field Inspection</div>
                <h4 className="font-bold text-xs text-white">{insp.mine_name}</h4>
                <p className="text-[11px] text-slate-300">Inspector: {insp.inspector_name}</p>
                <p className="text-[11px] text-slate-400">Notes: {insp.notes}</p>
                <span className="text-[10px] inline-block bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                  Status: {insp.overall_status}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Incident Pins */}
        {activeLayers.incidents && incidents.map(inc => (
          <Marker 
            key={inc.id} 
            position={[inc.latitude || 23.75, inc.longitude || 86.41]} 
            icon={incidentIcon}
          >
            <Popup>
              <div className="p-1 space-y-1.5 min-w-[220px]">
                <div className="text-[10px] font-bold text-rose-400 uppercase">Safety Incident Alert</div>
                <h4 className="font-bold text-xs text-rose-300">{inc.title}</h4>
                <p className="text-[11px] text-slate-300">Mine: {inc.mine_name}</p>
                <p className="text-[11px] text-slate-400">{inc.description}</p>
                <div className="flex items-center justify-between text-[10px] pt-1">
                  <span className="bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded">Severity: {inc.severity}</span>
                  <span className="text-slate-400">{inc.status}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
