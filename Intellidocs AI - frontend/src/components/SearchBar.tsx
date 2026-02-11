import React, { useState, useEffect, useRef } from 'react';
import { Search, CornerDownLeft, Loader2, X, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';
import type { SearchHistoryItem } from '../types/api';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('search_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const saveToHistory = (q: string) => {
    if (!q.trim()) return;
    const newHistory = [
      { id: Date.now().toString(), question: q, timestamp: Date.now() },
      ...history.filter(h => h.question !== q).slice(0, 5)
    ];
    setHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
      saveToHistory(query);
      setShowHistory(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full z-[100]">
      <div className={cn(
        "relative transition-slow p-[1.5px] rounded-3xl",
        isFocused ? "bg-slate-900 shadow-2xl scale-[1.01]" : "bg-slate-200 shadow-sm"
      )}>
        <form
          onSubmit={handleSubmit}
          className={cn(
            "relative flex items-center h-20 px-8 rounded-[22px] transition-slow",
            isFocused ? "bg-slate-900" : "bg-white"
          )}
        >
          <div className="flex-shrink-0 mr-5">
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            ) : (
              <Search className={cn("w-6 h-6 transition-slow", isFocused ? "text-blue-500" : "text-slate-300")} />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (history.length > 0) setShowHistory(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              setTimeout(() => setShowHistory(false), 200);
            }}
            placeholder="Ask a question about your documents..."
            className={cn(
              "flex-1 bg-transparent border-none outline-none text-xl font-medium tracking-tight h-full",
              isFocused ? "text-white" : "text-slate-900 placeholder:text-slate-300"
            )}
          />

          <div className="flex items-center gap-4 ml-4">
            {query && !isLoading && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className={cn(
                  "p-2 rounded-full transition-all",
                  isFocused ? "hover:bg-white/10 text-white/40" : "hover:bg-slate-100 text-slate-300"
                )}
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className={cn(
                "hidden sm:flex items-center gap-2 h-10 px-5 rounded-xl font-bold text-xs uppercase tracking-widest transition-slow",
                isFocused
                  ? "bg-white text-slate-900 shadow-lg"
                  : query.trim() && !isLoading
                    ? "bg-slate-900 text-white shadow-md hover:bg-slate-800"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
              )}
            >
              <span>Search</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {showHistory && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-[100]"
          >
            <div className="px-8 py-3 bg-slate-50 border-b border-slate-100">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 font-mono">
                Recent_History
              </span>
            </div>
            <div className="py-2">
              {history.map((item) => (
                <button
                  key={item.id}
                  onMouseDown={() => {
                    setQuery(item.question);
                    onSearch(item.question);
                    setShowHistory(false);
                  }}
                  className="w-full flex items-center px-8 py-4 hover:bg-slate-50 text-left transition-colors group"
                >
                  <Sparkles className="w-4 h-4 mr-6 text-slate-200 group-hover:text-blue-500" />
                  <span className="text-base font-medium text-slate-600 group-hover:text-slate-900 truncate">{item.question}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
