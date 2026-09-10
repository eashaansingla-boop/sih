const express = require("express");
const router = express.Router();
const auditLogsController = require("../controllers/auditLogs.controller");

router.get("/audit-logs", auditLogsController.getAuditLogs);
router.get("/audit-logs/entity/:type/:id", auditLogsController.getAuditLogsByEntity);
router.get("/audit-logs/:id", auditLogsController.getAuditLogById);

module.exports = router;
