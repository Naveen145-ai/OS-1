import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import MemoryRack from './components/MemoryRack';
import PlaybackControls from './components/PlaybackControls';
import StepTable from './components/StepTable';
import ComparisonView from './components/ComparisonView';
import BeladyDetector from './components/BeladyDetector';
import EducationalGuide from './components/EducationalGuide';
import {
  ALGORITHMS,
  parseReferenceString,
  simulateFIFO,
  simulateLRU,
  simulateOptimal,
  simulateLFU,
  simulateSecondChance,
} from './utils/pageReplacementAlgorithms';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState('single');
  const [selectedAlgo, setSelectedAlgo] = useState(ALGORITHMS.FIFO);
  const [frameCount, setFrameCount] = useState(3);
  const [referenceInput, setReferenceInput] = useState(
    '7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1'
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const parsedPages = parseReferenceString(referenceInput);

  // Compute simulation steps for selected algorithm
  const getSimulationResult = () => {
    switch (selectedAlgo) {
      case ALGORITHMS.FIFO:
        return simulateFIFO(parsedPages, frameCount);
      case ALGORITHMS.LRU:
        return simulateLRU(parsedPages, frameCount);
      case ALGORITHMS.OPTIMAL:
        return simulateOptimal(parsedPages, frameCount);
      case ALGORITHMS.LFU:
        return simulateLFU(parsedPages, frameCount);
      case ALGORITHMS.SECOND_CHANCE:
        return simulateSecondChance(parsedPages, frameCount);
      default:
        return simulateFIFO(parsedPages, frameCount);
    }
  };

  const simulationResult = getSimulationResult();
  const steps = simulationResult.steps || [];
  const currentStepData = steps[currentStepIndex] || null;

  // Auto-play timer effect
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      if (currentStepIndex >= steps.length - 1) {
        setIsPlaying(false);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } else {
        timer = setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, 1000 / speed);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  // Reset step index when inputs change
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [selectedAlgo, frameCount, referenceInput]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      {/* Top Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Tab 1: Single Algorithm Interactive Visualizer */}
        {activeTab === 'single' && (
          <div className="space-y-6">
            {/* Control Panel */}
            <ControlPanel
              selectedAlgo={selectedAlgo}
              setSelectedAlgo={setSelectedAlgo}
              frameCount={frameCount}
              setFrameCount={setFrameCount}
              referenceInput={referenceInput}
              setReferenceInput={setReferenceInput}
              parsedPages={parsedPages}
            />

            {/* Playback Bar */}
            <PlaybackControls
              currentStepIndex={currentStepIndex}
              totalSteps={steps.length}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onNext={() => setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
              onPrev={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              onFirst={() => setCurrentStepIndex(0)}
              onLast={() => setCurrentStepIndex(steps.length - 1)}
              onSeek={(idx) => setCurrentStepIndex(idx)}
              speed={speed}
              setSpeed={setSpeed}
              stepsData={steps}
            />

            {/* Visual RAM Memory Rack */}
            <MemoryRack
              currentStepData={currentStepData}
              algoName={selectedAlgo}
              totalSteps={steps.length}
            />

            {/* Detailed Execution Trace Table */}
            <StepTable
              steps={steps}
              frameCount={frameCount}
              activeStepIndex={currentStepIndex}
              onSelectStep={(idx) => setCurrentStepIndex(idx)}
            />
          </div>
        )}

        {/* Tab 2: Compare All Algorithms */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <ControlPanel
              selectedAlgo={selectedAlgo}
              setSelectedAlgo={setSelectedAlgo}
              frameCount={frameCount}
              setFrameCount={setFrameCount}
              referenceInput={referenceInput}
              setReferenceInput={setReferenceInput}
              parsedPages={parsedPages}
            />

            <ComparisonView pages={parsedPages} frameCount={frameCount} />
          </div>
        )}

        {/* Tab 3: Belady's Anomaly Lab */}
        {activeTab === 'belady' && <BeladyDetector />}

        {/* Tab 4: Theory & Quiz */}
        {activeTab === 'guide' && <EducationalGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            PagingLab &copy; OS Memory Management Visualizer &bull; Built with React & Tailwind Aesthetics
          </div>
          <div className="text-cyan-400/80">
            FIFO &bull; LRU &bull; Optimal &bull; LFU &bull; Second Chance
          </div>
        </div>
      </footer>
    </div>
  );
}
