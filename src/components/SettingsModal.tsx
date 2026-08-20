import React, { useState } from 'react';
import { 
  X, 
  Building, 
  User, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  FileJson
} from 'lucide-react';
import { UserSettings, OfficialItem } from '../types';
import { getSampleInitialItems } from '../storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
  items: OfficialItem[];
  onImportItems: (items: OfficialItem[]) => void;
  onResetSampleData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  items,
  onImportItems,
  onResetSampleData,
}) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [importStatus, setImportStatus] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

  const handleExportData = () => {
    const dataToExport = {
      settings: formData,
      items,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `official_duty_backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && Array.isArray(parsed.items)) {
            onImportItems(parsed.items);
            if (parsed.settings) {
              setFormData(parsed.settings);
              onSaveSettings(parsed.settings);
            }
            setImportStatus('Backup restored successfully!');
            setTimeout(() => setImportStatus(''), 3000);
          } else if (Array.isArray(parsed)) {
            onImportItems(parsed);
            setImportStatus('Backup restored successfully!');
            setTimeout(() => setImportStatus(''), 3000);
          } else {
            alert('Invalid backup file format.');
          }
        } catch (err) {
          alert('Error parsing JSON backup file.');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="modal-settings"
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col text-slate-100"
      >
        {/* Modal Header */}
        <div className="bg-slate-950 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-slate-800 rounded-xl text-emerald-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Office & Executive Profile Settings
              </h2>
              <p className="text-xs text-slate-400">
                Customise official headers, titles, and manage data backups
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Office Name */}
          <div>
            <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
              Office / Secretariat Name (Appears on Printed PDF Header)
            </label>
            <input
              type="text"
              value={formData.officeName}
              onChange={(e) => setFormData({ ...formData, officeName: e.target.value })}
              placeholder="e.g. Executive Office of the Director General"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Department Name */}
          <div>
            <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
              Directorate / Branch Name
            </label>
            <input
              type="text"
              value={formData.departmentName}
              onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
              placeholder="e.g. Administration & Coordination Wing"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Officer Name & Title */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
                Your Name (Officer)
              </label>
              <input
                type="text"
                value={formData.officerName}
                onChange={(e) => setFormData({ ...formData, officerName: e.target.value })}
                placeholder="e.g. Mubashir Qayyum"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
                Your Designation / Title
              </label>
              <input
                type="text"
                value={formData.officerTitle}
                onChange={(e) => setFormData({ ...formData, officerTitle: e.target.value })}
                placeholder="e.g. Personal Assistant to DG"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Superior Officer Designation */}
          <div>
            <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider text-[11px]">
              Boss / Superior Title (e.g. Director General / Worthy Sir)
            </label>
            <input
              type="text"
              value={formData.superiorTitle}
              onChange={(e) => setFormData({ ...formData, superiorTitle: e.target.value })}
              placeholder="e.g. Director General / Worthy Sir"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Data Backup & Restore Section */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2.5 pt-3">
            <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <FileJson className="w-4 h-4 text-emerald-400" />
              <span>Official Records Backup & Persistence</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              All directives, meetings, and correspondence are automatically saved locally. You can export or import a file backup anytime.
            </p>

            {importStatus && (
              <div className="p-2 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-lg font-semibold text-[11px] flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>{importStatus}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Export Button */}
              <button
                type="button"
                onClick={handleExportData}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold px-3 py-1.5 border border-slate-700 rounded-lg text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Export Backup ({items.length} Records)</span>
              </button>

              {/* Import Button */}
              <label className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold px-3 py-1.5 border border-slate-700 rounded-lg text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Restore Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>

              {/* Reset to Sample Data */}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all directives to fresh sample data?')) {
                    onResetSampleData();
                    onClose();
                  }
                }}
                className="text-slate-400 hover:text-red-400 text-xs px-2 py-1.5 rounded-lg flex items-center gap-1 ml-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Load Sample Data</span>
              </button>
            </div>
          </div>

          {/* Footer Save */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Profile & Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
