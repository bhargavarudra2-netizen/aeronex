export type PageTab = 
  | 'overview' 
  | 'air-mouse' 
  | 'gesture-studio' 
  | 'sensor-lab' 
  | 'calibration' 
  | 'device-settings' 
  | 'diagnostics';

export interface TelemetryPoint {
  timestamp: number;
  timeLabel: string;
  accelX: number;
  accelY: number;
  accelZ: number;
  gyroX: number;
  gyroY: number;
  gyroZ: number;
  mag: number;
}

export interface DeviceStatus {
  connected: boolean;
  deviceName: string;
  firmwareVersion: string;
  bleAddress: string;
  batteryLevel: number;
  batteryCharging: boolean;
  rssi: number;
  mpuStatus: 'operational' | 'degraded' | 'error';
  sampleRateHz: number;
  lastHeartbeat: number;
}

export interface GestureMapping {
  id: string;
  name: string;
  triggerType: 'left-flick' | 'right-flick' | 'up-flick' | 'down-flick' | 'double-flick' | 'circle-cw' | 'circle-ccw' | 'shake' | 'tilt-hold';
  action: string;
  enabled: boolean;
  thresholdG: number;
  cooldownMs: number;
  description: string;
}

export interface GestureEvent {
  id: string;
  timestamp: number;
  timeStr: string;
  gestureName: string;
  confidence: number;
  triggeredAction: string;
}

export interface CalibrationState {
  stage: 1 | 2 | 3 | 4 | 5;
  stageName: string;
  progressPercent: number;
  offsets: {
    accelX: number;
    accelY: number;
    accelZ: number;
    gyroX: number;
    gyroY: number;
    gyroZ: number;
  };
  jitterRms: number;
  isCalibrating: boolean;
  completed: boolean;
}

export interface DiagnosticLog {
  id: string;
  timestamp: number;
  timeStr: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: 'BLE' | 'MPU6050' | 'HID' | 'CALIBRATION' | 'SYSTEM';
  message: string;
  details?: Record<string, any>;
  isSimulated: boolean;
}

export interface DeviceSettings {
  cursorSensitivity: number; // 1 - 100
  smoothingFactor: number;   // 0.0 - 0.95
  deadZoneRadius: number;    // 0 - 25
  invertedX: boolean;
  invertedY: boolean;
  scrollModeEnabled: boolean;
  scrollSensitivity: number;
  bleTxPower: 'low' | 'medium' | 'high';
  autoSleepMinutes: number;
  hapticFeedback: boolean;
  ledIndicators: boolean;
  pollRateHz: 50 | 100 | 200;
}
