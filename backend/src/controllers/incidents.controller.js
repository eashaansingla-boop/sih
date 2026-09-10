const { incidents, mines, contractors, alerts, appendAuditLog } = require('../models/dataStore');

const getIncidents = async (req, res, next) => {
  try {
    const { mine_id, status, severity } = req.query;
    let list = [...incidents];
    if (mine_id) list = list.filter(i => i.mine_id === mine_id);
    if (status) list = list.filter(i => i.status.toLowerCase() === status.toLowerCase());
    if (severity) list = list.filter(i => i.severity.toLowerCase() === severity.toLowerCase());

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

const getIncidentById = async (req, res, next) => {
  try {
    const item = incidents.find(i => i.id === req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Incident not found' });
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const createIncident = async (req, res, next) => {
  try {
    const { mine_id, contractor_id, title, category, severity, description, reported_by, photo_url, latitude, longitude } = req.body;
    const mine = mines.find(m => m.id === mine_id) || mines[0];
    const contractor = contractors.find(c => c.id === contractor_id);

    const newInc = {
      id: `inc-${Date.now()}`,
      mine_id: mine.id,
      mine_name: mine.name,
      contractor_id: contractor ? contractor.id : null,
      contractor_name: contractor ? contractor.name : 'N/A',
      title: title || 'Safety Incident Reported',
      category: category || 'Safety Hazard',
      severity: severity || 'Medium',
      description: description || 'Incident reported by field worker.',
      reported_by: reported_by || 'Field Worker',
      reported_at: new Date().toISOString(),
      photo_url: photo_url || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
      latitude: latitude || mine.latitude,
      longitude: longitude || mine.longitude,
      status: 'Open',
      escalated_to_corporate: severity === 'High' || severity === 'Critical',
      escalated_to_regulator: severity === 'Critical',
    };

    incidents.unshift(newInc);

    if (severity === 'High' || severity === 'Critical') {
      alerts.unshift({
        id: `alt-${Date.now()}`,
        mine_id: mine.id,
        mine_name: mine.name,
        alert_type: 'AI High Risk Flag',
        severity,
        message: `INCIDENT ALERT: ${newInc.title} at ${mine.name}. Severity: ${severity}.`,
        target_role: 'Corporate Management',
        status: 'Unread',
        created_at: new Date().toISOString(),
      });
    }

    appendAuditLog(
      newInc.reported_by,
      'Field Worker / Official',
      'Incident Reported',
      mine.name,
      { incident_id: newInc.id, title: newInc.title, severity: newInc.severity }
    );

    return res.status(201).json({
      success: true,
      message: 'Incident reported successfully',
      data: newInc,
    });
  } catch (error) {
    next(error);
  }
};

const resolveIncident = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resolved_by, resolution_notes } = req.body;

    const inc = incidents.find(i => i.id === id);
    if (!inc) return res.status(404).json({ success: false, message: 'Incident not found' });

    inc.status = 'Resolved';
    inc.resolved_by = resolved_by || 'Mine Safety Officer';
    inc.resolved_at = new Date().toISOString();
    inc.resolution_notes = resolution_notes || 'Corrective actions completed and verified.';

    appendAuditLog(
      inc.resolved_by,
      'Mine Official',
      'Incident Resolved & Closed',
      inc.mine_name,
      { incident_id: inc.id, resolution_notes }
    );

    return res.status(200).json({
      success: true,
      message: 'Incident marked as resolved',
      data: inc,
    });
  } catch (error) {
    next(error);
  }
};

const updateIncidentStatus = resolveIncident;

module.exports = {
  getIncidents,
  getIncidentById,
  createIncident,
  resolveIncident,
  updateIncidentStatus,
};
