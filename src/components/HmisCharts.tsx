import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { HMISIndicator } from '../types/hmis';
import { TrendingUp, BarChart2, PieChart as PieIcon, ShieldAlert } from 'lucide-react';

interface HmisChartsProps {
  indicators: HMISIndicator[];
}

export const HmisCharts: React.FC<HmisChartsProps> = ({ indicators }) => {
  const [chartView, setChartView] = useState<'trends' | 'categories' | 'delivery_fp'>('trends');

  // 1. Monthly Trends Data
  const monthlyTrendsData = [
    {
      month: 'April 2026',
      OPD: indicators.find((i) => i.code === 'H.5.1')?.april2026 || 15400,
      LabTests: indicators.find((i) => i.code === 'LAB.7.1')?.april2026 || 12100,
      ANC: indicators.find((i) => i.code === 'M.1.1')?.april2026 || 115,
      Deliveries: indicators.find((i) => i.code === 'D.2.1')?.april2026 || 102,
      FIC: indicators.find((i) => i.code === 'C.3.4')?.april2026 || 95,
    },
    {
      month: 'May 2026',
      OPD: indicators.find((i) => i.code === 'H.5.1')?.may2026 || 16200,
      LabTests: indicators.find((i) => i.code === 'LAB.7.1')?.may2026 || 13100,
      ANC: indicators.find((i) => i.code === 'M.1.1')?.may2026 || 121,
      Deliveries: indicators.find((i) => i.code === 'D.2.1')?.may2026 || 106,
      FIC: indicators.find((i) => i.code === 'C.3.4')?.may2026 || 99,
    },
    {
      month: 'June 2026',
      OPD: indicators.find((i) => i.code === 'H.5.1')?.june2026 || 17000,
      LabTests: indicators.find((i) => i.code === 'LAB.7.1')?.june2026 || 13700,
      ANC: indicators.find((i) => i.code === 'M.1.1')?.june2026 || 126,
      Deliveries: indicators.find((i) => i.code === 'D.2.1')?.june2026 || 110,
      FIC: indicators.find((i) => i.code === 'C.3.4')?.june2026 || 102,
    },
  ];

  // 2. Immunization Progression Funnel
  const immunizationData = [
    { name: 'BCG (Birth)', value: indicators.find((i) => i.code === 'C.3.1')?.q1Total || 325, target: 310, fill: '#059669' },
    { name: 'Penta-3 (14 Wks)', value: indicators.find((i) => i.code === 'C.3.2')?.q1Total || 310, target: 310, fill: '#0284c7' },
    { name: 'MR-1 (9-12 M)', value: indicators.find((i) => i.code === 'C.3.3')?.q1Total || 302, target: 300, fill: '#6366f1' },
    { name: 'Rotavirus-3', value: indicators.find((i) => i.code === 'C.3.5')?.q1Total || 300, target: 300, fill: '#8b5cf6' },
    { name: 'Fully Immunized (FIC)', value: indicators.find((i) => i.code === 'C.3.4')?.q1Total || 296, target: 300, fill: '#10b981' },
  ];

  // 3. Deliveries Distribution
  const publicDel = indicators.find((i) => i.code === 'D.2.2')?.q1Total || 312;
  const totalDel = indicators.find((i) => i.code === 'D.2.1')?.q1Total || 318;
  const privateDel = Math.max(0, totalDel - publicDel);
  const homeDel = indicators.find((i) => i.code === 'D.2.4')?.q1Total || 2;

  const deliveryPieData = [
    { name: 'Public Health Facility', value: publicDel, color: '#059669' },
    { name: 'Private / Other Facility', value: privateDel, color: '#38bdf8' },
    { name: 'Home Deliveries (SBA)', value: homeDel, color: '#f59e0b' },
  ];

  // 4. Family Planning Method Mix
  const fpIucd = indicators.find((i) => i.code === 'FP.4.1')?.q1Total || 58;
  const fpAntara = indicators.find((i) => i.code === 'FP.4.2')?.q1Total || 82;
  const fpSterilization = indicators.find((i) => i.code === 'FP.4.4')?.q1Total || 26;
  const fpOcp = Math.round((indicators.find((i) => i.code === 'FP.4.3')?.q1Total || 980) / 10); // scaled for chart visibility

  const fpPieData = [
    { name: 'Antara Injectables', value: fpAntara, color: '#6366f1' },
    { name: 'IUCD / PPIUCD', value: fpIucd, color: '#0ea5e9' },
    { name: 'OCP Cycles (Scaled /10)', value: fpOcp, color: '#10b981' },
    { name: 'Female Sterilization', value: fpSterilization, color: '#f43f5e' },
  ];

  // 5. Category-wise Target Achievement Percentage
  const categoryAverages = [
    { category: 'Maternal Health (ANC)', rate: 101.4, fill: '#059669' },
    { category: 'Delivery & Newborn', rate: 101.1, fill: '#0284c7' },
    { category: 'Child Immunization', rate: 99.6, fill: '#6366f1' },
    { category: 'Family Planning', rate: 99.8, fill: '#8b5cf6' },
    { category: 'Hospital OPD/IPD', rate: 105.1, fill: '#14b8a6' },
    { category: 'NCD & Disease Surveillance', rate: 103.2, fill: '#f59e0b' },
    { category: 'Diagnostic & Lab Tests', rate: 104.8, fill: '#3b82f6' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-6">
      {/* Chart Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Q1 (April – June 2026) Trend & Performance Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Comparative analysis of service delivery volume, maternal-child health milestones, and method mix.
          </p>
        </div>

        {/* View Switcher buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start sm:self-auto text-xs">
          <button
            onClick={() => setChartView('trends')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              chartView === 'trends'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Growth
          </button>
          <button
            onClick={() => setChartView('categories')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              chartView === 'categories'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Target Achievement %
          </button>
          <button
            onClick={() => setChartView('delivery_fp')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              chartView === 'delivery_fp'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Delivery & FP Mix
          </button>
        </div>
      </div>

      {/* Charts Content */}
      <div className="mt-4">
        {chartView === 'trends' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Outpatient & Lab Diagnostic Trend */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    Hospital Workload & Diagnostic Volume
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Monthly footfall in OPD and Pathology/Radiology investigations
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  +11.1% June vs April
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrendsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                        border: 'none',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                    <Bar dataKey="OPD" name="OPD Footfall" fill="#0d9488" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="LabTests" name="Diagnostic Tests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: RMNCH Monthly Trajectory */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    Maternal & Child Health Milestones
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Monthly ANC Registrations, Institutional Deliveries & FIC
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  Consistent Upward Trend
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                        border: 'none',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                    <Line
                      type="monotone"
                      dataKey="ANC"
                      name="ANC Registrations"
                      stroke="#059669"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Deliveries"
                      name="Institutional Deliveries"
                      stroke="#0284c7"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="FIC"
                      name="Fully Immunized (FIC)"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {chartView === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Achievements */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-1">
                Category-wise Q1 Target Achievement (%)
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">
                Comparison of actual performance against pro-rata Q1 targets (100% benchmark line)
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={categoryAverages}
                    margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" domain={[70, 115]} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis
                      dataKey="category"
                      type="category"
                      tick={{ fill: '#334155', fontSize: 10, fontWeight: 500 }}
                      width={120}
                    />
                    <Tooltip
                      formatter={(val: number) => [`${val}%`, 'Achievement Rate']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="rate" name="Achievement %" radius={[0, 4, 4, 0]}>
                      {categoryAverages.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Immunization Drop-out & Funnel */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-1">
                Universal Immunization Programme (UIP) Cascade
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">
                Antigen coverage from BCG at birth to Fully Immunized Children (FIC) at 12 months
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={immunizationData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#475569', fontSize: 10, angle: -15, textAnchor: 'end' }}
                      height={40}
                    />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="value" name="Infants Vaccinated" fill="#0284c7" radius={[4, 4, 0, 0]}>
                      {immunizationData.map((entry, index) => (
                        <Cell key={`cell-imm-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {chartView === 'delivery_fp' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Delivery Place Distribution */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">
                  Institutional vs Non-Institutional Deliveries
                </h3>
                <p className="text-[11px] text-slate-500 mb-2">
                  Total district recorded births: 320 in Q1 (April - June 2026)
                </p>
              </div>
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deliveryPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {deliveryPieData.map((entry, index) => (
                        <Cell key={`del-pie-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [val.toLocaleString(), 'Deliveries']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200/60 text-center text-[11px]">
                <div className="bg-emerald-50/60 p-1.5 rounded">
                  <div className="font-bold text-emerald-800">97.5%</div>
                  <div className="text-slate-500 text-[10px]">Public Sector (312)</div>
                </div>
                <div className="bg-sky-50/60 p-1.5 rounded">
                  <div className="font-bold text-sky-800">1.9%</div>
                  <div className="text-slate-500 text-[10px]">Private / Other (6)</div>
                </div>
                <div className="bg-amber-50/60 p-1.5 rounded">
                  <div className="font-bold text-amber-800">0.6%</div>
                  <div className="text-slate-500 text-[10px]">Home (SBA) (2)</div>
                </div>
              </div>
            </div>

            {/* Family Planning Method Mix */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">
                  Family Planning & Contraceptive Method Mix
                </h3>
                <p className="text-[11px] text-slate-500 mb-2">
                  Spacing vs Limiting methods adopted by eligible couples
                </p>
              </div>
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fpPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {fpPieData.map((entry, index) => (
                        <Cell key={`fp-pie-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number, name: string) => [val.toLocaleString(), name]}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-indigo-50/60 p-2 rounded-lg text-[11px] text-indigo-900 border border-indigo-100">
                <span className="font-semibold">Key Takeaway: </span>
                Long-Acting Reversible Contraception (Antara + PPIUCD) represents 59.8% of modern clinical methods.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
