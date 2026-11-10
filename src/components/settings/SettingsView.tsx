import React, { useState } from 'react';
import { Shield, Lock, Download, Upload, Trash2, Info, Check, HardDrive } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface SettingsViewProps {
  onClearAllData?: () => void;
  onExportData?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onClearAllData,
  onExportData,
}) => {
  const [autoLockMinutes, setAutoLockMinutes] = useState('15');
  const [copiedStatus, setCopiedStatus] = useState(false);

  const handleExport = () => {
    if (onExportData) {
      onExportData();
    } else {
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h2 className="text-xl font-bold tracking-tight text-primary">Settings</h2>
        <p className="text-xs text-secondary mt-1">
          Manage privacy, security parameters, backups, and storage preferences.
        </p>
      </div>

      {/* Security & Cryptography Section */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-subtle space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/60 flex items-center justify-center text-accent-dark">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary">Privacy & Security</h3>
            <p className="text-xs text-secondary">
              Zero-knowledge architecture. Everything stays in your browser.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-border-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-secondary mt-0.5" />
              <div>
                <span className="text-xs font-medium text-primary block">Master Password Protection</span>
                <p className="text-[11px] text-secondary">
                  Data will be encrypted with AES-GCM and key derivation.
                </p>
              </div>
            </div>
            <Badge size="sm" variant="accent">
              Phase 4 Prepared
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <label htmlFor="autolock-select" className="text-xs font-medium text-primary block">Automatic Lock Timeout</label>
              <p className="text-[11px] text-secondary">
                Locks the notebook after period of inactivity.
              </p>
            </div>
            <select
              id="autolock-select"
              value={autoLockMinutes}
              onChange={(e) => setAutoLockMinutes(e.target.value)}
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
              Export encrypted snapshots to keep your records portable and safe.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-border-subtle flex flex-col sm:flex-row gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleExport}
            icon={copiedStatus ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5" />}
          >
            {copiedStatus ? 'Exported Backup!' : 'Export Encrypted Backup'}
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => alert('Backup import will be connected with Phase 4 cryptographic decryption.')}
            icon={<Upload className="w-3.5 h-3.5" />}
          >
            Import Backup File
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
          Irreversibly delete all local storage records, preferences, and cached keys on this device.
        </p>
        <div className="pt-2">
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              if (window.confirm('Are you sure you want to completely erase all local data? This cannot be undone.')) {
                if (onClearAllData) onClearAllData();
              }
            }}
          >
            Erase All Local Data
          </Button>
        </div>
      </div>

      {/* About Section */}
      <div className="p-6 bg-canvas border border-border-subtle rounded-xl text-xs space-y-2">
        <div className="flex items-center gap-2 text-primary font-medium">
          <Info className="w-4 h-4 text-secondary" />
          <span>Little Details — v0.1.0</span>
        </div>
        <p className="text-secondary leading-relaxed">
          &ldquo;Remember what matters.&rdquo; A minimalist, private digital notebook designed for keeping
          track of the little things about the people you love.
        </p>
        <div className="pt-2 flex items-center gap-4 text-[11px] text-muted">
          <span>Hosted on GitHub Pages</span>
          <span>•</span>
          <span>Zero analytics &amp; no trackers</span>
          <span>•</span>
          <span>Local client-side execution</span>
        </div>
      </div>
    </div>
  );
};
