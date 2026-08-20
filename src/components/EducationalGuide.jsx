import React, { useState } from 'react';
import { BookOpen, CheckCircle2, XCircle, HelpCircle, RefreshCw, Cpu, Zap, Layers, AlertCircle } from 'lucide-react';

export default function EducationalGuide() {
  const [activeTheoryTab, setActiveTheoryTab] = useState('overview');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const algorithmsInfo = [
    {
      id: 'fifo',
      name: 'FIFO (First-In, First-Out)',
      tagline: 'Oldest Page Replaced First',
      timeComplexity: 'O(1) insertion/deletion',
      spaceComplexity: 'O(M) queue overhead',
      description:
        'FIFO maintains a queue of all pages currently in memory. When a page fault occurs and memory is full, the page at the front of the queue (the oldest page loaded) is evicted.',
      pros: ['Simple to understand and implement using a FIFO queue', 'Low algorithmic overhead'],
      cons: ['May evict heavily used pages simply because they arrived early', "Suffer from Belady's Anomaly (faults can increase with more frames)"],
    },
    {
      id: 'lru',
      name: 'LRU (Least Recently Used)',
      tagline: 'Page Not Used for Longest Time Replaced',
      timeComplexity: 'O(1) with Doubly-Linked List + Hash Map',
      spaceComplexity: 'O(M) for tracking access history',
      description:
        'LRU looks backward in time. When a page fault occurs, it replaces the page that has not been referenced for the longest duration in past steps. Based on the Principle of Temporal Locality.',
      pros: ['Excellent performance in real workloads', "Belady Anomaly immune (Stack Algorithm)", 'Captures locality of reference effectively'],
      cons: ['Requires hardware/software tracking of timestamps or stack updates on EVERY memory access', 'Higher memory/CPU overhead'],
    },
    {
      id: 'opt',
      name: 'Optimal (OPT / Belady’s)',
      tagline: 'Page Not Used for Longest Time in Future Replaced',
      timeComplexity: 'O(N * M) lookahead',
      spaceComplexity: 'O(M)',
      description:
        'Optimal looks forward in time. When a page fault occurs, it evicts the page that will not be referenced for the longest time in the future (or never used again). It serves as the benchmark theoretical ceiling.',
      pros: ['Guarantees minimum possible page faults for any given reference string', 'Ideal benchmark standard'],
      cons: ['Impossible to implement in real OS kernel (requires future knowledge of page requests)', 'Used strictly for offline analysis'],
    },
    {
      id: 'lfu',
      name: 'LFU (Least Frequently Used)',
      tagline: 'Page with Lowest Reference Counter Replaced',
      timeComplexity: 'O(log M) with Min-Heap',
      spaceComplexity: 'O(P) tracking counters for all pages',
      description:
        'LFU maintains a frequency counter for each page. Upon a page fault, the page with the lowest access count is evicted. Ties are broken using FIFO arrival order.',
      pros: ['Keeps heavily accessed pages in memory over long periods'],
      cons: ['Pages accessed heavily early on can accumulate high frequency and stay in RAM forever even if no longer needed (frequency pollution)', 'Requires counter aging mechanisms'],
    },
    {
      id: 'sc',
      name: 'Second Chance (Clock Algorithm)',
      tagline: 'FIFO with Reference Bit (R-Bit) Grace Period',
      timeComplexity: 'O(1) average case pointer movement',
      spaceComplexity: 'O(M) for single R-bit per frame slot',
      description:
        'Approximates LRU efficiently in hardware. Frames are arranged in a circular buffer with a clock pointer and a single reference bit (R=0 or 1). On access, R=1. On fault, pointer inspects R-bit: if R=1, sets R=0 and gives a second chance; if R=0, evicts page.',
      pros: ['Very fast hardware approximation of LRU used in real kernels (e.g. BSD/Linux)', 'Low memory overhead (only 1 bit per page frame)'],
      cons: ['Degenerates to standard FIFO if all reference bits are 1'],
    },
  ];

  const quizQuestions = [
    {
      id: 1,
      question: 'Which page replacement algorithm can suffer from Belady’s Anomaly?',
      options: ['Optimal (OPT)', 'LRU', 'FIFO', 'Second Chance'],
      correct: 2,
      explanation: "Belady's Anomaly is a counter-intuitive phenomenon where increasing frame count increases page faults; FIFO is vulnerable to it.",
    },
    {
      id: 2,
      question: 'Why cannot the Optimal (OPT) page replacement algorithm be implemented in standard Operating System kernels?',
      options: [
        'It requires too much RAM memory',
        'It requires future knowledge of page reference requests',
        'It causes system thrashing',
        'It has an O(2^N) time complexity',
      ],
      correct: 1,
      explanation: 'Optimal algorithm requires predicting future memory accesses, which is impossible in real-time general computing.',
    },
    {
      id: 3,
      question: 'In the Second Chance (Clock) algorithm, what happens when the clock pointer encounters a frame with Reference Bit R = 1?',
      options: [
        'The page is immediately evicted',
        'The Reference Bit is set to 0 and pointer advances (Second Chance given)',
        'The system crashes',
        'The Reference Bit is set to 2',
      ],
      correct: 1,
      explanation: 'If R=1, the algorithm gives the page a second chance by clearing R to 0 and advancing the clock hand to check the next slot.',
    },
    {
      id: 4,
      question: 'Which property guarantees that an algorithm is immune to Belady’s Anomaly?',
      options: ['Being a Stack Algorithm', 'Having O(1) complexity', 'Using a circular queue', 'Having a clock pointer'],
      correct: 0,
      explanation: 'Stack algorithms (like LRU and Optimal) satisfy the condition that pages in n frames are a subset of pages in n+1 frames, making them immune.',
    },
    {
      id: 5,
      question: 'What is "Thrashing" in Operating Systems memory management?',
      options: [
        'Physical destruction of RAM sticks',
        'When the CPU spends more time swapping pages in/out than executing processes',
        'When all page frames are empty',
        'When FIFO runs out of queue memory',
      ],
      correct: 1,
      explanation: 'Thrashing occurs when total working set demands exceed physical RAM, causing continuous high page fault rates and near-zero CPU throughput.',
    },
  ];

  const handleSelectOption = (qId, optionIdx) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct) score++;
    });
    return score;
  };

  return (
    <div className="space-y-6">
      {/* Header & Subnav */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">OS Virtual Memory & Algorithms Theory</h2>
              <p className="text-xs text-slate-400">Master page faults, thrashing, and memory management concepts</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTheoryTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTheoryTab === 'overview'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Algorithms Guide
            </button>
            <button
              onClick={() => setActiveTheoryTab('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTheoryTab === 'quiz'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Interactive Quiz
            </button>
          </div>
        </div>

        {/* Tab 1: Algorithms Guide */}
        {activeTheoryTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {algorithmsInfo.map((algo) => (
                <div key={algo.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-extrabold text-cyan-400 text-sm">{algo.name}</h3>
                    </div>
                    <div className="text-[11px] text-slate-400 italic mb-3">{algo.tagline}</div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">{algo.description}</p>
                    
                    <div className="space-y-2 text-[11px] font-mono mb-4 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-cyan-300">Time: {algo.timeComplexity}</div>
                      <div className="text-purple-300">Space: {algo.spaceComplexity}</div>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="font-bold text-emerald-400">Pros:</div>
                      {algo.pros.map((p, i) => (
                        <div key={i} className="text-slate-400 flex items-start space-x-1">
                          <span className="text-emerald-500">•</span>
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 text-[11px] space-y-1">
                    <div className="font-bold text-rose-400">Cons:</div>
                    {algo.cons.map((c, i) => (
                      <div key={i} className="text-slate-400 flex items-start space-x-1">
                        <span className="text-rose-500">•</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Quiz */}
        {activeTheoryTab === 'quiz' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Knowledge Check: 5 Questions
              </h3>
              {showQuizResults && (
                <button
                  onClick={() => {
                    setQuizAnswers({});
                    setShowQuizResults(false);
                  }}
                  className="flex items-center space-x-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-950/50 px-3 py-1 rounded-lg border border-cyan-800"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Quiz</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {quizQuestions.map((q) => {
                const userAns = quizAnswers[q.id];
                const isCorrect = userAns === q.correct;
                return (
                  <div key={q.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="text-xs font-extrabold text-slate-200">
                      Q{q.id}. {q.question}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = userAns === oIdx;
                        let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850';

                        if (showQuizResults) {
                          if (oIdx === q.correct) {
                            btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300';
                          }
                        } else if (isSelected) {
                          btnStyle = 'bg-cyan-950/60 border-cyan-500 text-cyan-300 font-bold';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(q.id, oIdx)}
                            className={`p-3 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {showQuizResults && (
                      <div className="text-xs font-mono bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-slate-300">
                        <strong className="text-cyan-400">Explanation: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!showQuizResults ? (
              <button
                onClick={() => setShowQuizResults(true)}
                disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                className="w-full py-3 rounded-xl font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20"
              >
                Submit & Check Answers
              </button>
            ) : (
              <div className="bg-gradient-to-r from-cyan-950 to-emerald-950 border border-cyan-500/40 rounded-2xl p-6 text-center space-y-2">
                <div className="text-sm font-bold text-slate-300">Quiz Completed!</div>
                <div className="text-3xl font-extrabold text-cyan-400 font-mono">
                  Score: {calculateScore()} / {quizQuestions.length}
                </div>
                <p className="text-xs text-slate-400">
                  {calculateScore() === 5
                    ? '🎉 Perfect Score! Exceptional OS Memory Knowledge.'
                    : 'Good effort! Review the algorithm explanations above to master all concepts.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
