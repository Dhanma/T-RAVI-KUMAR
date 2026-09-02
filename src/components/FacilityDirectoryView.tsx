import React, { useState } from 'react';
import { Building2, Search, Filter, CheckCircle2, Hospital, Stethoscope, MapPin } from 'lucide-react';
import { officialFacilitiesList } from '../data/facilitiesData';
import { OfficialFacility } from '../types/hmis';

interface FacilityDirectoryViewProps {
  onSelectBlock?: (block: string) => void;
}

export const FacilityDirectoryView: React.FC<FacilityDirectoryViewProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<'All' | 'Mayabunder' | 'Diglipur' | 'Rangat'>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  const facilityTypes = [
    'All',
    'District Hospital (DH)',
    'Sub-Divisional Hospital (SDH)',
    'Community Health Centre (CHC)',
    'Primary Health Centre (PHC)',
    'Ayushman Arogya Mandir (AAM)',
    'Sub-Centre (SC)',
  ];

  const filteredFacilities = officialFacilitiesList.filter((f) => {
    const matchesSearch =
      f.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.facilityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.slNo.toString() === searchTerm.trim();

    const matchesBlock = selectedBlock === 'All' || f.block === selectedBlock;
    const matchesType = selectedType === 'All' || f.facilityType === selectedType;

    return matchesSearch && matchesBlock && matchesType;
  });

  const mayabunderCount = officialFacilitiesList.filter((f) => f.block === 'Mayabunder').length;
  const diglipurCount = officialFacilitiesList.filter((f) => f.block === 'Diglipur').length;
  const rangatCount = officialFacilitiesList.filter((f) => f.block === 'Rangat').length;

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'District Hospital (DH)':
        return 'bg-purple-100 text-purple-900 border-purple-300 font-bold';
      case 'Sub-Divisional Hospital (SDH)':
        return 'bg-blue-100 text-blue-900 border-blue-300 font-bold';
      case 'Community Health Centre (CHC)':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
      case 'Primary Health Centre (PHC)':
        return 'bg-sky-100 text-sky-800 border-sky-300 font-semibold';
      case 'Ayushman Arogya Mandir (AAM)':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Sub-Centre (SC)':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Summary Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-md">
                <Hospital className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Official Health Facility Directory & Block Registry
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Complete registry of all <strong>59 Health Facilities</strong> across <strong>Diglipur (24)</strong>, <strong>Mayabunder (16)</strong>, and <strong>Rangat (19)</strong> Blocks in North & Middle Andaman District.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
              59/59 Units 100% Active in HMIS
            </span>
          </div>
        </div>

        {/* Block Quick Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <button
            onClick={() => setSelectedBlock(selectedBlock === 'Diglipur' ? 'All' : 'Diglipur')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedBlock === 'Diglipur'
                ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-400'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Diglipur Block</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                {diglipurCount} Units
              </span>
            </div>
            <div className="text-[11px] text-slate-600 mt-1">
              <strong>1 SDH Diglipur</strong> &bull; 3 PHCs (Kalighat, Radhanagar, Kishorinagar) &bull; 20 AAM/SCs
            </div>
          </button>

          <button
            onClick={() => setSelectedBlock(selectedBlock === 'Mayabunder' ? 'All' : 'Mayabunder')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedBlock === 'Mayabunder'
                ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-400'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Mayabunder Block (HQ)</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
                {mayabunderCount} Units
              </span>
            </div>
            <div className="text-[11px] text-slate-600 mt-1">
              <strong>1 Dr. R.P. Hospital (DH)</strong> &bull; 2 PHCs (Tugapur, Billiground) &bull; 13 AAM/SCs
            </div>
          </button>

          <button
            onClick={() => setSelectedBlock(selectedBlock === 'Rangat' ? 'All' : 'Rangat')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedBlock === 'Rangat'
                ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Rangat Block</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                {rangatCount} Units
              </span>
            </div>
            <div className="text-[11px] text-slate-600 mt-1">
              <strong>1 CHC Rangat</strong> &bull; 3 PHCs (Baratang, Kadamtala, Long Island) &bull; 15 AAM/SCs
            </div>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search facility name, block, or sl. no. (e.g., SDH Diglipur, Tugapur, Long Island)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Block Filter */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-500 font-medium">Block:</span>
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value as any)}
                className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Blocks (59)</option>
                <option value="Mayabunder">Mayabunder (16)</option>
                <option value="Diglipur">Diglipur (24)</option>
                <option value="Rangat">Rangat (19)</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-500 font-medium">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-emerald-500"
              >
                {facilityTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Showing {filteredFacilities.length} of {officialFacilitiesList.length} Facilities</span>
          <span className="text-slate-500 text-[11px]">District: North & Middle Andaman (HQ: Mayabunder)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-semibold text-[11px] uppercase">
                <th className="py-2.5 px-3 text-center border-r border-slate-200 w-16">Sl. No.</th>
                <th className="py-2.5 px-4 border-r border-slate-200">Facility Name</th>
                <th className="py-2.5 px-3 border-r border-slate-200 w-32">Block</th>
                <th className="py-2.5 px-3 border-r border-slate-200 w-36">Sub-District</th>
                <th className="py-2.5 px-4 border-r border-slate-200 w-56">Facility Category</th>
                <th className="py-2.5 px-3 text-center w-28">HMIS Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredFacilities.map((facility, index) => (
                <tr
                  key={facility.slNo}
                  className={`hover:bg-slate-50/90 transition-colors ${
                    index % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                  }`}
                >
                  <td className="py-2.5 px-3 text-center border-r border-slate-200 font-mono text-slate-600 font-semibold">
                    {facility.slNo}
                  </td>
                  <td className="py-2.5 px-4 border-r border-slate-200 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      {facility.facilityType === 'District Hospital (DH)' && <Hospital className="w-4 h-4 text-purple-600" />}
                      {facility.facilityType === 'Sub-Divisional Hospital (SDH)' && <Hospital className="w-4 h-4 text-blue-600" />}
                      {facility.facilityType === 'Community Health Centre (CHC)' && <Building2 className="w-4 h-4 text-emerald-600" />}
                      {facility.facilityType === 'Primary Health Centre (PHC)' && <Stethoscope className="w-4 h-4 text-sky-600" />}
                      <span>{facility.facilityName}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 text-slate-700 font-medium">
                    {facility.block}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 text-slate-600">
                    {facility.subDistrict}
                  </td>
                  <td className="py-2.5 px-4 border-r border-slate-200">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] border ${getTypeBadgeColor(
                        facility.facilityType
                      )}`}
                    >
                      {facility.facilityType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Reported
                    </span>
                  </td>
                </tr>
              ))}
              {filteredFacilities.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No facilities found matching your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
