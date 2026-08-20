import React from 'react';
import { Table, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export default function StepTable({ steps, frameCount, activeStepIndex, onSelectStep }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
          <Table className="w-4 h-4 text-cyan-400" />
          <span>Execution Step-by-Step Trace Table</span>
        </h3>
        <span className="text-xs text-slate-500 font-mono">Click any row to jump to step</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="bg-slate-950/90 text-slate-400 border-b border-slate-800">
              <th className="py-3 px-3 text-center w-16">Step</th>
              <th className="py-3 px-3 text-center w-24">Page Req</th>
              {Array.from({ length: frameCount }).map((_, i) => (
                <th key={i} className="py-3 px-3 text-center border-l border-slate-800/60">
                  Frame {i}
                </th>
              ))}
              <th className="py-3 px-4 text-center border-l border-slate-800/60">Result</th>
              <th className="py-3 px-4 text-center border-l border-slate-800/60">Evicted Page</th>
              <th className="py-3 px-4 text-left border-l border-slate-800/60">Step Log</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {steps.map((st, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <tr
                  key={idx}
                  onClick={() => onSelectStep(idx)}
                  className={`cursor-pointer transition-all ${
                    isActive
                      ? 'bg-cyan-950/40 text-cyan-200 font-bold border-l-4 border-l-cyan-400'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <td className="py-2.5 px-3 text-center text-slate-400 font-bold">{st.step}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-block px-2.5 py-1 rounded bg-slate-800 font-extrabold text-cyan-300 border border-slate-700">
                      {st.page}
                    </span>
                  </td>
                  {st.frames.map((fPage, fIdx) => {
                    const isUpdatedFrame = st.targetFrameIndex === fIdx;
                    return (
                      <td
                        key={fIdx}
                        className={`py-2.5 px-3 text-center border-l border-slate-800/40 ${
                          isUpdatedFrame
                            ? st.isHit
                              ? 'bg-emerald-950/30 text-emerald-300 font-extrabold'
                              : 'bg-rose-950/30 text-rose-300 font-extrabold'
                            : 'text-slate-400'
                        }`}
                      >
                        {fPage !== null ? fPage : '-'}
                      </td>
                    );
                  })}
                  <td className="py-2.5 px-4 text-center border-l border-slate-800/40">
                    {st.isHit ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40 text-[11px]">
                        <CheckCircle className="w-3 h-3" />
                        <span>HIT</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800/40 text-[11px]">
                        <AlertCircle className="w-3 h-3" />
                        <span>FAULT</span>
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-center border-l border-slate-800/40 text-slate-400">
                    {st.replacedPage !== null ? (
                      <span className="text-rose-400 font-bold px-1.5 py-0.5 rounded bg-rose-950/30">
                        {st.replacedPage}
                      </span>
                    ) : (
                      <span className="text-slate-600">None</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-left border-l border-slate-800/40 text-slate-400 max-w-md truncate">
                    {st.explanation}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
