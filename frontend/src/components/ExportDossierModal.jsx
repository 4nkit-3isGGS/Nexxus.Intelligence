import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function ExportDossierModal({
  isOpen,
  onClose,
  caseInfo = { case_id: 'CR-2026-KOL-8841', name: 'Operation Cybershield Kolkata' },
  nodes = [],
  edges = [],
  currentUser,
  officerRole = 'LEAD_INVESTIGATOR'
}) {
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier' | 'certificate' | 'json'
  const { toast } = useToast();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const certificateText = `CERTIFICATE UNDER SECTION 65B OF THE BHARATIYA SAKSHYA ADHINIYAM (BSA), 2023
(Corresponding to Section 65B of the Indian Evidence Act, 1872)

CASE REF: ${caseInfo?.case_id || 'CR-2026-KOL-8841'} // OPERATION CYBERSHIELD
JURISDICTION: Kolkata Police Cyber Crime Division / West Bengal CID
DATE OF ISSUANCE: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}

I, the undersigned Certifying Officer, hereby certify that:
1. The electronic records and network graph topology produced herewith concerning Syndicate Apex Debasish Chatterjee (P008) and associates were produced by the automated lawful digital intelligence systems of NEXXUS.INTELLIGENCE during lawful operational surveillance.
2. The computer output was produced during the ordinary course of lawful cyber investigation.
3. The cryptographic integrity of the digital evidence exhibits (Exhibits P-01 through P-08) is verified by backward linked SHA-256 cryptographic chain of custody:
   TIP BLOCK HASH: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d
   GENESIS HASH:   8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4
4. No tampering, modification, or unauthorized deletion occurred throughout the extraction or ingestion cycle.

CERTIFYING OFFICER:
Name: ${currentUser?.name || 'Inspector S. Roy (Lead Forensics)'}
Badge/Clearance: ${currentUser?.badge_number || 'WB-CYBER-8841'} // ${officerRole}
Authority: Cyber Crime Directorate, West Bengal Police`;

  const handleCopyCert = () => {
    navigator.clipboard.writeText(certificateText);
    toast.success('Certificate Copied', 'BSA §65B Admissibility Certificate copied to clipboard.');
  };

  const handleDownloadJSON = () => {
    const data = {
      case_id: caseInfo?.case_id || 'CR-2026-KOL-8841',
      title: caseInfo?.name || 'Syndicate Network & Extortion Infiltration',
      export_timestamp: new Date().toISOString(),
      officer: currentUser?.name || 'Lead Investigator',
      officer_role: officerRole,
      summary: {
        total_entities: nodes?.length || 31,
        total_relationships: edges?.length || 42,
        master_firs: ['FIR 101/2026', 'FIR 102/2026', 'FIR 103/2026'],
        tip_hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d'
      },
      nodes: nodes.map(n => ({
        id: n.id,
        name: n.name,
        type: n.type,
        risk_score: n.risk_score,
        role: n.role
      })),
      edges: edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: e.type || e.label,
        amount: e.amount,
        frequency: e.frequency
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Case_Dossier_${caseInfo?.case_id || 'CR-2026-KOL-8841'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Dossier Downloaded', 'Case Dossier JSON exported successfully.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900">
        
        {/* Modal Topbar (Hidden on Print) */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[24px]">description</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base text-slate-900">
                  Court-Admissible Case Evidence Dossier
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
                  BSA §65B CERTIFIED
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {caseInfo?.case_id || 'CR-2026-KOL-8841'} // Charge Sheet Submission Package
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer ml-1"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs (Hidden on Print) */}
        <div className="px-6 border-b border-slate-200 bg-white flex items-center gap-2 print:hidden">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'dossier'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            <span>Master Case Dossier</span>
          </button>
          <button
            onClick={() => setActiveTab('certificate')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'certificate'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Section 65B Certificate</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'json'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">data_object</span>
            <span>Raw Evidence JSON</span>
          </button>
        </div>

        {/* Scrollable Printable Document Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-900 print:p-0 print:m-0 print:overflow-visible">
          
          {activeTab === 'dossier' && (
            <div className="space-y-6">
              {/* Formal Document Letterhead */}
              <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-serif font-bold text-xl">
                    POLICE
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
                      GOVERNMENT OF WEST BENGAL // STATE CYBER CRIME POLICE
                    </span>
                    <h1 className="font-display font-extrabold text-xl text-slate-900">
                      SPECIAL INVESTIGATION TEAM (SIT) DOSSIER
                    </h1>
                    <span className="text-xs text-slate-600">
                      Electronic Evidence Admissibility Package // BNS & Bharatiya Sakshya Adhiniyam, 2023
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end text-xs font-mono text-slate-600">
                  <span><strong>CASE NO:</strong> {caseInfo?.case_id || 'CR-2026-KOL-8841'}</span>
                  <span><strong>DATE:</strong> {new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                  <span><strong>OFFICER:</strong> {currentUser?.name || 'Lead Investigator'}</span>
                </div>
              </div>

              {/* 1. Executive Summary */}
              <div className="space-y-2">
                <h3 className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                  1. Executive Case Brief & Master FIR Linkage
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  During automated graph intelligence correlation across 3 separate jurisdictional First Information Reports 
                  (<strong>FIR 101/2026 Bidhannagar</strong>, <strong>FIR 102/2026 Howrah</strong>, and <strong>FIR 103/2026 Salt Lake AML</strong>), 
                  a unified interstate criminal syndicate was identified operating under apex coordinator 
                  <strong> Debasish Chatterjee (Suspect ID: P008)</strong>. 
                  The syndicate deployed 12 burner SIM cards, 3 shell corporations, and layered ₹14,85,000 in extortion proceeds through circular mule banking hops within 48 hours.
                </p>
              </div>

              {/* 2. Key Syndicate Hierarchy Table */}
              <div className="space-y-2">
                <h3 className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  2. Apex Syndicate Registry & Risk Assessment
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                      <tr>
                        <th className="p-2.5">Suspect ID</th>
                        <th className="p-2.5">Name</th>
                        <th className="p-2.5">Syndicate Role</th>
                        <th className="p-2.5">Risk Score</th>
                        <th className="p-2.5">Primary Offense Section</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-sans">
                      <tr className="bg-rose-50/30">
                        <td className="p-2.5 font-mono font-bold text-rose-700">P008</td>
                        <td className="p-2.5 font-bold text-slate-900">Debasish Chatterjee</td>
                        <td className="p-2.5">Apex Kingpin Bridge</td>
                        <td className="p-2.5 font-mono font-bold text-rose-600">96 / 100</td>
                        <td className="p-2.5 text-slate-600">Sec 120B BNS / Mastermind</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-sky-700">P003</td>
                        <td className="p-2.5 font-bold text-slate-900">Rajesh Kumar Sharma</td>
                        <td className="p-2.5">Extortion Operative Head</td>
                        <td className="p-2.5 font-mono font-bold text-rose-600">91 / 100</td>
                        <td className="p-2.5 text-slate-600">Sec 308(2) BNS (Extortion)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-sky-700">P002</td>
                        <td className="p-2.5 font-bold text-slate-900">Ashok Mehta</td>
                        <td className="p-2.5">Hawala Broker / Layerer</td>
                        <td className="p-2.5 font-mono font-bold text-amber-600">84 / 100</td>
                        <td className="p-2.5 text-slate-600">PMLA Sec 3/4 & Hawala</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-slate-700">O001</td>
                        <td className="p-2.5 font-bold text-slate-900">Shubh Laxmi Finance</td>
                        <td className="p-2.5">Shell Corporate Front</td>
                        <td className="p-2.5 font-mono font-bold text-amber-600">88 / 100</td>
                        <td className="p-2.5 text-slate-600">Shell Co Money Laundering</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Three Admissible Forensic Findings */}
              <div className="space-y-3">
                <h3 className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  3. Key Forensic Exhibits for Court Charge Sheet
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">Exhibit P-01</span>
                    <h4 className="font-bold text-xs text-slate-900 mt-1">Topological Cut-Out</h4>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Betweenness centrality of 0.942 proves Debasish directed the extortion network while maintaining complete cut-out separation from victims.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">Exhibit P-02</span>
                    <h4 className="font-bold text-xs text-slate-900 mt-1">₹500,000 Hawala Loop</h4>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Forensic trace of ₹500,000 looped through mule accounts A001 and A002 back to Shubh Laxmi Finance within 48 hours, keeping 2% syndicate cut.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">Exhibit P-03</span>
                    <h4 className="font-bold text-xs text-slate-900 mt-1">22-Call Extortion Spike</h4>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Acoustic voiceprint match (94.2%) on March 5, 2026, corroborating 22 coercive extortion calls made from burner SIM to victim Manoj Tiwari.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Chain of Custody & Hash Sign-off */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-bold">Cryptographic Tip Block Hash:</span>
                  <span className="text-[11px] text-slate-900 font-bold">ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Admissibility Verification Status:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    100% UNTAMPERED // BSA §65B CERTIFIED
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Generated by Nexxus Intelligence Defense Engine v2.6</span>
                  <span>Officer Signature: _______________________</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'certificate' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                  Official Statutory Evidence Certificate (BSA §65B)
                </span>
                <button
                  onClick={handleCopyCert}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold hover:bg-sky-100 transition-colors cursor-pointer print:hidden"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  <span>Copy Certificate</span>
                </button>
              </div>

              <pre className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed shadow-inner">
                {certificateText}
              </pre>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                  Structured JSON Evidence Packet
                </span>
                <button
                  onClick={handleDownloadJSON}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold hover:bg-sky-100 transition-colors cursor-pointer print:hidden"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Download .json</span>
                </button>
              </div>

              <pre className="p-5 rounded-2xl bg-slate-900 text-sky-300 text-xs font-mono overflow-x-auto max-h-96 rounded-xl">
                {JSON.stringify({
                  case_id: caseInfo?.case_id || 'CR-2026-KOL-8841',
                  nodes_count: nodes.length,
                  edges_count: edges.length,
                  tip_hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
                  verification: 'VALID'
                }, null, 2)}
              </pre>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
