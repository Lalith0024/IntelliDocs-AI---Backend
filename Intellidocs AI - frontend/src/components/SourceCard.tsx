import { useState } from 'react';
import { FileText, ChevronRight, ChevronDown, Eye, Hash, ShieldCheck, ShieldX } from 'lucide-react';
import type { Source } from '../types/api';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

interface SourceCardProps {
  source: Source;
  index: number;
}

export const SourceCard = ({ source, index }: SourceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  const confidenceColor = {
    high: 'text-emerald-600',
    medium: 'text-amber-600',
    low: 'text-rose-500',
  }[source.confidence] || 'text-slate-400';

  const scorePercent = Math.round(source.score * 100);

  return (
    <div className={cn(
      "source-item overflow-hidden transition-slow",
      isExpanded ? "ring-2 ring-blue-500/10 shadow-md" : "shadow-sm"
    )}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-6 flex items-start justify-between gap-6"
      >
        <div className="flex gap-6">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-slow",
            isExpanded ? "bg-black text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
          )}>
            <FileText className="w-6 h-6" />
          </div>
          <div className="pt-0.5">
            <h4 className={cn(
              "text-lg font-bold transition-colors",
              isExpanded ? "text-slate-900" : "text-slate-700"
            )}>
              {source.filename}
            </h4>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Hash className="w-3 h-3" /> Score: {scorePercent}%
              </span>
              <div className="h-3 w-[1px] bg-slate-200" />
              <span className={cn("text-[10px] font-bold uppercase tracking-widest", confidenceColor)}>
                {source.confidence} confidence
              </span>
              <div className="h-3 w-[1px] bg-slate-200" />
              {source.passed_threshold ? (
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Passed Threshold
                </span>
              ) : (
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1">
                  <ShieldX className="w-3 h-3" /> Below Threshold
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-2 text-slate-400">
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="px-6 pb-6 pt-0 ml-18">
              <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Eye className="w-3 h-3" /> Source File Content
                  </span>
                  <pre className="text-slate-600 leading-relaxed text-sm font-medium whitespace-pre-wrap font-sans max-h-60 overflow-y-auto">
                    {source.content}
                  </pre>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Similarity: {source.score.toFixed(4)}</span>
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      source.passed_threshold ? "bg-emerald-500" : "bg-rose-500"
                    )} />
                    <span className={source.passed_threshold ? "text-emerald-600" : "text-rose-500"}>
                      {source.passed_threshold ? "Verified Match" : "Weak Match"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
