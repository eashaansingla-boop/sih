const { compliance_rules, mine_compliance_status, mines, appendAuditLog } = require('../models/dataStore');

const getComplianceRules = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      count: compliance_rules.length,
      data: compliance_rules,
    });
  } catch (error) {
    next(error);
  }
};

const getComplianceMatrix = async (req, res, next) => {
  try {
    const { mine_id, status } = req.query;

    let records = mine_compliance_status.map(mcs => {
      const rule = compliance_rules.find(r => r.id === mcs.rule_id);
      const mine = mines.find(m => m.id === mcs.mine_id);
      return {
        ...mcs,
        rule_code: rule ? rule.rule_code : 'N/A',
        rule_title: rule ? rule.title : 'N/A',
        category: rule ? rule.category : 'N/A',
        severity: rule ? rule.severity : 'N/A',
        mine_name: mine ? mine.name : 'N/A',
        subsidiary: mine ? mine.subsidiary_name : 'N/A',
      };
    });

    if (mine_id) {
      records = records.filter(r => r.mine_id === mine_id);
    }
    if (status) {
      records = records.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }

    const summary = {
      total: records.length,
      compliant: records.filter(r => r.status === 'Compliant').length,
      due_soon: records.filter(r => r.status === 'Due Soon').length,
      overdue: records.filter(r => r.status === 'Overdue').length,
      violated: records.filter(r => r.status === 'Violated').length,
    };

    return res.status(200).json({
      success: true,
      summary,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

const updateComplianceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, remarks, updated_by } = req.body;

    const item = mine_compliance_status.find(m => m.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Compliance record not found' });
    }

    item.status = status || item.status;
    item.remarks = remarks || item.remarks;
    item.last_verified_at = new Date().toISOString();

    appendAuditLog(
      updated_by || 'Mine Inspector',
      'Mine Official',
      'Update Compliance Status',
      `Record ID ${id}`,
      { new_status: status, remarks }
    );

    return res.status(200).json({
      success: true,
      message: 'Compliance status updated successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const getMineCompliance = getComplianceMatrix;
const getMineComplianceOverdue = async (req, res, next) => getComplianceMatrix({ query: { mine_id: req.params.mine_id, status: 'overdue' } }, res, next);
const getMineComplianceUpcoming = async (req, res, next) => getComplianceMatrix({ query: { mine_id: req.params.mine_id, status: 'due soon' } }, res, next);

const createComplianceRecord = async (req, res, next) => res.status(201).json({ success: true, message: 'Compliance record created', data: req.body });
const getComplianceRecords = getComplianceMatrix;
const getComplianceRecordById = async (req, res, next) => res.status(200).json({ success: true, data: { id: req.params.id } });
const updateComplianceRecordStatus = updateComplianceStatus;

module.exports = {
  getComplianceRules,
  getComplianceMatrix,
  updateComplianceStatus,
  getMineCompliance,
  getMineComplianceOverdue,
  getMineComplianceUpcoming,
  createComplianceRecord,
  getComplianceRecords,
  getComplianceRecordById,
  updateComplianceRecordStatus,
};
