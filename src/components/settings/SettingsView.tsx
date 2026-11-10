import React, { useState, useEffect, useRef } from 'react';
import { Shield, Lock, Download, Upload, Trash2, Info, Check, HardDrive, RefreshCw } from 'lucide-react';
import { exportAllData, importDataFromFile, clearAllLocalData } from '../../services/backupService';
import { settingsRepository } from '../../db/repositories/settingsRepository';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useToast } from '../../hooks/useToast';

interface SettingsViewProps {
  onDataReset: () => void;
  onLoadDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onDataReset,
  onLoadDemoData,
}) => {
  const [autoLockMinutes, setAutoLockMinutes] = useState('15');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    settingsRepository.get('autoLockMinutes', 15).then((val) => {
      setAutoLockMinutes(String(val));
    });
  }, []);

  const handleAutoLockChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setAutoLockMinutes(val);
    await settingsRepository.set('autoLockMinutes', val === 'never' ? 0 : parseInt(val, 10));
    showToast('Auto-lock setting updated');
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportAllData();
      setExportSuccess(true);
      showToast('Backup JSON downloaded');
      setTimeout(() => setExportSuccess(false), 2500);
    } catch (err: any) {
      showToast(err.message || 'Export failed', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const res = await importDataFromFile(file);
      if (res.success) {
        showToast(`Successfully imported backup (${res.count} profiles)`);
        onDataReset();
      } else {
        showToast(res.error || 'Import failed', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Import error', 'error');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to completely erase all local records? This action is permanent and cannot be undone.')) {
      try {
        await clearAllLocalData();
        showToast('All local records cleared');
        onDataReset();
      } catch (err: any) {
        showToast(err.message || 'Failed to clear data', 'error');
      }
    }
  };

  return (
    <div className="space-y-8 max-w-2xl pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h2 className="text-xl font-bold tracking-tight text-primary">Settings</h2>
        <p className="text-xs text-secondary mt-1">
          Manage local storage parameters, backups, sample profiles, and security.
        </p>
      </div>

      {/* Security & Cryptography Section */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-subtle space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/60 flex items-center justify-center text-accent-dark">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary">Storage & Security</h3>
            <p className="text-xs text-secondary">
              Zero-knowledge architecture. All records are stored client-side in IndexedDB.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-border-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-secondary mt-0.5" />
              <div>
                <span className="text-xs font-medium text-primary block">Master Password & AES-GCM</span>
                <p className="text-[11px] text-secondary">
                  Phase 3: Unencrypted local persistence. Full PBKDF2 + AES-GCM activates in Phase 4.
                </p>
              </div>
            </div>
            <Badge size="sm" variant="default">
              Phase 4 Target
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <label htmlFor="autolock-select" className="text-xs font-medium text-primary block">
                Automatic Lock Inactivity Timeout
              </label>
              <p className="text-[11px] text-secondary">
                Period of inactivity before locking the notebook.
              </p>
            </div>
            <select
              id="autolock-select"
              value={autoLockMinutes}
              onChange={handleAutoLockChange}
              className="bg-canvas border border-border rounded-md px-2.5 py-1 text-xs text-primary focus:outline-none focus:border-primary/60 cursor-pointer"
            >
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="never">Never (keep unlocked)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Backup & Portability Section */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-canvas border border-border-subtle flex items-center justify-center text-primary">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary">Data & Backups</h3>
            <p className="text-xs text-secondary">
              Export and import portable JSON snapshots of your notebook.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-border-subtle flex flex-col sm:flex-row gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleExport}
            disabled={isExporting}
            icon={exportSuccess ? <Check className="w-3.5 h-3.5 text-accent-dark" /> : <Download className="w-3.5 h-3.5" />}
          >
            {exportSuccess ? 'Downloaded!' : isExporting ? 'Exporting...' : 'Export JSON Backup'}
          </Button>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportFile}
              className="hidden"
              id="backup-file-input"
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              icon={<Upload className="w-3.5 h-3.5" />}
            >
              {isImporting ? 'Importing...' : 'Import JSON Backup'}
            </Button>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={onLoadDemoData}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Load Sample Profiles
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-surface border border-red-200/70 rounded-xl p-6 shadow-subtle space-y-3">
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-status-danger-text" />
          <h3 className="text-sm font-semibold text-status-danger-text">Danger Zone</h3>
        </div>
        <p className="text-xs text-secondary leading-relaxed">
          Irreversibly delete all local storage records, preferences, and custom fields from this browser.
        </p>
        <div className="pt-2">
          <Button
            size="sm"
            variant="danger"
            onClick={handleClearAll}
          >
            Erase All Local Data
          </Button>
        </div>
      </div>

      {/* About Section */}
      <div className="p-6 bg-canvas border border-border-subtle rounded-xl text-xs space-y-2">
        <div className="flex items-center gap-2 text-primary font-medium">
          <Info className="w-4 h-4 text-secondary" />
          <span>Little Details — v0.2.0 (Phase 3 Core Functionality)</span>
        </div>
        <p className="text-secondary leading-relaxed">
          &ldquo;Remember what matters.&rdquo; A minimalist, private digital notebook designed for keeping
          track of the small details about loved ones.
        </p>
        <div className="pt-2 flex items-center gap-4 text-[11px] text-muted">
          <span>IndexedDB local database</span>
          <span>•</span>
          <span>Zero external server dependencies</span>
          <span>•</span>
          <span>No trackers</span>
        </div>
      </div>
    </div>
  );
};
