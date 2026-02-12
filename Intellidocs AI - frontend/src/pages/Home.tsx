import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SearchBar } from '../components/SearchBar';
import { AnswerPanel } from '../components/AnswerPanel';
import { SourceCard } from '../components/SourceCard';
import { DashboardSkeleton } from '../components/LoadingSkeleton';
import { queryService } from '../services/api';
import type { QueryResponse } from '../types/api';
import { Link } from 'react-router-dom';
import { Shield, Database, Sparkles, Clock, Globe, ArrowRight, AlertTriangle, MessageCircleQuestion } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const SUGGESTED_QUESTIONS = [
  { label: "Vehicle Color", question: "What color was the vehicle involved in the incident?" },
  { label: "Officer Arrival", question: "When did officers arrive at the scene?" },
  { label: "Suspect Identity", question: "Who is the suspect and what vehicle do they drive?" },
  { label: "Impact Speed", question: "What was the estimated speed at impact?" },
  { label: "Witness Account", question: "What did the witness see at the scene?" },
  { label: "Scene Location", question: "Where did the incident take place?" },
];

export const Home = () => {
  const [data, setData] = useState<QueryResponse | null>(null);

  const mutation = useMutation({
    mutationFn: (question: string) => queryService.performQuery({ question }),
    onSuccess: (response) => {
      setData(response);
    },
  });

  const handleSearch = (question: string) => {
    mutation.mutate(question);
  };

  const confidenceColor: Record<string, string> = {
    high: 'bg-emerald-500',
    medium: 'bg-amber-500',
    low: 'bg-rose-500',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12 px-6">
      {/* Hero Section */}
      <AnimatePresence mode="wait">
        {!data && !mutation.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="text-center space-y-6 pt-12 pb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em]">
              <Globe className="w-3.5 h-3.5" /> Semantic retrieval active
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Intelligent answers for <br /> every document.
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
              Search through your evidence files with neural-powered precision. Ask any question about the case documents.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Section */}
      <div className={cn("transition-all duration-700", data || mutation.isPending ? "scale-[0.98]" : "scale-100")}>
        <SearchBar onSearch={handleSearch} isLoading={mutation.isPending} />
      </div>

      {/* Suggested Questions — only show when no results yet */}
      <AnimatePresence>
        {!data && !mutation.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 px-2 text-slate-400">
              <MessageCircleQuestion className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Try these questions</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SUGGESTED_QUESTIONS.map((sq, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  onClick={() => handleSearch(sq.question)}
                  className="group text-left p-4 bg-white border border-slate-200/80 rounded-2xl hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer"
                >
                  <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest block mb-1.5">
                    {sq.label}
                  </span>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors leading-snug line-clamp-2">
                    {sq.question}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {mutation.isError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-rose-50 border border-rose-200 rounded-3xl flex items-center gap-4 shadow-sm"
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-rose-800">Connection Failed</p>
            <p className="text-[11px] text-rose-600/80 mt-1 leading-relaxed">
              We couldn't reach the intelligence engine. Please check if your backend is online.
              <span className="font-semibold px-1 italic">Note:</span> If using a free instance, the first request may take up to 50 seconds to boot the server.
            </p>
          </div>
        </motion.div>
      )}

      {/* Results Area */}
      <AnimatePresence mode="wait">
        {mutation.isPending ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-4">
            <DashboardSkeleton />
          </motion.div>
        ) : data ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pt-4"
          >
            {/* New Query Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setData(null)}
                className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all"
              >
                <MessageCircleQuestion className="w-3.5 h-3.5" /> New Question
              </button>
            </div>

            {/* 1. Primary Highlight (Response Content) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-2 text-slate-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest px-1">Synthesis Report</span>
              </div>
              <AnswerPanel data={data} />
            </div>

            {/* 2. Real Insights Hub — from actual backend data */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Latency</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-300" />
                  <span className="text-base font-bold text-slate-900">{data.retrieval_time_ms}ms</span>
                </div>
              </div>
              <div className="p-5 bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Sources</span>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-300" />
                  <span className="text-base font-bold text-slate-900">
                    {data.valid_count} / {data.retrieval_count} matched
                  </span>
                </div>
              </div>
              <div className="p-5 bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Confidence</span>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    confidenceColor[data.confidence] || 'bg-slate-400'
                  )} />
                  <span className="text-base font-bold text-slate-900">{data.confidence}</span>
                </div>
              </div>
              <div className="p-5 bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Threshold</span>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-300" />
                  <span className="text-base font-bold text-slate-900">{data.similarity_threshold}</span>
                </div>
              </div>
            </div>

            {/* 3. Evidence Collection */}
            {data.retrieved_documents.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Database className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Evidence Collection</span>
                  </div>
                  <Link to="/files" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                    View All Source Files <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {data.retrieved_documents.map((source, idx) => (
                    <SourceCard key={idx} source={source} index={idx} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Home;