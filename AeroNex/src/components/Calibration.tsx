import React, { useState } from 'react';
import { CalibrationState } from '../types';
import { 
  Compass, 
  RotateCcw, 
  CheckCircle2, 
  Play, 
  Info
} from 'lucide-react';

export const Calibration: React.FC = () => {
  const [state, setState] = useState<CalibrationState>({
    stage: 1,
    stageName: 'Initial Status Check',
    progressPercent: 0,
    offsets: {
      accelX: 0.042,
      accelY: -0.018,
      accelZ: -0.012,
      gyroX: 1.24,
      gyroY: -0.85,
      gyroZ: 0.32,
    },
    jitterRms: 0.012,
    isCalibrating: false,
    completed: false,
  });

  const startCalibrationWorkflow = () => {
    setState(prev => ({
      ...prev,
      stage: 1,
      stageName: 'Initial Status Check',
      progressPercent: 10,
      isCalibrating: true,
      completed: false,
    }));

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        stage: 2,
        stageName: 'Neutral Position & Resting Check',
        progressPercent: 30,
      }));
    }, 1500);

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        stage: 3,
        stageName: 'Sampling 500 Baseline Data Points',
        progressPercent: 60,
      }));
    }, 3500);

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        stage: 4,
        stageName: 'Stability & Drift Verification',
        progressPercent: 85,
      }));
    }, 5500);

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        stage: 5,
        stageName: 'Calibration Stored to Flash',
        progressPercent: 100,
        isCalibrating: false,
        completed: true,
        offsets: {
          accelX: 0.002,
          accelY: -0.001,
          accelZ: 0.000,
          gyroX: 0.08,
          gyroY: -0.04,
          gyroZ: 0.02,
        },
        jitterRms: 0.004,
      }));
    }, 7500);
  };

  const resetCalibration = () => {
    setState({
      stage: 1,
      stageName: 'Initial Status Check',
      progressPercent: 0,
      offsets: {
        accelX: 0.042,
        accelY: -0.018,
        accelZ: -0.012,
        gyroX: 1.24,
        gyroY: -0.85,
        gyroZ: 0.32,
      },
      jitterRms: 0.012,
      isCalibrating: false,
      completed: false,
    });
  };

  const stagesList = [
    { num: 1, title: 'Status Check', desc: 'Verify I2C bus address 0x68 and power rail ripple' },
    { num: 2, title: 'Neutral Position', desc: 'Hold controller flat on stationary table surface' },
    { num: 3, title: 'Baseline Capture', desc: 'Capture 500 inertial points at 100Hz' },
    { num: 4, title: 'Stability Check', desc: 'Calculate standard deviation and gyro drift rates' },
    { num: 5, title: 'Store Offsets', desc: 'Save zero-biases to simulated flash memory' },
  ];

  return (
    <div className="space-y-8 py-4 max-w-6xl mx-auto">
      {/* Notice Banner */}
      <div className="bg-white border border-brand-border rounded-3xl p-5 sm:p-6 flex items-start gap-3.5 shadow-card">
        <div className="w-9 h-9 rounded-full bg-brand-orangeLight border border-brand-orange/20 flex items-center justify-center text-brand-orange flex-shrink-0 mt-0.5">
          <Info className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div className="text-xs text-text-secondary leading-relaxed">
          <strong className="text-brand-dark font-bold">Simulated Routine Notice: </strong>
          This multi-stage calibration sequence demonstrates the exact routine executed on the ESP32 firmware 
          to cancel zero-rate drift and accelerometer fabrication bias. In this browser prototype, simulated offsets are computed and demonstrated.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Stepper & Execution Panel */}
        <div className="lg:col-span-8 bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-brand-border">
            <div>
              <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                <Compass className="w-5 h-5 text-brand-lavender" />
                6-DoF Sensor Calibration Routine
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Calculates zero-g offset and zero-rate bias to prevent cursor drifting.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={state.isCalibrating}
                onClick={startCalibrationWorkflow}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold transition ${
                  state.isCalibrating
                    ? 'bg-bg-soft text-text-secondary cursor-not-allowed border border-brand-border'
                    : 'bg-brand-orange hover:bg-brand-orangeHover text-white shadow-orangeGlow cursor-pointer'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{state.isCalibrating ? 'Calibrating...' : 'Start Calibration'}</span>
              </button>

              <button
                onClick={resetCalibration}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-brand-lavenderLight hover:text-brand-lavender border border-brand-border text-text-secondary rounded-full text-xs font-mono transition shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-brand-lavender" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-text-secondary font-medium">Progress: Stage {state.stage} of 5</span>
              <span className="text-brand-orange font-bold">{state.progressPercent}%</span>
            </div>
            <div className="w-full bg-bg-soft h-3 rounded-full overflow-hidden border border-brand-border">
              <div 
                className="bg-brand-orange h-full transition-all duration-500 ease-out"
                style={{ width: `${state.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Step Visualizer */}
          <div className="space-y-3">
            {stagesList.map((st) => {
              const isPast = state.stage > st.num || state.completed;
              const isCurrent = state.stage === st.num && !state.completed;

              return (
                <div
                  key={st.num}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-brand-orangeLight/40 border-brand-orange/40 shadow-sm'
                      : isPast
                      ? 'bg-white border-brand-border'
                      : 'bg-[#FAFBFD]/60 border-brand-border/40 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                        isCurrent
                          ? 'bg-brand-orange text-white shadow-sm'
                          : isPast
                          ? 'bg-status-success text-white'
                          : 'bg-bg-soft text-text-secondary border border-brand-border'
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : st.num}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-brand-dark flex items-center gap-2">
                        <span>{st.title}</span>
                        {isCurrent && (
                          <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-brand-orange text-white font-bold">
                            Sampling
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-text-secondary mt-0.5">{st.desc}</p>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-text-secondary">
                    {isPast && <span className="text-status-success font-bold">VERIFIED</span>}
                    {isCurrent && <span className="text-brand-orange font-bold animate-pulse">PROCESSING</span>}
                    {!isPast && !isCurrent && <span>PENDING</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Stage Instruction Box */}
          <div className="p-4 bg-[#FAFBFD] border border-brand-border rounded-2xl text-xs space-y-1.5">
            <div className="font-bold text-brand-orange font-mono text-[11px] uppercase">
              Operator Instructions for Step {state.stage}:
            </div>
            <p className="text-text-secondary">
              {state.stage === 1 && "Verifying register 0x75 (WHO_AM_I) and confirming low supply ripple."}
              {state.stage === 2 && "Keep the controller completely stationary on a flat, non-vibrating table surface."}
              {state.stage === 3 && "Sampling 500 records at 100Hz into ring buffer to calculate arithmetic means."}
              {state.stage === 4 && "Checking standard deviation against noise threshold (σ < 0.05 °/s)."}
              {state.stage === 5 && "Calibration successful! New biases are locked into simulated device memory."}
            </p>
          </div>
        </div>

        {/* Offsets & Telemetry Vector Panel */}
        <div className="lg:col-span-4 bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-card flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-brand-border">
              <h3 className="text-sm font-bold text-brand-dark">
                Calculated Offsets (Biases)
              </h3>
              <span className="text-xs font-mono text-brand-lavender bg-brand-lavenderLight px-2.5 py-0.5 rounded-full font-bold">
                6-DoF
              </span>
            </div>

            <div className="mt-5 space-y-4 font-mono text-xs">
              <div className="text-[11px] font-sans font-bold text-text-secondary uppercase">
                Accelerometer Biases (G)
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-[#FAFBFD] border border-brand-border rounded-xl text-center">
                  <div className="text-[10px] text-text-secondary">Offset X</div>
                  <div className="font-bold text-brand-dark mt-1">{state.offsets.accelX.toFixed(3)}</div>
                </div>
                <div className="p-3 bg-[#FAFBFD] border border-brand-border rounded-xl text-center">
                  <div className="text-[10px] text-text-secondary">Offset Y</div>
                  <div className="font-bold text-brand-dark mt-1">{state.offsets.accelY.toFixed(3)}</div>
                </div>
                <div className="p-3 bg-[#FAFBFD] border border-brand-border rounded-xl text-center">
                  <div className="text-[10px] text-text-secondary">Offset Z</div>
                  <div className="font-bold text-brand-dark mt-1">{state.offsets.accelZ.toFixed(3)}</div>
                </div>
              </div>

              <div className="text-[11px] font-sans font-bold text-text-secondary uppercase pt-2">
                Gyroscope Zero-Rates (°/s)
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-[#FAFBFD] border border-brand-border rounded-xl text-center">
                  <div className="text-[10px] text-text-secondary">Gyro X</div>
                  <div className="font-bold text-brand-orange mt-1">{state.offsets.gyroX.toFixed(2)}</div>
                </div>
                <div className="p-3 bg-[#FAFBFD] border border-brand-border rounded-xl text-center">
                  <div className="text-[10px] text-text-secondary">Gyro Y</div>
                  <div className="font-bold text-brand-lavender mt-1">{state.offsets.gyroY.toFixed(2)}</div>
                </div>
                <div className="p-3 bg-[#FAFBFD] border border-brand-border rounded-xl text-center">
                  <div className="text-[10px] text-text-secondary">Gyro Z</div>
                  <div className="font-bold text-brand-orange mt-1">{state.offsets.gyroZ.toFixed(2)}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-brand-border flex justify-between text-xs">
                <span className="text-text-secondary">Stationary Jitter (RMS):</span>
                <span className="text-status-success font-bold">{state.jitterRms.toFixed(4)} G</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#FAFBFD] rounded-2xl border border-brand-border text-[11px] text-text-secondary space-y-1">
            <span className="font-semibold text-brand-dark block">Hardware Persistence:</span>
            <span>Offset vectors are dynamically loaded at MCU boot to eliminate drift during relative HID mouse updates.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
