import React, { useState, useRef } from 'react';
import { DeviceSettings, TelemetryPoint } from '../types';
import { 
  MousePointer, 
  RotateCcw, 
  Sliders, 
  Info, 
  Power, 
  Eye, 
  EyeOff, 
  Move,
  Activity
} from 'lucide-react';

interface AirMouseProps {
  settings: DeviceSettings;
  onUpdateSettings: (newSettings: Partial<DeviceSettings>) => void;
  telemetry: TelemetryPoint | null;
}

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
}

export const AirMouse: React.FC<AirMouseProps> = ({
  settings,
  onUpdateSettings,
  telemetry
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 }); // percentage
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(true);
  const [showTrail, setShowTrail] = useState(true);
  const [lastClickState, setLastClickState] = useState<'none' | 'left' | 'right'>('none');
  const [movementState, setMovementState] = useState<'idle' | 'tracking' | 'deadzone'>('idle');

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isTrackingEnabled || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;

    const dx = rawX - cursorPos.x;
    const dy = rawY - cursorPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < settings.deadZoneRadius * 0.15) {
      setMovementState('deadzone');
      return;
    }

    setMovementState('tracking');

    const smooth = settings.smoothingFactor;
    const targetX = settings.invertedX ? 100 - rawX : rawX;
    const targetY = settings.invertedY ? 100 - rawY : rawY;

    const newX = cursorPos.x * smooth + targetX * (1 - smooth);
    const newY = cursorPos.y * smooth + targetY * (1 - smooth);

    const clampedX = Math.max(2, Math.min(98, newX));
    const clampedY = Math.max(2, Math.min(98, newY));

    setCursorPos({ x: clampedX, y: clampedY });

    if (showTrail) {
      setTrail(prev => [
        { x: clampedX, y: clampedY, opacity: 1 },
        ...prev.slice(0, 18).map(p => ({ ...p, opacity: p.opacity * 0.82 }))
      ]);
    }
  };

  const resetCursor = () => {
    setCursorPos({ x: 50, y: 50 });
    setTrail([]);
    setMovementState('idle');
  };

  const handlePadClick = (type: 'left' | 'right') => {
    setLastClickState(type);
    setTimeout(() => setLastClickState('none'), 300);
  };

  return (
    <div className="space-y-8 py-4 max-w-6xl mx-auto">
      {/* Notice Banner */}
      <div className="bg-white border border-brand-border rounded-3xl p-5 sm:p-6 flex items-start gap-3.5 shadow-card">
        <div className="w-9 h-9 rounded-full bg-brand-orangeLight border border-brand-orange/20 flex items-center justify-center text-brand-orange flex-shrink-0 mt-0.5">
          <Info className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div className="text-xs text-text-secondary leading-relaxed">
          <strong className="text-brand-dark font-bold">Browser Sandbox Notice: </strong>
          For operating system security, standard web browsers cannot grant raw control of your physical OS cursor. 
          This interactive motion canvas provides an accurate simulation of how the ESP32’s MPU6050 angular velocity data is converted into pointer vectors, smoothed, and bounded.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Interactive 2D Motion Pad */}
        <div className="lg:col-span-8 bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-card space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-brand-border">
            <div>
              <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                <Move className="w-5 h-5 text-brand-orange" />
                Air Motion Canvas
              </h2>
              <p className="text-xs text-text-secondary">
                Move pointer inside canvas to simulate 6-DoF spatial pointer input.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTrackingEnabled(!isTrackingEnabled)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border transition ${
                  isTrackingEnabled
                    ? 'bg-status-success/10 border-status-success/30 text-status-success'
                    : 'bg-bg-soft border-brand-border text-text-secondary'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                {isTrackingEnabled ? 'TRACKING: ON' : 'TRACKING: OFF'}
              </button>

              <button
                onClick={() => setShowTrail(!showTrail)}
                className="p-2 bg-bg-soft hover:bg-border-subtle rounded-full border border-brand-border text-text-secondary text-xs transition"
                title="Toggle movement trail"
              >
                {showTrail ? <Eye className="w-4 h-4 text-brand-orange" /> : <EyeOff className="w-4 h-4" />}
              </button>

              <button
                onClick={resetCursor}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-bg-soft hover:bg-brand-lavenderLight hover:text-brand-lavender rounded-full border border-brand-border text-brand-dark text-xs font-mono transition"
                title="Reset cursor to center"
              >
                <RotateCcw className="w-3.5 h-3.5 text-brand-lavender" />
                <span>Recenter</span>
              </button>
            </div>
          </div>

          {/* Virtual Surface Pad */}
          <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setMovementState('idle')}
            className={`w-full h-80 sm:h-96 bg-[#FAFBFD] rounded-3xl border border-brand-border relative overflow-hidden select-none touch-none cursor-crosshair group ${
              !isTrackingEnabled ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {/* Visual subtle grid */}
            <div className="absolute inset-0 bg-subtle-grid opacity-70 pointer-events-none" />

            {/* Crosshair Center Reference */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-brand-border pointer-events-none" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-brand-border pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-dashed border-brand-lavender/40 pointer-events-none" />

            {/* Movement Trails */}
            {showTrail && trail.map((pt, idx) => (
              <div
                key={idx}
                className="absolute w-2.5 h-2.5 rounded-full bg-brand-orange pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${pt.x}%`,
                  top: `${pt.y}%`,
                  opacity: pt.opacity * 0.6,
                  transform: `scale(${0.4 + pt.opacity * 0.6})`,
                }}
              />
            ))}

            {/* Simulated Cursor Pointer */}
            <div
              className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75"
              style={{
                left: `${cursorPos.x}%`,
                top: `${cursorPos.y}%`,
              }}
            >
              <div className="relative">
                <MousePointer className="w-5 h-5 text-brand-orange drop-shadow -rotate-12 fill-white" />
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-brand-orange animate-ping" />
              </div>
            </div>

            {/* Telemetry Overlay HUD */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-brand-border text-[11px] font-mono text-text-secondary space-x-3 pointer-events-none shadow-sm">
              <span>X: <strong className="text-brand-dark">{cursorPos.x.toFixed(1)}%</strong></span>
              <span>Y: <strong className="text-brand-dark">{cursorPos.y.toFixed(1)}%</strong></span>
              <span>STATE: <strong className="uppercase text-brand-orange">{movementState}</strong></span>
            </div>

            {/* Click Tester Overlay Buttons */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={() => handlePadClick('left')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border transition ${
                  lastClickState === 'left'
                    ? 'bg-brand-orange text-white border-brand-orange shadow-sm'
                    : 'bg-white text-text-secondary border-brand-border hover:text-brand-dark shadow-sm'
                }`}
              >
                Left Click
              </button>
              <button
                onClick={() => handlePadClick('right')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border transition ${
                  lastClickState === 'right'
                    ? 'bg-brand-orange text-white border-brand-orange shadow-sm'
                    : 'bg-white text-text-secondary border-brand-border hover:text-brand-dark shadow-sm'
                }`}
              >
                Right Click
              </button>
            </div>
          </div>
        </div>

        {/* Kinematic & Filtering Controls Panel */}
        <div className="lg:col-span-4 bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="pb-3 border-b border-brand-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-brand-dark flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-lavender" />
                Kinematic Calibration
              </h3>
              <span className="text-xs font-mono text-brand-lavender bg-brand-lavenderLight px-2.5 py-0.5 rounded-full font-bold">
                DSP Filters
              </span>
            </div>

            {/* Sensitivity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <label htmlFor="airmouse-pointer-sens-slider" className="text-text-secondary">Cursor Sensitivity</label>
                <span className="text-brand-orange font-bold">{settings.cursorSensitivity}%</span>
              </div>
              <input
                id="airmouse-pointer-sens-slider"
                type="range"
                min="10"
                max="100"
                value={settings.cursorSensitivity}
                onChange={(e) => onUpdateSettings({ cursorSensitivity: Number(e.target.value) })}
                className="w-full accent-brand-orange bg-bg-soft h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-text-secondary">Scales degrees/sec of gyro rotation to HID pixels.</p>
            </div>

            {/* Smoothing Factor */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <label htmlFor="airmouse-smooth-factor-slider" className="text-text-secondary">Smoothing Filter (EMA)</label>
                <span className="text-brand-lavender font-bold">{(settings.smoothingFactor * 100).toFixed(0)}%</span>
              </div>
              <input
                id="airmouse-smooth-factor-slider"
                type="range"
                min="0"
                max="90"
                value={Math.round(settings.smoothingFactor * 100)}
                onChange={(e) => onUpdateSettings({ smoothingFactor: Number(e.target.value) / 100 })}
                className="w-full accent-brand-lavender bg-bg-soft h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-text-secondary">Exponential moving average dampening for hand tremor.</p>
            </div>

            {/* Deadzone Radius */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <label htmlFor="airmouse-deadzone-threshold-slider" className="text-text-secondary">Dead-Zone Threshold</label>
                <span className="text-brand-orange font-bold">±{settings.deadZoneRadius} dps</span>
              </div>
              <input
                id="airmouse-deadzone-threshold-slider"
                type="range"
                min="0"
                max="25"
                value={settings.deadZoneRadius}
                onChange={(e) => onUpdateSettings({ deadZoneRadius: Number(e.target.value) })}
                className="w-full accent-brand-orange bg-bg-soft h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-text-secondary">Suppresses involuntary micro-drift when holding still.</p>
            </div>

            {/* Inversion Toggles */}
            <div className="pt-2 border-t border-brand-border space-y-2.5">
              <div className="text-xs font-semibold text-brand-dark uppercase font-mono">Axis Configuration</div>
              
              <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                <span className="text-text-secondary">Invert Horizontal (Yaw / X-Axis)</span>
                <input
                  type="checkbox"
                  checked={settings.invertedX}
                  onChange={(e) => onUpdateSettings({ invertedX: e.target.checked })}
                  className="rounded border-brand-border bg-bg-soft accent-brand-orange w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                <span className="text-text-secondary">Invert Vertical (Pitch / Y-Axis)</span>
                <input
                  type="checkbox"
                  checked={settings.invertedY}
                  onChange={(e) => onUpdateSettings({ invertedY: e.target.checked })}
                  className="rounded border-brand-border bg-bg-soft accent-brand-orange w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Realtime Telemetry Hook */}
          <div className="p-4 bg-[#FAFBFD] border border-brand-border rounded-2xl text-xs font-mono space-y-1.5 text-text-secondary">
            <div className="text-[11px] text-brand-dark font-bold flex items-center justify-between">
              <span>IMU KINEMATICS STREAM</span>
              <Activity className="w-3.5 h-3.5 text-brand-orange" />
            </div>
            <div className="flex justify-between">
              <span>Raw Gyro Z (Yaw):</span>
              <span className="text-brand-dark font-bold">{telemetry?.gyroZ.toFixed(2) ?? '0.00'} °/s</span>
            </div>
            <div className="flex justify-between">
              <span>Raw Gyro Y (Pitch):</span>
              <span className="text-brand-dark font-bold">{telemetry?.gyroY.toFixed(2) ?? '0.00'} °/s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
