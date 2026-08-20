import React from 'react';
import { simulateAll, ALGORITHMS } from '../utils/pageReplacementAlgorithms';
import { Trophy, BarChart3, AlertOctagon, CheckCircle2, Award, Zap } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';

export default function ComparisonView({ pages, frameCount }) {
  const results = simulateAll(pages, frameCount);
  const resultsList = Object.values(results);

  // Sort by fewest page faults
  const sortedByFaults = [...resultsList].sort((a, b) => a.totalFaults - b.totalFaults);
  const minFaults = sortedByFaults[0]?.totalFaults;

  const chartData = resultsList.map((res) => ({
    name: res.algorithm,
    Faults: res.totalFaults,
    Hits: res.totalHits,
    'Hit Ratio %': parseFloat(res.hitRatio),
    isWinner: res.totalFaults === minFaults,
  }));

  const colors = {
    [ALGORITHMS.FIFO]: '#38bdf8', // sky-400
    [ALGORITHMS.LRU]: '#a855f7', // purple-500
    [ALGORITHMS.OPTIMAL]: '#10b981', // emerald-500
    [ALGORITHMS.LFU]: '#f59e0b', // amber-500
    [ALGORITHMS.SECOND_CHANCE]: '#ec4899', // pink-500
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Best Performing Algorithm */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-500 text-slate-950 rounded-2xl shadow-lg shadow-emerald-500/30">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
              Best Performing Algorithm
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              {sortedByFaults.filter((r) => r.totalFaults === minFaults).map((r) => r.algorithm).join(' & ')}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Achieved the lowest Page Fault count of{' '}
              <span className="text-emerald-400 font-bold">{minFaults} faults</span> ({sortedByFaults[0]?.hitRatio}% Hit Ratio) on {pages.length} total references with {frameCount} memory frames.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950/60 px-4 py-3 rounded-xl border border-slate-800">
          <Zap className="w-5 h-5 text-amber-400" />
          <div className="text-xs font-mono">
            <div className="text-slate-400">Tested Frames: <strong className="text-cyan-400">{frameCount} Slots</strong></div>
            <div className="text-slate-400">Total Requests: <strong className="text-cyan-400">{pages.length} Pages</strong></div>
          </div>
        </div>
      </div>

      {/* Grid of Algorithm Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {resultsList.map((res) => {
          const isWinner = res.totalFaults === minFaults;
          return (
            <div
              key={res.algorithm}
              className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                isWinner
                  ? 'bg-slate-900/90 border-emerald-500/60 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isWinner && (
                <div className="absolute -top-3 right-3 bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md flex items-center space-x-1">
                  <Award className="w-3 h-3" />
                  <span>OPTIMAL LEADER</span>
                </div>
              )}

              <div>
                <div className="text-sm font-extrabold text-slate-200 flex items-center justify-between mb-3">
                  <span>{res.algorithm}</span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[res.algorithm] }}
                  />
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                      <span>Page Faults:</span>
                    </span>
                    <span className="font-extrabold text-rose-400 text-sm">{res.totalFaults}</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Page Hits:</span>
                    </span>
                    <span className="font-extrabold text-emerald-400 text-sm">{res.totalHits}</span>
                  </div>
                </div>
              </div>

              {/* Progress bar for Hit Ratio */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Hit Ratio</span>
                  <span className="text-cyan-400 font-bold">{res.hitRatio}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${res.hitRatio}%`,
                      backgroundColor: colors[res.algorithm],
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Recharts Bar Graph Comparison */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Comparative Bar Chart: Page Faults & Hit Ratios</span>
          </h3>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="Faults" fill="#f43f5e" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isWinner ? '#10b981' : '#f43f5e'}
                  />
                ))}
              </Bar>
              <Bar dataKey="Hit Ratio %" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
