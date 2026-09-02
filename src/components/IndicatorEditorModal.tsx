import React, { useState, useEffect } from 'react';
import { X, Save, PlusCircle, Layers } from 'lucide-react';
import { HMISIndicator, IndicatorCategory } from '../types/hmis';

interface IndicatorEditorModalProps {
  isOpen: boolean;
  indicator: HMISIndicator | null;
  onClose: () => void;
  onSave: (savedIndicator: HMISIndicator) => void;
}

export const IndicatorEditorModal: React.FC<IndicatorEditorModalProps> = ({
  isOpen,
  indicator,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<HMISIndicator>>({
    code: '',
    name: '',
    nameHindi: '',
    category: 'maternal_health',
    april2026: 0,
    may2026: 0,
    june2026: 0,
    q1Target: 0,
    annualTarget: 0,
    description: '',
  });

  useEffect(() => {
    if (indicator) {
      setFormData(indicator);
    } else {
      setFormData({
        id: `ind-custom-${Date.now()}`,
        code: 'GEN.1.1',
        name: '',
        nameHindi: '',
        category: 'maternal_health',
        april2026: 0,
        may2026: 0,
        june2026: 0,
        q1Target: 1000,
        annualTarget: 4000,
        description: '',
      });
    }
  }, [indicator, isOpen]);

  if (!isOpen) return null;

  const april = Number(formData.april2026 || 0);
  const may = Number(formData.may2026 || 0);
  const june = Number(formData.june2026 || 0);
  const calculatedTotal = april + may + june;
  const q1Target = Number(formData.q1Target || 1);
  const calculatedAchievement = q1Target > 0 ? (calculatedTotal / q1Target) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    let status: 'achieved' | 'on_track' | 'lagging' = 'on_track';
    if (calculatedAchievement >= 100) status = 'achieved';
    else if (calculatedAchievement < 90) status = 'lagging';

    const saved: HMISIndicator = {
      id: formData.id || `ind-${Date.now()}`,
      code: formData.code || 'M.1.0',
      name: formData.name || 'Unnamed Indicator',
      nameHindi: formData.nameHindi || undefined,
      category: (formData.category as IndicatorCategory) || 'maternal_health',
      unit: 'number',
      april2026: april,
      may2026: may,
      june2026: june,
      q1Total: calculatedTotal,
      q1Target: q1Target,
      annualTarget: Number(formData.annualTarget || q1Target * 4),
      achievementPercent: calculatedAchievement,
      status,
      description: formData.description || '',
      blockData: formData.blockData,
    };

    onSave(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-500 text-slate-950 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">
                {indicator ? 'Edit HMIS Indicator' : 'Add New HMIS Indicator'}
              </h3>
              <p className="text-xs text-slate-300">
                Update quarterly reporting figures for April, May & June 2026
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Code & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Indicator Code</label>
              <input
                type="text"
                required
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. M.1.1, D.2.3"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Health Category</label>
              <select
                value={formData.category || 'maternal_health'}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as IndicatorCategory })
                }
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="maternal_health">Maternal Health & ANC</option>
                <option value="delivery_care">Delivery & Intrapartum Care</option>
                <option value="child_immunization">Child Health & Immunization</option>
                <option value="family_planning">Family Planning & Contraception</option>
                <option value="opd_ipd_services">Hospital OPD & IPD</option>
                <option value="disease_surveillance">Disease Surveillance & NCDs</option>
                <option value="diagnostics_lab">Diagnostic & Lab Tests</option>
              </select>
            </div>
          </div>

          {/* Name & Hindi Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Indicator Name (English)</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Total Antenatal Care (ANC) Registrations"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Hindi Name (वैकल्पिक हिंदी नाम)
            </label>
            <input
              type="text"
              value={formData.nameHindi || ''}
              onChange={(e) => setFormData({ ...formData, nameHindi: e.target.value })}
              placeholder="उदा. कुल प्रसव पूर्व पंजीकरण"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-hindi"
            />
          </div>

          {/* Monthly Figures */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block mb-2">
              Monthly Reported Values (April – June 2026)
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">April 2026</label>
                <input
                  type="number"
                  min="0"
                  value={formData.april2026 ?? ''}
                  onChange={(e) => setFormData({ ...formData, april2026: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono text-right"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">May 2026</label>
                <input
                  type="number"
                  min="0"
                  value={formData.may2026 ?? ''}
                  onChange={(e) => setFormData({ ...formData, may2026: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono text-right"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">June 2026</label>
                <input
                  type="number"
                  min="0"
                  value={formData.june2026 ?? ''}
                  onChange={(e) => setFormData({ ...formData, june2026: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono text-right"
                />
              </div>
            </div>

            {/* Calculated Q1 Total preview */}
            <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-slate-600">Calculated Q1 Total:</span>
              <span className="font-bold font-mono text-emerald-800 text-sm">
                {calculatedTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Targets */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Q1 Target (Apr-Jun)</label>
              <input
                type="number"
                min="1"
                required
                value={formData.q1Target ?? ''}
                onChange={(e) => setFormData({ ...formData, q1Target: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-right"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Annual Target FY 26-27</label>
              <input
                type="number"
                min="1"
                value={formData.annualTarget ?? ''}
                onChange={(e) => setFormData({ ...formData, annualTarget: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-right"
              />
            </div>
          </div>

          {/* Achievement Summary */}
          <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
            <span>Calculated Achievement Rate:</span>
            <span className="font-bold font-mono text-sm">{calculatedAchievement.toFixed(1)}%</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Indicator</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
