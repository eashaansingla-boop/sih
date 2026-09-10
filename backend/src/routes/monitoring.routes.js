const express = require("express");
const router = express.Router();

const inspectionsController = require("../controllers/inspections.controller");
const observationsController = require("../controllers/observations.controller");
const violationsController = require("../controllers/violations.controller");
const incidentsController = require("../controllers/incidents.controller");
const correctiveActionsController = require("../controllers/correctiveActions.controller");
const attendanceController = require("../controllers/attendance.controller");
const fieldController = require("../controllers/field.controller");

// Inspections
router.post("/inspections", inspectionsController.createInspection);
router.get("/inspections", inspectionsController.getInspections);
router.get("/inspections/:id", inspectionsController.getInspectionById);
router.patch("/inspections/:id", inspectionsController.updateInspection);

// Safety Observations
router.post("/observations", observationsController.createObservation);
router.get("/observations", observationsController.getObservations);
router.get("/observations/:id", observationsController.getObservationById);
router.patch("/observations/:id/status", observationsController.updateObservationStatus);

// Violations
router.post("/violations", violationsController.createViolation);
router.get("/violations", violationsController.getViolations);
router.get("/violations/:id", violationsController.getViolationById);
router.patch("/violations/:id/status", violationsController.updateViolationStatus);

// Incidents
router.post("/incidents", incidentsController.createIncident);
router.get("/incidents", incidentsController.getIncidents);
router.get("/incidents/:id", incidentsController.getIncidentById);
router.patch("/incidents/:id/status", incidentsController.updateIncidentStatus);

// Corrective Actions
router.post("/corrective-actions", correctiveActionsController.createCorrectiveAction);
router.get("/corrective-actions", correctiveActionsController.getCorrectiveActions);
router.get("/corrective-actions/:id", correctiveActionsController.getCorrectiveActionById);
router.patch("/corrective-actions/:id/status", correctiveActionsController.updateCorrectiveActionStatus);

// Attendance
router.post("/attendance", attendanceController.createAttendance);
router.get("/attendance", attendanceController.getAttendance);
router.get("/attendance/:id", attendanceController.getAttendanceById);
router.patch("/attendance/:id", attendanceController.updateAttendance);

// Field Reporting & Offline Sync
router.post("/field/sync", fieldController.syncField);
router.get("/field/sync/status", fieldController.getSyncStatus);

module.exports = router;
