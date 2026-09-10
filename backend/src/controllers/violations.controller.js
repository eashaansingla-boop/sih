const { mine_compliance_status, compliance_rules, mines } = require('../models/dataStore');

const createViolation = async (req, res, next) => {
  try {
    return res.status(201).json({ success: true, message: 'Violation reported', data: req.body });
  } catch (err) { next(err); }
};
const getViolations = async (req, res, next) => {
  try {
    const list = mine_compliance_status.filter(c => c.status === 'Violated' || c.status === 'Overdue').map(c => {
      const rule = compliance_rules.find(r => r.id === c.rule_id);
      const mine = mines.find(m => m.id === c.mine_id);
      return {
        ...c,
        rule_code: rule ? rule.rule_code : 'N/A',
        title: rule ? rule.title : 'N/A',
        mine_name: mine ? mine.name : 'N/A',
      };
    });
    return res.status(200).json({ success: true, count: list.length, data: list });
  } catch (err) { next(err); }
};
const getViolationById = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, data: { id: req.params.id } });
  } catch (err) { next(err); }
};
const updateViolationStatus = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, message: 'Violation status updated' });
  } catch (err) { next(err); }
};
module.exports = { createViolation, getViolations, getViolationById, updateViolationStatus };
