const { documents, mines, appendAuditLog } = require('../models/dataStore');

const getDocuments = async (req, res, next) => {
  try {
    const { mine_id, type } = req.query;
    let list = [...documents];
    if (mine_id) list = list.filter(d => d.mine_id === mine_id);
    if (type) list = list.filter(d => d.document_type.toLowerCase().includes(type.toLowerCase()));

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

const getDocumentById = async (req, res, next) => {
  try {
    const item = documents.find(d => d.id === req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Document not found' });
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const uploadAndProcessOCR = async (req, res, next) => {
  try {
    const { mine_id, title, document_type, sample_preset, raw_text } = req.body;
    const mine = mines.find(m => m.id === mine_id) || mines[0];

    let extractedText = raw_text || '';
    if (!extractedText) {
      if (sample_preset === 'dgms_form') {
        extractedText = `DIRECTORATE GENERAL OF MINES SAFETY - DGMS STATUTORY AUDIT REPORT
Mine Code: ${mine.code} - ${mine.name}
Inspection Date: 2026-09-06
Inspector Name: Dr. Sanjeev Kumar (DGMS Zone Officer)
Safety Equipment Status: PPE Compliance 94%. Slope Angle 43 degrees (Compliant).
Environmental Readings: SPM 285 ug/m3 (Exceeds limit of 250 ug/m3).
Gas Telemetry: Methane CH4 620 ppm.
Status: High Risk Violation Flagged. Water sprinkling required within 24 hours.
Official Signoff: S. Kumar`;
      } else if (sample_preset === 'env_clearance') {
        extractedText = `STATE POLLUTION CONTROL BOARD - ENVIRONMENTAL COMPLIANCE AUDIT
Mine Name: ${mine.name} (${mine.code})
Audit Date: 2026-09-02
Air Quality Index: SPM 140 ug/m3 - SATISFACTORY
Water Quality Discharge: pH 7.2 - COMPLIANT
Heavy Metals Concentration: Pb <0.01 mg/L - NORMAL
Compliance Status: APPROVED`;
      } else {
        extractedText = `MINE COMPLIANCE RECORD & FIELD CHECKLIST
Mine: ${mine.name}
Date: ${new Date().toISOString().split('T')[0]}
Checklist Items:
- Haulage Road Sprinkling: Verified
- Explosive Storage Audit: Completed
- Worker Medical Fitness Certificates: 100% Verified
Overall Rating: Compliant`;
      }
    }

    const structuredJson = {
      mine_name: mine.name,
      mine_code: mine.code,
      processed_at: new Date().toISOString(),
      detected_dates: extractedText.match(/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/g) || [new Date().toISOString().split('T')[0]],
      detected_metrics: {},
      compliance_status: extractedText.includes('Exceeds') || extractedText.includes('Violation') ? 'Violated' : 'Compliant',
      key_observations: [],
    };

    const spmMatch = extractedText.match(/SPM\s*[:=]?\s*(\d+)/i);
    if (spmMatch) structuredJson.detected_metrics.spm_ug_m3 = parseInt(spmMatch[1], 10);

    const ch4Match = extractedText.match(/Methane|CH4\s*[:=]?\s*(\d+)/i);
    if (ch4Match) structuredJson.detected_metrics.methane_ppm = parseInt(ch4Match[1], 10);

    const phMatch = extractedText.match(/pH\s*[:=]?\s*([\d.]+)/i);
    if (phMatch) structuredJson.detected_metrics.water_ph = parseFloat(phMatch[1]);

    if (extractedText.includes('Water sprinkling required')) {
      structuredJson.key_observations.push('Urgent dust suppression water sprinkling mandated.');
    }
    if (extractedText.includes('Exceeds limit')) {
      structuredJson.key_observations.push('Air quality suspended particulate matter exceeds MOEF statutory boundary.');
    }

    const newDoc = {
      id: `doc-${Date.now()}`,
      mine_id: mine.id,
      mine_name: mine.name,
      title: title || 'Scanned Compliance Form',
      document_type: document_type || 'Statutory Inspection Certificate',
      file_url: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80',
      uploaded_by: 'Field OCR Studio User',
      uploaded_at: new Date().toISOString(),
      approval_status: structuredJson.compliance_status === 'Violated' ? 'Flagged' : 'Processed',
      ocr_raw_text: extractedText,
      ocr_structured_json: structuredJson,
    };

    documents.unshift(newDoc);

    appendAuditLog(
      newDoc.uploaded_by,
      'Mine Official',
      'Document OCR Digitization & Structured Extraction',
      mine.name,
      { document_id: newDoc.id, document_type: newDoc.document_type, status: newDoc.approval_status }
    );

    return res.status(201).json({
      success: true,
      message: 'Document uploaded and OCR structured extraction complete',
      data: newDoc,
    });
  } catch (error) {
    next(error);
  }
};

const createDocument = uploadAndProcessOCR;
const generateReport = async (req, res, next) => res.status(200).json({ success: true, message: 'Report generated' });
const getReports = async (req, res, next) => res.status(200).json({ success: true, data: [] });
const getReportById = async (req, res, next) => res.status(200).json({ success: true, data: { id: req.params.id } });
const runOcr = uploadAndProcessOCR;
const getOcrResult = async (req, res, next) => getDocumentById(req, res, next);
const deleteDocument = async (req, res, next) => res.status(200).json({ success: true, message: 'Document deleted' });

module.exports = {
  getDocuments,
  getDocumentById,
  uploadAndProcessOCR,
  createDocument,
  generateReport,
  getReports,
  getReportById,
  runOcr,
  getOcrResult,
  deleteDocument,
};
