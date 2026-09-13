import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { apiService } from '../services/api';

export default function IngestModal({ isOpen, onClose, onIngestSuccess }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleIngestSample = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Sample NLP extraction payload matching output_contract.json
      const samplePayload = {
        entities: [
          { id: "LOC001", type: "Location", source_doc: "FIR_101", name: "Bidhannagar", latitude: 22.590425, longitude: 88.41692, city: "Bidhannagar", state: "West Bengal" },
          { id: "LOC002", type: "Location", source_doc: "FIR_101", name: "Kolkata", latitude: 22.6564623, longitude: 88.4467245, city: "New Town", state: "West Bengal" },
          { id: "P001", type: "Person", source_doc: "FIR_101", name: "Manoj Tiwari", aliases: ["Munna"], role: "Complainant / Victim" },
          { id: "P002", type: "Person", source_doc: "FIR_101", name: "Pooja Tiwari", aliases: [], role: "Wife of Complainant" },
          { id: "P003", type: "Person", source_doc: "FIR_101", name: "Rajesh Kumar Sharma", aliases: ["R.K. Sharma"], role: "Extortion Agent" },
          { id: "P004", type: "Person", source_doc: "FIR_101", name: "Bimal Das", aliases: [], role: "Accomplice" },
          { id: "PH001", type: "Phone", source_doc: "FIR_101", number: "9876543210", imei: "356789012345678" },
          { id: "PH002", type: "Phone", source_doc: "FIR_101", number: "9832145678", imei: "359876543210987" },
          { id: "ORG001", type: "Organization", source_doc: "FIR_101", name: "Shubh Laxmi Finance Pvt Ltd", type_of_org: "Finance Company" },
          { id: "VEH001", type: "Vehicle", source_doc: "FIR_101", registration_number: "WB01AB1234", vehicle_type: "SUV" }
        ],
        relationships: [
          { id: "REL001", source: "P001", target: "P002", type: "ASSOCIATED_WITH", source_doc: "FIR_101", description: "Wife of complainant", confidence: 0.95 },
          { id: "REL002", source: "P001", target: "PH001", type: "OWNS_PHONE", source_doc: "FIR_101", confidence: 0.99 },
          { id: "REL003", source: "P003", target: "PH002", type: "OWNS_PHONE", source_doc: "FIR_101", confidence: 0.99 },
          { id: "REL004", source: "P003", target: "P001", type: "CALLED", source_doc: "FIR_101", confidence: 0.92, properties: { call_count: 22, duration: 450 } },
          { id: "REL005", source: "P003", target: "ORG001", type: "MEMBER_OF", source_doc: "FIR_101", confidence: 0.9 }
        ]
      };

      const res = await apiService.ingestPayload(samplePayload);
      if (res.success) {
        setResult(res.data || res);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        if (onIngestSuccess) onIngestSuccess();
      } else {
        setError(res.error || 'Ingestion request failed');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-secondary border border-white/[0.12] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in text-on-surface">
        {/* Header */}
        <div className="p-4 bg-surface-container-lowest border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="p-2 rounded-xl bg-primary/20 text-primary border border-primary/30">
              <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-body-sm font-bold text-on-surface">
                NLP Extraction Pipeline Ingestion
              </h3>
              <p className="text-[11px] text-outline font-mono">POST /api/graph/ingest</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-bright text-outline hover:text-on-surface flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 text-body-sm">
          <div className="bg-surface-container-lowest border border-white/[0.06] rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary font-bold font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px]">data_object</span>
              <span>Abhidha's NLP Contract (output_contract.json)</span>
            </div>
            <p className="text-on-surface-variant text-[12px] leading-relaxed">
              Ingests extracted entities (Persons, Phones, Locations, Vehicles, Orgs) and relationships with automatic entity resolution, fuzzy token deduplication, and BSA Section 65B hash validation.
            </p>
          </div>

          {/* Stepper Pipeline */}
          <div className="flex flex-col gap-2 font-label-sm text-label-sm">
            <span className="text-outline uppercase text-[10px]">Extraction Pipeline Stages:</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-surface-container flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-verified-emerald"></span>
                <span>1. PDF OCR Parsing</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-verified-emerald"></span>
                <span>2. NER Triplet Extraction</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>3. Graph Node Sync</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-ai-purple"></span>
                <span>4. §65B Hash Attestation</span>
              </div>
            </div>
          </div>

          {/* Result / Error Banner */}
          {result && (
            <div className="p-3.5 rounded-xl bg-verified-emerald/15 border border-verified-emerald/30 text-verified-emerald flex items-center justify-between text-body-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">task_alt</span>
                <span>Ingested 10 entities & 5 relationships successfully!</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-threat-crimson/15 border border-threat-crimson/30 text-threat-crimson flex items-center gap-2 text-body-sm">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.04]">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleIngestSample}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-primary text-surface-base font-label-sm text-label-sm font-bold shadow-[0_0_14px_rgba(6,182,212,0.4)] hover:bg-tertiary-fixed transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">
                {loading ? 'autorenew' : 'upload'}
              </span>
              <span>{loading ? 'Ingesting...' : 'Ingest Sample Payload'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
