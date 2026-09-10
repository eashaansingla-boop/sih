const { getAIRiskAssessment, getMineRiskDetail } = require('./ai.controller');

const assessRisk = getAIRiskAssessment;
const getMineRisks = getAIRiskAssessment;
const getMineRiskById = getMineRiskDetail;
const getContractorRisk = async (req, res, next) => {
  return res.status(200).json({
    success: true,
    data: { contractor_id: req.params.contractor_id, risk_score: 64, risk_level: 'High' }
  });
};

module.exports = { assessRisk, getMineRisks, getMineRiskById, getContractorRisk };
