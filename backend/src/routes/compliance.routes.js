const express = require("express");
const router = express.Router();

const complianceRulesController = require("../controllers/complianceRules.controller");
const complianceController = require("../controllers/compliance.controller");

// Compliance Rules
router.post("/compliance/rules", complianceRulesController.createRule);
router.get("/compliance/rules", complianceRulesController.getRules);
router.get("/compliance/rules/:id", complianceRulesController.getRuleById);
router.patch("/compliance/rules/:id", complianceRulesController.updateRule);

// Mine Compliance
router.get("/mines/:mine_id/compliance", complianceController.getMineCompliance);
router.get("/mines/:mine_id/compliance/overdue", complianceController.getMineComplianceOverdue);
router.get("/mines/:mine_id/compliance/upcoming", complianceController.getMineComplianceUpcoming);

// Compliance Records
router.post("/compliance/records", complianceController.createComplianceRecord);
router.get("/compliance/records", complianceController.getComplianceRecords);
router.get("/compliance/records/:id", complianceController.getComplianceRecordById);
router.patch("/compliance/records/:id/status", complianceController.updateComplianceRecordStatus);

module.exports = router;
