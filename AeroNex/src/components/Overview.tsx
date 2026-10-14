import React from 'react';
import { DeviceStatus, DeviceSettings, GestureEvent } from '../types';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  MousePointer2, 
  HandMetal, 
  Activity, 
  Bluetooth, 
  Cpu, 
  CheckCircle2,
  ChevronRight,
  Shield,
  Layers,
  Compass,
  Play,
  RotateCcw,
  Sliders
} from 'lucide-react';

interface OverviewProps {
  deviceStatus: DeviceStatus;
  settings: DeviceSettings;
  recentGesture: GestureEvent | null;
  onNavigate: (tab: any) => void;
  onTriggerDemoGesture: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  deviceStatus,
  settings,
  recentGesture,
  onNavigate,
  onTriggerDemoGesture
}) => {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section inspired by reference SaaS header */}
      <section className="text-center relative max-w-4xl mx-auto space-y-6 pt-4 sm:pt-8">
        {/* Subtle pill tag badge with avatar/dot icon */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-border shadow-pill text-xs font-semibold text-text-primary">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping"></span>
          <span className="text-brand-orange font-bold font-mono">ESP32 + MPU6050</span>
          <span className="text-border-subtle">•</span>
          <span className="text-text-secondary">Spatial Kinematic Controller</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-dark leading-[1.12]">
          Your Hand's Movement in <br />
          <span className="relative inline-block">
            One Clever Hub
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-orange/40 pointer-events-none" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 15 Q 50 0 100 15" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          AirControl translates natural spatial hand gestures into ultra-precise wireless cursor movement and instant desktop media shortcuts.
        </p>

        {/* CTA Buttons with curved arrow note */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('air-mouse')}
            className="px-8 py-3.5 bg-brand-orange hover:bg-brand-orangeHover text-white font-bold text-sm rounded-full transition duration-150 shadow-orangeGlow flex items-center gap-2 group cursor-pointer"
          >
            <span>Explore Air Mouse</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('gesture-studio')}
            className="px-8 py-3.5 bg-white hover:bg-bg-soft text-brand-dark border border-brand-border font-semibold text-sm rounded-full transition shadow-card flex items-center gap-2 cursor-pointer"
          >
            <HandMetal className="w-4 h-4 text-brand-lavender" />
            <span>Explore Gestures</span>
          </button>

          <button
            onClick={onTriggerDemoGesture}
            className="px-5 py-3 bg-brand-orangeLight hover:bg-brand-orange/20 text-brand-orange font-mono text-xs font-bold rounded-full transition flex items-center gap-1.5 border border-brand-orange/30 cursor-pointer"
            title="Simulate Flick motion"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Flick</span>
          </button>
        </div>

        {/* Small social-proof style subtitle like reference */}
        <div className="text-xs text-text-muted font-mono flex items-center justify-center gap-2 pt-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
          <span>Universal Bluetooth Low Energy HID • Driverless Plug &amp; Play</span>
        </div>

        {/* Hero Interactive Media/Illustration Showcase Card */}
        <div className="pt-6">
          <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-floating max-w-3xl mx-auto relative overflow-hidden">
            {/* Visual Header bar of showcase card */}
            <div className="flex items-center justify-between pb-4 border-b border-brand-border/70 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-status-error/40 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-status-warning/40 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-status-success/40 inline-block"></span>
                <span className="font-mono text-text-secondary ml-2 font-medium">AirControl Hardware Companion</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lavenderLight text-brand-lavender font-mono font-bold text-[11px] border border-brand-lavenderBorder">
                <Sparkles className="w-3 h-3" />
                <span>6-DoF Inertial Fusion</span>
              </div>
            </div>

            {/* Inner Graphic Stage */}
            <div className="py-8 sm:py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Product Visual Illustration */}
              <div className="md:col-span-6 flex justify-center">
                <div className="w-48 h-72 bg-gradient-to-b from-white to-[#F8F9FD] rounded-3xl border-2 border-brand-border shadow-card flex flex-col items-center justify-between p-5 relative group hover:border-brand-orange/40 transition">
                  {/* Status Indicator Ring */}
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono text-text-secondary">ESP32</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-orange shadow-orangeGlow animate-pulse"></span>
                  </div>

                  {/* Ergonomic Directional Sensor Ring with Orange & Lavender Accents */}
                  <div className="w-28 h-28 rounded-full border-2 border-dashed border-brand-orange/30 flex items-center justify-center bg-brand-orangeLight/40 relative">
                    <div className="w-14 h-14 rounded-full bg-white border border-brand-border flex items-center justify-center shadow-sm">
                      <MousePointer2 className="w-6 h-6 text-brand-orange" />
                    </div>
                    {/* Ring micro-indicators */}
                    <span className="absolute top-1 text-[10px] font-mono font-bold text-brand-orange">▲</span>
                    <span className="absolute bottom-1 text-[10px] font-mono font-bold text-brand-orange">▼</span>
                    <span className="absolute left-1.5 text-[10px] font-mono font-bold text-brand-lavender">◀</span>
                    <span className="absolute right-1.5 text-[10px] font-mono font-bold text-brand-lavender">▶</span>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="w-full space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-5 bg-white rounded-lg border border-brand-border flex items-center justify-center text-[9px] font-mono font-bold text-text-secondary">
                        L-CLICK
                      </div>
                      <div className="h-5 bg-white rounded-lg border border-brand-border flex items-center justify-center text-[9px] font-mono font-bold text-text-secondary">
                        R-CLICK
                      </div>
                    </div>
                    <div className="h-2 w-14 mx-auto bg-brand-lavender/30 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Real-time Status Floating Cards */}
              <div className="md:col-span-6 space-y-3.5 text-left">
                <div className="bg-[#FAFBFD] border border-brand-border rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-dark flex items-center gap-1.5">
                      <MousePointer2 className="w-4 h-4 text-brand-orange" />
                      Dynamic Cursor Engine
                    </span>
                    <span className="text-[11px] font-mono text-status-success font-semibold">Active</span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Sensitivity at <strong className="text-brand-orange">{settings.cursorSensitivity}%</strong> with <strong className="text-brand-lavender">{Math.round(settings.smoothingFactor * 100)}% EMA Smoothing</strong>.
                  </p>
                </div>

                <div className="bg-[#FAFBFD] border border-brand-border rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-dark flex items-center gap-1.5">
                      <Bluetooth className="w-4 h-4 text-brand-lavender" />
                      Wireless Bluetooth HID
                    </span>
                    <span className="text-[11px] font-mono text-brand-orange font-semibold">GATT 0x1812</span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Standard Human Interface Device reports broadcasted directly to host computer.
                  </p>
                </div>

                <div className="bg-[#FAFBFD] border border-brand-border rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-dark flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-brand-orange" />
                      MPU6050 Accelerometer / Gyro
                    </span>
                    <span className="text-[11px] font-mono text-status-success font-semibold">100 Hz</span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Internal Digital Low-Pass Filter (DLPF 44Hz) suppressing hand motor noise.
                  </p>
                </div>
              </div>
            </div>

            {/* Showcase Footnote */}
            <div className="pt-4 border-t border-brand-border/70 flex flex-wrap items-center justify-between text-xs font-mono text-text-secondary gap-2">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-success"></span>
                <span>Controller Battery: <strong>{deviceStatus.batteryLevel}%</strong></span>
              </span>
              <span className="text-brand-lavender font-bold">Simulated Demonstration Environment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities - 4 Round Feature Cards from Reference */}
      <section className="space-y-6 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-brand-border text-xs font-mono text-text-secondary shadow-pill">
            <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
            <span>Intelligent Hardware Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
            Unlock Natural Control with Smart Solutions
          </h2>
          <p className="text-sm text-text-secondary max-w-xl mx-auto">
            Everything you need to deliver fluid spatial cursor interactions and intuitive presentation shortcuts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Feature 1 */}
          <div 
            onClick={() => onNavigate('air-mouse')}
            className="bg-white border border-brand-border rounded-3xl p-6 shadow-card hover:shadow-cardHover hover:border-brand-orange/40 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-orangeLight border border-brand-orange/20 flex items-center justify-center text-brand-orange group-hover:scale-105 transition-transform">
                <MousePointer2 className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-brand-dark group-hover:text-brand-orange transition-colors">
                Air Mouse
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Smooth 2D cursor navigation mapped directly from spatial angular rate with adjustable smoothing and dead-zone filtering.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-brand-border flex items-center justify-between text-xs font-bold text-brand-orange">
              <span>Launch Canvas</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 2 */}
          <div 
            onClick={() => onNavigate('gesture-studio')}
            className="bg-white border border-brand-border rounded-3xl p-6 shadow-card hover:shadow-cardHover hover:border-brand-lavender/40 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-lavenderLight border border-brand-lavenderBorder flex items-center justify-center text-brand-lavender group-hover:scale-105 transition-transform">
                <HandMetal className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-brand-dark group-hover:text-brand-lavender transition-colors">
                Gesture Studio
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Configure lateral flick patterns, double taps, and tilt angles mapped to slideshow next/prev and media controls.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-brand-border flex items-center justify-between text-xs font-bold text-brand-lavender">
              <span>Customize Rules</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 3 */}
          <div 
            onClick={() => onNavigate('sensor-lab')}
            className="bg-white border border-brand-border rounded-3xl p-6 shadow-card hover:shadow-cardHover hover:border-brand-orange/40 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-orangeLight border border-brand-orange/20 flex items-center justify-center text-brand-orange group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-brand-dark group-hover:text-brand-orange transition-colors">
                Sensor Lab
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Real-time 6-axis accelerometer and gyroscope charts with live aggregate stats and magnitude calculations.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-brand-border flex items-center justify-between text-xs font-bold text-brand-orange">
              <span>Inspect Telemetry</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 4 */}
          <div 
            onClick={() => onNavigate('calibration')}
            className="bg-white border border-brand-border rounded-3xl p-6 shadow-card hover:shadow-cardHover hover:border-brand-lavender/40 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-lavenderLight border border-brand-lavenderBorder flex items-center justify-center text-brand-lavender group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-brand-dark group-hover:text-brand-lavender transition-colors">
                Calibration
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Multi-stage guided routine to eliminate stationary gyro drift and calculate accelerometer fabrication offsets.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-brand-border flex items-center justify-between text-xs font-bold text-brand-lavender">
              <span>Zero Drift Routine</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Visual Workflow Section - "Getting Started Steps" layout from reference */}
      <section className="bg-white border border-brand-border rounded-3xl p-8 sm:p-12 shadow-card max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lavenderLight border border-brand-lavenderBorder text-xs font-mono text-brand-lavender font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>End-to-End Motion Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
            How AirControl Converts Motion to Action
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto">
            From physical hand movement to native computer operating system events in under 10 milliseconds.
          </p>
        </div>

        {/* 5 Connected Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-[#FAFBFD] border border-brand-border rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-orange uppercase bg-brand-orangeLight px-2 py-0.5 rounded-full inline-block mb-3">
                Step 01
              </span>
              <h4 className="font-bold text-brand-dark text-sm">Hand Movement</h4>
              <p className="text-xs text-text-secondary mt-1">Spatial wrist tilting, air pointing, or lateral gesture flick.</p>
            </div>
            <div className="mt-4 pt-2 border-t border-brand-border text-[10px] font-mono text-text-muted">
              Kinetic Input
            </div>
          </div>

          <div className="bg-[#FAFBFD] border border-brand-border rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-lavender uppercase bg-brand-lavenderLight px-2 py-0.5 rounded-full inline-block mb-3">
                Step 02
              </span>
              <h4 className="font-bold text-brand-dark text-sm">MPU6050 IMU</h4>
              <p className="text-xs text-text-secondary mt-1">Measures 3-axis accel and 3-axis angular rates via I2C at 400kHz.</p>
            </div>
            <div className="mt-4 pt-2 border-t border-brand-border text-[10px] font-mono text-text-muted">
              I2C Bus Sample
            </div>
          </div>

          <div className="bg-[#FAFBFD] border border-brand-border rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-orange uppercase bg-brand-orangeLight px-2 py-0.5 rounded-full inline-block mb-3">
                Step 03
              </span>
              <h4 className="font-bold text-brand-dark text-sm">ESP32 MCU</h4>
              <p className="text-xs text-text-secondary mt-1">Applies dead-zones, low-pass EMA filters, and classifies flick motions.</p>
            </div>
            <div className="mt-4 pt-2 border-t border-brand-border text-[10px] font-mono text-text-muted">
              DSP Filtering
            </div>
          </div>

          <div className="bg-[#FAFBFD] border border-brand-border rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-lavender uppercase bg-brand-lavenderLight px-2 py-0.5 rounded-full inline-block mb-3">
                Step 04
              </span>
              <h4 className="font-bold text-brand-dark text-sm">Bluetooth HID</h4>
              <p className="text-xs text-text-secondary mt-1">Encodes standard relative mouse delta reports and consumer keycodes.</p>
            </div>
            <div className="mt-4 pt-2 border-t border-brand-border text-[10px] font-mono text-text-muted">
              GATT 0x1812
            </div>
          </div>

          <div className="bg-[#FAFBFD] border border-brand-border rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-orange uppercase bg-brand-orangeLight px-2 py-0.5 rounded-full inline-block mb-3">
                Step 05
              </span>
              <h4 className="font-bold text-brand-dark text-sm">Host Computer</h4>
              <p className="text-xs text-text-secondary mt-1">Desktop cursor moves smoothly and presentations advance instantly.</p>
            </div>
            <div className="mt-4 pt-2 border-t border-brand-border text-[10px] font-mono text-text-muted">
              Driverless Execution
            </div>
          </div>
        </div>

        {/* Workflow Summary Pill */}
        <div className="p-3.5 bg-[#FAFBFD] rounded-2xl border border-brand-border flex flex-wrap items-center justify-between text-xs font-mono text-text-secondary gap-2">
          <span className="font-semibold text-brand-dark">
            Workflow: Hand Movement → MPU6050 → ESP32 → Bluetooth HID → Computer
          </span>
          <span className="text-brand-orange font-bold">Simulated Data Architecture</span>
        </div>
      </section>

      {/* Recent Gesture & Quick Status Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Recent Gesture Activity */}
        <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="font-bold text-brand-dark text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-orange" />
                Recent Gesture Activity
              </h3>
              <span className="text-xs font-mono text-text-secondary">Real-Time Monitor</span>
            </div>

            <div className="mt-4">
              {recentGesture ? (
                <div className="bg-[#FAFBFD] border border-brand-border rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-brand-dark font-bold text-sm">
                      {recentGesture.gestureName}
                    </span>
                    <span className="text-[11px] font-mono text-text-secondary">
                      {recentGesture.timeStr}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-text-secondary">Action Dispatched:</span>
                    <span className="text-brand-orange font-bold bg-brand-orangeLight px-2 py-0.5 rounded-full border border-brand-orange/20">
                      {recentGesture.triggeredAction}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-text-secondary">Match Confidence:</span>
                    <span className="text-status-success font-bold">{(recentGesture.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#FAFBFD] border border-brand-border rounded-2xl p-8 text-center text-xs font-mono text-text-secondary">
                  No gestures logged yet. Click "Simulate Flick" to trigger a demonstration event.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('gesture-studio')}
            className="w-full py-2.5 bg-[#FAFBFD] hover:bg-brand-lavenderLight hover:text-brand-lavender text-text-secondary border border-brand-border rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>Open Gesture Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Launch & Hardware Status */}
        <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="font-bold text-brand-dark text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-lavender" />
                Controller Telemetry Overview
              </h3>
              <span className="text-xs font-mono text-brand-lavender bg-brand-lavenderLight px-2 py-0.5 rounded-full font-bold">
                Simulated
              </span>
            </div>

            <div className="mt-4 space-y-2.5 font-mono text-xs">
              <div className="p-3 bg-[#FAFBFD] rounded-2xl border border-brand-border flex justify-between items-center">
                <span className="text-text-secondary">Connection Link:</span>
                <span className={deviceStatus.connected ? "text-status-success font-bold" : "text-status-error font-bold"}>
                  {deviceStatus.connected ? "BLE HID Active" : "Disconnected"}
                </span>
              </div>
              <div className="p-3 bg-[#FAFBFD] rounded-2xl border border-brand-border flex justify-between items-center">
                <span className="text-text-secondary">LiPo Battery:</span>
                <span className="font-bold text-brand-dark">{deviceStatus.batteryLevel}%</span>
              </div>
              <div className="p-3 bg-[#FAFBFD] rounded-2xl border border-brand-border flex justify-between items-center">
                <span className="text-text-secondary">Cursor Sensitivity:</span>
                <span className="font-bold text-brand-orange">{settings.cursorSensitivity}%</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('air-mouse')}
            className="w-full py-2.5 bg-[#FAFBFD] hover:bg-brand-orangeLight hover:text-brand-orange text-text-secondary border border-brand-border rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>Launch Air Mouse Canvas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
