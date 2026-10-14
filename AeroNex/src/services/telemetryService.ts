import { TelemetryPoint, DeviceStatus, DiagnosticLog, GestureEvent } from '../types';

export type TelemetryListener = (data: TelemetryPoint) => void;
export type DeviceStatusListener = (status: DeviceStatus) => void;
export type LogListener = (log: DiagnosticLog) => void;
export type GestureListener = (event: GestureEvent) => void;
export type LiveHardwareListener = (isLive: boolean) => void;

class DemoTelemetryService {
  private isRunning: boolean = true;
  private intervalId: number | null = null;
  private sampleRateHz: number = 20; // 20 updates per second for smooth rendering
  private telemetryListeners: Set<TelemetryListener> = new Set();
  private statusListeners: Set<DeviceStatusListener> = new Set();
  private logListeners: Set<LogListener> = new Set();
  private gestureListeners: Set<GestureListener> = new Set();
  private liveListeners: Set<LiveHardwareListener> = new Set();

  private logsHistory: DiagnosticLog[] = [];
  private recentPoints: TelemetryPoint[] = [];
  private maxHistory: number = 200;

  // Web Serial port & reader handles
  private serialPort: any = null;
  private serialReader: any = null;
  private isLiveHardware: boolean = false;

  // Internal simulated physics state
  private timeStep: number = 0;
  private handJitterBase: number = 0.08;
  private gyroJitterBase: number = 3.5;
  private pitchBias: number = 0.04;
  private rollBias: number = -0.02;

  // Active gesture injection
  private gestureActiveCountdown: number = 0;
  private activeGestureType: string | null = null;

  private currentStatus: DeviceStatus = {
    connected: true,
    deviceName: "AeroNex-ESP32-M1",
    firmwareVersion: "v1.4.2",
    bleAddress: "C4:4F:33:8A:1E:F0",
    batteryLevel: 92,
    batteryCharging: false,
    rssi: -58,
    mpuStatus: 'operational',
    sampleRateHz: 100,
    lastHeartbeat: Date.now()
  };

  constructor() {
    this.initDefaultLogs();
    this.start();
  }

  public start() {
    if (this.intervalId) return;
    this.isRunning = true;
    this.intervalId = window.setInterval(() => {
      this.tick();
    }, 1000 / this.sampleRateHz);
  }

  public pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  public resume() {
    if (!this.isRunning && !this.isLiveHardware) {
      this.start();
    }
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getIsLiveHardware(): boolean {
    return this.isLiveHardware;
  }

  public getStatus(): DeviceStatus {
    return { ...this.currentStatus };
  }

  public getRecentLogs(): DiagnosticLog[] {
    return [...this.logsHistory];
  }

  public clearLogs() {
    this.logsHistory = [];
  }

  public addLog(log: Omit<DiagnosticLog, 'id' | 'timestamp' | 'timeStr'>) {
    const now = Date.now();
    const d = new Date(now);
    const timeStr = d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
    
    const newLog: DiagnosticLog = {
      ...log,
      id: 'log-' + now + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: now,
      timeStr,
    };

    this.logsHistory.unshift(newLog);
    if (this.logsHistory.length > 500) {
      this.logsHistory.pop();
    }

    this.logListeners.forEach(listener => listener(newLog));
  }

  public subscribeTelemetry(listener: TelemetryListener): () => void {
    this.telemetryListeners.add(listener);
    return () => this.telemetryListeners.delete(listener);
  }

  public subscribeStatus(listener: DeviceStatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.currentStatus);
    return () => this.statusListeners.delete(listener);
  }

  public subscribeLogs(listener: LogListener): () => void {
    this.logListeners.add(listener);
    return () => this.logListeners.delete(listener);
  }

  public subscribeGesture(listener: GestureListener): () => void {
    this.gestureListeners.add(listener);
    return () => this.gestureListeners.delete(listener);
  }

  public subscribeLiveHardware(listener: LiveHardwareListener): () => void {
    this.liveListeners.add(listener);
    listener(this.isLiveHardware);
    return () => this.liveListeners.delete(listener);
  }

  /**
   * Connect to physical ESP32 via Chrome/Edge Web Serial API
   */
  public async connectWebSerial(): Promise<boolean> {
    if (!('serial' in navigator)) {
      alert('Web Serial is supported in Google Chrome, Microsoft Edge, and Opera. Please open this app in Chrome or Edge to connect with your ESP32 over USB.');
      return false;
    }

    try {
      this.serialPort = await (navigator as any).serial.requestPort();
      await this.serialPort.open({ baudRate: 115200 });

      this.isLiveHardware = true;
      this.pause(); // stop simulated physics ticks

      this.currentStatus.connected = true;
      this.currentStatus.deviceName = "ESP32 (Live USB Serial)";
      this.currentStatus.mpuStatus = 'operational';
      this.statusListeners.forEach(l => l({ ...this.currentStatus }));
      this.liveListeners.forEach(l => l(true));

      this.addLog({
        level: 'info',
        category: 'SYSTEM',
        message: 'Successfully connected to physical ESP32 via Web Serial @ 115200 baud.',
        isSimulated: false,
      });

      this.readSerialLoop();
      return true;
    } catch (err: any) {
      console.warn('Web Serial connection canceled or failed:', err);
      if (err.name !== 'NotFoundError') {
        this.addLog({
          level: 'error',
          category: 'SYSTEM',
          message: `Serial connection error: ${err?.message || err}`,
          isSimulated: false,
        });
      }
      return false;
    }
  }

  public async disconnectWebSerial(): Promise<void> {
    this.isLiveHardware = false;

    if (this.serialReader) {
      try {
        await this.serialReader.cancel();
      } catch {}
      this.serialReader = null;
    }

    if (this.serialPort) {
      try {
        await this.serialPort.close();
      } catch {}
      this.serialPort = null;
    }

    this.currentStatus.deviceName = "AeroNex-ESP32-M1";
    this.liveListeners.forEach(l => l(false));
    this.statusListeners.forEach(l => l({ ...this.currentStatus }));

    this.addLog({
      level: 'warn',
      category: 'SYSTEM',
      message: 'Disconnected from Live ESP32. Resumed Demo Simulation Mode.',
      isSimulated: false,
    });

    this.resume();
  }

  private async readSerialLoop() {
    let lineBuffer = '';

    try {
      while (this.isLiveHardware && this.serialPort && this.serialPort.readable) {
        const textDecoder = new TextDecoderStream();
        this.serialPort.readable.pipeTo(textDecoder.writable);
        this.serialReader = textDecoder.readable.getReader();

        while (this.isLiveHardware) {
          const { value, done } = await this.serialReader.read();
          if (done) break;
          if (value) {
            lineBuffer += value;
            const lines = lineBuffer.split('\n');
            lineBuffer = lines.pop() || '';

            for (const line of lines) {
              this.handleSerialLine(line.trim());
            }
          }
        }
      }
    } catch (err: any) {
      if (this.isLiveHardware) {
        console.warn('Serial stream stopped:', err);
      }
    } finally {
      if (this.isLiveHardware) {
        this.disconnectWebSerial();
      }
    }
  }

  private handleSerialLine(raw: string) {
    if (!raw) return;

    // Check if JSON packet
    if (raw.startsWith('{') && raw.endsWith('}')) {
      try {
        const parsed = JSON.parse(raw);
        const now = Date.now();
        const d = new Date(now);
        const timeLabel = `${d.getMinutes()}:${String(d.getSeconds()).padStart(2, '0')}.${Math.floor(d.getMilliseconds() / 100)}`;

        if (parsed.event === 'gesture') {
          const event: GestureEvent = {
            id: 'gest-' + now,
            timestamp: now,
            timeStr: d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0'),
            gestureName: parsed.name || 'Unknown',
            confidence: parsed.confidence || 0.95,
            triggeredAction: parsed.action || parsed.name || 'Shortcut Triggered',
          };
          this.gestureListeners.forEach(l => l(event));
          this.addLog({
            level: 'info',
            category: 'HID',
            message: `[LIVE HW] Gesture Detected: "${event.gestureName}"`,
            isSimulated: false,
            details: parsed,
          });
          return;
        }

        if (parsed.ax !== undefined && parsed.ay !== undefined && parsed.az !== undefined) {
          const accelX = Number(Number(parsed.ax).toFixed(3));
          const accelY = Number(Number(parsed.ay).toFixed(3));
          const accelZ = Number(Number(parsed.az).toFixed(3));
          const gyroX = Number(Number(parsed.gx ?? 0).toFixed(2));
          const gyroY = Number(Number(parsed.gy ?? 0).toFixed(2));
          const gyroZ = Number(Number(parsed.gz ?? 0).toFixed(2));
          const mag = Number(Math.sqrt(accelX * accelX + accelY * accelY + accelZ * accelZ).toFixed(3));

          const point: TelemetryPoint = {
            timestamp: now,
            timeLabel,
            accelX,
            accelY,
            accelZ,
            gyroX,
            gyroY,
            gyroZ,
            mag,
          };

          this.recentPoints.push(point);
          if (this.recentPoints.length > this.maxHistory) {
            this.recentPoints.shift();
          }

          this.telemetryListeners.forEach(l => l(point));
          return;
        }
      } catch {
        // Fall through to plain text log
      }
    }

    // Diagnostic log from ESP32
    this.addLog({
      level: raw.toLowerCase().includes('fail') || raw.toLowerCase().includes('err') ? 'error' : 'info',
      category: raw.includes('MPU') ? 'MPU6050' : raw.includes('BLE') ? 'BLE' : 'SYSTEM',
      message: `[ESP32]: ${raw}`,
      isSimulated: false,
    });
  }

  /**
   * Manual trigger from UI to test gesture pipelines
   */
  public triggerSimulatedGesture(gestureName: string, actionName: string, confidence: number = 0.94) {
    const now = Date.now();
    const d = new Date(now);
    const timeStr = d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');

    const event: GestureEvent = {
      id: 'gest-' + now,
      timestamp: now,
      timeStr,
      gestureName,
      confidence,
      triggeredAction: actionName
    };

    this.gestureActiveCountdown = 8;
    this.activeGestureType = gestureName;

    this.gestureListeners.forEach(l => l(event));
    this.addLog({
      level: 'info',
      category: 'HID',
      message: `Gesture matched: "${gestureName}" -> Executed action "${actionName}" (Confidence: ${(confidence * 100).toFixed(0)}%)`,
      isSimulated: true,
      details: { gesture: gestureName, confidence, action: actionName }
    });
  }

  public toggleConnection() {
    this.currentStatus.connected = !this.currentStatus.connected;
    this.addLog({
      level: this.currentStatus.connected ? 'info' : 'warn',
      category: 'BLE',
      message: this.currentStatus.connected ? 'Simulated BLE Link established (GATT HID Peripheral ready)' : 'Simulated BLE Link disconnected',
      isSimulated: true
    });
    this.statusListeners.forEach(l => l({ ...this.currentStatus }));
  }

  public updateSampleRate(hz: number) {
    this.sampleRateHz = hz;
    if (this.isRunning && !this.isLiveHardware) {
      this.pause();
      this.start();
    }
  }

  private initDefaultLogs() {
    this.addLog({
      level: 'info',
      category: 'SYSTEM',
      message: 'AeroNex Control Suite Initialized.',
      isSimulated: true
    });
    this.addLog({
      level: 'info',
      category: 'MPU6050',
      message: 'MPU6050 Driver ready (Connect Live ESP32 via USB or test in Demo Mode)',
      isSimulated: true
    });
    this.addLog({
      level: 'info',
      category: 'BLE',
      message: 'ESP32 BLE HID Profile ready',
      isSimulated: true
    });
  }

  private tick() {
    this.timeStep += 0.1;
    const now = Date.now();
    const d = new Date(now);
    const timeLabel = `${d.getMinutes()}:${String(d.getSeconds()).padStart(2, '0')}.${Math.floor(d.getMilliseconds() / 100)}`;

    let surgeAccelX = 0;
    let surgeAccelY = 0;
    let surgeGyroZ = 0;

    if (this.gestureActiveCountdown > 0) {
      this.gestureActiveCountdown--;
      if (this.activeGestureType?.includes('flick') || this.activeGestureType?.includes('Left')) {
        surgeAccelX = -1.8 * (this.gestureActiveCountdown / 8);
        surgeGyroZ = 120.0 * (this.gestureActiveCountdown / 8);
      } else if (this.activeGestureType?.includes('Right')) {
        surgeAccelX = 1.8 * (this.gestureActiveCountdown / 8);
        surgeGyroZ = -120.0 * (this.gestureActiveCountdown / 8);
      } else {
        surgeAccelY = 1.5 * (this.gestureActiveCountdown / 8);
      }
    }

    const noise = () => (Math.random() - 0.5) * 2;

    const accelX = Number((Math.sin(this.timeStep * 0.7) * 0.18 + noise() * this.handJitterBase + this.rollBias + surgeAccelX).toFixed(3));
    const accelY = Number((Math.cos(this.timeStep * 0.5) * 0.14 + noise() * this.handJitterBase + this.pitchBias + surgeAccelY).toFixed(3));
    const accelZ = Number((0.99 + Math.sin(this.timeStep * 0.3) * 0.03 + noise() * 0.02).toFixed(3));

    const gyroX = Number((Math.cos(this.timeStep * 0.9) * 12.0 + noise() * this.gyroJitterBase).toFixed(2));
    const gyroY = Number((Math.sin(this.timeStep * 0.8) * 10.5 + noise() * this.gyroJitterBase).toFixed(2));
    const gyroZ = Number((Math.sin(this.timeStep * 0.4) * 6.2 + noise() * (this.gyroJitterBase * 0.8) + surgeGyroZ).toFixed(2));

    const mag = Number(Math.sqrt(accelX * accelX + accelY * accelY + accelZ * accelZ).toFixed(3));

    const point: TelemetryPoint = {
      timestamp: now,
      timeLabel,
      accelX,
      accelY,
      accelZ,
      gyroX,
      gyroY,
      gyroZ,
      mag
    };

    this.recentPoints.push(point);
    if (this.recentPoints.length > this.maxHistory) {
      this.recentPoints.shift();
    }

    this.telemetryListeners.forEach(l => l(point));

    if (Math.random() < 0.005) {
      this.currentStatus.batteryLevel = Math.max(12, Math.min(100, this.currentStatus.batteryLevel + (this.currentStatus.batteryCharging ? 1 : -0.1)));
      this.currentStatus.batteryLevel = Number(this.currentStatus.batteryLevel.toFixed(1));
      this.statusListeners.forEach(l => l({ ...this.currentStatus }));
    }
  }
}

export const telemetryService = new DemoTelemetryService();
