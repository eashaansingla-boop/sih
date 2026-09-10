const express = require("express");
const router = express.Router();
const gisController = require("../controllers/gis.controller");

router.get("/gis/mines", gisController.getMines);
router.get("/gis/inspections", gisController.getInspections);
router.get("/gis/observations", gisController.getObservations);
router.get("/gis/incidents", gisController.getIncidents);
router.get("/gis/risk-zones", gisController.getRiskZones);

module.exports = router;
