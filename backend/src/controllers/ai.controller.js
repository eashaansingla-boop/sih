const { mines, calculateMineAIRisk, incidents, mine_compliance_status } = require('../models/dataStore');

const getAIRiskAssessment = async (req, res, next) => {
  try {
    const assessments = mines.map(m => calculateMineAIRisk(m.id));
    const sorted = [...assessments].sort((a, b) => b.risk_score - a.risk_score);

    return res.status(200).json({
      success: true,
      high_risk_count: sorted.filter(a => a.risk_level === 'High' || a.risk_level === 'Critical').length,
      data: sorted,
    });
  } catch (error) {
    next(error);
  }
};

const getMineRiskDetail = async (req, res, next) => {
  try {
    const { mine_id } = req.params;
    const assessment = calculateMineAIRisk(mine_id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Mine not found' });
    }
    return res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

const getAnomalies = async (req, res, next) => {
  try {
    const anomalyList = [];
    mines.forEach(m => {
      if (m.methane_ppm > 500) {
        anomalyList.push({
          id: `anom-gas-${m.id}`,
          mine_id: m.id,
          mine_name: m.name,
          anomaly_type: 'Gas Spike',
          sensor_name: 'Methane CH4 Telemetry',
          current_value: `${m.methane_ppm} ppm`,
          statutory_limit: '500 ppm',
          variance_percentage: `+${Math.round(((m.methane_ppm - 500) / 500) * 100)}%`,
          severity: m.methane_ppm > 1000 ? 'Critical' : 'High',
          detected_at: new Date().toISOString(),
        });
      }
      if (m.spm_ug_m3 > 250) {
        anomalyList.push({
          id: `anom-spm-${m.id}`,
          mine_id: m.id,
          mine_name: m.name,
          anomaly_type: 'Dust Pollution Spike',
          sensor_name: 'SPM Sensor Array',
          current_value: `${m.spm_ug_m3} µg/m³`,
          statutory_limit: '250 µg/m³',
          variance_percentage: `+${Math.round(((m.spm_ug_m3 - 250) / 250) * 100)}%`,
          severity: 'High',
          detected_at: new Date().toISOString(),
        });
      }
      // Production Variance simulation
      if (m.id === 'mine-4') {
        anomalyList.push({
          id: `anom-prd-${m.id}`,
          mine_id: m.id,
          mine_name: m.name,
          anomaly_type: 'Abnormal Production Drop',
          sensor_name: 'Weighbridge Telemetry Logs',
          current_value: '12,400 Tons/day',
          statutory_limit: '25,000 Tons baseline',
          variance_percentage: '-50.4% Drop',
          severity: 'Critical',
          detected_at: new Date().toISOString(),
        });
      }
    });

    return res.status(200).json({
      success: true,
      count: anomalyList.length,
      data: anomalyList,
    });
  } catch (error) {
    next(error);
  }
};

const getRecurringViolations = async (req, res, next) => {
  try {
    const recurring = [
      {
        id: 'rec-1',
        mine_id: 'mine-1',
        mine_name: 'Jharia Open Cast Mine Pit-3',
        hazard_category: 'Air Quality & Dust Suppression',
        location: 'Pit 3 Haul Road North',
        repeat_count_30_days: 4,
        contractor_involved: 'Eastern Earthmovers Ltd',
        risk_impact: 'Severe environmental non-compliance and health hazard for pit operators',
        recommended_action: 'Mandatory installation of fixed high-pressure mist cannons and automatic sprinkler telemetry.',
      },
      {
        id: 'rec-2',
        mine_id: 'mine-4',
        mine_name: 'North Karanpura Opencast Project',
        hazard_category: 'Explosives & Blasting Safety',
        location: 'West Pit Quarry Section B',
        repeat_count_30_days: 3,
        contractor_involved: 'Apex Mining Services',
        risk_impact: 'High risk of flyrock damage and unexploded charge hazards',
        recommended_action: 'Audit blasting license of Apex Mining Services and require electronic detonator sequencing.',
      },
    ];

    return res.status(200).json({
      success: true,
      count: recurring.length,
      data: recurring,
    });
  } catch (error) {
    next(error);
  }
};

const path = require('path');
const fs = require('fs');

const getMLDataset = async (req, res, next) => {
  try {
    const csvPath = path.join(__dirname, '../../../datasets/model_feature_dataset.csv');
    if (fs.existsSync(csvPath)) {
      const content = fs.readFileSync(csvPath, 'utf8');
      const lines = content.trim().split('\n');
      const headers = lines[0].split(',');
      const rows = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((h, idx) => {
          const val = values[idx];
          obj[h] = isNaN(val) ? val : Number(val);
        });
        return obj;
      });
      return res.status(200).json({
        success: true,
        features_count: headers.length,
        records_count: rows.length,
        headers,
        data: rows,
      });
    }

    return res.status(200).json({
      success: true,
      data: mines,
    });
  } catch (error) {
    next(error);
  }
};

const exportMLDatasetCSV = async (req, res, next) => {
  try {
    const csvPath = path.join(__dirname, '../../../datasets/model_feature_dataset.csv');
    if (fs.existsSync(csvPath)) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="coal_mine_ai_training_dataset.csv"');
      return fs.createReadStream(csvPath).pipe(res);
    }
    return res.status(404).json({ success: false, message: 'Dataset file not found' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAIRiskAssessment,
  getMineRiskDetail,
  getAnomalies,
  getRecurringViolations,
  getMLDataset,
  exportMLDatasetCSV,
};

