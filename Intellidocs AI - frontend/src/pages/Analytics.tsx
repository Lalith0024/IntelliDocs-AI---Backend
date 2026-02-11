import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Clock, Zap, Target, FileText, TrendingUp, Loader2, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { statsService } from '../services/api';
import type { StatsResponse } from '../types/api';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export const Analytics = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await statsService.getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const confidenceData = stats ? [
    { name: 'High', value: stats.confidence_distribution.high },
    { name: 'Medium', value: stats.confidence_distribution.medium },
    { name: 'Low', value: stats.confidence_distribution.low },
  ] : [];

  const hasConfidenceData = confidenceData.some(d => d.value > 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pt-12 pb-24 px-6">
      {/* Page Header */}
      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-blue-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Live Analytics</span>
            </div>
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Query Analytics</h2>
            </div>
          </div>
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            Refresh
          </button>
        </div>
        <p className="text-slate-500 font-medium">
          Real-time performance metrics from the evidence intelligence pipeline. Stats update automatically.
        </p>
      </div>

      {/* Loading */}
      {loading && !stats && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading analytics...</span>
        </div>
      )}

      {/* Error */}
      {error && !stats && (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl">
          <p className="text-sm font-bold text-rose-700">{error}</p>
        </div>
      )}

      {/* Stats Content */}
      {stats && (
        <>
          {/* Primary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col gap-4"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.1em]">Total Queries</span>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  {stats.total_queries}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mt-2">
                  {stats.total_queries === 0 ? 'No queries yet — try searching!' : 'From this session'}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-8 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col gap-4"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.1em]">Avg Latency</span>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  {stats.avg_latency_ms}ms
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mt-2">
                  Retrieval + embedding time
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-8 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col gap-4"
            >
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.1em]">Success Rate</span>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  {stats.success_rate}%
                </div>
                <div className="text-[10px] font-bold text-emerald-500 uppercase mt-2">
                  Queries with matching evidence
                </div>
              </div>
            </motion.div>
          </div>

          {/* Confidence Distribution + Recent Queries */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pie Chart */}
            <div className="lg:col-span-1 p-8 bg-white border border-slate-200 shadow-sm rounded-[40px] flex flex-col items-center">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest self-start mb-8 text-center w-full">
                Confidence Distribution
              </h3>
              {hasConfidenceData ? (
                <>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={confidenceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {confidenceData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 mt-4">
                    {confidenceData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          {d.name} ({d.value})
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <p className="text-sm text-slate-400 font-medium">No data yet</p>
                  <p className="text-xs text-slate-300">Run some queries to see the distribution</p>
                </div>
              )}
            </div>

            {/* Recent Queries */}
            <div className="lg:col-span-2 p-8 bg-white border border-slate-200 shadow-sm rounded-[40px]">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> Recent Queries
              </h3>
              <div className="space-y-4">
                {stats.recent_queries.length > 0 ? (
                  stats.recent_queries.map((q, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {q.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {q.question}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {q.retrieval_time_ms}ms · {q.valid_count}/{q.retrieval_count} sources · {q.confidence} confidence
                          </div>
                        </div>
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full flex-shrink-0 ml-4",
                        q.confidence === 'high' ? 'bg-emerald-50 text-emerald-600' :
                          q.confidence === 'medium' ? 'bg-amber-50 text-amber-600' :
                            'bg-rose-50 text-rose-500'
                      )}>
                        {q.confidence}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                      <Zap className="w-8 h-8" />
                    </div>
                    <p className="text-sm text-slate-400 font-medium">No queries yet</p>
                    <p className="text-xs text-slate-300">Go to the Research page and ask a question to see analytics here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
