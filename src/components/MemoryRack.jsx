import React from 'react';
import { ALGORITHMS } from '../utils/pageReplacementAlgorithms';
import { CheckCircle2, AlertOctagon, Clock, Activity, Eye, RotateCw } from 'lucide-react';

export default function MemoryRack({ currentStepData, algoName, totalSteps }) {
  if (!currentStepData) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
        No simulation data available. Please check reference string.
      </div>
    );
  }

  const {
    step,
    page,
    frames,
    isHit,
    replacedPage,
    targetFrameIndex,
    explanation,
    clockPointer,
    refBits,
    frequencies,
    lastAccessed,
    nextUsed,
    cumulativeFaults,
    cumulativeHits,
  } = currentStepData;

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Subtle Accent Glow */}
      <div
        className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none transition-all duration-500 ${
          isHit ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />

      {/* Top Bar: Current Page Request & Hit/Fault Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        
        {/* Active Page Request Display */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Current Step</span>
            <span className="text-xl font-bold font-mono text-cyan-400">
              {step} <span className="text-sm font-normal text-slate-500">/ {totalSteps}</span>
            </span>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          {/* Requested Page Badge */}
          <div className="flex items-center space-x-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Incoming Page:</span>
            <div className="w-12 h-12 rounded-xl bg-slate-950 border-2 border-cyan-500/60 text-cyan-300 font-mono font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 transform transition-transform duration-300 scale-105">
              {page}
            </div>
          </div>
        </div>

        {/* Hit / Fault Banner Badge */}
        <div className="flex items-center space-x-3">
          {isHit ? (
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-500/10 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wide">PAGE HIT</div>
                <div className="text-[11px] text-emerald-300/80">Page {page} found in memory</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-400 shadow-md shadow-rose-500/10 animate-fade-in">
              <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wide">PAGE FAULT</div>
                <div className="text-[11px] text-rose-300/80">
                  {replacedPage !== null ? `Evicted Page ${replacedPage}` : 'Loaded into empty frame'}
                </div>
              </div>
            </div>
          )}

          {/* Cumulative Counters */}
          <div className="hidden sm:flex items-center space-x-2 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 text-xs font-mono">
            <div className="text-emerald-400 font-bold">H: {cumulativeHits}</div>
            <div className="text-slate-600">|</div>
            <div className="text-rose-400 font-bold">F: {cumulativeFaults}</div>
          </div>
        </div>
      </div>

      {/* Main Physical RAM Frames Rack */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Physical Memory Frames (RAM Slots)</span>
          </h3>

          {algoName === ALGORITHMS.SECOND_CHANCE && (
            <span className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded flex items-center space-x-1">
              <RotateCw className="w-3 h-3 animate-spin text-amber-400" />
              <span>Clock Pointer at Frame {clockPointer}</span>
            </span>
          )}
        </div>

        {/* Frames Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {frames.map((framePage, frameIdx) => {
            const isTargetFrame = targetFrameIndex === frameIdx;
            const isClockFrame = algoName === ALGORITHMS.SECOND_CHANCE && clockPointer === frameIdx;
            const isEmpty = framePage === null;

            return (
              <div
                key={frameIdx}
                className={`relative rounded-2xl p-4 flex flex-col items-center justify-between min-h-[140px] border transition-all duration-300 ${
                  isTargetFrame
                    ? isHit
                      ? 'bg-emerald-950/30 border-emerald-500 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/50'
                      : 'bg-rose-950/30 border-rose-500 shadow-lg shadow-rose-500/20 ring-2 ring-rose-500/50'
                    : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {/* Second Chance Clock Hand Pointer Indicator */}
                {isClockFrame && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md shadow-amber-500/30 flex items-center space-x-1 z-10 animate-bounce">
                    <Clock className="w-3 h-3" />
                    <span>PTR</span>
                  </div>
                )}

                {/* Frame Header Index */}
                <div className="w-full flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>FRAME {frameIdx}</span>
                  {isTargetFrame && (
                    <span
                      className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        isHit ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {isHit ? 'HIT' : 'TARGET'}
                    </span>
                  )}
                </div>

                {/* Frame Content - Page Number */}
                <div className="my-2 flex flex-col items-center">
                  {!isEmpty ? (
                    <span className="text-3xl font-extrabold font-mono text-slate-100 tracking-tight">
                      {framePage}
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-slate-700 italic uppercase">EMPTY</span>
                  )}
                </div>

                {/* Algorithm-Specific Extra Metrics */}
                <div className="w-full pt-2 border-t border-slate-800/60 text-center">
                  {!isEmpty && (
                    <>
                      {/* Second Chance: Reference Bit */}
                      {algoName === ALGORITHMS.SECOND_CHANCE && refBits && (
                        <div className="flex items-center justify-center space-x-1 text-[10px]">
                          <span className="text-slate-400">Ref Bit R =</span>
                          <span
                            className={`font-mono font-bold px-1.5 rounded ${
                              refBits[frameIdx] === 1
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {refBits[frameIdx]}
                          </span>
                        </div>
                      )}

                      {/* LFU: Frequency Counter */}
                      {algoName === ALGORITHMS.LFU && frequencies && (
                        <div className="text-[10px] text-cyan-400 font-mono">
                          Freq: <span className="font-bold">{frequencies[frameIdx]}</span>
                        </div>
                      )}

                      {/* LRU: Last Access Step */}
                      {algoName === ALGORITHMS.LRU && lastAccessed && (
                        <div className="text-[10px] text-purple-400 font-mono">
                          Last: <span className="font-bold">Step {lastAccessed[frameIdx] + 1}</span>
                        </div>
                      )}

                      {/* Optimal: Future Distance */}
                      {algoName === ALGORITHMS.OPTIMAL && nextUsed && (
                        <div className="text-[10px] font-mono">
                          {nextUsed[frameIdx] === Infinity ? (
                            <span className="text-rose-400 font-bold">Never again</span>
                          ) : (
                            <span className="text-teal-400">+ {nextUsed[frameIdx]} steps</span>
                          )}
                        </div>
                      )}

                      {/* FIFO: Slot number */}
                      {algoName === ALGORITHMS.FIFO && (
                        <div className="text-[10px] text-slate-500 font-mono">
                          Loaded Page {framePage}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Explanation Banner */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex items-start space-x-3 text-xs">
        <Eye className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-slate-300 font-mono leading-relaxed">
          <strong className="text-cyan-400">Step Log: </strong>
          {explanation}
        </div>
      </div>
    </div>
  );
}
