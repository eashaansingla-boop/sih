const createContract = async (req, res, next) => res.status(201).json({ success: true, message: 'Contract created', data: req.body });
const getContracts = async (req, res, next) => res.status(200).json({ success: true, count: 0, data: [] });
const getContractById = async (req, res, next) => res.status(200).json({ success: true, data: { id: req.params.id } });
const updateContract = async (req, res, next) => res.status(200).json({ success: true, message: 'Contract updated' });

module.exports = { createContract, getContracts, getContractById, updateContract };
