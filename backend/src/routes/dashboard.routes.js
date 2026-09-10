const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");

// Mine Official Dashboard
router.get("/dashboard/mine-official", dashboardController.getMineOfficialDashboard);
router.get("/dashboard/mine-official/compliance", dashboardController.getMineOfficialCompliance);
router.get("/dashboard/mine-official/monitoring", dashboardController.getMineOfficialMonitoring);
router.get("/dashboard/mine-official/risks", dashboardController.getMineOfficialRisks);
router.get("/dashboard/mine-official/alerts", dashboardController.getMineOfficialAlerts);

// Corporate Management Dashboard
router.get("/dashboard/corporate", dashboardController.getCorporateDashboard);
router.get("/dashboard/corporate/compliance", dashboardController.getCorporateCompliance);
router.get("/dashboard/corporate/mines", dashboardController.getCorporateMines);
router.get("/dashboard/corporate/risks", dashboardController.getCorporateRisks);
router.get("/dashboard/corporate/contractors", dashboardController.getCorporateContractors);

// Regulatory Authority Dashboard
router.get("/dashboard/regulator", dashboardController.getRegulatorDashboard);
router.get("/dashboard/regulator/compliance", dashboardController.getRegulatorCompliance);
router.get("/dashboard/regulator/violations", dashboardController.getRegulatorViolations);
router.get("/dashboard/regulator/incidents", dashboardController.getRegulatorIncidents);
router.get("/dashboard/regulator/reports", dashboardController.getRegulatorReports);

module.exports = router;
