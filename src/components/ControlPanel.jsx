import React, { useState } from 'react';
import { ALGORITHMS, PRESETS } from '../utils/pageReplacementAlgorithms';
import { Shuffle, RefreshCw, Layers, Sparkles, HelpCircle } from 'lucide-react';

export default function ControlPanel({
  selectedAlgo,
  setSelectedAlgo,
  frameCount,
  setFrameCount,
  referenceInput,
  setReferenceInput,
  onReset,
  parsedPages,
}) {
  const [showPresets, setShowPresets] = useState(false);
  const [randomLength, setRandomLength] = useState(15);
  const [randomMaxPage, setRandomMaxPage] = useState(7);

  const generateRandomString = () => {
    const len = Math.max(5, Math.min(30, randomLength));
    const maxP = Math.max(2, Math.min(15, randomMaxPage));
    const arr = Array.from({ length: len }, () => Math.floor(Math.random() * maxP));
    setReferenceInput(arr.join(', '));
  };

  const applyPreset = (preset) => {
    setReferenceInput(preset.string);
    setFrameCount(preset.frames);
    setShowPresets(false);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Algorithm Selector & Frame Count */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select Replacement Algorithm
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(ALGORITHMS).map((algo) => (
                <button
                  key={algo}
                  onClick={() => setSelectedAlgo(algo)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border text-center ${
                    selectedAlgo === algo
                      ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Memory Frames Count: <span className="text-cyan-400 font-bold text-sm">{frameCount} Slots</span>
              </label>
            </div>
            <div className="flex items-center space-x-2">
              {[2, 3, 4, 5, 6, 7, 8].map((count) => (
                <button
                  key={count}
                  onClick={() => setFrameCount(count)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    frameCount === count
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                      : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700/50'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reference String Input & Controls */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                <span>Page Reference Sequence</span>
                <span className="text-slate-500 text-[11px] font-normal">({parsedPages.length} requests)</span>
              </label>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPresets(!showPresets)}
                  className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Presets</span>
                </button>
                <button
                  onClick={generateRandomString}
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>Random</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={referenceInput}
                onChange={(e) => setReferenceInput(e.target.value)}
                placeholder="Enter numbers separated by commas or spaces e.g. 7, 0, 1, 2, 0, 3..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>
          </div>

          {/* Reference Page Chips Preview */}
          <div className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-slate-700">
            {parsedPages.map((pg, idx) => (
              <span
                key={idx}
                className="inline-flex items-center justify-center min-w-7 h-7 px-2 text-xs font-mono font-bold rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
              >
                {pg}
              </span>
            ))}
          </div>

          {/* Presets Modal / Dropdown */}
          {showPresets && (
            <div className="bg-slate-950/90 border border-slate-700 rounded-xl p-3 space-y-2 mt-2">
              <div className="text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span>Select Standard OS Test Cases</span>
                <button
                  onClick={() => setShowPresets(false)}
                  className="text-slate-500 hover:text-slate-300 text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyPreset(p)}
                    className="text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 transition-all"
                  >
                    <div className="text-xs font-bold text-cyan-400">{p.name}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{p.description}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">{p.string}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
