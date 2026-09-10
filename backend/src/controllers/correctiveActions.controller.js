const { corrective_actions, appendAuditLog } = require('../models/dataStore');

const createCorrectiveAction = async (req, res, next) => {
  try {
    const newAction = {
      id: `ca-${Date.now()}`,
      ...req.body,
      status: 'Pending',
      created_at: new Date().toISOString(),
    };
    corrective_actions.unshift(newAction);
    return res.status(201).json({ success: true, message: 'Corrective action assigned', data: newAction });
  } catch (err) { next(err); }
};

const getCorrectiveActions = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, count: corrective_actions.length, data: corrective_actions });
  } catch (err) { next(err); }
};

const getCorrectiveActionById = async (req, res, next) => {
  try {
    const item = corrective_actions.find(c => c.id === req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Corrective action not found' });
    return res.status(200).json({ success: true, data: item });
  } catch (err) { next(err); }
};

const updateCorrectiveActionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, signoff_by } = req.body;
    const item = corrective_actions.find(c => c.id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });

    item.status = status || item.status;
    if (signoff_by) {
      item.signoff_by = signoff_by;
      item.signoff_timestamp = new Date().toISOString();
    }

    appendAuditLog(
      signoff_by || 'Mine Inspector',
      'Official',
      'Corrective Action Status Updated',
      item.mine_name || `Action ID ${id}`,
      { action_id: id, status: item.status, signoff: item.signoff_by }
    );

    return res.status(200).json({ success: true, message: 'Corrective action status updated', data: item });
  } catch (err) { next(err); }
};

module.exports = { createCorrectiveAction, getCorrectiveActions, getCorrectiveActionById, updateCorrectiveActionStatus };
