const { mines, mine_compliance_status, compliance_rules, incidents, contractors, alerts, documents, audit_trail, verifyAuditChain } = require('../models/dataStore');

const getMineOfficialDashboard = async (req, res, next) => {
  try {
    const mineId = req.query.mine_id || 'mine-1';
    const mine = mines.find(m => m.id === mineId) || mines[0];
    const mineCompliance = mine_compliance_status.filter(c => c.mine_id === mine.id);
    const mineIncidents = incidents.filter(i => i.mine_id === mine.id);
    const mineAlerts = alerts.filter(a => a.mine_id === mine.id);

    return res.status(200).json({
      success: true,
      mine: {
        id: mine.id,
        name: mine.name,
        code: mine.code,
        subsidiary: mine.subsidiary_name,
        manager: mine.manager_name,
        risk_score: mine.risk_score,
        risk_level: mine.risk_level,
        status: mine.operational_status,
        telemetry: {
          methane_ppm: mine.methane_ppm,
          spm_ug_m3: mine.spm_ug_m3,
          water_ph: mine.water_ph,
        },
      },
      compliance_summary: {
        total: mineCompliance.length,
        compliant: mineCompliance.filter(c => c.status === 'Compliant').length,
        due_soon: mineCompliance.filter(c => c.status === 'Due Soon').length,
        overdue: mineCompliance.filter(c => c.status === 'Overdue').length,
        violated: mineCompliance.filter(c => c.status === 'Violated').length,
      },
      active_incidents: mineIncidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed'),
      recent_alerts: mineAlerts.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};

const getCorporateDashboard = async (req, res, next) => {
  try {
    const totalMines = mines.length;
    const highRiskMines = mines.filter(m => m.risk_level === 'High' || m.risk_level === 'Critical').length;
    const totalViolations = mine_compliance_status.filter(c => c.status === 'Violated' || c.status === 'Overdue').length;

    const subsidiaryPerformance = [
      { code: 'BCCL', name: 'Bharat Coking Coal Ltd', mines_count: 1, compliance_index: 74, risk_level: 'High' },
      { code: 'ECL', name: 'Eastern Coalfields Ltd', mines_count: 1, compliance_index: 92, risk_level: 'Low' },
      { code: 'MCL', name: 'Mahanadi Coalfields Ltd', mines_count: 1, compliance_index: 85, risk_level: 'Moderate' },
      { code: 'CCL', name: 'Central Coalfields Ltd', mines_count: 1, compliance_index: 68, risk_level: 'Critical' },
    ];

    return res.status(200).json({
      success: true,
      kpis: {
        total_mines: totalMines,
        high_risk_mines: highRiskMines,
        active_contractors: contractors.length,
        total_active_violations: totalViolations,
        overall_compliance_rate: 82.5,
      },
      mines_overview: mines.map(m => ({
        id: m.id,
        name: m.name,
        subsidiary: m.subsidiary_name,
        risk_score: m.risk_score,
        risk_level: m.risk_level,
        status: m.operational_status,
      })),
      subsidiary_performance: subsidiaryPerformance,
      contractors_ranking: contractors.map(c => ({
        id: c.id,
        name: c.name,
        compliance_score: c.compliance_score,
        risk_level: c.risk_level,
        workers: c.active_workers,
      })),
    });
  } catch (error) {
    next(error);
  }
};

const getRegulatorDashboard = async (req, res, next) => {
  try {
    const dgmsViolations = mine_compliance_status.filter(c => c.status === 'Violated' || c.status === 'Overdue').map(c => {
      const rule = compliance_rules.find(r => r.id === c.rule_id);
      const mine = mines.find(m => m.id === c.mine_id);
      return {
        id: c.id,
        mine_name: mine ? mine.name : 'N/A',
        subsidiary: mine ? mine.subsidiary_name : 'N/A',
        rule_code: rule ? rule.rule_code : 'N/A',
        rule_title: rule ? rule.title : 'N/A',
        statutory_ref: rule ? rule.statutory_reference : 'N/A',
        status: c.status,
        remarks: c.remarks,
        next_due_date: c.next_due_date,
      };
    });

    const auditStatus = verifyAuditChain();

    return res.status(200).json({
      success: true,
      statutory_summary: {
        total_mines_under_jurisdiction: mines.length,
        critical_violations: dgmsViolations.length,
        verified_audit_logs: audit_trail.length,
        tamper_proof_status: auditStatus.valid ? 'Verified (SHA-256 Validated)' : 'Compromised',
      },
      active_statutory_violations: dgmsViolations,
      scanned_documents: documents,
    });
  } catch (error) {
    next(error);
  }
};

const getContractorDashboard = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      contractors: contractors.map(c => {
        const mine = mines.find(m => m.id === c.primary_mine_id);
        return {
          id: c.id,
          name: c.name,
          registration_no: c.registration_no,
          contract_type: c.contract_type,
          primary_mine: mine ? mine.name : 'N/A',
          active_workers: c.active_workers,
          compliance_score: c.compliance_score,
          risk_level: c.risk_level,
          attendance_rate: '94.2%',
          ppe_audit_score: '96%',
        };
      }),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMineOfficialDashboard,
  getCorporateDashboard,
  getRegulatorDashboard,
  getContractorDashboard,
  getMineOfficialCompliance: getMineOfficialDashboard,
  getMineOfficialMonitoring: getMineOfficialDashboard,
  getMineOfficialRisks: getMineOfficialDashboard,
  getMineOfficialAlerts: getMineOfficialDashboard,
  getCorporateCompliance: getCorporateDashboard,
  getCorporateMines: getCorporateDashboard,
  getCorporateRisks: getCorporateDashboard,
  getCorporateContractors: getCorporateDashboard,
  getRegulatorCompliance: getRegulatorDashboard,
  getRegulatorViolations: getRegulatorDashboard,
  getRegulatorIncidents: getRegulatorDashboard,
  getRegulatorReports: getRegulatorDashboard,
};
