import React, { useState } from 'react';
import { initialHMISData } from './data/hmisQ1Data';
import { HMISDataset, HMISIndicator } from './types/hmis';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { HmisCharts } from './components/HmisCharts';
import { MonthlyBreakdownTable } from './components/MonthlyBreakdownTable';
import { PrintReportView } from './components/PrintReportView';
import { BlockPerformanceView } from './components/BlockPerformanceView';
import { FacilityDirectoryView } from './components/FacilityDirectoryView';
import { FileUploadModal } from './components/FileUploadModal';
import { IndicatorEditorModal } from './components/IndicatorEditorModal';
import { CheckCircle2, FileDown } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<HMISDataset>(initialHMISData);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'indicators' | 'blocks' | 'facilities' | 'print'>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<HMISIndicator | null>(null);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handle Indicator Edit / Add
  const handleOpenAddModal = () => {
    setEditingIndicator(null);
    setIsEditorModalOpen(true);
  };

  const handleOpenEditModal = (indicator: HMISIndicator) => {
    setEditingIndicator(indicator);
    setIsEditorModalOpen(true);
  };

  const handleSaveIndicator = (savedInd: HMISIndicator) => {
    setData((prev) => {
      const existsIndex = prev.indicators.findIndex((i) => i.id === savedInd.id);
      let updatedList = [...prev.indicators];
      if (existsIndex >= 0) {
        updatedList[existsIndex] = savedInd;
      } else {
        updatedList = [savedInd, ...updatedList];
      }
      return {
        ...prev,
        indicators: updatedList,
      };
    });
    showToast(`Indicator "${savedInd.name}" saved successfully.`);
  };

  // Handle CSV / JSON Import
  const handleImportData = (importedIndicators: HMISIndicator[]) => {
    setData((prev) => ({
      ...prev,
      indicators: importedIndicators,
    }));
    showToast(`Imported ${importedIndicators.length} indicators into Q1 Dashboard.`);
  };

  // Handle CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Code',
      'Indicator Name',
      'Hindi Name',
      'Category',
      'April 2026',
      'May 2026',
      'June 2026',
      'Q1 Total',
      'Q1 Target',
      'Annual Target',
      'Achievement Percent',
      'Status',
    ];

    const rows = data.indicators.map((ind) => [
      `"${ind.code}"`,
      `"${ind.name.replace(/"/g, '""')}"`,
      `"${(ind.nameHindi || '').replace(/"/g, '""')}"`,
      `"${ind.category}"`,
      ind.april2026,
      ind.may2026,
      ind.june2026,
      ind.q1Total,
      ind.q1Target,
      ind.annualTarget,
      ind.achievementPercent.toFixed(2),
      `"${ind.status}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `HMIS_Q1_April_June_2026_${data.metadata.district.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported complete HMIS Q1 report dataset to CSV.');
  };

  // If active tab is 'print', render the official printable layout
  if (activeTab === 'print') {
    return (
      <PrintReportView
        data={data}
        onBackToDashboard={() => setActiveTab('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Top Header & Navigation */}
      <Header
        metadata={data.metadata}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenAddModal={handleOpenAddModal}
        onExportCSV={handleExportCSV}
        onPrint={() => setActiveTab('print')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Scorecard Cards */}
        <KpiCards
          indicators={data.indicators}
          facilityStatus={data.facilityStatus}
          onSelectCategory={(cat) => {
            if (cat !== 'all') {
              setSelectedCategory(cat);
              setActiveTab('indicators');
            }
          }}
        />

        {/* Tab 1: Analytics Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <HmisCharts indicators={data.indicators} />
            <MonthlyBreakdownTable
              indicators={data.indicators}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onEditIndicator={handleOpenEditModal}
            />
          </div>
        )}

        {/* Tab 2: Full Indicator Matrix */}
        {activeTab === 'indicators' && (
          <div className="space-y-6">
            <MonthlyBreakdownTable
              indicators={data.indicators}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onEditIndicator={handleOpenEditModal}
            />
          </div>
        )}

        {/* Tab 3: Sub-District / Block Performance */}
        {activeTab === 'blocks' && (
          <div className="space-y-6">
            <BlockPerformanceView indicators={data.indicators} />
          </div>
        )}

        {/* Tab 4: Health Facility Directory (59 Units) */}
        {activeTab === 'facilities' && (
          <div className="space-y-6">
            <FacilityDirectoryView />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Health Management Information System (HMIS) &bull; National Health Mission &bull; Ministry of Health & Family Welfare
          </div>
          <div className="text-slate-400">
            Q1 Performance Review (April – June 2026)
          </div>
        </div>
      </footer>

      {/* Modals */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImportData={handleImportData}
      />

      <IndicatorEditorModal
        isOpen={isEditorModalOpen}
        indicator={editingIndicator}
        onClose={() => setIsEditorModalOpen(false)}
        onSave={handleSaveIndicator}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-3 duration-200 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
