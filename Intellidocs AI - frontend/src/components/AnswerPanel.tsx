import { CheckCircle2, AlertTriangle, Quote, Info } from 'lucide-react';
import type { QueryResponse } from '../types/api';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface AnswerPanelProps {
  data: QueryResponse;
}

export const AnswerPanel = ({ data }: AnswerPanelProps) => {
  const isFailed = !data.success;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "answer-card overflow-hidden",
        isFailed ? "border-amber-200 bg-white" : "border-slate-200 bg-white"
      )}
    >
      <div className="p-8 lg:p-12 space-y-10">
        {/* Status Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              isFailed ? "bg-amber-100 text-amber-600" : "bg-black text-white"
            )}>
              {isFailed ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {isFailed ? "No Relevant Evidence Found" : "Evidence-Based Answer"}
              </h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                {isFailed
                  ? `${data.retrieval_count} documents searched · 0 passed threshold`
                  : `${data.valid_count} of ${data.retrieval_count} sources matched · ${data.retrieval_time_ms}ms`
                }
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200/60">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Confidence: {data.confidence}</span>
          </div>
        </div>

        {/* The Answer Content */}
        <div className="relative">
          <Quote className="absolute -top-6 -left-6 w-12 h-12 text-slate-100 -rotate-12" />
          <p className={cn(
            "text-2xl lg:text-3xl leading-[1.4] tracking-tight font-medium",
            isFailed ? "text-slate-400 italic" : "text-slate-900"
          )}>
            {data.answer}
          </p>
        </div>

        {/* Source verification — real data */}
        {!isFailed && data.retrieved_documents.length > 0 && (
          <div className="pt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {data.retrieved_documents.filter(d => d.passed_threshold).map((_, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500">
                  {i + 1}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              {data.valid_count} source{data.valid_count !== 1 ? 's' : ''} verified · Threshold {data.similarity_threshold}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
