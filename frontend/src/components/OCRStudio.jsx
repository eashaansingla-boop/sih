import React, { useState } from 'react';
import { FileText, Upload, Sparkles, CheckCircle2, AlertTriangle, Database } from 'lucide-react';

export default function OCRStudio({ mines, onProcessOCR }) {
  const [selectedMine, setSelectedMine] = useState(mines[0]?.id || 'mine-1');
  const [preset, setPreset] = useState('dgms_form');
  const [documentTitle, setDocumentTitle] = useState('DGMS Form IV Inspection Report');
  const [rawTextInput, setRawTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedResult, setExtractedResult] = useState(null);

  const handleRunOCR = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mine_id: selectedMine,
          title: documentTitle,
          document_type: 'Statutory Inspection Certificate',
          sample_preset: preset,
          raw_text: rawTextInput,
        }),
      });
      const data = await res.json();
      setExtractedResult(data.data);
      setIsProcessing(false);
    } catch (err) {
      alert("Failed to process OCR document.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 bg-slate-950 min-h-screen text-slate-100">
      {/* Banner */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Document Digitization & OCR Studio</h2>
            <p className="text-xs text-slate-400">Optical Character Recognition converting scanned forms into structured JSON records</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload & Preset Form */}
        <form onSubmit={handleRunOCR} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-purple-400 flex items-center space-x-2">
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Upload or Select Document Preset</span>
          </h3>

          <div>
            <label className="block text-xs text-slate-400 font-semibold mb-1">Target Mine</label>
            <select
              value={selectedMine}
              onChange={e => setSelectedMine(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs"
            >
              {mines.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.subsidiary_name})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-semibold mb-1">Document Title</label>
            <input
              type="text"
              value={documentTitle}
              onChange={e => setDocumentTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-semibold mb-1">Sample Preset Document</label>
            <select
              value={preset}
              onChange={e => setPreset(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs"
            >
              <option value="dgms_form">DGMS Form IV Inspection Report (Methane & Dust Warning)</option>
              <option value="env_clearance">State Environmental Clearance Audit Certificate</option>
              <option value="custom">Custom Scanned Form Input</option>
            </select>
          </div>

          {preset === 'custom' && (
            <div>
              <label className="block text-xs text-slate-400 font-semibold mb-1">Paste Raw Scanned Text</label>
              <textarea
                value={rawTextInput}
                onChange={e => setRawTextInput(e.target.value)}
                rows={4}
                placeholder="Paste OCR text here..."
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs"
              ></textarea>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>{isProcessing ? 'Running OCR Extraction Engine...' : 'Run OCR & Digitizes Document'}</span>
          </button>
        </form>

        {/* Structured Results Display */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-emerald-400 flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Structured Data Output (JSON)</span>
          </h3>

          {!extractedResult ? (
            <div className="p-8 border-2 border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
              Select a preset and click "Run OCR" to inspect extracted structured JSON parameters.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Extracted Status:</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded ${
                  extractedResult.approval_status === 'Flagged' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'
                }`}>
                  {extractedResult.approval_status}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-amber-400 mb-1">Parsed JSON Schema</h4>
                <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-emerald-300 font-mono overflow-x-auto max-h-60">
                  {JSON.stringify(extractedResult.ocr_structured_json, null, 2)}
                </pre>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 mb-1">Raw OCR Extracted Text</h4>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {extractedResult.ocr_raw_text}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
