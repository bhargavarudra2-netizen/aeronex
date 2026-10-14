import React, { useState } from 'react';
import { DeviceSettings } from '../types';
import { 
  Sliders, 
  Save, 
  RotateCcw, 
  Check, 
  AlertTriangle, 
  Bluetooth, 
  MousePointer,
  Vibrate,
  Lightbulb
} from 'lucide-react';

interface DeviceSettingsProps {
  settings: DeviceSettings;
  onSaveSettings: (settings: DeviceSettings) => void;
  onResetDefaults: () => void;
}

export const DeviceSettingsPage: React.FC<DeviceSettingsProps> = ({
  settings,
  onSaveSettings,
  onResetDefaults,
}) => {
  const [formData, setFormData] = useState<DeviceSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleChange = <K extends keyof DeviceSettings>(key: K, value: DeviceSettings[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setSaveSuccess(false);
  };

  const handleSave = () => {
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    onResetDefaults();
    setShowResetConfirm(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 py-4 max-w-6xl mx-auto">
      {/* Settings Top Bar */}
      <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4 shadow-card">
        <div>
          <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-lavender" />
            Device & Firmware Preferences
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Configure mouse behavior, sensitivity curve, BLE radio power, and power management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-mono text-status-success font-bold flex items-center gap-1 bg-status-success/10 px-3.5 py-1.5 rounded-full border border-status-success/20">
              <Check className="w-4 h-4" />
              Settings Saved to LocalStorage
            </span>
          )}

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-status-error/10 text-text-secondary hover:text-status-error border border-brand-border rounded-full text-xs font-semibold transition shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-brand-orange hover:bg-brand-orangeHover text-white font-bold text-xs rounded-full transition shadow-orangeGlow cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mouse Behaviour Settings */}
        <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="pb-3 border-b border-brand-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-brand-dark flex items-center gap-2">
              <MousePointer className="w-4 h-4 text-brand-orange" />
              Mouse Pointer & Kinematics
            </h3>
            <span className="text-xs font-mono text-text-secondary">HID Core</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Sensitivity */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <label htmlFor="settings-pointer-sensitivity-slider" className="text-text-secondary">Pointer Sensitivity</label>
                <span className="text-brand-orange font-bold">{formData.cursorSensitivity}%</span>
              </div>
              <input
                id="settings-pointer-sensitivity-slider"
                type="range"
                min="10"
                max="100"
                value={formData.cursorSensitivity}
                onChange={e => handleChange('cursorSensitivity', Number(e.target.value))}
                className="w-full accent-brand-orange bg-bg-soft h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Smoothing */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <label htmlFor="settings-smoothing-factor-slider" className="text-text-secondary">Smoothing Factor (EMA)</label>
                <span className="text-brand-lavender font-bold">{(formData.smoothingFactor * 100).toFixed(0)}%</span>
              </div>
              <input
                id="settings-smoothing-factor-slider"
                type="range"
                min="0"
                max="90"
                value={Math.round(formData.smoothingFactor * 100)}
                onChange={e => handleChange('smoothingFactor', Number(e.target.value) / 100)}
                className="w-full accent-brand-lavender bg-bg-soft h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Deadzone */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <label htmlFor="settings-deadzone-radius-slider" className="text-text-secondary">Dead-Zone Radius</label>
                <span className="text-brand-orange font-bold">±{formData.deadZoneRadius} dps</span>
              </div>
              <input
                id="settings-deadzone-radius-slider"
                type="range"
                min="0"
                max="25"
                value={formData.deadZoneRadius}
                onChange={e => handleChange('deadZoneRadius', Number(e.target.value))}
                className="w-full accent-brand-orange bg-bg-soft h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Scroll Mode */}
            <div className="pt-3 border-t border-brand-border space-y-3">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <div>
                  <span className="text-brand-dark font-semibold block">Scroll Mode Gesture</span>
                  <span className="text-[11px] text-text-secondary">Tilt roll past 35° switches cursor into vertical mouse wheel</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.scrollModeEnabled}
                  onChange={e => handleChange('scrollModeEnabled', e.target.checked)}
                  className="rounded border-brand-border bg-bg-soft accent-brand-orange w-4 h-4 cursor-pointer"
                />
              </label>

              {formData.scrollModeEnabled && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between font-mono">
                    <label htmlFor="settings-scroll-speed-slider" className="text-text-secondary">Scroll Sensitivity</label>
                    <span className="text-brand-orange font-bold">{formData.scrollSensitivity}</span>
                  </div>
                  <input
                    id="settings-scroll-speed-slider"
                    type="range"
                    min="1"
                    max="10"
                    value={formData.scrollSensitivity}
                    onChange={e => handleChange('scrollSensitivity', Number(e.target.value))}
                    className="w-full accent-brand-orange bg-bg-soft h-2 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Radio & Power Management Settings */}
        <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="pb-3 border-b border-brand-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-brand-dark flex items-center gap-2">
              <Bluetooth className="w-4 h-4 text-brand-lavender" />
              BLE Radio & Power Management
            </h3>
            <span className="text-xs font-mono text-text-secondary">Radio / NVS</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* BLE TX Power */}
            <div className="space-y-1.5">
              <label className="block text-brand-dark font-semibold font-mono">BLE Transmitter Output (TX Power)</label>
              <select
                value={formData.bleTxPower}
                onChange={e => handleChange('bleTxPower', e.target.value as any)}
                className="w-full bg-[#FAFBFD] border border-brand-border rounded-xl px-3.5 py-2 text-brand-dark font-mono focus:outline-none focus:border-brand-orange"
              >
                <option value="low">Low (-12 dBm) - Battery saver, max 3 meters</option>
                <option value="medium">Medium (0 dBm) - Standard desktop room, 8 meters</option>
                <option value="high">High (+9 dBm) - High interference / Auditoriums</option>
              </select>
            </div>

            {/* Poll Rate */}
            <div className="space-y-1.5">
              <label className="block text-brand-dark font-semibold font-mono">IMU Sampling & HID Report Rate</label>
              <select
                value={formData.pollRateHz}
                onChange={e => handleChange('pollRateHz', Number(e.target.value) as any)}
                className="w-full bg-[#FAFBFD] border border-brand-border rounded-xl px-3.5 py-2 text-brand-dark font-mono focus:outline-none focus:border-brand-orange"
              >
                <option value={50}>50 Hz - Low power (20ms interval)</option>
                <option value={100}>100 Hz - Balanced standard (10ms interval)</option>
                <option value={200}>200 Hz - High precision gaming (5ms interval)</option>
              </select>
            </div>

            {/* Auto-sleep minutes */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-text-secondary font-semibold">Deep Sleep Inactivity Timer</span>
                <span className="text-brand-orange font-bold">{formData.autoSleepMinutes} min</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={formData.autoSleepMinutes}
                onChange={e => handleChange('autoSleepMinutes', Number(e.target.value))}
                className="w-full accent-brand-orange bg-bg-soft h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-text-secondary">ESP32 enters ultra-low-power sleep when no motion is detected.</p>
            </div>

            {/* Hardware feedback toggles */}
            <div className="pt-3 border-t border-brand-border space-y-3">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <div className="flex items-center gap-2">
                  <Vibrate className="w-4 h-4 text-brand-lavender" />
                  <span className="text-brand-dark font-semibold">Haptic Vibration on Gesture Match</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.hapticFeedback}
                  onChange={e => handleChange('hapticFeedback', e.target.checked)}
                  className="rounded border-brand-border bg-bg-soft accent-brand-orange w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer select-none">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-brand-orange" />
                  <span className="text-brand-dark font-semibold">Status LED Indicators</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.ledIndicators}
                  onChange={e => handleChange('ledIndicators', e.target.checked)}
                  className="rounded border-brand-border bg-bg-soft accent-brand-orange w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-brand-border rounded-3xl max-w-sm w-full p-6 shadow-floating space-y-4">
            <div className="flex items-center gap-3 text-status-warning">
              <AlertTriangle className="w-6 h-6 flex-shrink-0 text-brand-orange" />
              <h3 className="font-bold text-brand-dark text-base">Reset Settings?</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Are you sure you want to revert all custom thresholds, mouse kinematics, and radio preferences to their factory defaults?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-white hover:bg-bg-soft border border-brand-border text-text-secondary text-xs rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-2 bg-brand-orange hover:bg-brand-orangeHover text-white font-bold text-xs rounded-full shadow-orangeGlow"
              >
                Yes, Restore Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
