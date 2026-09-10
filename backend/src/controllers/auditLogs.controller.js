const { audit_trail, verifyAuditChain } = require('../models/dataStore');

const getAuditLogs = async (req, res, next) => {
  try {
    const { search } = req.query;
    let list = [...audit_trail].reverse();
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        a =>
          a.actor_name.toLowerCase().includes(q) ||
          a.action_type.toLowerCase().includes(q) ||
          a.entity_target.toLowerCase().includes(q) ||
          a.current_hash.toLowerCase().includes(q)
      );
    }

    const verification = verifyAuditChain();

    return res.status(200).json({
      success: true,
      integrity: verification,
      count: list.length,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

const getAuditLogsByEntity = async (req, res, next) => {
  const { type, id } = req.params;
  const list = audit_trail.filter(a => a.entity_target.toLowerCase().includes(type.toLowerCase()) || a.entity_target.toLowerCase().includes(id.toLowerCase()));
  return res.status(200).json({ success: true, count: list.length, data: list });
};

const getAuditLogById = async (req, res, next) => {
  const item = audit_trail.find(a => a.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Audit log entry not found' });
  return res.status(200).json({ success: true, data: item });
};

const verifyIntegrity = async (req, res, next) => {
  try {
    const result = verifyAuditChain();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditLogs,
  getAuditLogsByEntity,
  getAuditLogById,
  verifyIntegrity,
};
