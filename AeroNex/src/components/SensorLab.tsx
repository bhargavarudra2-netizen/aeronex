import React, { useState } from 'react';
import { TelemetryPoint } from '../types';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle
} from 'lucide-react';

interface SensorLabProps {
  telemetryHistory: TelemetryPoint[];
  currentPoint: TelemetryPoint | null;
  isRunning: boolean;
  onTogglePause: () => void;
  onClearData: () => void;
}

export const SensorLab: React.FC<SensorLabProps> = ({
  telemetryHistory,
  currentPoint,
  isRunning,
  onTogglePause,
  onClearData,
}) => {
  const [windowSize, setWindowSize] = useState<number>(50);
  const [activeTab, setActiveTab] = useState<'both' | 'accel' | 'gyro'>('both');

  const displayedData = telemetryHistory.slice(-windowSize);

  const calculateStats = (key: keyof TelemetryPoint) => {
    if (displayedData.length === 0) return { min: 0, max: 0, avg: 0 };
    const values = displayedData.map(d => Number(d[key]));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const sum = values.reduce((acc, v) => acc + v, 0);
    const avg = sum / values.length;
    return {
      min: Number(min.toFixed(2)),
      max: Number(max.toFixed(2)),
      avg: Number(avg.toFixed(2)),
    };
  };

  const accelXStats = calculateStats('accelX');
  const accelYStats = calculateStats('accelY');
  const accelZStats = calculateStats('accelZ');
  const gyroXStats = calculateStats('gyroX');
  const gyroYStats = calculateStats('gyroY');
  const gyroZStats = calculateStats('gyroZ');

  return (
    <div className="space-y-8 py-4 max-w-6xl mx-auto">
      {/* Explicit Required Banner */}
      <div className="bg-white border border-brand-border p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-brand-orangeLight border border-brand-orange/20 flex items-center justify-center text-brand-orange flex-shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wider text-brand-dark uppercase font-mono">
              DEMO MODE — SIMULATED SENSOR DATA
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Kinematic streams are synthesised by the local demo pipeline. No real I2C bus readings or physical MPU-6050 silicon are connected.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
          <button
            onClick={onTogglePause}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold transition border ${
              isRunning 
                ? 'bg-white border-brand-border text-brand-dark hover:bg-bg-soft shadow-sm'
                : 'bg-brand-orange text-white border-brand-orange shadow-orangeGlow'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 text-brand-orange" />
                <span>Pause Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Stream</span>
              </>
            )}
          </button>

          <button
            onClick={onClearData}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-mono bg-white hover:bg-brand-lavenderLight hover:text-brand-lavender border border-brand-border text-text-secondary transition shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-brand-lavender" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Aggregate Statistics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 font-mono">
        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-card">
          <div className="text-[11px] text-text-secondary">ACCEL X (G)</div>
          <div className="text-lg font-bold text-brand-dark mt-1">
            {currentPoint?.accelX.toFixed(2) ?? '0.00'}
          </div>
          <div className="text-[10px] text-text-secondary mt-1 flex justify-between">
            <span>Min: {accelXStats.min}</span>
            <span>Max: {accelXStats.max}</span>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-card">
          <div className="text-[11px] text-text-secondary">ACCEL Y (G)</div>
          <div className="text-lg font-bold text-brand-dark mt-1">
            {currentPoint?.accelY.toFixed(2) ?? '0.00'}
          </div>
          <div className="text-[10px] text-text-secondary mt-1 flex justify-between">
            <span>Min: {accelYStats.min}</span>
            <span>Max: {accelYStats.max}</span>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-card">
          <div className="text-[11px] text-text-secondary">ACCEL Z (G)</div>
          <div className="text-lg font-bold text-brand-dark mt-1">
            {currentPoint?.accelZ.toFixed(2) ?? '0.00'}
          </div>
          <div className="text-[10px] text-text-secondary mt-1 flex justify-between">
            <span>Min: {accelZStats.min}</span>
            <span>Max: {accelZStats.max}</span>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-card">
          <div className="text-[11px] text-text-secondary">GYRO X (°/s)</div>
          <div className="text-lg font-bold text-brand-orange mt-1">
            {currentPoint?.gyroX.toFixed(1) ?? '0.0'}
          </div>
          <div className="text-[10px] text-text-secondary mt-1 flex justify-between">
            <span>Avg: {gyroXStats.avg}</span>
            <span>Max: {gyroXStats.max}</span>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-card">
          <div className="text-[11px] text-text-secondary">GYRO Y (°/s)</div>
          <div className="text-lg font-bold text-brand-lavender mt-1">
            {currentPoint?.gyroY.toFixed(1) ?? '0.0'}
          </div>
          <div className="text-[10px] text-text-secondary mt-1 flex justify-between">
            <span>Avg: {gyroYStats.avg}</span>
            <span>Max: {gyroYStats.max}</span>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-card">
          <div className="text-[11px] text-text-secondary">GYRO Z (°/s)</div>
          <div className="text-lg font-bold text-brand-orange mt-1">
            {currentPoint?.gyroZ.toFixed(1) ?? '0.0'}
          </div>
          <div className="text-[10px] text-text-secondary mt-1 flex justify-between">
            <span>Avg: {gyroZStats.avg}</span>
            <span>Max: {gyroZStats.max}</span>
          </div>
        </div>
      </div>

      {/* Chart View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-brand-border shadow-card">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-brand-dark">Stream Selection:</span>
          <div className="flex rounded-full bg-bg-soft p-1 border border-brand-border">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                activeTab === 'both' ? 'bg-white text-brand-dark shadow-sm' : 'text-text-secondary hover:text-brand-dark'
              }`}
            >
              All 6-Axes
            </button>
            <button
              onClick={() => setActiveTab('accel')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                activeTab === 'accel' ? 'bg-white text-brand-orange shadow-sm' : 'text-text-secondary hover:text-brand-dark'
              }`}
            >
              Accelerometer (±2G)
            </button>
            <button
              onClick={() => setActiveTab('gyro')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                activeTab === 'gyro' ? 'bg-white text-brand-lavender shadow-sm' : 'text-text-secondary hover:text-brand-dark'
              }`}
            >
              Gyroscope (±250°/s)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-brand-dark">History Window:</span>
          <select
            value={windowSize}
            onChange={(e) => setWindowSize(Number(e.target.value))}
            className="bg-bg-soft border border-brand-border rounded-full px-4 py-1.5 text-xs font-mono text-brand-dark"
          >
            <option value={30}>30 points (~1.5s)</option>
            <option value={50}>50 points (~2.5s)</option>
            <option value={100}>100 points (~5.0s)</option>
          </select>
        </div>
      </div>

      {/* Primary Graphs via Recharts */}
      <div className="space-y-6">
        {/* Accelerometer Graph */}
        {(activeTab === 'both' || activeTab === 'accel') && (
          <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-brand-border">
              <div>
                <h3 className="text-base font-bold text-brand-dark">
                  3-Axis Accelerometer (G)
                </h3>
                <p className="text-xs text-text-secondary">Linear proper acceleration vector including gravitational reference vector.</p>
              </div>
              <div className="text-xs font-mono text-brand-orange bg-brand-orangeLight px-3 py-1 rounded-full font-bold">
                Mag: {currentPoint?.mag.toFixed(3) ?? '1.000'} G
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E3E4EB" />
                  <XAxis 
                    dataKey="timeLabel" 
                    stroke="#8F93A0" 
                    tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono' }} 
                  />
                  <YAxis 
                    domain={[-2, 2]} 
                    stroke="#8F93A0" 
                    tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono' }}
                    label={{ value: 'Acc (G)', angle: -90, position: 'insideLeft', fill: '#8F93A0', fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E3E4EB', borderRadius: '16px', fontSize: '11px', fontFamily: 'IBM Plex Mono', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'IBM Plex Mono' }} />
                  <Line type="monotone" dataKey="accelX" name="Accel X" stroke="#FF5722" dot={false} strokeWidth={2.2} isAnimationActive={false} />
                  <Line type="monotone" dataKey="accelY" name="Accel Y" stroke="#7667C2" dot={false} strokeWidth={2.2} isAnimationActive={false} />
                  <Line type="monotone" dataKey="accelZ" name="Accel Z" stroke="#10B981" dot={false} strokeWidth={2.2} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Gyroscope Graph */}
        {(activeTab === 'both' || activeTab === 'gyro') && (
          <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-brand-border">
              <div>
                <h3 className="text-base font-bold text-brand-dark">
                  3-Axis Gyroscope Angular Velocity (°/s)
                </h3>
                <p className="text-xs text-text-secondary">Angular rotation rates mapped directly to mouse delta cursor vectors.</p>
              </div>
              <div className="text-xs font-mono text-brand-lavender bg-brand-lavenderLight px-3 py-1 rounded-full font-bold">
                Yaw (Z): {currentPoint?.gyroZ.toFixed(1) ?? '0.0'} °/s
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E3E4EB" />
                  <XAxis 
                    dataKey="timeLabel" 
                    stroke="#8F93A0" 
                    tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono' }} 
                  />
                  <YAxis 
                    domain={[-150, 150]} 
                    stroke="#8F93A0" 
                    tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono' }}
                    label={{ value: 'Deg/Sec', angle: -90, position: 'insideLeft', fill: '#8F93A0', fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E3E4EB', borderRadius: '16px', fontSize: '11px', fontFamily: 'IBM Plex Mono', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'IBM Plex Mono' }} />
                  <Line type="monotone" dataKey="gyroX" name="Gyro X (Roll)" stroke="#F59E0B" dot={false} strokeWidth={2.2} isAnimationActive={false} />
                  <Line type="monotone" dataKey="gyroY" name="Gyro Y (Pitch)" stroke="#7667C2" dot={false} strokeWidth={2.2} isAnimationActive={false} />
                  <Line type="monotone" dataKey="gyroZ" name="Gyro Z (Yaw)" stroke="#FF5722" dot={false} strokeWidth={2.2} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
