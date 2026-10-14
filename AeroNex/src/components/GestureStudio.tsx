import React, { useState } from 'react';
import { GestureMapping, GestureEvent } from '../types';
import { 
  HandMetal, 
  Plus, 
  Trash2, 
  Play, 
  AlertCircle, 
  Sparkles, 
  X,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Repeat,
  Zap,
  Radio,
  Settings2
} from 'lucide-react';

interface GestureStudioProps {
  mappings: GestureMapping[];
  onUpdateMappings: (mappings: GestureMapping[]) => void;
  recentGestures: GestureEvent[];
  onTestGesture: (gestureName: string, action: string) => void;
}

export const GestureStudio: React.FC<GestureStudioProps> = ({
  mappings,
  onUpdateMappings,
  recentGestures,
  onTestGesture,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formState, setFormState] = useState<Partial<GestureMapping>>({
    name: '',
    triggerType: 'left-flick',
    action: '',
    enabled: true,
    thresholdG: 1.8,
    cooldownMs: 650,
    description: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const startEdit = (mapping: GestureMapping) => {
    setEditingId(mapping.id);
    setFormState({ ...mapping });
    setShowAddModal(true);
    setFormError(null);
  };

  const startAdd = () => {
    setEditingId(null);
    setFormState({
      name: '',
      triggerType: 'left-flick',
      action: 'Next Slide',
      enabled: true,
      thresholdG: 1.8,
      cooldownMs: 600,
      description: 'Quick lateral wrist flick motion',
    });
    setShowAddModal(true);
    setFormError(null);
  };

  const handleSave = () => {
    if (!formState.name?.trim()) {
      setFormError('Please enter a gesture name.');
      return;
    }
    if (!formState.action?.trim()) {
      setFormError('Please assign an action for this gesture.');
      return;
    }

    if (editingId) {
      onUpdateMappings(
        mappings.map(m => (m.id === editingId ? ({ ...m, ...formState } as GestureMapping) : m))
      );
    } else {
      const newMapping: GestureMapping = {
        id: 'g-' + Date.now(),
        name: formState.name,
        triggerType: formState.triggerType || 'left-flick',
        action: formState.action,
        enabled: formState.enabled ?? true,
        thresholdG: formState.thresholdG || 1.8,
        cooldownMs: formState.cooldownMs || 600,
        description: formState.description || '',
      };
      onUpdateMappings([...mappings, newMapping]);
    }

    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this gesture mapping?')) {
      onUpdateMappings(mappings.filter(m => m.id !== id));
    }
  };

  const toggleEnable = (id: string) => {
    onUpdateMappings(
      mappings.map(m => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const getGestureIcon = (triggerType: GestureMapping['triggerType'], isEven: boolean) => {
    const colorClass = isEven ? "text-brand-orange" : "text-brand-lavender";
    switch (triggerType) {
      case 'left-flick':
        return <ArrowLeft className={`w-5 h-5 ${colorClass}`} />;
      case 'right-flick':
        return <ArrowRight className={`w-5 h-5 ${colorClass}`} />;
      case 'up-flick':
        return <ArrowUp className={`w-5 h-5 ${colorClass}`} />;
      case 'down-flick':
        return <ArrowDown className={`w-5 h-5 ${colorClass}`} />;
      case 'double-flick':
        return <Repeat className={`w-5 h-5 ${colorClass}`} />;
      default:
        return <Zap className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto">
      {/* Header Banner with Clean SaaS Styling */}
      <div className="bg-white border border-brand-border rounded-3xl p-8 sm:p-10 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-lavenderLight border border-brand-lavenderBorder text-brand-lavender text-xs font-bold font-mono">
            <HandMetal className="w-3.5 h-3.5" />
            <span>Kinetic Shortcuts Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
            Gesture Studio
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-xl">
            Make movement your shortcut. Configure wrist flicks, wave triggers, and rotational shortcuts 
            mapped to standard keyboard and media commands.
          </p>
        </div>

        <button
          onClick={startAdd}
          className="px-6 py-3.5 bg-brand-orange hover:bg-brand-orangeHover text-white font-bold text-xs sm:text-sm rounded-full transition shadow-orangeGlow flex items-center gap-2 self-start md:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gesture Mapping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Gesture Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-text-secondary px-1">
            <span>CONFIGURED SHORTCUTS ({mappings.length})</span>
            <span>THRESHOLDS &amp; COOLDOWNS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mappings.map((mapping, idx) => {
              const isEven = idx % 2 === 0;
              const bgBadge = isEven ? "bg-brand-orangeLight border-brand-orange/20" : "bg-brand-lavenderLight border-brand-lavenderBorder";
              const accentColor = isEven ? "text-brand-orange" : "text-brand-lavender";

              return (
                <div
                  key={mapping.id}
                  className={`bg-white border rounded-3xl p-6 shadow-card transition-all duration-200 flex flex-col justify-between group hover:shadow-cardHover ${
                    mapping.enabled ? 'border-brand-border' : 'border-brand-border/60 opacity-60 bg-bg-soft/40'
                  }`}
                >
                  <div>
                    {/* Top card header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-11 h-11 rounded-2xl ${bgBadge} border flex items-center justify-center`}>
                        {getGestureIcon(mapping.triggerType, isEven)}
                      </div>

                      <button
                        onClick={() => toggleEnable(mapping.id)}
                        className={`text-[11px] font-mono px-3 py-1 rounded-full border font-bold transition ${
                          mapping.enabled
                            ? 'bg-status-success/10 border-status-success/30 text-status-success'
                            : 'bg-bg-soft border-brand-border text-text-secondary'
                        }`}
                      >
                        {mapping.enabled ? 'ENABLED' : 'DISABLED'}
                      </button>
                    </div>

                    {/* Title and trigger description */}
                    <h3 className="font-bold text-lg text-brand-dark">
                      {mapping.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className={`text-xs font-bold ${accentColor}`}>
                        &rarr; {mapping.action}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-2.5 leading-relaxed">
                      {mapping.description || 'Custom hand gesture assigned to desktop HID shortcut.'}
                    </p>
                  </div>

                  {/* Technical footnote & actions */}
                  <div className="mt-6 pt-3.5 border-t border-brand-border flex items-center justify-between text-xs">
                    <div className="text-[11px] font-mono text-text-secondary">
                      <span>{mapping.thresholdG}G</span>
                      <span className="mx-1.5 text-border-subtle">•</span>
                      <span>{mapping.cooldownMs}ms</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onTestGesture(mapping.name, mapping.action)}
                        className="px-3 py-1 bg-brand-orangeLight hover:bg-brand-orange/20 text-brand-orange font-mono text-[11px] font-bold rounded-full transition flex items-center gap-1"
                        title="Simulate this gesture event"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Test</span>
                      </button>

                      <button
                        onClick={() => startEdit(mapping)}
                        className="p-1.5 text-text-secondary hover:text-brand-dark hover:bg-bg-soft rounded-full transition"
                        title="Edit Mapping & Thresholds"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(mapping.id)}
                        className="p-1.5 text-text-secondary hover:text-status-error hover:bg-status-error/10 rounded-full transition"
                        title="Delete Mapping"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {mappings.length === 0 && (
            <div className="bg-white border border-brand-border rounded-3xl p-12 text-center space-y-3">
              <HandMetal className="w-12 h-12 text-text-muted mx-auto" />
              <h3 className="font-bold text-brand-dark text-base">No gestures configured</h3>
              <p className="text-xs text-text-secondary">Click "Add Gesture Mapping" above to create one.</p>
            </div>
          )}
        </div>

        {/* Right Column: Live Gesture Feed */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-text-secondary px-1">
            <span>LIVE GESTURE STREAM</span>
            <span className="text-status-success font-bold">● LISTENING</span>
          </div>

          <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card flex flex-col justify-between space-y-4 min-h-[480px]">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-brand-border">
                <h3 className="font-bold text-brand-dark text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-orange" />
                  Real-Time Event Stream
                </h3>
                <span className="text-[10px] font-mono text-brand-lavender bg-brand-lavenderLight px-2.5 py-0.5 rounded-full font-bold">
                  Inertial Buffer
                </span>
              </div>

              <div className="mt-4 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {recentGestures.map(evt => (
                  <div
                    key={evt.id}
                    className="p-3.5 bg-[#FAFBFD] border border-brand-border rounded-2xl text-xs space-y-1 font-mono transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-brand-dark">{evt.gestureName}</span>
                      <span className="text-[10px] text-text-secondary">{evt.timeStr}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-text-secondary">Action Executed:</span>
                      <span className="text-brand-orange font-bold">{evt.triggeredAction}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-text-secondary">Confidence:</span>
                      <span className="text-status-success font-bold">{(evt.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}

                {recentGestures.length === 0 && (
                  <div className="py-20 text-center space-y-2">
                    <Radio className="w-9 h-9 text-brand-lavender/40 mx-auto animate-pulse" />
                    <p className="text-xs font-mono text-text-secondary font-semibold">
                      Waiting for kinematic gesture events...
                    </p>
                    <p className="text-[11px] text-text-muted">
                      Click "Test" on any gesture card to simulate an inertial trigger.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-brand-border text-[11px] text-text-secondary space-y-1">
              <span className="font-bold text-brand-dark block font-mono">Micro-Controller State:</span>
              <span>ESP32 FIR filter classifies motion vectors locally before reporting BLE consumer keys.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Gesture Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-brand-border rounded-3xl max-w-md w-full p-6 shadow-floating space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="font-bold text-brand-dark text-base">
                {editingId ? 'Edit Gesture Mapping' : 'Add New Gesture'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-text-secondary hover:text-brand-dark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-status-error/10 border border-status-error/30 text-status-error text-xs rounded-2xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-brand-dark font-semibold mb-1">Gesture Name</label>
                <input
                  type="text"
                  value={formState.name || ''}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                  placeholder="e.g. Left Flick, Quick Tilt, Snap"
                  className="w-full bg-[#FAFBFD] border border-brand-border rounded-xl px-3.5 py-2 text-brand-dark focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-brand-dark font-semibold mb-1">Motion Direction</label>
                <select
                  value={formState.triggerType || 'left-flick'}
                  onChange={e => setFormState({ ...formState, triggerType: e.target.value as any })}
                  className="w-full bg-[#FAFBFD] border border-brand-border rounded-xl px-3.5 py-2 text-brand-dark focus:outline-none focus:border-brand-orange"
                >
                  <option value="left-flick">Left Flick (Yaw -Z)</option>
                  <option value="right-flick">Right Flick (Yaw +Z)</option>
                  <option value="up-flick">Upward Flick (Pitch +Y)</option>
                  <option value="down-flick">Downward Flick (Pitch -Y)</option>
                  <option value="double-flick">Double Flick (Rapid Cycle)</option>
                </select>
              </div>

              <div>
                <label className="block text-brand-dark font-semibold mb-1">Assigned Shortcut Action</label>
                <input
                  type="text"
                  value={formState.action || ''}
                  onChange={e => setFormState({ ...formState, action: e.target.value })}
                  placeholder="e.g. Next Slide, Previous Slide, Play/Pause"
                  className="w-full bg-[#FAFBFD] border border-brand-border rounded-xl px-3.5 py-2 text-brand-dark focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-brand-dark font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={formState.description || ''}
                  onChange={e => setFormState({ ...formState, description: e.target.value })}
                  placeholder="Brief note about the motion"
                  className="w-full bg-[#FAFBFD] border border-brand-border rounded-xl px-3.5 py-2 text-brand-dark focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-brand-dark font-semibold mb-1">Acceleration Threshold (G)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="5.0"
                    value={formState.thresholdG || 1.8}
                    onChange={e => setFormState({ ...formState, thresholdG: Number(e.target.value) })}
                    className="w-full bg-[#FAFBFD] border border-brand-border rounded-xl px-3.5 py-2 font-mono text-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-brand-dark font-semibold mb-1">Cooldown (ms)</label>
                  <input
                    type="number"
                    step="50"
                    min="100"
                    max="2000"
                    value={formState.cooldownMs || 600}
                    onChange={e => setFormState({ ...formState, cooldownMs: Number(e.target.value) })}
                    className="w-full bg-[#FAFBFD] border border-brand-border rounded-xl px-3.5 py-2 font-mono text-brand-dark"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-brand-border">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 bg-white hover:bg-bg-soft border border-brand-border text-text-secondary text-xs rounded-full transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orangeHover text-white font-bold text-xs rounded-full transition shadow-orangeGlow"
              >
                Save Gesture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
