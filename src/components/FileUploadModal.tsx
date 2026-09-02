import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  HelpCircle
} from 'lucide-react';
import Papa from 'papaparse';
import { HMISIndicator, IndicatorCategory } from '../types/hmis';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportData: (importedIndicators: HMISIndicator[]) => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onImportData,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setErrorMsg(null);

    const isCsv = selectedFile.name.endsWith('.csv');
    const isJson = selectedFile.name.endsWith('.json');

    if (!isCsv && !isJson) {
      setErrorMsg('Please upload a valid .csv or .json HMIS file.');
      return;
    }

    if (isCsv) {
      Papa.parse(selectedFile, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (!results.data || results.data.length === 0) {
            setErrorMsg('The uploaded CSV file contains no data rows.');
            return;
          }
          setParsedRows(results.data);
        },
        error: (err) => {
          setErrorMsg(`Error parsing CSV file: ${err.message}`);
        },
      });
    } else if (isJson) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsed)) {
            setParsedRows(parsed);
          } else if (parsed.indicators && Array.isArray(parsed.indicators)) {
            setParsedRows(parsed.indicators);
          } else {
            setErrorMsg('Invalid JSON structure. Expected an array of indicators.');
          }
        } catch (err: any) {
          setErrorMsg(`Invalid JSON file: ${err.message}`);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleApplyImport = () => {
    if (parsedRows.length === 0) return;

    try {
      const mappedIndicators: HMISIndicator[] = parsedRows.map((row, idx) => {
        const code = String(row.Code || row.code || `IND.${idx + 1}`);
        const name = String(row.Name || row.name || row.Indicator || row.indicator || `Indicator ${idx + 1}`);
        const nameHindi = row.NameHindi || row.nameHindi || row.Hindi || undefined;
        
        // Category detection
        let category: IndicatorCategory = 'maternal_health';
        const catStr = String(row.Category || row.category || '').toLowerCase();
        if (catStr.includes('deliv')) category = 'delivery_care';
        else if (catStr.includes('imm') || catStr.includes('child')) category = 'child_immunization';
        else if (catStr.includes('fam') || catStr.includes('plan')) category = 'family_planning';
        else if (catStr.includes('opd') || catStr.includes('ipd') || catStr.includes('hosp')) category = 'opd_ipd_services';
        else if (catStr.includes('ncd') || catStr.includes('dis') || catStr.includes('tb')) category = 'disease_surveillance';
        else if (catStr.includes('lab') || catStr.includes('diag')) category = 'diagnostics_lab';
        else if (code.startsWith('D.')) category = 'delivery_care';
        else if (code.startsWith('C.')) category = 'child_immunization';
        else if (code.startsWith('FP.')) category = 'family_planning';
        else if (code.startsWith('H.')) category = 'opd_ipd_services';
        else if (code.startsWith('NCD.')) category = 'disease_surveillance';
        else if (code.startsWith('LAB.')) category = 'diagnostics_lab';

        const april = Number(row.April || row.april || row.April2026 || row.april2026 || 0);
        const may = Number(row.May || row.may || row.May2026 || row.may2026 || 0);
        const june = Number(row.June || row.june || row.June2026 || row.june2026 || 0);
        const q1Total = Number(row.Q1Total || row.q1Total || row.Total || (april + may + june));
        const q1Target = Number(row.Q1Target || row.q1Target || row.Target || (q1Total > 0 ? Math.round(q1Total * 0.95) : 1000));
        const annualTarget = Number(row.AnnualTarget || row.annualTarget || q1Target * 4);
        const achievementPercent = q1Target > 0 ? (q1Total / q1Target) * 100 : 100;

        let status: 'achieved' | 'on_track' | 'lagging' = 'on_track';
        if (achievementPercent >= 100) status = 'achieved';
        else if (achievementPercent < 90) status = 'lagging';

        return {
          id: `imported-${idx}-${Date.now()}`,
          code,
          name,
          nameHindi,
          category,
          unit: 'number',
          april2026: april,
          may2026: may,
          june2026: june,
          q1Total,
          q1Target,
          annualTarget,
          achievementPercent,
          status,
          description: row.Description || row.description || '',
        };
      });

      onImportData(mappedIndicators);
      onClose();
    } catch (err: any) {
      setErrorMsg(`Failed to format data: ${err.message}`);
    }
  };

  const handleDownloadSample = () => {
    const sampleCsv = `Code,Name,NameHindi,Category,April2026,May2026,June2026,Q1Target,AnnualTarget
M.1.1,Total Antenatal Care (ANC) Registrations,कुल प्रसव पूर्व पंजीकरण,maternal_health,2740,2890,2920,8150,32600
M.1.2,ANC Registered within 1st Trimester,प्रथम त्रैमास में पंजीकृत महिलाएं,maternal_health,2310,2470,2510,6927,27710
D.2.1,Total Reported Institutional Deliveries,कुल संस्थागत प्रसव,delivery_care,2380,2490,2550,7250,29000
C.3.4,Fully Immunized Children (FIC 9-11 Months),पूर्ण प्रतिरक्षित बच्चे,child_immunization,2210,2310,2370,6960,27840
FP.4.1,IUCD & PPIUCD Insertions,आईयूसीडी निवेशन,family_planning,460,495,520,1400,5600
H.5.1,Total Outpatient (OPD) Consultations,कुल ओपीडी परामर्श,opd_ipd_services,58400,62800,64900,175000,700000
LAB.7.1,Total Diagnostic Lab Tests Performed,कुल पैथोलॉजी परीक्षण,diagnostics_lab,62400,67800,71200,190000,760000`;

    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'HMIS_Q1_2026_Sample_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-500 text-slate-950 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">
                Import HMIS File (April – June 2026)
              </h3>
              <p className="text-xs text-slate-300">
                Upload your HMIS quarterly report spreadsheet in CSV or JSON format
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/50'
                : 'border-slate-300 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {file ? file.name : 'Click to browse or drag & drop HMIS file here'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Supports .CSV or .JSON reports containing monthly data for April, May & June 2026
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Preview of Parsed Rows */}
          {parsedRows.length > 0 && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  Successfully parsed {parsedRows.length} indicator rows
                </span>
                <span className="text-[11px] text-slate-500">Preview (First 3 rows)</span>
              </div>
              <div className="max-h-40 overflow-y-auto divide-y divide-slate-200 text-xs">
                {parsedRows.slice(0, 3).map((row, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between bg-white text-slate-700">
                    <div className="font-semibold truncate max-w-xs">
                      {row.Code || row.code ? `[${row.Code || row.code}] ` : ''}
                      {row.Name || row.name || row.Indicator || `Row ${i + 1}`}
                    </div>
                    <div className="font-mono text-slate-500 text-[11px]">
                      Apr: {row.April || row.april || 0} | May: {row.May || row.may || 0} | Jun:{' '}
                      {row.June || row.june || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download Sample CSV Template */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Need the standard HMIS column format?</span>
            </div>
            <button
              onClick={handleDownloadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 border border-slate-300 rounded-md font-semibold text-xs hover:bg-slate-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Sample CSV</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyImport}
            disabled={parsedRows.length === 0}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Load Data into Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
