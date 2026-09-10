const { contractors } = require('../models/dataStore');

const getContractors = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, count: contractors.length, data: contractors });
  } catch (err) { next(err); }
};
const getContractorById = async (req, res, next) => {
  try {
    const item = contractors.find(c => c.id === req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Contractor not found' });
    return res.status(200).json({ success: true, data: item });
  } catch (err) { next(err); }
};
const createContractor = async (req, res, next) => {
  try {
    const newC = { id: `con-${Date.now()}`, ...req.body };
    contractors.push(newC);
    return res.status(201).json({ success: true, message: 'Contractor created', data: newC });
  } catch (err) { next(err); }
};
const updateContractor = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, message: 'Contractor updated' });
  } catch (err) { next(err); }
};
const deleteContractor = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, message: 'Contractor deleted' });
  } catch (err) { next(err); }
};
module.exports = { getContractors, getContractorById, createContractor, updateContractor, deleteContractor };
