import React, { useState } from 'react';
import { simulateFIFO, simulateLRU, simulateOptimal } from '../utils/pageReplacementAlgorithms';
import { AlertTriangle, CheckCircle, Info, ArrowRight, Zap } from 'lucide-react';

export default function BeladyDetector() {
  const beladySequence = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
  const [customInput, setCustomInput] = useState(beladySequence.join(', '));
  const [frameA, setFrameA] = useState(3);
  const [frameB, setFrameB] = useState(4);

  const parsed = customInput
    .split(/[\s,]+/)
    .map(Number)
    .filter((n) => !isNaN(n));

  const fifoA = simulateFIFO(parsed, frameA);
  const fifoB = simulateFIFO(parsed, frameB);

  const lruA = simulateLRU(parsed, frameA);
  const lruB = simulateLRU(parsed, frameB);

  const optA = simulateOptimal(parsed, frameA);
  const optB = simulateOptimal(parsed, frameB);

  const isBeladyDetected = fifoB.totalFaults > fifoA.totalFaults;

  return (
    <div className="space-y-6">
      {/* Explanation Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-rose-950/40 border border-amber-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl shadow-lg shadow-amber-500/30 shrink-0">
            <AlertTriangle className="w-8 h-8 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <span>Belady's Anomaly Laboratory</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                OS Counter-Intuitive Phenomenon
              </span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              <strong>Belady's Anomaly</strong> occurs when increasing the number of memory frames results in an <strong>INCREASE in page faults</strong> for FIFO (First-In, First-Out). Stack-based algorithms like LRU and Optimal are provably immune to Belady's Anomaly.
            </p>
          </div>
        </div>
      </div>

      {/* Control Box */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Test Sequence (Belady Anomaly Default)
            </label>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm font-mono text-cyan-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="md:col-span-4 flex items-center justify-end space-x-2">
            <button
              onClick={() => setCustomInput(beladySequence.join(', '))}
              className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
            >
              Reset to Classic Belady String
            </button>
          </div>
        </div>
      </div>

      {/* Detection Result Indicator */}
      <div
        className={`rounded-2xl p-5 border text-center transition-all ${
          isBeladyDetected
            ? 'bg-rose-950/40 border-rose-500/60 text-rose-300 shadow-xl shadow-rose-500/10'
            : 'bg-slate-900/60 border-slate-800 text-slate-400'
        }`}
      >
        {isBeladyDetected ? (
          <div className="space-y-1">
            <div className="text-lg font-extrabold text-rose-400 flex items-center justify-center space-x-2">
              <AlertTriangle className="w-6 h-6 text-rose-400 animate-pulse" />
              <span>BELADY'S ANOMALY DETECTED IN FIFO!</span>
            </div>
            <p className="text-xs text-rose-200">
              FIFO produced <strong className="text-rose-400 text-sm font-mono">{fifoA.totalFaults} faults</strong> with {frameA} frames, but incurred MORE faults (<strong className="text-rose-400 text-sm font-mono">{fifoB.totalFaults} faults</strong>) when upgraded to {frameB} frames!
            </p>
          </div>
        ) : (
          <div className="text-xs text-slate-400">
            Belady's Anomaly is not present in FIFO for the current frame configuration. Try 3 frames vs 4 frames on the default string.
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison: 3 Frames vs 4 Frames across Algorithms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* FIFO Comparison */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-cyan-400 text-sm">FIFO (First-In, First-Out)</h3>
            <span className="text-[11px] text-rose-400 font-bold bg-rose-950/50 border border-rose-800 px-2 py-0.5 rounded">
              Vulnerable to Anomaly
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-slate-400 text-[10px] uppercase">{frameA} Memory Frames</div>
              <div className="text-2xl font-bold text-slate-200 mt-1">{fifoA.totalFaults}</div>
              <div className="text-[10px] text-slate-500">Page Faults</div>
            </div>

            <div className={`bg-slate-950 p-3 rounded-xl border text-center ${fifoB.totalFaults > fifoA.totalFaults ? 'border-rose-500 bg-rose-950/20' : 'border-slate-800'}`}>
              <div className="text-slate-400 text-[10px] uppercase">{frameB} Memory Frames</div>
              <div className={`text-2xl font-bold mt-1 ${fifoB.totalFaults > fifoA.totalFaults ? 'text-rose-400 font-extrabold' : 'text-slate-200'}`}>
                {fifoB.totalFaults}
              </div>
              <div className="text-[10px] text-slate-500">Page Faults</div>
            </div>
          </div>
        </div>

        {/* LRU Comparison */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-purple-400 text-sm">LRU (Least Recently Used)</h3>
            <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-800 px-2 py-0.5 rounded">
              Stack Algo (Immune)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-slate-400 text-[10px] uppercase">{frameA} Memory Frames</div>
              <div className="text-2xl font-bold text-slate-200 mt-1">{lruA.totalFaults}</div>
              <div className="text-[10px] text-slate-500">Page Faults</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-slate-400 text-[10px] uppercase">{frameB} Memory Frames</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{lruB.totalFaults}</div>
              <div className="text-[10px] text-slate-500">Page Faults</div>
            </div>
          </div>
        </div>

        {/* Optimal Comparison */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-emerald-400 text-sm">Optimal (OPT)</h3>
            <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-800 px-2 py-0.5 rounded">
              Theoretical Limit (Immune)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-slate-400 text-[10px] uppercase">{frameA} Memory Frames</div>
              <div className="text-2xl font-bold text-slate-200 mt-1">{optA.totalFaults}</div>
              <div className="text-[10px] text-slate-500">Page Faults</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-slate-400 text-[10px] uppercase">{frameB} Memory Frames</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{optB.totalFaults}</div>
              <div className="text-[10px] text-slate-500">Page Faults</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
