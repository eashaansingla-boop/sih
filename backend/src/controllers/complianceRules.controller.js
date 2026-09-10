const { compliance_rules } = require('../models/dataStore');

const createRule = async (req, res, next) => res.status(201).json({ success: true, message: 'Rule created', data: req.body });
const getRules = async (req, res, next) => res.status(200).json({ success: true, count: compliance_rules.length, data: compliance_rules });
const getRuleById = async (req, res, next) => {
  const item = compliance_rules.find(r => r.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Rule not found' });
  return res.status(200).json({ success: true, data: item });
};
const updateRule = async (req, res, next) => res.status(200).json({ success: true, message: 'Rule updated' });

module.exports = { createRule, getRules, getRuleById, updateRule };
