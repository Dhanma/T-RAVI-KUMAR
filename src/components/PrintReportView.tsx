import React, { useState } from 'react';
import { 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  Shield, 
  Calendar, 
  MapPin, 
  Building2, 
  Check, 
  Settings2,
  Download
} from 'lucide-react';
import { HMISDataset, IndicatorCategory } from '../types/hmis';

interface PrintReportViewProps {
  data: HMISDataset;
  onBackToDashboard: () => void;
}

const CATEGORY_HEADERS: Record<IndicatorCategory, { title: string; hindi: string; sectionNo: string }> = {
  maternal_health: {
    sectionNo: '1.0',
    title: 'Reproductive & Maternal Health (Antenatal Care - ANC)',
    hindi: 'मातृ स्वास्थ्य एवं प्रसव पूर्व देखभाल (ANC)',
  },
  delivery_care: {
    sectionNo: '2.0',
    title: 'Delivery, Intrapartum Care & Newborn Health',
    hindi: 'प्रसव, प्रसवकालीन सेवाएं एवं नवजात शिशु स्वास्थ्य',
  },
  child_immunization: {
    sectionNo: '3.0',
    title: 'Child Health & Universal Immunization Programme (UIP)',
    hindi: 'शिशु स्वास्थ्य एवं सार्वभौमिक टीकाकरण कार्यक्रम',
  },
  family_planning: {
    sectionNo: '4.0',
    title: 'Family Planning & Contraceptive Services',
    hindi: 'परिवार नियोजन एवं गर्भनिरोधक सेवाएं',
  },
  opd_ipd_services: {
    sectionNo: '5.0',
    title: 'Hospital Outpatient (OPD) & Inpatient (IPD) Performance',
    hindi: 'अस्पताल ओपीडी एवं आईपीडी सेवाएं',
  },
  disease_surveillance: {
    sectionNo: '6.0',
    title: 'Disease Surveillance, TB, Vector-Borne & NCD Screening',
    hindi: 'रोग नियंत्रण, टीबी, मलेरिया एवं गैर-संचारी रोग (NCD)',
  },
  diagnostics_lab: {
    sectionNo: '7.0',
    title: 'Diagnostic Laboratory & Imaging Services',
    hindi: 'पैथोलॉजी लैब एवं रेडियोलॉजी परीक्षण सेवाएं',
  },
};

export const PrintReportView: React.FC<PrintReportViewProps> = ({ data, onBackToDashboard }) => {
  const [includeBlockData, setIncludeBlockData] = useState(true);
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [reportType, setReportType] = useState<'full' | 'summary'>('full');

  const { metadata, facilityStatus, indicators } = data;

  const handlePrint = () => {
    window.print();
  };

  const categoriesOrder: IndicatorCategory[] = [
    'maternal_health',
    'delivery_care',
    'child_immunization',
    'family_planning',
    'opd_ipd_services',
    'disease_surveillance',
    'diagnostics_lab',
  ];

  // Key summary numbers
  const totalOpd = indicators.find((i) => i.code === 'H.5.1')?.q1Total || 48600;
  const totalDeliveries = indicators.find((i) => i.code === 'D.2.1')?.q1Total || 318;
  const totalFic = indicators.find((i) => i.code === 'C.3.4')?.q1Total || 296;
  const totalAnc = indicators.find((i) => i.code === 'M.1.1')?.q1Total || 362;
  const earlyAnc = indicators.find((i) => i.code === 'M.1.2')?.q1Total || 312;
  const totalLab = indicators.find((i) => i.code === 'LAB.7.1')?.q1Total || 38900;
  const totalFacilitiesCount = facilityStatus.reduce((acc, f) => acc + f.totalFacilities, 0);
  const reportedFacilitiesCount = facilityStatus.reduce((acc, f) => acc + f.reportedFacilities, 0);

  return (
    <div className="min-h-screen bg-slate-100 py-4 sm:py-8 px-2 sm:px-4">
      {/* Interactive Print Controls Header (Hidden in Print) */}
      <div className="no-print max-w-5xl mx-auto mb-6 bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Return to Interactive Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Official Print Preview & PDF Export
              </h2>
              <p className="text-xs text-slate-500">
                Quarterly HMIS Report formatted for standard A4 portrait print and official sign-off.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs">
              <label className="flex items-center gap-1.5 px-2 py-1 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={includeBlockData}
                  onChange={(e) => setIncludeBlockData(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span>Block Breakdown</span>
              </label>

              <label className="flex items-center gap-1.5 px-2 py-1 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={includeSignatures}
                  onChange={(e) => setIncludeSignatures(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span>Signature Block</span>
              </label>
            </div>

            <button
              id="print-action-btn"
              onClick={handlePrint}
              className="action-btn flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Document Now (प्रिंट करें)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official A4 Document Container */}
      <div className="max-w-5xl mx-auto bg-white p-6 sm:p-10 rounded-xl sm:rounded-2xl border border-slate-300 shadow-md print:shadow-none print:border-none print:p-0 print:m-0 text-slate-900">
        
        {/* ================= OFFICIAL DOCUMENT HEADER ================= */}
        <div className="border-b-2 border-slate-900 pb-4 mb-5">
          <div className="text-center">
            <div className="text-xs font-bold tracking-widest text-slate-700 uppercase">
              Directorate of Health Services &bull; Andaman & Nicobar Administration
            </div>
            <div className="text-sm font-bold text-slate-800 font-hindi mt-1">
              जिला स्वास्थ्य समिति, उत्तर एवं मध्य अंडमान
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase tracking-tight font-display mt-1">
              DISTRICT HEALTH SOCIETY, NORTH & MIDDLE ANDAMAN
            </h1>
            <div className="text-sm font-bold text-emerald-800 mt-1">
              QUARTERLY HMIS PERFORMANCE REVIEW REPORT &bull; 1st QUARTER (Q1)
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">
              Reporting Period: 01 April 2026 to 30 June 2026 &bull; Financial Year: 2026–2027
            </div>
          </div>

          {/* Metadata Bar */}
          <div className="mt-4 pt-3 border-t border-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-2.5 rounded border border-slate-200">
            <div>
              <span className="text-slate-500 font-medium">State / UT:</span>{' '}
              <span className="font-bold text-slate-900">{metadata.state}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">District:</span>{' '}
              <span className="font-bold text-slate-900">{metadata.district} (HQ: Mayabunder)</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Report Date:</span>{' '}
              <span className="font-bold text-slate-900">{metadata.reportGeneratedDate}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Doc Ref No:</span>{' '}
              <span className="font-mono font-bold text-slate-900">DHS/N&MA/HMIS/2026/Q1-042</span>
            </div>
          </div>
        </div>

        {/* ================= SECTION 0: EXECUTIVE SUMMARY SCORECARD ================= */}
        <div className="mb-6 print-avoid-break">
          <div className="flex items-center justify-between bg-slate-900 text-white px-3 py-1.5 rounded-t font-semibold text-xs uppercase tracking-wide">
            <span>District Health Society Performance Summary &bull; Q1 (April - June 2026)</span>
            <span className="text-emerald-400 font-bold">Status: {metadata.dataApprovalStatus}</span>
          </div>
          <div className="border border-slate-900 border-t-0 p-3 bg-slate-50/50 rounded-b grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
            <div className="bg-white p-2 rounded border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium">Total ANC Reg.</div>
              <div className="text-base font-bold text-emerald-800 font-mono mt-0.5">{totalAnc.toLocaleString()}</div>
              <div className="text-[10px] text-slate-600">104.9% of target</div>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium">Inst. Deliveries</div>
              <div className="text-base font-bold text-sky-800 font-mono mt-0.5">{totalDeliveries.toLocaleString()}</div>
              <div className="text-[10px] text-slate-600">99.4% dist. births</div>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium">Fully Immunized</div>
              <div className="text-base font-bold text-indigo-800 font-mono mt-0.5">{totalFic.toLocaleString()}</div>
              <div className="text-[10px] text-slate-600">98.7% FIC coverage</div>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium">Total OPD Consult</div>
              <div className="text-base font-bold text-teal-800 font-mono mt-0.5">{totalOpd.toLocaleString()}</div>
              <div className="text-[10px] text-slate-600">105.7% of target</div>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium">Lab & Radiodiag.</div>
              <div className="text-base font-bold text-violet-800 font-mono mt-0.5">{totalLab.toLocaleString()}</div>
              <div className="text-[10px] text-slate-600">Free diagnostic</div>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium">Facility Reporting</div>
              <div className="text-base font-bold text-slate-900 font-mono mt-0.5">100%</div>
              <div className="text-[10px] text-emerald-700 font-semibold">{reportedFacilitiesCount}/{totalFacilitiesCount} active units</div>
            </div>
          </div>
        </div>

        {/* ================= SECTION: DETAILED INDICATOR TABLES ================= */}
        <div className="space-y-6">
          {categoriesOrder.map((catKey) => {
            const header = CATEGORY_HEADERS[catKey];
            const catIndicators = indicators.filter((i) => i.category === catKey);

            if (catIndicators.length === 0) return null;

            return (
              <div key={catKey} className="print-avoid-break">
                {/* Category Section Title */}
                <div className="bg-slate-800 text-white px-3 py-1.5 flex items-center justify-between text-xs font-bold rounded-t">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded text-[10px] font-mono">
                      SECTION {header.sectionNo}
                    </span>
                    <span>{header.title}</span>
                  </div>
                  <span className="text-[11px] font-normal text-slate-300 font-hindi hidden sm:inline">
                    {header.hindi}
                  </span>
                </div>

                {/* Table */}
                <div className="border border-slate-800 border-t-0 rounded-b overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse print-table">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-semibold text-[10px] uppercase">
                        <th className="py-2 px-2 text-center border-r border-slate-300 w-8">#</th>
                        <th className="py-2 px-2 text-center border-r border-slate-300 w-14">Code</th>
                        <th className="py-2 px-3 border-r border-slate-300">Indicator Name</th>
                        <th className="py-2 px-2 text-right border-r border-slate-300 bg-slate-50 w-20">Apr 2026</th>
                        <th className="py-2 px-2 text-right border-r border-slate-300 bg-slate-50 w-20">May 2026</th>
                        <th className="py-2 px-2 text-right border-r border-slate-300 bg-slate-50 w-20">Jun 2026</th>
                        <th className="py-2 px-2 text-right border-r border-slate-300 bg-slate-200 font-bold w-22">
                          Q1 Total
                        </th>
                        <th className="py-2 px-2 text-right border-r border-slate-300 w-20">Q1 Target</th>
                        <th className="py-2 px-2 text-right border-r border-slate-300 w-20">Achieve %</th>
                        <th className="py-2 px-2 text-center w-20">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {catIndicators.map((ind, idx) => {
                        const isAchieved = ind.achievementPercent >= 100;
                        const isOnTrack = ind.achievementPercent >= 90 && ind.achievementPercent < 100;

                        return (
                          <React.Fragment key={ind.id}>
                            <tr className={idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}>
                              <td className="py-1.5 px-2 text-center border-r border-slate-200 text-slate-500 font-mono text-[11px]">
                                {idx + 1}
                              </td>
                              <td className="py-1.5 px-2 text-center border-r border-slate-200 font-mono font-bold text-slate-700 text-[11px]">
                                {ind.code}
                              </td>
                              <td className="py-1.5 px-3 border-r border-slate-200">
                                <div className="font-semibold text-slate-900 leading-tight">{ind.name}</div>
                                {ind.nameHindi && (
                                  <div className="text-[10px] text-slate-500 font-hindi">{ind.nameHindi}</div>
                                )}
                              </td>
                              <td className="py-1.5 px-2 text-right border-r border-slate-200 font-mono text-slate-700">
                                {ind.april2026.toLocaleString()}
                              </td>
                              <td className="py-1.5 px-2 text-right border-r border-slate-200 font-mono text-slate-700">
                                {ind.may2026.toLocaleString()}
                              </td>
                              <td className="py-1.5 px-2 text-right border-r border-slate-200 font-mono text-slate-700">
                                {ind.june2026.toLocaleString()}
                              </td>
                              <td className="py-1.5 px-2 text-right border-r border-slate-200 font-mono font-bold text-slate-900 bg-slate-100/60">
                                {ind.q1Total.toLocaleString()}
                              </td>
                              <td className="py-1.5 px-2 text-right border-r border-slate-200 font-mono text-slate-600">
                                {ind.q1Target.toLocaleString()}
                              </td>
                              <td className="py-1.5 px-2 text-right border-r border-slate-200 font-mono font-bold">
                                <span
                                  className={
                                    isAchieved
                                      ? 'text-emerald-700'
                                      : isOnTrack
                                      ? 'text-sky-700'
                                      : 'text-amber-700'
                                  }
                                >
                                  {ind.achievementPercent.toFixed(1)}%
                                </span>
                              </td>
                              <td className="py-1.5 px-2 text-center">
                                <span
                                  className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                    isAchieved
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : isOnTrack
                                      ? 'bg-sky-100 text-sky-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {isAchieved ? 'ACHIEVED' : isOnTrack ? 'ON TRACK' : 'LAGGING'}
                                </span>
                              </td>
                            </tr>

                            {/* Block drilldown in print if enabled */}
                            {includeBlockData && ind.blockData && ind.blockData.length > 0 && (
                              <tr className="bg-slate-50/90 text-[10px] text-slate-600 border-b border-slate-200">
                                <td colSpan={3} className="py-1 px-3 border-r border-slate-200 italic">
                                  &bull; Sub-Division Breakdown (Diglipur / Mayabunder / Rangat):
                                </td>
                                <td colSpan={7} className="py-1 px-2 font-mono">
                                  <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                                    {ind.blockData.map((b) => (
                                      <span key={b.blockName}>
                                        <strong className="text-slate-800">{b.blockName.split(' ')[0]}:</strong>{' '}
                                        {b.total.toLocaleString()}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= SECTION: FACILITY REPORTING COMPLIANCE ================= */}
        <div className="mt-6 print-avoid-break">
          <div className="bg-slate-800 text-white px-3 py-1.5 flex items-center justify-between text-xs font-bold rounded-t">
            <span>SECTION 8.0 &bull; Facility Reporting Compliance & Validation Status</span>
            <span className="text-[11px] font-normal text-slate-300">Quarter 1 (April - June 2026)</span>
          </div>
          <div className="border border-slate-800 border-t-0 rounded-b overflow-hidden">
            <table className="w-full text-left text-xs border-collapse print-table">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-semibold text-[10px] uppercase">
                  <th className="py-2 px-3 border-r border-slate-300">Health Facility Tier</th>
                  <th className="py-2 px-2 text-center border-r border-slate-300">Total Sanctioned</th>
                  <th className="py-2 px-2 text-center border-r border-slate-300">Active Reporting Units</th>
                  <th className="py-2 px-2 text-center border-r border-slate-300">Reporting Rate (%)</th>
                  <th className="py-2 px-2 text-center">Timeliness Rate (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {facilityStatus.map((f, idx) => (
                  <tr key={f.facilityType} className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="py-1.5 px-3 border-r border-slate-200 font-semibold text-slate-900">
                      {f.facilityType}
                    </td>
                    <td className="py-1.5 px-2 text-center border-r border-slate-200 font-mono text-slate-700">
                      {f.totalFacilities}
                    </td>
                    <td className="py-1.5 px-2 text-center border-r border-slate-200 font-mono font-bold text-slate-900">
                      {f.reportedFacilities}
                    </td>
                    <td className="py-1.5 px-2 text-center border-r border-slate-200 font-mono font-bold text-emerald-700">
                      {f.reportingRatePercent}%
                    </td>
                    <td className="py-1.5 px-2 text-center font-mono text-slate-700">
                      {f.timelyReportingPercent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= SECTION: ACTION POINTS & GAPS ================= */}
        <div className="mt-6 print-avoid-break bg-slate-50 p-4 rounded-lg border border-slate-300 text-xs">
          <h3 className="font-bold text-slate-900 uppercase text-[11px] mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-600 rounded-full" />
            District Health Society Strategic Observations & Action Plan for Q2 (July – September 2026):
          </h3>
          <ol className="list-decimal list-inside space-y-1 text-slate-700 leading-relaxed text-[11.5px]">
            <li>
              <strong>Maternal & Newborn Care:</strong> 1st Trimester ANC early registration achieved 86.2% across North & Middle Andaman; continuous tracking of 56 High-Risk Pregnancies through Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA) with specialized OBGYN camps at SDH Diglipur and Dr. R.P. Hospital Mayabunder.
            </li>
            <li>
              <strong>Institutional Deliveries:</strong> Sustained 99.4% institutional delivery rate across Dr. R.P. Hospital Mayabunder, SDH Diglipur, and CHC Rangat; emergency boat & ambulance referral protocols streamlined for remote island hamlets in Baratang, Kadamtala, Long Island, and Kishorinagar.
            </li>
            <li>
              <strong>Universal Immunization:</strong> Fully Immunized Child (FIC) rate stands at 98.7% (296/300 targeted infants); 100% Pentavalent-3 milestone achieved via U-WIN and VHSND sessions.
            </li>
            <li>
              <strong>Vector-Borne & Non-Communicable Diseases:</strong> Pre-monsoon malaria active surveillance conducted with 6,200 slides/RDTs tested (zero mortality); universal NCD screening of 14,350 adults achieved across 48 Ayushman Arogya Mandirs and Sub-Centres.
            </li>
          </ol>
        </div>

        {/* ================= SECTION: OFFICIAL SIGNATURES ================= */}
        {includeSignatures && (
          <div className="mt-8 pt-6 border-t-2 border-slate-800 print-avoid-break">
            <div className="text-center text-xs font-semibold text-slate-500 mb-8 uppercase tracking-wider">
              Verification & Authentication of Health Management Information System Records
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-xs">
              <div className="flex flex-col items-center">
                <div className="h-12 flex items-end justify-center font-mono text-[11px] text-slate-400 italic">
                  [Verified on Portal]
                </div>
                <div className="w-48 border-t border-slate-400 pt-1.5">
                  <div className="font-bold text-slate-900">District HMIS Officer</div>
                  <div className="text-[11px] text-slate-500">M&E / Statistical Division</div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-12 flex items-end justify-center font-mono text-[11px] text-slate-400 italic">
                  [Digitally Approved]
                </div>
                <div className="w-48 border-t border-slate-400 pt-1.5">
                  <div className="font-bold text-slate-900">District Programme Manager</div>
                  <div className="text-[11px] text-slate-500">National Health Mission (NHM)</div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-12 flex items-end justify-center font-mono text-[11px] text-slate-400 italic">
                  [Seal & Countersigned]
                </div>
                <div className="w-48 border-t border-slate-400 pt-1.5">
                  <div className="font-bold text-slate-900">{metadata.officerInCharge}</div>
                  <div className="text-[11px] text-slate-500">{metadata.designation}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Official Footer */}
        <div className="mt-8 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
          <div>Report generated automatically via HMIS Portal &bull; Government of India / State Health Society</div>
          <div>Page 1 of 1 &bull; Q1 FY 2026-27 Official Record</div>
        </div>

      </div>
    </div>
  );
};
