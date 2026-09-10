import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import GISMap from './components/GISMap';
import MineOfficialDashboard from './components/MineOfficialDashboard';
import CorporateDashboard from './components/CorporateDashboard';
import RegulatorDashboard from './components/RegulatorDashboard';
import ContractorDashboard from './components/ContractorDashboard';
import FieldReportingApp from './components/FieldReportingApp';
import ComplianceMatrix from './components/ComplianceMatrix';
import AIRiskCenter from './components/AIRiskCenter';
import OCRStudio from './components/OCRStudio';
import AuditTrailViewer from './components/AuditTrailViewer';
import ChatbotWidget from './components/ChatbotWidget';

export default function App() {
  const [currentRole, setCurrentRole] = useState('mine_official');
  const [activeTab, setActiveTab] = useState('gis');
  const [isOffline, setIsOffline] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [selectedMineId, setSelectedMineId] = useState('mine-1');

  // Backend Data States
  const [mines, setMines] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [complianceMatrix, setComplianceMatrix] = useState({ summary: {}, data: [] });
  const [mineOfficialData, setMineOfficialData] = useState(null);
  const [corporateData, setCorporateData] = useState(null);
  const [regulatorData, setRegulatorData] = useState(null);
  const [contractorData, setContractorData] = useState(null);
  const [aiRiskData, setAiRiskData] = useState(null);
  const [anomaliesData, setAnomaliesData] = useState(null);
  const [recurringData, setRecurringData] = useState(null);
  const [auditData, setAuditData] = useState(null);
  const [alertsData, setAlertsData] = useState({ unread_count: 0, data: [] });

  // Initial Fetching
  const fetchAllData = async () => {
    try {
      // GIS / Mines
      const resMines = await fetch('/api/gis/mines');
      const dataMines = await resMines.json();
      if (dataMines.data) setMines(dataMines.data);

      const resInsp = await fetch('/api/inspections');
      const dataInsp = await resInsp.json();
      if (dataInsp.data) setInspections(dataInsp.data);

      const resInc = await fetch('/api/incidents');
      const dataInc = await resInc.json();
      if (dataInc.data) setIncidents(dataInc.data);

      // Compliance
      const resComp = await fetch('/api/compliance/records');
      const dataComp = await resComp.json();
      setComplianceMatrix(dataComp);

      // Mine Official Dashboard
      const resOfficial = await fetch(`/api/dashboard/mine-official?mine_id=${selectedMineId}`);
      const dataOfficial = await resOfficial.json();
      setMineOfficialData(dataOfficial);

      // Corporate Dashboard
      const resCorp = await fetch('/api/dashboard/corporate');
      const dataCorp = await resCorp.json();
      setCorporateData(dataCorp);

      // Regulator Dashboard
      const resReg = await fetch('/api/dashboard/regulator');
      const dataReg = await resReg.json();
      setRegulatorData(dataReg);

      // Contractor Dashboard
      const resCon = await fetch('/api/dashboard/contractors');
      const dataCon = await resCon.json();
      setContractorData(dataCon);

      // AI Risk & Anomalies
      const resRisk = await fetch('/api/ai/risk-assessment');
      const dataRisk = await resRisk.json();
      setAiRiskData(dataRisk);

      const resAnom = await fetch('/api/ai/anomalies');
      const dataAnom = await resAnom.json();
      setAnomaliesData(dataAnom);

      const resRec = await fetch('/api/ai/recurring-violations');
      const dataRec = await resRec.json();
      setRecurringData(dataRec);

      // Audit Trail
      const resAudit = await fetch('/api/audit-logs');
      const dataAudit = await resAudit.json();
      setAuditData(dataAudit);

      // Alerts
      const resAlerts = await fetch('/api/alerts');
      const dataAlerts = await resAlerts.json();
      setAlertsData(dataAlerts);

    } catch (err) {
      console.warn("API fetch fallback", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [selectedMineId]);

  // Handlers
  const handleSelectMineFromMap = (mineId) => {
    setSelectedMineId(mineId);
    setActiveTab('dashboard');
  };

  const handleResolveIncident = async (incidentId) => {
    try {
      await fetch(`/api/incidents/${incidentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved', resolved_by: 'Mine Safety Lead' }),
      });
      fetchAllData();
    } catch (err) {
      alert("Failed to resolve incident.");
    }
  };

  const handleUpdateComplianceStatus = async (recordId, newStatus) => {
    try {
      await fetch(`/api/compliance/records/${recordId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, remarks: `Status updated to ${newStatus}` }),
      });
      fetchAllData();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleSyncOfflineQueue = async (queueItems) => {
    try {
      await fetch('/api/field/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reports: queueItems }),
      });
      fetchAllData();
    } catch (err) {
      alert("Failed to sync queue.");
    }
  };

  const handleVerifyAuditIntegrity = async () => {
    const res = await fetch('/api/audit-logs');
    const data = await res.json();
    setAuditData(data);
    return data.integrity || { valid: true };
  };

  // Dynamic Dashboard Render based on currentRole
  const renderDashboardView = () => {
    switch (currentRole) {
      case 'corporate':
        return <CorporateDashboard data={corporateData} />;
      case 'regulator':
        return <RegulatorDashboard data={regulatorData} />;
      case 'contractor':
        return <ContractorDashboard data={contractorData} />;
      case 'mine_official':
      default:
        return (
          <MineOfficialDashboard
            data={mineOfficialData}
            onOpenFieldApp={() => setActiveTab('field_app')}
            onResolveIncident={handleResolveIncident}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        alertCount={alertsData.unread_count || 2}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        supabaseConnected={supabaseConnected}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} currentRole={currentRole} />

        <main className="flex-1 overflow-y-auto bg-slate-950">
          {activeTab === 'gis' && (
            <GISMap
              mines={mines}
              inspections={inspections}
              incidents={incidents}
              onSelectMine={handleSelectMineFromMap}
              onTriggerReport={() => setActiveTab('field_app')}
            />
          )}

          {activeTab === 'dashboard' && renderDashboardView()}

          {activeTab === 'field_app' && (
            <FieldReportingApp
              mines={mines}
              isOffline={isOffline}
              onSyncQueue={handleSyncOfflineQueue}
            />
          )}

          {activeTab === 'compliance' && (
            <ComplianceMatrix
              matrixData={complianceMatrix}
              onUpdateStatus={handleUpdateComplianceStatus}
            />
          )}

          {activeTab === 'ai_center' && (
            <AIRiskCenter
              riskData={aiRiskData}
              anomaliesData={anomaliesData}
              recurringData={recurringData}
            />
          )}

          {activeTab === 'ocr_studio' && (
            <OCRStudio
              mines={mines}
              onProcessOCR={fetchAllData}
            />
          )}

          {activeTab === 'audit_trail' && (
            <AuditTrailViewer
              auditData={auditData}
              onVerifyIntegrity={handleVerifyAuditIntegrity}
            />
          )}

          {activeTab === 'chatbot' && <ChatbotWidget />}
        </main>
      </div>
    </div>
  );
}
