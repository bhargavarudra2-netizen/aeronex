import React, { useState, useEffect } from 'react';
import { 
  PageTab, 
  DeviceStatus, 
  DeviceSettings, 
  GestureMapping, 
  GestureEvent, 
  TelemetryPoint, 
  DiagnosticLog 
} from './types';
import { telemetryService } from './services/telemetryService';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Overview } from './components/Overview';
import { AirMouse } from './components/AirMouse';
import { GestureStudio } from './components/GestureStudio';
import { SensorLab } from './components/SensorLab';
import { Calibration } from './components/Calibration';
import { DeviceSettingsPage } from './components/DeviceSettingsPage';
import { Diagnostics } from './components/Diagnostics';
import { Radio, ArrowRight, ShieldCheck } from 'lucide-react';

const DEFAULT_SETTINGS: DeviceSettings = {
  cursorSensitivity: 65,
  smoothingFactor: 0.45,
  deadZoneRadius: 8,
  invertedX: false,
  invertedY: false,
  scrollModeEnabled: true,
  scrollSensitivity: 4,
  bleTxPower: 'medium',
  autoSleepMinutes: 5,
  hapticFeedback: true,
  ledIndicators: true,
  pollRateHz: 100,
};

const DEFAULT_GESTURES: GestureMapping[] = [
  {
    id: 'g-1',
    name: 'Left Flick',
    triggerType: 'left-flick',
    action: 'Previous Slide',
    enabled: true,
    thresholdG: 1.6,
    cooldownMs: 650,
    description: 'Rapid leftward wrist pivot. Triggers Page Up / Left Arrow.',
  },
  {
    id: 'g-2',
    name: 'Right Flick',
    triggerType: 'right-flick',
    action: 'Next Slide',
    enabled: true,
    thresholdG: 1.6,
    cooldownMs: 650,
    description: 'Rapid rightward wrist pivot. Triggers Page Down / Right Arrow.',
  },
  {
    id: 'g-3',
    name: 'Double Flick',
    triggerType: 'double-flick',
    action: 'Play / Pause Media',
    enabled: true,
    thresholdG: 2.2,
    cooldownMs: 800,
    description: 'Double oscillating pulse within 400ms window.',
  },
  {
    id: 'g-4',
    name: 'Upward Flick',
    triggerType: 'up-flick',
    action: 'Volume Up',
    enabled: false,
    thresholdG: 2.0,
    cooldownMs: 500,
    description: 'Quick vertical snap upwards.',
  },
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PageTab>('overview');
  
  // Persistent Settings in LocalStorage
  const [settings, setSettings] = useState<DeviceSettings>(() => {
    try {
      const stored = localStorage.getItem('aircontrol_settings');
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Persistent Gestures in LocalStorage
  const [gestures, setGestures] = useState<GestureMapping[]>(() => {
    try {
      const stored = localStorage.getItem('aircontrol_gestures');
      return stored ? JSON.parse(stored) : DEFAULT_GESTURES;
    } catch {
      return DEFAULT_GESTURES;
    }
  });

  // Live Telemetry & Device State
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>(telemetryService.getStatus());
  const [currentTelemetry, setCurrentTelemetry] = useState<TelemetryPoint | null>(null);
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>([]);
  const [recentGestures, setRecentGestures] = useState<GestureEvent[]>([]);
  const [logs, setLogs] = useState<DiagnosticLog[]>(telemetryService.getRecentLogs());
  const [isTelemetryRunning, setIsTelemetryRunning] = useState<boolean>(true);
  const [isLiveHardware, setIsLiveHardware] = useState<boolean>(false);

  // Subscribe to Telemetry service events
  useEffect(() => {
    const unsubTelemetry = telemetryService.subscribeTelemetry((point) => {
      setCurrentTelemetry(point);
      setTelemetryHistory(prev => {
        const next = [...prev, point];
        if (next.length > 200) next.shift();
        return next;
      });
    });

    const unsubStatus = telemetryService.subscribeStatus((st) => {
      setDeviceStatus(st);
    });

    const unsubLog = telemetryService.subscribeLogs((newLog) => {
      setLogs(prev => [newLog, ...prev.slice(0, 499)]);
    });

    const unsubGesture = telemetryService.subscribeGesture((event) => {
      setRecentGestures(prev => [event, ...prev.slice(0, 49)]);
    });

    const unsubLive = telemetryService.subscribeLiveHardware((isLive) => {
      setIsLiveHardware(isLive);
    });

    return () => {
      unsubTelemetry();
      unsubStatus();
      unsubLog();
      unsubGesture();
      unsubLive();
    };
  }, []);

  const handleUpdateSettings = (newPartial: Partial<DeviceSettings>) => {
    const updated = { ...settings, ...newPartial };
    setSettings(updated);
    try {
      localStorage.setItem('aircontrol_settings', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  const handleSaveFullSettings = (updated: DeviceSettings) => {
    setSettings(updated);
    try {
      localStorage.setItem('aircontrol_settings', JSON.stringify(updated));
      telemetryService.addLog({
        level: 'info',
        category: 'SYSTEM',
        message: 'Updated device settings written to non-volatile storage.',
        isSimulated: true,
      });
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem('aircontrol_settings', JSON.stringify(DEFAULT_SETTINGS));
      telemetryService.addLog({
        level: 'warn',
        category: 'SYSTEM',
        message: 'Device configuration restored to factory defaults.',
        isSimulated: true,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateGestures = (newGestures: GestureMapping[]) => {
    setGestures(newGestures);
    try {
      localStorage.setItem('aircontrol_gestures', JSON.stringify(newGestures));
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePause = () => {
    if (telemetryService.getIsRunning()) {
      telemetryService.pause();
      setIsTelemetryRunning(false);
    } else {
      telemetryService.resume();
      setIsTelemetryRunning(true);
    }
  };

  const handleClearTelemetryData = () => {
    setTelemetryHistory([]);
  };

  const handleTestGesture = (gestureName: string, action: string) => {
    telemetryService.triggerSimulatedGesture(gestureName, action, 0.95);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F9] text-brand-dark flex flex-col font-sans selection:bg-brand-orangeLight selection:text-brand-orange relative">
      {/* Background subtle grid pattern across top hero */}
      <div className="absolute top-0 left-0 right-0 h-[620px] bg-subtle-grid pointer-events-none opacity-60"></div>

      {/* Top Header */}
      <Header
        deviceStatus={deviceStatus}
        isLiveHardware={isLiveHardware}
        onToggleConnection={() => telemetryService.toggleConnection()}
        onConnectSerial={() => telemetryService.connectWebSerial()}
        onDisconnectSerial={() => telemetryService.disconnectWebSerial()}
        onNavigateOverview={() => setActiveTab('overview')}
      />

      {/* Floating Segmented Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {activeTab === 'overview' && (
          <Overview
            deviceStatus={deviceStatus}
            settings={settings}
            recentGesture={recentGestures[0] || null}
            onNavigate={(tab) => setActiveTab(tab)}
            onTriggerDemoGesture={() => handleTestGesture('Right Flick', 'Next Slide')}
          />
        )}

        {activeTab === 'air-mouse' && (
          <AirMouse
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            telemetry={currentTelemetry}
          />
        )}

        {activeTab === 'gesture-studio' && (
          <GestureStudio
            mappings={gestures}
            onUpdateMappings={handleUpdateGestures}
            recentGestures={recentGestures}
            onTestGesture={handleTestGesture}
          />
        )}

        {activeTab === 'sensor-lab' && (
          <SensorLab
            telemetryHistory={telemetryHistory}
            currentPoint={currentTelemetry}
            isRunning={isTelemetryRunning}
            onTogglePause={handleTogglePause}
            onClearData={handleClearTelemetryData}
          />
        )}

        {activeTab === 'calibration' && (
          <Calibration />
        )}

        {activeTab === 'device-settings' && (
          <DeviceSettingsPage
            settings={settings}
            onSaveSettings={handleSaveFullSettings}
            onResetDefaults={handleResetDefaults}
          />
        )}

        {activeTab === 'diagnostics' && (
          <Diagnostics
            logs={logs}
            deviceStatus={deviceStatus}
            onClearLogs={() => {
              telemetryService.clearLogs();
              setLogs([]);
            }}
            onRefresh={() => setLogs(telemetryService.getRecentLogs())}
          />
        )}
      </main>

      {/* Bottom CTA Banner inspired by the reference footer card */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-[#16171B] text-white rounded-3xl p-8 sm:p-12 shadow-floating relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Control in Thin Air?
            </h3>
            <p className="text-sm text-gray-400 max-w-md">
              Switch seamlessly between air mouse cursor tracking and slide presentation flick shortcuts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => setActiveTab('air-mouse')}
              className="px-7 py-3.5 bg-brand-orange hover:bg-brand-orangeHover text-white font-bold text-xs sm:text-sm rounded-full transition shadow-orangeGlow cursor-pointer flex items-center gap-2"
            >
              <span>Launch Air Mouse</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('sensor-lab')}
              className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-full transition border border-white/15 cursor-pointer"
            >
              Sensor Telemetry
            </button>
          </div>
        </div>
      </div>

      {/* Clean White SaaS Footer */}
      <footer className="w-full bg-white border-t border-brand-border py-8 px-4 sm:px-8 text-xs text-text-secondary">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-full bg-brand-orangeLight border border-brand-orange/20 flex items-center justify-center text-brand-orange">
              <Radio className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
            <span className="font-bold text-brand-dark">AirControl</span>
            <span className="text-brand-border">|</span>
            <span>ESP32 Air Mouse &amp; Gesture Controller</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px] text-text-secondary">
            <span>Universal BLE HID</span>
            <span className="text-brand-lavender font-semibold">MPU6050 6-DoF</span>
            <span className="text-brand-orange font-bold">Demo Prototype</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
