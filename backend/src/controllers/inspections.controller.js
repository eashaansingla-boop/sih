const { inspections, mines, appendAuditLog } = require('../models/dataStore');

const getInspections = async (req, res, next) => {
  try {
    const { mine_id } = req.query;
    let list = [...inspections];
    if (mine_id) {
      list = list.filter(i => i.mine_id === mine_id);
    }
    return res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

const getInspectionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = inspections.find(i => i.id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Inspection not found' });
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const createInspection = async (req, res, next) => {
  try {
    const {
      mine_id,
      inspector_name,
      inspector_role,
      overall_status,
      hazard_rating,
      checklist_data,
      notes,
      photo_url,
      latitude,
      longitude,
      synced_from_offline,
    } = req.body;

    const mine = mines.find(m => m.id === mine_id) || mines[0];

    const newInsp = {
      id: `insp-${Date.now()}`,
      mine_id: mine.id,
      mine_name: mine.name,
      inspector_name: inspector_name || 'Field Inspector',
      inspector_role: inspector_role || 'Field Officer',
      inspection_date: new Date().toISOString(),
      overall_status: overall_status || 'Passed',
      hazard_rating: hazard_rating || 'Low',
      checklist_data: checklist_data || {},
      notes: notes || 'Routine field safety inspection.',
      photo_url: photo_url || 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
      latitude: latitude || mine.latitude,
      longitude: longitude || mine.longitude,
      synced_from_offline: Boolean(synced_from_offline),
    };

    inspections.unshift(newInsp);

    appendAuditLog(
      newInsp.inspector_name,
      newInsp.inspector_role,
      'Field Safety Inspection Submission',
      mine.name,
      { inspection_id: newInsp.id, status: newInsp.overall_status, hazard: newInsp.hazard_rating }
    );

    return res.status(201).json({
      success: true,
      message: 'Field inspection submitted successfully',
      data: newInsp,
    });
  } catch (error) {
    next(error);
  }
};

const updateInspection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = inspections.find(i => i.id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Inspection not found' });
    Object.assign(item, req.body);
    return res.status(200).json({ success: true, message: 'Inspection updated', data: item });
  } catch (error) {
    next(error);
  }
};

const syncOfflineReports = async (req, res, next) => {
  try {
    const { reports } = req.body;
    if (!Array.isArray(reports) || reports.length === 0) {
      return res.status(400).json({ success: false, message: 'No offline reports provided' });
    }

    const syncedCount = reports.length;
    reports.forEach(rep => {
      const mine = mines.find(m => m.id === rep.mine_id) || mines[0];
      const newInsp = {
        id: `insp-off-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        mine_id: mine.id,
        mine_name: mine.name,
        inspector_name: rep.inspector_name || 'Field Officer',
        inspector_role: 'Field Officer (Offline)',
        inspection_date: rep.timestamp || new Date().toISOString(),
        overall_status: rep.overall_status || 'Passed with Observations',
        hazard_rating: rep.hazard_rating || 'Medium',
        checklist_data: rep.checklist_data || {},
        notes: rep.notes || 'Submitted while offline.',
        photo_url: rep.photo_url || '',
        latitude: rep.latitude || mine.latitude,
        longitude: rep.longitude || mine.longitude,
        synced_from_offline: true,
      };
      inspections.unshift(newInsp);

      appendAuditLog(
        newInsp.inspector_name,
        'Field Officer',
        'Offline Inspection Auto-Synced',
        mine.name,
        { inspection_id: newInsp.id }
      );
    });

    return res.status(200).json({
      success: true,
      message: `Successfully synced ${syncedCount} offline inspection reports`,
      synced_count: syncedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInspections,
  getInspectionById,
  createInspection,
  updateInspection,
  syncOfflineReports,
};
