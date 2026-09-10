const express = require("express");
const router = express.Router();

const aiController = require("../controllers/ai.controller");
const chatbotController = require("../controllers/chatbot.controller");

// Risk Assessment & Anomaly Routes
router.get("/ai/risk-assessment", aiController.getAIRiskAssessment);
router.get("/ai/risk/mines/:mine_id", aiController.getMineRiskDetail);
router.get("/ai/anomalies", aiController.getAnomalies);
router.get("/ai/recurring-violations", aiController.getRecurringViolations);

// Backward compatibility routes
router.get("/ai/risk/mines", aiController.getAIRiskAssessment);
router.post("/ai/risk/assess", aiController.getAIRiskAssessment);
router.post("/ai/anomalies/detect", aiController.getAnomalies);

// Dataset & ML Training Export Routes
router.get("/ai/dataset", aiController.getMLDataset);
router.get("/ai/dataset/export-csv", aiController.exportMLDatasetCSV);

// Chatbot endpoint
router.post("/chatbot/query", chatbotController.processChatQuery);
router.post("/ai/chatbot/query", chatbotController.processChatQuery);

module.exports = router;
