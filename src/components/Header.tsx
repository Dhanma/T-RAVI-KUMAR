import React from 'react';
import { 
  Printer, 
  Upload, 
  Download, 
  PlusCircle, 
  Activity, 
  FileText, 
  Layers, 
  BarChart3,
  Building2,
  Calendar,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { DistrictMetadata } from '../types/hmis';

interface HeaderProps {
  metadata: DistrictMetadata;
  activeTab: 'dashboard' | 'indicators' | 'blocks' | 'facilities' | 'print';
  onTabChange: (tab: 'dashboard' | 'indicators' | 'blocks' | 'facilities' | 'print') => void;
  onOpenUploadModal: () => void;
  onOpenAddModal: () => void;
  onExportCSV: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  metadata,
  activeTab,
  onTabChange,
  onOpenUploadModal,
  onOpenAddModal,
  onExportCSV,
  onPrint,
}) => {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner with Government / Health Society Branding */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-slate-900 font-bold text-[10px]">
              +
            </span>
            <span className="font-semibold tracking-wide text-emerald-400">
              NATIONAL HEALTH MISSION &bull; HMIS PORTAL
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300">
              Health Management Information System (स्वास्थ्य प्रबंधन सूचना प्रणाली)
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Q1 Report (April – June 2026)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{metadata.dataApprovalStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Title & Action Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and metadata badges */}
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 shadow-xs">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display tracking-tight">
                    HMIS 1st Quarter Performance Dashboard
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                    April – June 2026
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-0.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {metadata.district}, {metadata.state}
                  </span>
                  <span>&bull;</span>
                  <span>Financial Year: {metadata.financialYear}</span>
                  <span>&bull;</span>
                  <span>Target Pop: {(metadata.totalPopulation / 100000).toFixed(2)} Lakh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="upload-file-btn"
              onClick={onOpenUploadModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
              title="Upload existing CSV / Excel HMIS report file"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Import File</span>
            </button>

            <button
              id="export-csv-btn"
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
              title="Export complete indicator data to CSV"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              id="add-indicator-btn"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
              title="Add or custom edit HMIS indicator"
            >
              <PlusCircle className="w-4 h-4 text-slate-500" />
              <span>Add Indicator</span>
            </button>

            <button
              id="print-report-main-btn"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
              title="Print official A4 HMIS 1st Quarter report"
            >
              <Printer className="w-4 h-4" />
              <span className="font-bold">Print Official Report</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 mt-4 border-t border-slate-200 pt-3 overflow-x-auto scrollbar-none">
          <button
            id="tab-dashboard"
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Q1 Analytics Dashboard</span>
          </button>

          <button
            id="tab-indicators"
            onClick={() => onTabChange('indicators')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'indicators'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Indicator Matrix (All Categories)</span>
          </button>

          <button
            id="tab-blocks"
            onClick={() => onTabChange('blocks')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'blocks'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Block Performance (3 Blocks)</span>
          </button>

          <button
            id="tab-facilities"
            onClick={() => onTabChange('facilities')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'facilities'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Facility Directory (59 Units)</span>
          </button>

          <button
            id="tab-print-preview"
            onClick={() => onTabChange('print')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'print'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'text-emerald-700 bg-emerald-50/70 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Print View & Official Format (प्रिंट लेआउट)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
