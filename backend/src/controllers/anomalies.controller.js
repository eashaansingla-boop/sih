const { getAnomalies: fetchAnomalies } = require('./ai.controller');

const detectAnomalies = fetchAnomalies;
const getAnomalies = fetchAnomalies;
const getAnomalyById = async (req, res, next) => {
  return res.status(200).json({ success: true, data: { id: req.params.id } });
};

module.exports = { detectAnomalies, getAnomalies, getAnomalyById };
