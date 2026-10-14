import React, { useState } from 'react';
import { DiagnosticLog, DeviceStatus } from '../types';
import { exportToJson, exportToCsv } from '../utils/exportUtils';
import { 
  TerminalSquare, 
  Trash2, 
  Search, 
  FileSpreadsheet, 
  FileCode
} from 'lucide-react';

interface DiagnosticsProps {
  logs: DiagnosticLog[];
  deviceStatus: DeviceStatus;
  onClearLogs: () => void;
  onRefresh: () => void;
}

export const Diagnostics: React.FC<DiagnosticsProps> = ({
  logs,
  deviceStatus,
  onClearLogs,
  onRefresh,
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = logs.filter(log => {
    if (filterLevel !== 'all' && log.level !== filterLevel) return false;
    if (filterCategory !== 'all' && log.category !== filterCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        log.message.toLowerCase().includes(q) ||
        log.category.toLowerCase().includes(q) ||
        log.timeStr.includes(q)
      );
    }
    return true;
  });

  const handleExportJson = () => {
    exportToJson(logs, `aircontrol_diagnostics_${Date.now()}`);
  };

  const handleExportCsv = () => {
    const csvData = logs.map(l => ({
      ID: l.id,
      Timestamp: l.timeStr,
      Level: l.level.toUpperCase(),
      Category: l.category,
      Message: l.message,
      IsSimulated: l.isSimulated ? 'YES' : 'NO',
    }));
    exportToCsv(csvData, `aircontrol_diagnostics_${Date.now()}`);
  };

  const getLevelBadge = (level: DiagnosticLog['level']) => {
    switch (level) {
      case 'error':
        return <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-status-error/15 text-status-error font-mono font-bold">ERR</span>;
      case 'warn':
        return <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-status-warning/15 text-status-warning font-mono font-bold">WARN</span>;
      case 'info':
        return <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-brand-orangeLight text-brand-orange font-mono font-bold">INFO</span>;
      case 'debug':
        return <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-bg-soft text-text-secondary font-mono font-bold">DBG</span>;
    }
  };

  return (
    <div className="space-y-8 py-4 max-w-6xl mx-auto">
      {/* Overview Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card">
          <div className="text-text-secondary text-[11px] mb-1">TELEMETRY PIPELINE</div>
          <div className="text-sm font-bold text-brand-dark">Browser Demo Mock</div>
          <div className="text-[10px] text-text-secondary mt-1">Source: DemoTelemetryService</div>
        </div>

        <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card">
          <div className="text-text-secondary text-[11px] mb-1">APPLICATION CORE</div>
          <div className="text-sm font-bold text-status-success">Nominal Status</div>
          <div className="text-[10px] text-text-secondary mt-1">Thread State: Active</div>
        </div>

        <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card">
          <div className="text-text-secondary text-[11px] mb-1">TOTAL EVENTS BUFFERED</div>
          <div className="text-sm font-bold text-brand-orange">{logs.length} entries</div>
          <div className="text-[10px] text-text-secondary mt-1">Buffer: 500 max</div>
        </div>

        <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card">
          <div className="text-text-secondary text-[11px] mb-1">LAST HEARTBEAT</div>
          <div className="text-sm font-bold text-brand-lavender">
            {new Date(deviceStatus.lastHeartbeat).toLocaleTimeString()}
          </div>
          <div className="text-[10px] text-text-secondary mt-1">Interval: 1000ms</div>
        </div>
      </div>

      {/* Log Console & Export Controls */}
      <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <TerminalSquare className="w-5 h-5 text-brand-lavender" />
            <div>
              <h2 className="text-base font-bold text-brand-dark">
                System Diagnostics & Event Log Stream
              </h2>
              <p className="text-xs text-text-secondary">
                Inspect firmware status messages, BLE HID state transitions, and gesture dispatch records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-bg-soft border border-brand-border text-brand-dark text-xs font-mono rounded-full transition shadow-sm cursor-pointer"
              title="Download diagnostic trace as JSON"
            >
              <FileCode className="w-3.5 h-3.5 text-brand-orange" />
              <span>JSON Export</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-bg-soft border border-brand-border text-brand-dark text-xs font-mono rounded-full transition shadow-sm cursor-pointer"
              title="Download diagnostic trace as CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-status-success" />
              <span>CSV Export</span>
            </button>

            <button
              onClick={onClearLogs}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-status-error/10 border border-brand-border text-text-secondary hover:text-status-error text-xs font-mono rounded-full transition shadow-sm cursor-pointer"
              title="Clear event logs buffer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Log</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="relative">
            <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search message text..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAFBFD] border border-brand-border rounded-full pl-10 pr-4 py-2.5 text-brand-dark focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-secondary">Level:</span>
            <select
              value={filterLevel}
              onChange={e => setFilterLevel(e.target.value)}
              className="w-full bg-[#FAFBFD] border border-brand-border rounded-full px-4 py-2.5 text-brand-dark focus:outline-none focus:border-brand-orange"
            >
              <option value="all">All Levels</option>
              <option value="info">INFO Only</option>
              <option value="warn">WARN Only</option>
              <option value="error">ERROR Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-secondary">Category:</span>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="w-full bg-[#FAFBFD] border border-brand-border rounded-full px-4 py-2.5 text-brand-dark focus:outline-none focus:border-brand-orange"
            >
              <option value="all">All Subsystems</option>
              <option value="SYSTEM">SYSTEM</option>
              <option value="BLE">BLE Radio</option>
              <option value="MPU6050">MPU6050 Driver</option>
              <option value="HID">HID Reports</option>
              <option value="CALIBRATION">Calibration</option>
            </select>
          </div>
        </div>

        {/* Terminal Log Console */}
        <div className="bg-[#FAFBFD] rounded-3xl border border-brand-border p-4 h-96 overflow-y-auto space-y-2 font-mono text-xs">
          {filteredLogs.map(l => (
            <div
              key={l.id}
              className="py-2.5 px-3.5 rounded-2xl bg-white hover:bg-brand-orangeLight/30 border border-brand-border transition flex flex-wrap sm:flex-nowrap items-baseline gap-2.5 leading-relaxed shadow-sm"
            >
              <span className="text-text-secondary text-[11px] flex-shrink-0">{l.timeStr}</span>
              <div className="flex-shrink-0">{getLevelBadge(l.level)}</div>
              <span className="text-brand-lavender text-[11px] font-bold flex-shrink-0">[{l.category}]</span>
              <span className="text-brand-dark flex-1 break-words">{l.message}</span>
              {l.isSimulated && (
                <span className="text-[10px] text-text-secondary bg-[#FAFBFD] px-2 py-0.5 rounded-full border border-brand-border flex-shrink-0 font-medium">
                  SIMULATED
                </span>
              )}
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="h-full flex items-center justify-center text-text-secondary text-xs">
              No matching diagnostic logs found.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-text-secondary px-1">
          <span>Displaying {filteredLogs.length} of {logs.length} logged events</span>
          <span>Timestamp resolution: millisecond precision</span>
        </div>
      </div>
    </div>
  );
};
