const { mines, inspections, incidents } = require('../models/dataStore');

const getGISMapData = async (req, res, next) => {
  try {
    const mineFeatures = mines.map(m => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [m.longitude, m.latitude],
      },
      properties: {
        id: m.id,
        name: m.name,
        code: m.code,
        subsidiary: m.subsidiary_name,
        mine_type: m.mine_type,
        risk_score: m.risk_score,
        risk_level: m.risk_level,
        status: m.operational_status,
        manager: m.manager_name,
        methane_ppm: m.methane_ppm,
        spm_ug_m3: m.spm_ug_m3,
        location: m.location_name,
        state: m.state,
      },
    }));

    const inspectionFeatures = inspections.map(i => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [i.longitude, i.latitude],
      },
      properties: {
        id: i.id,
        mine_id: i.mine_id,
        mine_name: i.mine_name,
        inspector: i.inspector_name,
        date: i.inspection_date,
        overall_status: i.overall_status,
        hazard_rating: i.hazard_rating,
        notes: i.notes,
        photo_url: i.photo_url,
      },
    }));

    const incidentFeatures = incidents.map(inc => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [inc.longitude, inc.latitude],
      },
      properties: {
        id: inc.id,
        mine_id: inc.mine_id,
        mine_name: inc.mine_name,
        title: inc.title,
        severity: inc.severity,
        status: inc.status,
        reported_by: inc.reported_by,
        reported_at: inc.reported_at,
        photo_url: inc.photo_url,
      },
    }));

    const riskZoneFeatures = mines
      .filter(m => m.risk_level === 'High' || m.risk_level === 'Critical')
      .map(m => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [m.longitude, m.latitude],
        },
        properties: {
          mine_id: m.id,
          mine_name: m.name,
          risk_level: m.risk_level,
          radius_meters: 1500,
          hazard: 'High Methane CH4 & Dust Accumulation Zone',
        },
      }));

    return res.status(200).json({
      success: true,
      data: {
        type: 'FeatureCollection',
        mines: mineFeatures,
        inspections: inspectionFeatures,
        incidents: incidentFeatures,
        risk_zones: riskZoneFeatures,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMines = async (req, res, next) => res.status(200).json({ success: true, count: mines.length, data: mines });
const getInspections = async (req, res, next) => res.status(200).json({ success: true, count: inspections.length, data: inspections });
const getObservations = async (req, res, next) => res.status(200).json({ success: true, count: 0, data: [] });
const getIncidents = async (req, res, next) => res.status(200).json({ success: true, count: incidents.length, data: incidents });
const getRiskZones = async (req, res, next) => {
  const zones = mines.filter(m => m.risk_level === 'High' || m.risk_level === 'Critical').map(m => ({
    mine_id: m.id,
    mine_name: m.name,
    latitude: m.latitude,
    longitude: m.longitude,
    risk_level: m.risk_level,
    hazard_type: 'Methane Gas Spike & SPM Dust Hazard',
  }));
  return res.status(200).json({ success: true, count: zones.length, data: zones });
};

module.exports = {
  getGISMapData,
  getMines,
  getInspections,
  getObservations,
  getIncidents,
  getRiskZones,
};
