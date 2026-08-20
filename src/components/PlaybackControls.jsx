import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Gauge,
  RotateCcw,
} from 'lucide-react';

export default function PlaybackControls({
  currentStepIndex,
  totalSteps,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onFirst,
  onLast,
  onSeek,
  speed,
  setSpeed,
  stepsData,
}) {
  const speeds = [0.5, 1, 2, 4];

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Interactive Timeline Scrubbing Bar */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
          <span>Simulation Timeline</span>
          <span className="font-mono text-cyan-400">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
        </div>

        {/* Custom Timeline Slider with Hit/Fault Marker Dots */}
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => onSeek(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-800 focus:outline-none"
          />
        </div>

        {/* Step Marker Dots underneath slider */}
        {stepsData && stepsData.length > 0 && (
          <div className="flex justify-between items-center px-1 mt-2">
            {stepsData.map((stepItem, idx) => (
              <button
                key={idx}
                onClick={() => onSeek(idx)}
                title={`Step ${idx + 1}: Page ${stepItem.page} (${stepItem.isHit ? 'Hit' : 'Fault'})`}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'ring-2 ring-cyan-400 scale-125'
                    : 'opacity-60 hover:opacity-100'
                } ${stepItem.isHit ? 'bg-emerald-400' : 'bg-rose-400'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Playback Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
        
        {/* Navigation Controls */}
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <button
            onClick={onFirst}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="First Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onPrev}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Previous Step"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={onPlayPause}
            className={`px-5 py-2.5 rounded-xl font-bold text-slate-950 flex items-center space-x-2 transition-all shadow-lg ${
              isPlaying
                ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-400/20'
                : 'bg-cyan-400 hover:bg-cyan-300 shadow-cyan-400/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-slate-950" />
                <span className="text-sm">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-slate-950" />
                <span className="text-sm">Play</span>
              </>
            )}
          </button>

          <button
            onClick={onNext}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Next Step"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={onLast}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Last Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center space-x-2 mx-auto sm:mx-0 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <Gauge className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-semibold mr-1">Speed:</span>
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 rounded text-xs font-bold font-mono transition-all ${
                speed === s
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
