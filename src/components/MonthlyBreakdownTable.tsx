import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowUpDown,
  Sparkles,
  Layers
} from 'lucide-react';
import { HMISIndicator, IndicatorCategory } from '../types/hmis';

interface MonthlyBreakdownTableProps {
  indicators: HMISIndicator[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onEditIndicator: (indicator: HMISIndicator) => void;
}

const CATEGORIES: { id: string; label: string; hindi: string; color: string }[] = [
  { id: 'all', label: 'All Indicators', hindi: 'सभी संकेतक', color: 'slate' },
  { id: 'maternal_health', label: 'Maternal Health & ANC', hindi: 'मातृ स्वास्थ्य एवं एएनसी', color: 'emerald' },
  { id: 'delivery_care', label: 'Delivery & Newborn', hindi: 'प्रसव एवं नवजात देखभाल', color: 'sky' },
  { id: 'child_immunization', label: 'Child Immunization', hindi: 'शिशु टीकाकरण', color: 'indigo' },
  { id: 'family_planning', label: 'Family Planning', hindi: 'परिवार नियोजन', color: 'violet' },
  { id: 'opd_ipd_services', label: 'Hospital OPD / IPD', hindi: 'ओपीडी / आईपीडी सेवाएं', color: 'teal' },
  { id: 'disease_surveillance', label: 'Disease & NCDs', hindi: 'रोग निगरानी एवं एनसीडी', color: 'amber' },
  { id: 'diagnostics_lab', label: 'Diagnostic Tests', hindi: 'पैथोलॉजी व डायग्नोस्टिक्स', color: 'blue' },
];

export const MonthlyBreakdownTable: React.FC<MonthlyBreakdownTableProps> = ({
  indicators,
  selectedCategory,
  onSelectCategory,
  onEditIndicator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'achieved' | 'on_track' | 'lagging'>('all');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [sortField, setSortField] = useState<'code' | 'name' | 'q1Total' | 'achievementPercent'>('code');
  const [sortAsc, setSortAsc] = useState(true);

  // Toggle row expansion
  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter indicators
  const filteredIndicators = indicators.filter((ind) => {
    const matchesCategory = selectedCategory === 'all' || ind.category === selectedCategory;
    const matchesSearch =
      ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ind.nameHindi && ind.nameHindi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ind.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'achieved') matchesStatus = ind.achievementPercent >= 100;
    else if (statusFilter === 'on_track') matchesStatus = ind.achievementPercent >= 90 && ind.achievementPercent < 100;
    else if (statusFilter === 'lagging') matchesStatus = ind.achievementPercent < 90;

    return matchesCategory && matchesSearch && matchesStatus;
  });

  // Sort indicators
  const sortedIndicators = [...filteredIndicators].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'code') comparison = a.code.localeCompare(b.code);
    else if (sortField === 'name') comparison = a.name.localeCompare(b.name);
    else if (sortField === 'q1Total') comparison = a.q1Total - b.q1Total;
    else if (sortField === 'achievementPercent') comparison = a.achievementPercent - b.achievementPercent;
    return sortAsc ? comparison : -comparison;
  });

  const handleSort = (field: 'code' | 'name' | 'q1Total' | 'achievementPercent') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Table Header & Category Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-md">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900 font-display">
                HMIS Q1 (April – June 2026) Indicator Register
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Detailed monthly service statistics, quarterly targets, achievement ratios and block breakdowns.
            </p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Box */}
            <div className="relative min-w-[200px] sm:min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search indicator code / name..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs"
              />
            </div>

            {/* Target Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            >
              <option value="all">All Status</option>
              <option value="achieved">Achieved (&ge;100%)</option>
              <option value="on_track">On Track (90-99%)</option>
              <option value="lagging">Lagging (&lt;90%)</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3 w-10 text-center">#</th>
              <th
                onClick={() => handleSort('code')}
                className="py-3 px-3 cursor-pointer hover:text-emerald-700 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Code</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('name')}
                className="py-3 px-4 min-w-[260px] cursor-pointer hover:text-emerald-700 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Standard Indicator Name (संकेतक)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-right bg-emerald-50/40 text-emerald-900">April 2026</th>
              <th className="py-3 px-3 text-right bg-emerald-50/40 text-emerald-900">May 2026</th>
              <th className="py-3 px-3 text-right bg-emerald-50/40 text-emerald-900">June 2026</th>
              <th
                onClick={() => handleSort('q1Total')}
                className="py-3 px-3 text-right font-bold text-slate-900 bg-slate-200/50 cursor-pointer hover:text-emerald-700"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Q1 Total</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-right text-slate-600">Q1 Target</th>
              <th className="py-3 px-3 text-right text-slate-500 hidden sm:table-cell">Annual Target</th>
              <th
                onClick={() => handleSort('achievementPercent')}
                className="py-3 px-4 min-w-[130px] text-right cursor-pointer hover:text-emerald-700"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>% Target Achieved</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70">
            {sortedIndicators.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-8 h-8 text-slate-400" />
                    <p className="text-sm font-medium">No indicators match your search or filter</p>
                    <p className="text-xs text-slate-400">Try changing the category or clearing the search box</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedIndicators.map((ind, idx) => {
                const isExpanded = expandedRows[ind.id];
                const hasBlockData = !!ind.blockData && ind.blockData.length > 0;
                const isAchieved = ind.achievementPercent >= 100;
                const isOnTrack = ind.achievementPercent >= 90 && ind.achievementPercent < 100;

                return (
                  <React.Fragment key={ind.id}>
                    <tr className={`hover:bg-slate-50/90 transition-colors ${isExpanded ? 'bg-emerald-50/20' : ''}`}>
                      {/* Expand Chevron / Index */}
                      <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                        {hasBlockData ? (
                          <button
                            onClick={() => toggleRow(ind.id)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                            title="View Block-wise breakdown"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        ) : (
                          <span className="text-[11px]">{idx + 1}</span>
                        )}
                      </td>

                      {/* Code */}
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                        <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">
                          {ind.code}
                        </span>
                      </td>

                      {/* Name & Hindi Name */}
                      <td className="py-2.5 px-4">
                        <div className="font-semibold text-slate-900 leading-snug">{ind.name}</div>
                        {ind.nameHindi && (
                          <div className="text-[11px] text-slate-500 font-hindi mt-0.5">{ind.nameHindi}</div>
                        )}
                        {hasBlockData && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 mt-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            4 Blocks available (Click arrow to view)
                          </span>
                        )}
                      </td>

                      {/* Monthly Numbers */}
                      <td className="py-2.5 px-3 text-right font-medium text-slate-700 font-mono">
                        {ind.april2026.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-700 font-mono">
                        {ind.may2026.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-700 font-mono">
                        {ind.june2026.toLocaleString()}
                      </td>

                      {/* Q1 Total */}
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-slate-100/50 font-mono">
                        {ind.q1Total.toLocaleString()}
                      </td>

                      {/* Targets */}
                      <td className="py-2.5 px-3 text-right text-slate-600 font-mono">
                        {ind.q1Target.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-400 font-mono hidden sm:table-cell">
                        {ind.annualTarget.toLocaleString()}
                      </td>

                      {/* Achievement Progress */}
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className={`h-full rounded-full ${
                                isAchieved
                                  ? 'bg-emerald-500'
                                  : isOnTrack
                                  ? 'bg-sky-500'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.min(ind.achievementPercent, 100)}%` }}
                            />
                          </div>
                          <span className="font-bold font-mono text-slate-800">
                            {ind.achievementPercent.toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isAchieved
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : isOnTrack
                              ? 'bg-sky-50 text-sky-800 border border-sky-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isAchieved ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Achieved</span>
                            </>
                          ) : isOnTrack ? (
                            <>
                              <Clock className="w-3 h-3 text-sky-600" />
                              <span>On Track</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              <span>Lagging</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => onEditIndicator(ind)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Edit indicator numbers / targets"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>

                    {/* Sub-row for Block Breakdown */}
                    {isExpanded && hasBlockData && (
                      <tr className="bg-slate-50/80 border-y border-slate-200">
                        <td colSpan={12} className="p-3 sm:px-8">
                          <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-slate-800">
                                Sub-District / Block Performance for &ldquo;{ind.name}&rdquo;
                              </span>
                              <span className="text-[11px] text-slate-500">
                                4 Administrative Health Blocks
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                              {ind.blockData!.map((block) => (
                                <div
                                  key={block.blockName}
                                  className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs"
                                >
                                  <div className="font-semibold text-slate-800 mb-1.5 truncate">
                                    {block.blockName}
                                  </div>
                                  <div className="space-y-1 text-slate-600 text-[11px]">
                                    <div className="flex justify-between">
                                      <span>April 2026:</span>
                                      <span className="font-mono font-medium">{block.april.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>May 2026:</span>
                                      <span className="font-mono font-medium">{block.may.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>June 2026:</span>
                                      <span className="font-mono font-medium">{block.june.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                                      <span>Q1 Total:</span>
                                      <span className="font-mono text-emerald-700">{block.total.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div>
          Showing <span className="font-bold text-slate-800">{sortedIndicators.length}</span> of{' '}
          <span className="font-bold text-slate-800">{indicators.length}</span> standard indicators
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Achieved (&ge;100%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
            On Track (90-99%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            Lagging (&lt;90%)
          </span>
        </div>
      </div>
    </div>
  );
};
