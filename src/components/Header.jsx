import React from 'react';
import { Cpu, Layers, BarChart2, BookOpen, AlertTriangle } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'single', label: 'Single Visualizer', icon: Cpu },
    { id: 'compare', label: 'Compare All', icon: BarChart2 },
    { id: 'belady', label: "Belady's Anomaly", icon: AlertTriangle },
    { id: 'guide', label: 'Theory & Quiz', icon: BookOpen },
  ];

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-emerald-500 rounded-xl shadow-lg shadow-cyan-500/20 text-slate-950 font-bold">
              <Layers className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  PagingLab
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-slate-800 text-cyan-400 border border-cyan-500/30 rounded-full">
                  OS Visualizer
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Page Replacement Algorithms & Memory Management Simulator
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
