const crypto = require('crypto');

// Initial SHA-256 genesis hash
const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

function calculateHash(previousHash, actorName, actionType, entityTarget, timestamp, details) {
  const payload = `${previousHash}|${actorName}|${actionType}|${entityTarget}|${timestamp}|${JSON.stringify(details)}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

const subsidiaries = [
  { id: 'sub-1', name: 'Bharat Coking Coal Limited (BCCL)', code: 'BCCL', headquarters: 'Dhanbad, Jharkhand' },
  { id: 'sub-2', name: 'Eastern Coalfields Limited (ECL)', code: 'ECL', headquarters: 'Sanctoria, West Bengal' },
  { id: 'sub-3', name: 'Mahanadi Coalfields Limited (MCL)', code: 'MCL', headquarters: 'Sambalpur, Odisha' },
  { id: 'sub-4', name: 'Central Coalfields Limited (CCL)', code: 'CCL', headquarters: 'Ranchi, Jharkhand' },
];

const mines = [
  {
    id: 'mine-1',
    name: 'Jharia Open Cast Mine Pit-3',
    code: 'JHR-OCP3',
    subsidiary_id: 'sub-1',
    subsidiary_name: 'BCCL',
    company: 'Bharat Coking Coal Limited (BCCL)',
    mine_type: 'Open Cast',
    latitude: 23.7500,
    longitude: 86.4167,
    location_name: 'Jharia, Dhanbad',
    state: 'Jharkhand',
    manager_name: 'Rajesh Sharma',
    contact_phone: '+91 9876543210',
    operational_status: 'Active',
    risk_score: 78,
    risk_level: 'High',
    annual_target_tons: 6500000,
    ytd_production_tons: 4200000,
    depth: 120, // meters
    production_tpd: 18500,
    workers: 850,
    shift: 'Morning (A)',
    working_hours: 8.0,
    methane_ppm: 820,
    co_ppm: 28, // DGMS Warning > 15 ppm
    co2_ppm: 2800,
    dust_mg_m3: 0.31,
    spm_ug_m3: 310,
    temperature: 32.4, // Celsius
    humidity: 78, // %
    ventilation_rate: 1.2, // m/s
    water_ph: 6.2,
    equipment_age: 6.8, // years
    equipment_fault_count: 8,
    inspection_score: 64, // out of 100
    training_compliance: 79, // %
    ppe_compliance: 84, // %
    previous_accidents: 3, // last 3 years
    previous_near_misses: 15, // last 12 months
    open_compliance_issues: 4,
    days_since_last_inspection: 5,
    production_deviation: -14.2, // %
    accident_occurred: 1,
    accident_severity: 'Serious',
  },
  {
    id: 'mine-2',
    name: 'Raniganj Underground Mine Shaft-2',
    code: 'RNG-UG2',
    subsidiary_id: 'sub-2',
    subsidiary_name: 'ECL',
    company: 'Eastern Coalfields Limited (ECL)',
    mine_type: 'Underground',
    latitude: 23.6167,
    longitude: 87.1333,
    location_name: 'Raniganj, Paschim Bardhaman',
    state: 'West Bengal',
    manager_name: 'Amitabh Roy',
    contact_phone: '+91 9876543211',
    operational_status: 'Active',
    risk_score: 35,
    risk_level: 'Low',
    annual_target_tons: 3200000,
    ytd_production_tons: 2100000,
    depth: 350, // meters
    production_tpd: 7200,
    workers: 620,
    shift: 'Morning (A)',
    working_hours: 8.0,
    methane_ppm: 410,
    co_ppm: 6,
    co2_ppm: 1200,
    dust_mg_m3: 0.14,
    spm_ug_m3: 140,
    temperature: 34.8,
    humidity: 84,
    ventilation_rate: 2.4, // Good velocity in return airway
    water_ph: 7.1,
    equipment_age: 4.1,
    equipment_fault_count: 2,
    inspection_score: 92,
    training_compliance: 96,
    ppe_compliance: 98,
    previous_accidents: 0,
    previous_near_misses: 2,
    open_compliance_issues: 1,
    days_since_last_inspection: 2,
    production_deviation: 2.8,
    accident_occurred: 0,
    accident_severity: 'None',
  },
  {
    id: 'mine-3',
    name: 'Talcher Open Cast Mine',
    code: 'TLC-OCP1',
    subsidiary_id: 'sub-3',
    subsidiary_name: 'MCL',
    company: 'Mahanadi Coalfields Limited (MCL)',
    mine_type: 'Open Cast',
    latitude: 20.9500,
    longitude: 85.2167,
    location_name: 'Talcher, Angul',
    state: 'Odisha',
    manager_name: 'Suresh Patnaik',
    contact_phone: '+91 9876543212',
    operational_status: 'Active',
    risk_score: 62,
    risk_level: 'Moderate',
    annual_target_tons: 9000000,
    ytd_production_tons: 6100000,
    depth: 95,
    production_tpd: 24000,
    workers: 1100,
    shift: 'Evening (B)',
    working_hours: 8.0,
    methane_ppm: 550,
    co_ppm: 12,
    co2_ppm: 1900,
    dust_mg_m3: 0.24,
    spm_ug_m3: 240,
    temperature: 29.2,
    humidity: 65,
    ventilation_rate: 1.5,
    water_ph: 6.8,
    equipment_age: 7.5,
    equipment_fault_count: 4,
    inspection_score: 78,
    training_compliance: 88,
    ppe_compliance: 92,
    previous_accidents: 1,
    previous_near_misses: 7,
    open_compliance_issues: 2,
    days_since_last_inspection: 4,
    production_deviation: -1.5,
    accident_occurred: 0,
    accident_severity: 'None',
  },
  {
    id: 'mine-4',
    name: 'North Karanpura Opencast Project',
    code: 'NKP-OCP',
    subsidiary_id: 'sub-4',
    subsidiary_name: 'CCL',
    company: 'Central Coalfields Limited (CCL)',
    mine_type: 'Open Cast',
    latitude: 23.8500,
    longitude: 85.1500,
    location_name: 'Chatra / Hazaribagh',
    state: 'Jharkhand',
    manager_name: 'Vikram Singh',
    contact_phone: '+91 9876543213',
    operational_status: 'Under Audit',
    risk_score: 88,
    risk_level: 'Critical',
    annual_target_tons: 7800000,
    ytd_production_tons: 3900000,
    depth: 210,
    production_tpd: 12400,
    workers: 940,
    shift: 'Night (C)',
    working_hours: 8.0,
    methane_ppm: 1150,
    co_ppm: 48, // High CO indicates fire / spontaneous combustion
    co2_ppm: 4600,
    dust_mg_m3: 0.42,
    spm_ug_m3: 420,
    temperature: 36.1,
    humidity: 88,
    ventilation_rate: 0.7, // Low ventilation
    water_ph: 5.4,
    equipment_age: 9.2,
    equipment_fault_count: 14, // Severe machinery hazard
    inspection_score: 46,
    training_compliance: 62,
    ppe_compliance: 71,
    previous_accidents: 4,
    previous_near_misses: 26,
    open_compliance_issues: 6,
    days_since_last_inspection: 17,
    production_deviation: -42.1,
    accident_occurred: 1,
    accident_severity: 'Fatal',
  },
];

const contractors = [
  { id: 'con-1', name: 'MineTech Infra Corp', registration_no: 'MTC-2021-987', contract_type: 'Overburden Excavation', primary_mine_id: 'mine-1', active_workers: 180, compliance_score: 92, risk_level: 'Low' },
  { id: 'con-2', name: 'Eastern Earthmovers Ltd', registration_no: 'EEM-2020-441', contract_type: 'Haulage & Transport', primary_mine_id: 'mine-1', active_workers: 140, compliance_score: 64, risk_level: 'High' },
  { id: 'con-3', name: 'Kalinga Safety Logistics', registration_no: 'KSL-2022-105', contract_type: 'Ventilation & Safety Systems', primary_mine_id: 'mine-3', active_workers: 95, compliance_score: 88, risk_level: 'Low' },
  { id: 'con-4', name: 'Apex Mining Services', registration_no: 'AMS-2019-332', contract_type: 'Blasting & Drilling Operations', primary_mine_id: 'mine-4', active_workers: 210, compliance_score: 52, risk_level: 'Critical' },
];

const compliance_rules = [
  { id: 'rule-1', rule_code: 'DGMS-SAF-01', title: 'Slope Stability Inspection (Open Cast)', category: 'Safety', frequency: 'Weekly', statutory_reference: 'DGMS Circular 04 of 2019', penalty_description: 'Work Stoppage Order', severity: 'Critical' },
  { id: 'rule-2', rule_code: 'DGMS-SAF-02', title: 'Continuous Methane & Toxic Gas Monitoring', category: 'Safety', frequency: 'Daily', statutory_reference: 'Coal Mines Regulations 2017 (Reg 153)', penalty_description: 'Heavy Statutory Fine & License Audit', severity: 'Critical' },
  { id: 'rule-3', rule_code: 'MOEF-ENV-01', title: 'Suspended Particulate Matter (SPM) Dust Control', category: 'Environmental', frequency: 'Monthly', statutory_reference: 'CPCB Environmental Clearance Limit <250 µg/m³', penalty_description: 'Environmental Clearance Suspension', severity: 'High' },
  { id: 'rule-4', rule_code: 'MOEF-ENV-02', title: 'Effluent Water Treatment & pH Balance', category: 'Environmental', frequency: 'Monthly', statutory_reference: 'Water Prevention & Control Act 1974', penalty_description: 'Notice of Closure', severity: 'Medium' },
  { id: 'rule-5', rule_code: 'LAB-WEL-01', title: 'Personal Protective Equipment (PPE) Audit', category: 'Labour', frequency: 'Weekly', statutory_reference: 'Mines Act 1952 Section 18', penalty_description: 'Contractor Penalty ₹50,000 per violation', severity: 'High' },
  { id: 'rule-6', rule_code: 'LAB-WEL-02', title: 'Periodic Medical Examination (PME) for Miners', category: 'Labour', frequency: 'Quarterly', statutory_reference: 'Mines Rules 1955 Rule 29B', penalty_description: 'Disqualification of Unexamined Labour', severity: 'Medium' },
  { id: 'rule-7', rule_code: 'PRD-AUD-01', title: 'Daily Explosive & Blasting Log Audit', category: 'Production', frequency: 'Daily', statutory_reference: 'Explosives Act 1884 & CMR 2017', penalty_description: 'Magazine Storage Permit Revocation', severity: 'Critical' },
  { id: 'rule-8', rule_code: 'PRD-AUD-02', title: 'Coal Stockpile Telemetry & Weighbridge Calibration', category: 'Production', frequency: 'Monthly', statutory_reference: 'Coal Controller Organization Audit Standard', penalty_description: 'Discrepancy Investigation', severity: 'Medium' },
];

const mine_compliance_status = [
  // Jharia (mine-1)
  { id: 'mcs-1', mine_id: 'mine-1', rule_id: 'rule-1', status: 'Compliant', last_verified_at: '2026-09-01T10:00:00Z', next_due_date: '2026-09-08', remarks: 'Bench slope angle verified at 42°.' },
  { id: 'mcs-2', mine_id: 'mine-1', rule_id: 'rule-2', status: 'Violated', last_verified_at: '2026-09-05T14:30:00Z', next_due_date: '2026-09-06', remarks: 'Methane CH4 sensor in Pit 3 North reads 820 ppm (Threshold: 500 ppm).' },
  { id: 'mcs-3', mine_id: 'mine-1', rule_id: 'rule-3', status: 'Overdue', last_verified_at: '2026-08-15T09:00:00Z', next_due_date: '2026-09-01', remarks: 'SPM level exceeds limit at 310 µg/m³; water sprinkling logs missing.' },
  { id: 'mcs-4', mine_id: 'mine-1', rule_id: 'rule-5', status: 'Compliant', last_verified_at: '2026-09-04T11:00:00Z', next_due_date: '2026-09-11', remarks: '100% PPE compliance recorded for Shift A.' },
  
  // Raniganj (mine-2)
  { id: 'mcs-5', mine_id: 'mine-2', rule_id: 'rule-1', status: 'Compliant', last_verified_at: '2026-09-02T12:00:00Z', next_due_date: '2026-09-09', remarks: 'Roof bolting inspection passed.' },
  { id: 'mcs-6', mine_id: 'mine-2', rule_id: 'rule-2', status: 'Compliant', last_verified_at: '2026-09-06T08:00:00Z', next_due_date: '2026-09-07', remarks: 'Gas sensors normal in Shaft 2.' },
  { id: 'mcs-7', mine_id: 'mine-2', rule_id: 'rule-4', status: 'Due Soon', last_verified_at: '2026-08-10T10:00:00Z', next_due_date: '2026-09-10', remarks: 'Water discharge report due in 4 days.' },
  
  // Talcher (mine-3)
  { id: 'mcs-8', mine_id: 'mine-3', rule_id: 'rule-1', status: 'Compliant', last_verified_at: '2026-09-03T15:00:00Z', next_due_date: '2026-09-10', remarks: 'Haul road gradient compliant.' },
  { id: 'mcs-9', mine_id: 'mine-3', rule_id: 'rule-3', status: 'Due Soon', last_verified_at: '2026-08-12T11:00:00Z', next_due_date: '2026-09-09', remarks: 'Dust monitoring due.' },
  
  // North Karanpura (mine-4)
  { id: 'mcs-10', mine_id: 'mine-4', rule_id: 'rule-2', status: 'Violated', last_verified_at: '2026-09-05T16:00:00Z', next_due_date: '2026-09-06', remarks: 'CH4 sensor spike (1150 ppm) detected.' },
  { id: 'mcs-11', mine_id: 'mine-4', rule_id: 'rule-7', status: 'Overdue', last_verified_at: '2026-08-20T10:00:00Z', next_due_date: '2026-08-30', remarks: 'Explosive magazine log audit overdue by 7 days.' },
];

const inspections = [
  {
    id: 'insp-101',
    mine_id: 'mine-1',
    mine_name: 'Jharia Open Cast Mine Pit-3',
    inspector_name: 'Sanjeev Kumar (DGMS Inspector)',
    inspector_role: 'Regulator / Inspector',
    inspection_date: '2026-09-05T14:30:00Z',
    overall_status: 'Failed / Major Violations',
    hazard_rating: 'High',
    checklist_data: {
      slope_stability: 'Pass',
      ventilation_fan: 'Pass',
      methane_sensor: 'Fail (820 ppm)',
      dust_suppression: 'Fail (Water sprinkler offline)',
      ppe_compliance: 'Pass',
    },
    notes: 'Observed water sprinkling truck breakdown resulting in severe dust plume in Pit 3 North face. Methane sensor reading elevated.',
    photo_url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    latitude: 23.7512,
    longitude: 86.4180,
    synced_from_offline: false,
  },
  {
    id: 'insp-102',
    mine_id: 'mine-2',
    mine_name: 'Raniganj Underground Mine Shaft-2',
    inspector_name: 'Arun Mukherjee',
    inspector_role: 'Mine Official',
    inspection_date: '2026-09-06T09:15:00Z',
    overall_status: 'Passed with Observations',
    hazard_rating: 'Low',
    checklist_data: {
      roof_bolting: 'Pass',
      air_velocity: 'Pass',
      gas_detector: 'Pass',
      emergency_lighting: 'Pass',
    },
    notes: 'Shaft 2 ventilation normal. Minor cable wear noted at Station 4 sub-station.',
    photo_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    latitude: 23.6170,
    longitude: 87.1340,
    synced_from_offline: false,
  },
];

const incidents = [
  {
    id: 'inc-1',
    mine_id: 'mine-1',
    mine_name: 'Jharia Open Cast Mine Pit-3',
    contractor_id: 'con-2',
    contractor_name: 'Eastern Earthmovers Ltd',
    title: 'Haulage Dumper Hydraulic Leak & Overheating',
    category: 'Equipment Failure',
    severity: 'High',
    description: 'Dumper #HD-44 leaked hydraulic oil near Pit 3 ramp, posing slip and fire hazard.',
    reported_by: 'Manoj Verma (Safety Officer)',
    reported_at: '2026-09-05T11:20:00Z',
    photo_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
    latitude: 23.7505,
    longitude: 86.4172,
    status: 'Action Required',
    escalated_to_corporate: true,
    escalated_to_regulator: false,
  },
  {
    id: 'inc-2',
    mine_id: 'mine-4',
    mine_name: 'North Karanpura Opencast Project',
    contractor_id: 'con-4',
    contractor_name: 'Apex Mining Services',
    title: 'Flyrock Dispersion Beyond Blast Zone Boundary',
    category: 'Blasting Hazard',
    severity: 'Critical',
    description: 'Controlled blasting at West Quarry resulted in flyrock exceeding 300m safety buffer.',
    reported_by: 'Prakash Rao (Senior Engineer)',
    reported_at: '2026-09-04T16:45:00Z',
    photo_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    latitude: 23.8520,
    longitude: 85.1530,
    status: 'Under Investigation',
    escalated_to_corporate: true,
    escalated_to_regulator: true,
  },
];

const corrective_actions = [
  {
    id: 'ca-1',
    incident_id: 'inc-1',
    mine_id: 'mine-1',
    mine_name: 'Jharia Open Cast Mine Pit-3',
    action_plan: 'Replace hydraulic hose assembly on Dumper HD-44 and inspect all Eastern Earthmovers haulage vehicles.',
    assigned_to: 'Ramesh Gupta (Maintenance Lead)',
    assigned_role: 'Contractor Engineer',
    due_date: '2026-09-08',
    status: 'In Progress',
    signoff_by: null,
    signoff_timestamp: null,
  },
  {
    id: 'ca-2',
    incident_id: 'inc-2',
    mine_id: 'mine-4',
    mine_name: 'North Karanpura Opencast Project',
    action_plan: 'Re-calibrate explosive charge weight per hole and submit updated blast design plan to DGMS.',
    assigned_to: 'Deepak Saxena (Blasting Officer)',
    assigned_role: 'Mine Official',
    due_date: '2026-09-10',
    status: 'Pending',
    signoff_by: null,
    signoff_timestamp: null,
  },
];

const alerts = [
  {
    id: 'alt-1',
    mine_id: 'mine-1',
    mine_name: 'Jharia Open Cast Mine Pit-3',
    alert_type: 'AI High Risk Flag',
    severity: 'High',
    message: 'AI Risk Engine flagged Jharia Pit-3 (Risk Score: 78). Multiple recurring SPM dust violations & CH4 gas spike.',
    target_role: 'Corporate Management',
    status: 'Unread',
    created_at: '2026-09-05T14:35:00Z',
  },
  {
    id: 'alt-2',
    mine_id: 'mine-4',
    mine_name: 'North Karanpura Opencast Project',
    alert_type: 'Gas Anomaly',
    severity: 'Critical',
    message: 'CRITICAL: Methane CH4 sensor exceeded statutory limit (1150 ppm). Immediate ventilation audit required.',
    target_role: 'Mine Official',
    status: 'Unread',
    created_at: '2026-09-05T16:05:00Z',
  },
  {
    id: 'alt-3',
    mine_id: 'mine-1',
    mine_name: 'Jharia Open Cast Mine Pit-3',
    alert_type: 'Compliance Deadline',
    severity: 'Medium',
    message: 'Slope stability inspection due in 2 days.',
    target_role: 'Mine Official',
    status: 'Acknowledged',
    created_at: '2026-09-06T07:00:00Z',
  },
];

const documents = [
  {
    id: 'doc-1',
    mine_id: 'mine-1',
    mine_name: 'Jharia Open Cast Mine Pit-3',
    title: 'DGMS Safety Inspection Notice Form IV',
    document_type: 'Statutory Inspection Certificate',
    file_url: '/samples/dgms_notice_jharia.pdf',
    uploaded_by: 'Sanjeev Kumar',
    uploaded_at: '2026-09-05T15:00:00Z',
    approval_status: 'Verified',
    ocr_raw_text: 'DIRECTORATE GENERAL OF MINES SAFETY - FORM IV INSPECTION REPORT\nMine: Jharia Open Cast Pit-3\nDate: 05/09/2026\nInspector: Sanjeev Kumar\nObservations: Methane gas 820 ppm. Water sprinkler trucks non-functional in North Pit. Contractor Eastern Earthmovers penalized ₹50,000.\nSigned: S. Kumar',
    ocr_structured_json: {
      document_type: 'DGMS Form IV',
      mine_code: 'JHR-OCP3',
      inspection_date: '2026-09-05',
      inspector: 'Sanjeev Kumar',
      key_findings: [
        'Methane level 820 ppm (Threshold: 500 ppm)',
        'Water sprinkler truck non-functional',
      ],
      penalty_amount_inr: 50000,
      compliance_status: 'Violated',
    },
  },
  {
    id: 'doc-2',
    mine_id: 'mine-2',
    mine_name: 'Raniganj Underground Mine Shaft-2',
    title: 'Monthly Environmental Clearance Certificate',
    document_type: 'Environmental Clearance',
    file_url: '/samples/raniganj_env_clearance.pdf',
    uploaded_by: 'Amitabh Roy',
    uploaded_at: '2026-09-02T10:00:00Z',
    approval_status: 'Processed',
    ocr_raw_text: 'WEST BENGAL POLLUTION CONTROL BOARD\nConsent to Operate Certificate\nMine: Raniganj Shaft 2\nSPM: 140 ug/m3 (Pass)\nWater pH: 7.1 (Pass)\nStatus: Compliant',
    ocr_structured_json: {
      document_type: 'Environment Certificate',
      mine_code: 'RNG-UG2',
      spm_level: 140,
      water_ph: 7.1,
      compliance_status: 'Compliant',
    },
  },
];

// Audit trail ledger
const audit_trail = [];

// Seed genesis audit log
const t1 = '2026-09-01T00:00:00.000Z';
const h1 = calculateHash(GENESIS_HASH, 'System Admin', 'System Initialization', 'Global Platform', t1, { system: 'Coal Mine Smart Governance API initialized' });
audit_trail.push({
  id: 'aud-1',
  timestamp: t1,
  actor_name: 'System Admin',
  actor_role: 'Admin',
  action_type: 'System Initialization',
  entity_target: 'Global Platform',
  details_json: { system: 'Coal Mine Smart Governance API initialized' },
  previous_hash: GENESIS_HASH,
  current_hash: h1,
});

const t2 = '2026-09-05T14:35:00.000Z';
const h2 = calculateHash(h1, 'AI Risk Engine', 'Risk Score Calculation', 'Jharia Pit-3', t2, { old_score: 45, new_score: 78, reason: 'CH4 gas spike & SPM dust non-compliance' });
audit_trail.push({
  id: 'aud-2',
  timestamp: t2,
  actor_name: 'AI Risk Engine',
  actor_role: 'AI System',
  action_type: 'Risk Score Calculation',
  entity_target: 'Jharia Pit-3',
  details_json: { old_score: 45, new_score: 78, reason: 'CH4 gas spike & SPM dust non-compliance' },
  previous_hash: h1,
  current_hash: h2,
});

function appendAuditLog(actorName, actorRole, actionType, entityTarget, details) {
  const previousHash = audit_trail.length > 0 ? audit_trail[audit_trail.length - 1].current_hash : GENESIS_HASH;
  const timestamp = new Date().toISOString();
  const currentHash = calculateHash(previousHash, actorName, actorRole, actionType, timestamp, details);
  const logEntry = {
    id: `aud-${Date.now()}`,
    timestamp,
    actor_name: actorName,
    actor_role: actorRole,
    action_type: actionType,
    entity_target: entityTarget,
    details_json: details,
    previous_hash: previousHash,
    current_hash: currentHash,
  };
  audit_trail.push(logEntry);
  return logEntry;
}

function verifyAuditChain() {
  let prevHash = GENESIS_HASH;
  for (let i = 0; i < audit_trail.length; i++) {
    const entry = audit_trail[i];
    if (entry.previous_hash !== prevHash) {
      return { valid: false, brokenAt: i, reason: 'Previous hash mismatch' };
    }
    const recalculated = calculateHash(
      entry.previous_hash,
      entry.actor_name,
      entry.action_type,
      entry.entity_target,
      entry.timestamp,
      entry.details_json
    );
    if (recalculated !== entry.current_hash) {
      return { valid: false, brokenAt: i, reason: 'Current hash tampered' };
    }
    prevHash = entry.current_hash;
  }
  return { valid: true, totalRecords: audit_trail.length, latestHash: prevHash };
}

function calculateMineAIRisk(mineId) {
  const mine = mines.find(m => m.id === mineId);
  if (!mine) return null;

  const mineInspections = inspections.filter(i => i.mine_id === mineId);
  const mineIncidents = incidents.filter(i => i.mine_id === mineId);
  const mineCompliance = mine_compliance_status.filter(mc => mc.mine_id === mineId);

  let score = 20; // baseline
  const factors = [];
  const anomalies = [];

  // 1. Methane gas check (CMR 2017 Reg 153)
  if (mine.methane_ppm > 800) {
    score += 25;
    factors.push(`Critical Methane CH4 concentration (${mine.methane_ppm} ppm > threshold 500 ppm)`);
    anomalies.push({ type: 'Gas Anomaly', sensor: 'Methane CH4', value: mine.methane_ppm, unit: 'ppm', limit: 500 });
  } else if (mine.methane_ppm > 500) {
    score += 15;
    factors.push(`Elevated Methane level (${mine.methane_ppm} ppm)`);
  }

  // 2. Carbon Monoxide check (DGMS Spontaneous Combustion / Mine Fire Indicator)
  if (mine.co_ppm > 30) {
    score += 25;
    factors.push(`Critical Carbon Monoxide (${mine.co_ppm} ppm > DGMS limit 25 ppm - fire/heating risk)`);
    anomalies.push({ type: 'Toxic Gas Anomaly', sensor: 'Carbon Monoxide (CO)', value: mine.co_ppm, unit: 'ppm', limit: 25 });
  } else if (mine.co_ppm > 15) {
    score += 10;
    factors.push(`Elevated CO reading (${mine.co_ppm} ppm)`);
  }

  // 3. Ventilation Airflow velocity (CMR 2017 standard > 1.0 m/s in workings)
  if (mine.ventilation_rate && mine.ventilation_rate < 1.0) {
    score += 15;
    factors.push(`Sub-standard ventilation airflow (${mine.ventilation_rate} m/s < statutory minimum 1.0 m/s)`);
    anomalies.push({ type: 'Ventilation Defect', sensor: 'Airflow Anemometer', value: mine.ventilation_rate, unit: 'm/s', limit: 1.0 });
  }

  // 4. Equipment Faults & Machinery Hazard (DGMS 2024 Top Fatality Factor)
  if (mine.equipment_fault_count && mine.equipment_fault_count >= 8) {
    score += 15;
    factors.push(`High machinery failure rate (${mine.equipment_fault_count} faults/30d - dumper/conveyor risk)`);
    anomalies.push({ type: 'Machinery Anomaly', sensor: 'Telemetry Fault Logger', value: mine.equipment_fault_count, unit: 'faults', limit: 5 });
  }

  // 5. Dust check (CPCB / MOEF Environmental Limit < 250 ug/m3)
  if (mine.spm_ug_m3 > 250) {
    score += 15;
    factors.push(`High SPM Dust concentration (${mine.spm_ug_m3} µg/m³ > limit 250 µg/m³)`);
    anomalies.push({ type: 'Environmental Anomaly', sensor: 'SPM Dust', value: mine.spm_ug_m3, unit: 'µg/m³', limit: 250 });
  }

  // 6. Violations & Overdue rules
  const violatedCount = mineCompliance.filter(c => c.status === 'Violated').length;
  const overdueCount = mineCompliance.filter(c => c.status === 'Overdue').length;

  if (violatedCount > 0) {
    score += violatedCount * 12;
    factors.push(`${violatedCount} active statutory violations`);
  }
  if (overdueCount > 0) {
    score += overdueCount * 8;
    factors.push(`${overdueCount} overdue compliance items`);
  }

  // 7. Days since last inspection lapse
  if (mine.days_since_last_inspection && mine.days_since_last_inspection > 14) {
    score += 10;
    factors.push(`Inspection lapse (${mine.days_since_last_inspection} days since last statutory DGMS audit)`);
  }

  // 8. Incident penalty
  const highIncidents = mineIncidents.filter(inc => inc.severity === 'High' || inc.severity === 'Critical').length;
  if (highIncidents > 0) {
    score += highIncidents * 12;
    factors.push(`${highIncidents} high/critical incidents reported recently`);
  }

  score = Math.min(Math.max(score, 5), 98);
  let level = 'Low';
  if (score >= 80) level = 'Critical';
  else if (score >= 70) level = 'High';
  else if (score >= 50) level = 'Moderate';

  mine.risk_score = score;
  mine.risk_level = level;

  return {
    mine_id: mineId,
    mine_name: mine.name,
    risk_score: score,
    risk_level: level,
    factors,
    anomalies,
    recommendations: [
      level === 'Critical' || level === 'High' ? 'Dispatch immediate DGMS safety audit team' : 'Schedule routine check',
      mine.co_ppm > 25 ? 'Conduct immediate thermal imaging for spontaneous heating in coal pillar/seam' : 'Thermal sensors stable',
      mine.ventilation_rate < 1.0 ? 'Boost booster fans & clear auxiliary ventilation ducts' : 'Ventilation adequate',
      mine.spm_ug_m3 > 250 ? 'Deploy automated water sprinkling trucks on haul roads' : 'Maintain dust suppression',
      mine.methane_ppm > 500 ? 'Evacuate district if CH4 exceeds 1.25% (12,500 ppm), calibrate continuous telemetry' : 'Gas sensors operating normally',
    ],
  };
}

module.exports = {
  subsidiaries,
  mines,
  contractors,
  compliance_rules,
  mine_compliance_status,
  inspections,
  incidents,
  corrective_actions,
  alerts,
  documents,
  audit_trail,
  appendAuditLog,
  verifyAuditChain,
  calculateMineAIRisk,
};
