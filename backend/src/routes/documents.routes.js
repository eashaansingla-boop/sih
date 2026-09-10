const express = require("express");
const router = express.Router();
const documentsController = require("../controllers/documents.controller");

router.post("/", documentsController.createDocument);
router.get("/", documentsController.getDocuments);

router.post("/reports/generate", documentsController.generateReport);
router.get("/reports", documentsController.getReports);
router.get("/reports/:id", documentsController.getReportById);

router.post("/:id/ocr", documentsController.runOcr);
router.get("/:id/ocr-result", documentsController.getOcrResult);
router.get("/:id", documentsController.getDocumentById);
router.delete("/:id", documentsController.deleteDocument);

module.exports = router;
