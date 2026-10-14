import React from 'react';
import { DeviceStatus } from '../types';
import { 
  Wifi, 
  WifiOff, 
  Cpu, 
  BatteryMedium, 
  BatteryCharging, 
  Radio,
  Usb,
  Unplug
} from 'lucide-react';

interface HeaderProps {
  deviceStatus: DeviceStatus;
  isLiveHardware: boolean;
  onToggleConnection: () => void;
  onConnectSerial: () => void;
  onDisconnectSerial: () => void;
  onNavigateOverview?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  deviceStatus, 
  isLiveHardware,
  onToggleConnection,
  onConnectSerial,
  onDisconnectSerial,
  onNavigateOverview 
}) => {
  return (
    <header className="w-full bg-[#16171B] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand logo & tagline */}
        <div 
          onClick={onNavigateOverview}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-brand-orange group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-extrabold tracking-tight text-white">
                AeroNex
              </span>
              <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-brand-lavenderLight border border-white/15">
                ESP32 + TinyML
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Air Mouse &amp; Gesture Studio
            </p>
          </div>
        </div>

        {/* Status Bar Indicators & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {/* Live USB Hardware Connect / Disconnect Button */}
          {isLiveHardware ? (
            <button
              onClick={onDisconnectSerial}
              title="Disconnect from physical ESP32"
              className="inline-flex items-center gap-1.5 bg-status-success/20 text-status-success border border-status-success/40 px-3 py-1.5 rounded-full font-mono text-[11px] font-semibold hover:bg-status-error/20 hover:text-status-error hover:border-status-error/40 transition cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-status-success animate-ping"></span>
              <Usb className="w-3.5 h-3.5" />
              <span>LIVE ESP32 (USB)</span>
              <Unplug className="w-3 h-3 ml-1 opacity-70" />
            </button>
          ) : (
            <button
              onClick={onConnectSerial}
              title="Connect directly to your ESP32 via Chrome/Edge Web Serial API"
              className="inline-flex items-center gap-1.5 bg-brand-orange/20 text-brand-orange border border-brand-orange/40 hover:bg-brand-orange/30 px-3 py-1.5 rounded-full font-mono text-[11px] font-semibold transition cursor-pointer"
            >
              <Usb className="w-3.5 h-3.5" />
              <span>CONNECT ESP32 (LIVE)</span>
            </button>
          )}

          {/* Mode Pill */}
          {!isLiveHardware && (
            <div className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 text-gray-300 border border-white/15 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange"></span>
              <span>SIMULATED DEMO</span>
            </div>
          )}

          {/* Battery Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full border border-white/10 font-mono text-gray-300 text-[11px]">
            {deviceStatus.batteryCharging ? (
              <BatteryCharging className="w-3.5 h-3.5 text-status-success animate-pulse" />
            ) : (
              <BatteryMedium className={`w-3.5 h-3.5 ${deviceStatus.batteryLevel > 20 ? 'text-brand-lavenderLight' : 'text-brand-orange'}`} />
            )}
            <span>{deviceStatus.batteryLevel}%</span>
          </div>

          {/* Sensor Health Pill */}
          <div className="hidden md:flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full border border-white/10 text-gray-300 text-[11px] font-mono">
            <Cpu className="w-3.5 h-3.5 text-brand-lavender" />
            <span>MPU:</span>
            <span className="text-status-success font-semibold uppercase">{deviceStatus.mpuStatus}</span>
          </div>

          {/* BLE Link State Button */}
          <button
            onClick={onToggleConnection}
            title="Click to toggle simulated BLE link status"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition ${
              deviceStatus.connected
                ? 'bg-status-success/15 border-status-success/40 text-status-success hover:bg-status-success/25'
                : 'bg-status-error/15 border-status-error/40 text-status-error hover:bg-status-error/25'
            }`}
          >
            {deviceStatus.connected ? (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px] hidden xs:inline">BLE: LINKED</span>
                <span className="font-mono text-[11px] xs:hidden">LINKED</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px] hidden xs:inline">BLE: OFFLINE</span>
                <span className="font-mono text-[11px] xs:hidden">OFFLINE</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
