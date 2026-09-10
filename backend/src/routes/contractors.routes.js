const express = require("express");
const router = express.Router();

const contractorsController = require("../controllers/contractors.controller");
const contractsController = require("../controllers/contracts.controller");
const contractorComplianceController = require("../controllers/contractorCompliance.controller");

// Contractors
router.post("/contractors", contractorsController.createContractor);
router.get("/contractors", contractorsController.getContractors);
router.get("/contractors/:id", contractorsController.getContractorById);
router.patch("/contractors/:id", contractorsController.updateContractor);

// Contracts
router.post("/contracts", contractsController.createContract);
router.get("/contracts", contractsController.getContracts);
router.get("/contracts/:id", contractsController.getContractById);
router.patch("/contracts/:id", contractsController.updateContract);

// Contractor Compliance
router.get("/contractors/:id/compliance", contractorComplianceController.getContractorCompliance);
router.get("/contractors/:id/violations", contractorComplianceController.getContractorViolations);
router.get("/contractors/:id/risk", contractorComplianceController.getContractorRisk);

module.exports = router;
