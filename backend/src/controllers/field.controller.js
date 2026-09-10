const { syncOfflineReports } = require('./inspections.controller');

const syncField = async (req, res, next) => {
  return syncOfflineReports(req, res, next);
};

const getSyncStatus = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      pending_sync_count: 0,
      last_sync_timestamp: new Date().toISOString(),
    });
  } catch (err) { next(err); }
};

module.exports = { syncField, getSyncStatus };
