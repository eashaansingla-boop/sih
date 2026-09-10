const { alerts, appendAuditLog } = require('../models/dataStore');

const getAlerts = async (req, res, next) => {
  try {
    const { role, mine_id, status } = req.query;
    let list = [...alerts];
    if (role) list = list.filter(a => a.target_role.toLowerCase() === role.toLowerCase() || a.target_role === 'All');
    if (mine_id) list = list.filter(a => a.mine_id === mine_id);
    if (status) list = list.filter(a => a.status.toLowerCase() === status.toLowerCase());

    return res.status(200).json({
      success: true,
      unread_count: list.filter(a => a.status === 'Unread').length,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

const getAlertById = async (req, res, next) => {
  const item = alerts.find(a => a.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Alert not found' });
  return res.status(200).json({ success: true, data: item });
};

const acknowledgeAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { acknowledged_by } = req.body;

    const alert = alerts.find(a => a.id === id);
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });

    alert.status = 'Acknowledged';
    alert.acknowledged_by = acknowledged_by || 'Mine Official';
    alert.acknowledged_at = new Date().toISOString();

    appendAuditLog(
      alert.acknowledged_by,
      'User',
      'Alert Acknowledged',
      alert.mine_name,
      { alert_id: alert.id, type: alert.alert_type }
    );

    return res.status(200).json({
      success: true,
      message: 'Alert acknowledged',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlerts,
  getAlertById,
  acknowledgeAlert,
};
