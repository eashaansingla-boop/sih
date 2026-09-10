const express = require("express");
const router = express.Router();

const alertsController = require("../controllers/alerts.controller");
const remindersController = require("../controllers/reminders.controller");
const escalationsController = require("../controllers/escalations.controller");

// Alerts
router.get("/alerts", alertsController.getAlerts);
router.get("/alerts/:id", alertsController.getAlertById);
router.patch("/alerts/:id/acknowledge", alertsController.acknowledgeAlert);

// Reminders
router.get("/reminders", remindersController.getReminders);
router.post("/reminders", remindersController.createReminder);

// Escalations
router.get("/escalations", escalationsController.getEscalations);
router.post("/escalations", escalationsController.createEscalation);
router.patch("/escalations/:id/status", escalationsController.updateEscalationStatus);

module.exports = router;
