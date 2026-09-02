import React from 'react';
import { 
  Baby, 
  ShieldCheck, 
  HeartHandshake, 
  Stethoscope, 
  BedDouble, 
  FlaskConical, 
  Building,
  TrendingUp
} from 'lucide-react';
import { HMISIndicator, FacilityReportStatus } from '../types/hmis';

interface KpiCardsProps {
  indicators: HMISIndicator[];
  facilityStatus: FacilityReportStatus[];
  onSelectCategory?: (category: string) => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ indicators, facilityStatus, onSelectCategory }) => {
  // Find key indicators
  const totalDeliveries = indicators.find((i) => i.code === 'D.2.1') || {
    q1Total: 318,
    q1Target: 310,
    achievementPercent: 102.6,
  };

  const fullyImmunized = indicators.find((i) => i.code === 'C.3.4') || {
    q1Total: 296,
    q1Target: 300,
    achievementPercent: 98.7,
  };

  const earlyAnc = indicators.find((i) => i.code === 'M.1.2') || {
    q1Total: 312,
    q1Target: 295,
    achievementPercent: 105.8,
  };

  const totalOpd = indicators.find((i) => i.code === 'H.5.1') || {
    q1Total: 48600,
    q1Target: 46000,
    achievementPercent: 105.7,
  };

  const totalIpd = indicators.find((i) => i.code === 'H.5.2') || {
    q1Total: 3450,
    q1Target: 3250,
    achievementPercent: 106.2,
  };

  const totalLab = indicators.find((i) => i.code === 'LAB.7.1') || {
    q1Total: 38900,
    q1Target: 36000,
    achievementPercent: 108.1,
  };

  // Facility counts
  const totalFacilities = facilityStatus.reduce((acc, f) => acc + f.totalFacilities, 0);
  const reportedFacilities = facilityStatus.reduce((acc, f) => acc + f.reportedFacilities, 0);
  const overallReportingRate = totalFacilities > 0 ? ((reportedFacilities / totalFacilities) * 100).toFixed(1) : "100.0";

  const kpis = [
    {
      id: 'kpi-anc',
      title: '1st Trimester ANC Reg.',
      hindiTitle: 'प्रथम त्रैमास प्रसव पूर्व पंजीकरण',
      value: earlyAnc.q1Total.toLocaleString(),
      target: earlyAnc.q1Target.toLocaleString(),
      achievement: earlyAnc.achievementPercent.toFixed(1),
      category: 'maternal_health',
      subtitle: '86.2% early registration',
      icon: HeartHandshake,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: 'kpi-delivery',
      title: 'Institutional Deliveries',
      hindiTitle: 'संस्थागत प्रसव (सरकारी व निजी)',
      value: totalDeliveries.q1Total.toLocaleString(),
      target: totalDeliveries.q1Target.toLocaleString(),
      achievement: totalDeliveries.achievementPercent.toFixed(1),
      category: 'delivery_care',
      subtitle: '99.4% of district births',
      icon: Baby,
      color: 'sky',
      bgColor: 'bg-sky-50',
      textColor: 'text-sky-700',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    },
    {
      id: 'kpi-immunization',
      title: 'Fully Immunized (FIC)',
      hindiTitle: 'पूर्ण प्रतिरक्षित बच्चे (9-11 माह)',
      value: fullyImmunized.q1Total.toLocaleString(),
      target: fullyImmunized.q1Target.toLocaleString(),
      achievement: fullyImmunized.achievementPercent.toFixed(1),
      category: 'child_immunization',
      subtitle: 'All antigens completed',
      icon: ShieldCheck,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
    {
      id: 'kpi-opd',
      title: 'Total OPD Footfall',
      hindiTitle: 'कुल बाह्य रोगी विभाग परामर्श',
      value: totalOpd.q1Total.toLocaleString(),
      target: totalOpd.q1Target.toLocaleString(),
      achievement: totalOpd.achievementPercent.toFixed(1),
      category: 'opd_ipd_services',
      subtitle: 'Avg ~535 patients / day',
      icon: Stethoscope,
      color: 'teal',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    },
    {
      id: 'kpi-ipd',
      title: 'Total IPD Admissions',
      hindiTitle: 'कुल अंतरंग रोगी भर्ती',
      value: totalIpd.q1Total.toLocaleString(),
      target: totalIpd.q1Target.toLocaleString(),
      achievement: totalIpd.achievementPercent.toFixed(1),
      category: 'opd_ipd_services',
      subtitle: 'DH, CHC Inpatient beds',
      icon: BedDouble,
      color: 'amber',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'kpi-lab',
      title: 'Diagnostic Lab Tests',
      hindiTitle: 'कुल पैथोलॉजी व रेडियोलॉजी जांच',
      value: totalLab.q1Total.toLocaleString(),
      target: totalLab.q1Target.toLocaleString(),
      achievement: totalLab.achievementPercent.toFixed(1),
      category: 'diagnostics_lab',
      subtitle: 'Free diagnostic package',
      icon: FlaskConical,
      color: 'violet',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-700',
      badgeColor: 'bg-violet-100 text-violet-800 border-violet-200',
    },
    {
      id: 'kpi-reporting',
      title: 'Reporting Facilities',
      hindiTitle: 'रिपोर्टिंग स्वास्थ्य केंद्र सक्रियता',
      value: `${reportedFacilities} / ${totalFacilities}`,
      target: '100%',
      achievement: `${overallReportingRate}%`,
      category: 'all',
      subtitle: '55 DH, CHC, PHC & HWCs',
      icon: Building,
      color: 'slate',
      bgColor: 'bg-slate-100',
      textColor: 'text-slate-800',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3 mb-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const isOverTarget = parseFloat(kpi.achievement) >= 100;
        return (
          <div
            key={kpi.id}
            id={kpi.id}
            onClick={() => onSelectCategory && onSelectCategory(kpi.category)}
            className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className={`p-2 rounded-lg ${kpi.bgColor} ${kpi.textColor} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                    isOverTarget
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  <TrendingUp className="w-2.5 h-2.5" />
                  {kpi.achievement}%
                </span>
              </div>

              <h2 className="text-xs font-semibold text-slate-700 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                {kpi.title}
              </h2>
              <p className="text-[10px] text-slate-600 mb-1.5 line-clamp-1 font-hindi">
                {kpi.hindiTitle}
              </p>

              <div className="text-xl font-bold text-slate-900 font-display tracking-tight">
                {kpi.value}
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Target: {kpi.target}</span>
              <span className="text-[10px] text-slate-600 truncate max-w-[80px] text-right">
                {kpi.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
