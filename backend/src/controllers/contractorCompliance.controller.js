const getContractorCompliance = async (req, res, next) => res.status(200).json({ success: true, compliance_score: 88, status: 'Compliant' });
const getContractorViolations = async (req, res, next) => res.status(200).json({ success: true, count: 1, data: [{ id: 'cv-1', violation: 'Overburden dumper oil leak' }] });
const getContractorRisk = async (req, res, next) => res.status(200).json({ success: true, risk_level: 'Low', risk_score: 24 });

module.exports = { getContractorCompliance, getContractorViolations, getContractorRisk };
