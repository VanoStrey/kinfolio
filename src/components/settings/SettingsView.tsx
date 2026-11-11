import React, { useState, useEffect, useRef } from 'react';
import { Shield, Lock, Download, Upload, Trash2, Info, Check, HardDrive, RefreshCw, Globe } from 'lucide-react';
import { exportAllData, importDataFromFile, clearAllLocalData } from '../../services/backupService';
import { settingsRepository } from '../../db/repositories/settingsRepository';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../i18n/LanguageContext';

interface SettingsViewProps {
  onDataReset: () => void;
  onLoadDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onDataReset,
  onLoadDemoData,
}) => {
  const { t } = useTranslation();
  const [autoLockMinutes, setAutoLockMinutes] = useState('15');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    settingsRepository.get('autoLockMinutes', 15).then((val) => {
      setAutoLockMinutes(val === 0 ? 'never' : String(val));
    });
  }, []);

  const handleAutoLockChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setAutoLockMinutes(val);
    await settingsRepository.set('autoLockMinutes', val === 'never' ? 0 : parseInt(val, 10));
    showToast(t('toasts.autoLockUpdated'));
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportAllData();
      setExportSuccess(true);
      showToast(t('toasts.backupDownloaded'));
      setTimeout(() => setExportSuccess(false), 2500);
    } catch (err: any) {
      showToast(err.message || t('toasts.exportFailed'), 'error');
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
        showToast(t('toasts.backupImported', { count: res.count }));
        onDataReset();
      } else {
        showToast(res.error || t('toasts.importFailed'), 'error');
      }
    } catch (err: any) {
      showToast(err.message || t('toasts.importError'), 'error');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm(t('settings.confirmErase'))) {
      try {
        await clearAllLocalData();
        showToast(t('toasts.localCleared'));
        onDataReset();
      } catch (err: any) {
        showToast(err.message || t('toasts.clearFailed'), 'error');
      }
    }
  };

  return (
    <div className="space-y-8 max-w-2xl pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h2 className="text-xl font-bold tracking-tight text-primary">{t('settings.heading')}</h2>
        <p className="text-xs text-secondary mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Interface Language Section */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/60 flex items-center justify-center text-accent-dark">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary">{t('settings.languageTitle')}</h3>
            <p className="text-xs text-secondary">
              {t('settings.languageDesc')}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-medium text-primary block">{t('settings.languageLabel')}</span>
            <p className="text-[11px] text-secondary">{t('settings.languageHint')}</p>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Security & Cryptography Section */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-subtle space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/60 flex items-center justify-center text-accent-dark">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary">{t('settings.securityTitle')}</h3>
            <p className="text-xs text-secondary">
              {t('settings.securityDesc')}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-border-subtle space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-medium text-primary block">{t('settings.masterPasswordTitle')}</span>
                <p className="text-[11px] text-secondary">
                  {t('settings.masterPasswordDesc')}
                </p>
              </div>
            </div>
            <Badge size="sm" variant="default" className="shrink-0">
              {t('settings.phase4Target')}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-2 gap-3">
            <div>
              <label htmlFor="autolock-select" className="text-xs font-medium text-primary block">
                {t('settings.autoLockLabel')}
              </label>
              <p className="text-[11px] text-secondary">
                {t('settings.autoLockDesc')}
              </p>
            </div>
            <select
              id="autolock-select"
              value={autoLockMinutes}
              onChange={handleAutoLockChange}
              className="bg-canvas border border-border rounded-md px-2.5 py-1 text-xs text-primary focus:outline-none focus:border-primary/60 cursor-pointer shrink-0"
            >
              <option value="5">{t('settings.min5')}</option>
              <option value="15">{t('settings.min15')}</option>
              <option value="30">{t('settings.min30')}</option>
              <option value="60">{t('settings.hour1')}</option>
              <option value="never">{t('settings.never')}</option>
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
            <h3 className="text-sm font-semibold text-primary">{t('settings.backupsTitle')}</h3>
            <p className="text-xs text-secondary">
              {t('settings.backupsDesc')}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-border-subtle flex flex-col sm:flex-row flex-wrap gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleExport}
            disabled={isExporting}
            icon={exportSuccess ? <Check className="w-3.5 h-3.5 text-accent-dark" /> : <Download className="w-3.5 h-3.5" />}
          >
            {exportSuccess
              ? t('settings.downloadedBtn')
              : isExporting
              ? t('settings.exportingBtn')
              : t('settings.exportBtn')}
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
              {isImporting ? t('settings.importingBtn') : t('settings.importBtn')}
            </Button>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={onLoadDemoData}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            {t('settings.loadDemoBtn')}
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-surface border border-red-200/70 rounded-xl p-6 shadow-subtle space-y-3">
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-status-danger-text" />
          <h3 className="text-sm font-semibold text-status-danger-text">{t('settings.dangerTitle')}</h3>
        </div>
        <p className="text-xs text-secondary leading-relaxed">
          {t('settings.dangerDesc')}
        </p>
        <div className="pt-2">
          <Button
            size="sm"
            variant="danger"
            onClick={handleClearAll}
          >
            {t('settings.eraseBtn')}
          </Button>
        </div>
      </div>

      {/* About Section */}
      <div className="p-6 bg-canvas border border-border-subtle rounded-xl text-xs space-y-2">
        <div className="flex items-center gap-2 text-primary font-medium">
          <Info className="w-4 h-4 text-secondary" />
          <span>{t('settings.aboutTitle')}</span>
        </div>
        <p className="text-secondary leading-relaxed">
          {t('settings.aboutDesc')}
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted">
          <span>{t('settings.aboutFooter1')}</span>
          <span>•</span>
          <span>{t('settings.aboutFooter2')}</span>
          <span>•</span>
          <span>{t('settings.aboutFooter3')}</span>
        </div>
      </div>
    </div>
  );
};
