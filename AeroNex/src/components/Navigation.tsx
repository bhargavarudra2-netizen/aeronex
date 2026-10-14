import React from 'react';
import { PageTab } from '../types';
import { 
  LayoutDashboard, 
  MousePointer2, 
  HandMetal, 
  Activity, 
  Compass, 
  Sliders, 
  TerminalSquare 
} from 'lucide-react';

interface NavigationProps {
  activeTab: PageTab;
  onTabChange: (tab: PageTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: PageTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'air-mouse', label: 'Air Mouse', icon: <MousePointer2 className="w-4 h-4" /> },
    { id: 'gesture-studio', label: 'Gesture Studio', icon: <HandMetal className="w-4 h-4" /> },
    { id: 'sensor-lab', label: 'Sensor Lab', icon: <Activity className="w-4 h-4" /> },
    { id: 'calibration', label: 'Calibration', icon: <Compass className="w-4 h-4" /> },
    { id: 'device-settings', label: 'Device Settings', icon: <Sliders className="w-4 h-4" /> },
    { id: 'diagnostics', label: 'Diagnostics', icon: <TerminalSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <nav className="bg-white/80 backdrop-blur-md border border-border-subtle rounded-2xl p-1.5 shadow-card overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1 min-w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-dark text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-soft/60'
                }`}
              >
                <span className={isActive ? 'text-brand-orange' : 'text-text-secondary'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
