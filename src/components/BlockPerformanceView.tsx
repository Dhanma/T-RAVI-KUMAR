import React, { useState } from 'react';
import { Building2, Award, Users, Hospital, CheckCircle2, ChevronDown, ChevronRight, Stethoscope } from 'lucide-react';
import { HMISIndicator } from '../types/hmis';
import { officialFacilitiesList } from '../data/facilitiesData';

interface BlockPerformanceViewProps {
  indicators: HMISIndicator[];
}

export const BlockPerformanceView: React.FC<BlockPerformanceViewProps> = ({ indicators }) => {
  const [expandedBlock, setExpandedBlock] = useState<string | null>('Diglipur');

  const blocks = [
    {
      id: 'Diglipur',
      name: 'Diglipur Block',
      hospital: 'SDH Diglipur (Sub-Divisional Hospital)',
      subDivision: 'Diglipur Sub-Division',
      totalUnits: 24,
      sdhCount: 1,
      phcCount: 3,
      scCount: 20,
      population: 46200,
      ancTotal: 156,
      delivTotal: 134,
      ficTotal: 127,
      opdTotal: 20300,
      score: 102.4,
      rank: 1,
      facilities: officialFacilitiesList.filter((f) => f.block === 'Diglipur'),
      keyInstitutions: 'SDH Diglipur, PHC Kalighat, PHC Radha Nagar, PHC Kishori Nagar',
    },
    {
      id: 'Mayabunder',
      name: 'Mayabunder Block (District HQ)',
      hospital: 'Dr. R.P. Hospital (District Hospital)',
      subDivision: 'Mayabunder HQ Sub-Division',
      totalUnits: 16,
      sdhCount: 0,
      dhCount: 1,
      phcCount: 2,
      scCount: 13,
      population: 26400,
      ancTotal: 88,
      delivTotal: 98,
      ficTotal: 79,
      opdTotal: 13200,
      score: 101.8,
      rank: 2,
      facilities: officialFacilitiesList.filter((f) => f.block === 'Mayabunder'),
      keyInstitutions: 'Dr. R.P. Hospital (DH), PHC Tugapur, PHC Billiground',
    },
    {
      id: 'Rangat',
      name: 'Rangat Block',
      hospital: 'CHC Rangat (Community Health Centre)',
      subDivision: 'Rangat Sub-Division',
      totalUnits: 19,
      sdhCount: 0,
      chcCount: 1,
      phcCount: 3,
      scCount: 15,
      population: 36900,
      ancTotal: 118,
      delivTotal: 86,
      ficTotal: 90,
      opdTotal: 15100,
      score: 99.6,
      rank: 3,
      facilities: officialFacilitiesList.filter((f) => f.block === 'Rangat'),
      keyInstitutions: 'CHC Rangat, PHC Baratang, PHC Kadamtala, PHC Long Island',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-md">
                <Building2 className="w-5 h-5" />
              </span>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Block Health Performance & Hierarchy (3 Blocks &bull; 59 Facilities)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Sub-divisional and block health performance across North & Middle Andaman District for Q1 (April – June 2026)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 self-start sm:self-auto">
              59/59 Facilities (100% Reporting Compliance)
            </span>
          </div>
        </div>

        {/* 3 Blocks Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {blocks.map((block) => (
            <div
              key={block.name}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                expandedBlock === block.id
                  ? 'bg-slate-50 border-emerald-400 ring-2 ring-emerald-300/60'
                  : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">{block.name}</span>
                    <span className="text-[11px] text-emerald-800 font-medium">{block.hospital}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      block.rank === 1
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Award className="w-3 h-3" />
                    Rank #{block.rank}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 mb-3 space-y-0.5">
                  <div>Population: ~{(block.population).toLocaleString()}</div>
                  <div>
                    <strong>Total: {block.totalUnits} Facilities</strong> ({block.phcCount} PHCs &bull; {block.scCount} AAM/SCs)
                  </div>
                  <div className="text-[10px] text-slate-400 italic truncate" title={block.keyInstitutions}>
                    {block.keyInstitutions}
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-1.5 text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-[11px]">ANC Registrations:</span>
                    <span className="font-mono font-bold text-slate-900">{block.ancTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-[11px]">Inst. Deliveries:</span>
                    <span className="font-mono font-bold text-emerald-700">{block.delivTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-[11px]">Immunized (FIC):</span>
                    <span className="font-mono font-bold text-indigo-700">{block.ficTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-[11px]">OPD Footfall:</span>
                    <span className="font-mono font-bold text-teal-700">{block.opdTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Achievement:</span>
                <span className="font-bold text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {block.score}%
                </span>
              </div>

              <button
                onClick={() => setExpandedBlock(expandedBlock === block.id ? null : block.id)}
                className="mt-3 w-full py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700 flex items-center justify-center gap-1 transition-colors"
              >
                {expandedBlock === block.id ? (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Hide Facilities ({block.totalUnits})</span>
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    <span>View All {block.totalUnits} Facilities</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Facility Section */}
      {expandedBlock && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Hospital className="w-4 h-4 text-emerald-700" />
              <span>
                Facilities in {blocks.find((b) => b.id === expandedBlock)?.name} (Total{' '}
                {blocks.find((b) => b.id === expandedBlock)?.totalUnits} Units)
              </span>
            </h3>
            <span className="text-xs text-slate-500">
              Main Facility: <strong>{blocks.find((b) => b.id === expandedBlock)?.hospital}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-3">
            {blocks
              .find((b) => b.id === expandedBlock)
              ?.facilities.map((fac) => (
                <div
                  key={fac.slNo}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400">#{fac.slNo}</span>
                      <span className="text-xs font-bold text-slate-800">{fac.facilityName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{fac.facilityType}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                    Active
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
