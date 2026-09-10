const getEscalations = async (req, res, next) => {
  return res.status(200).json({ success: true, count: 1, data: [
    { id: 'esc-1', mine: 'North Karanpura OCP', reason: 'Unresolved Critical Methane Gas Spike (>1000 ppm)', SLA: 'Expired', escalated_to: 'DGMS Regulator & Corporate GM' },
  ] });
};
const createEscalation = async (req, res, next) => res.status(201).json({ success: true, message: 'Escalation created', data: req.body });
const updateEscalationStatus = async (req, res, next) => res.status(200).json({ success: true, message: 'Escalation status updated' });

module.exports = { getEscalations, createEscalation, updateEscalationStatus };
