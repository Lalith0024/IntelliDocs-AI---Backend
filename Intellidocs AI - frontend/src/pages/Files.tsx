import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, Loader2, Database, Eye, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { filesService } from '../services/api';
import type { DataFile } from '../types/api';

export const Files = () => {
  const [files, setFiles] = useState<DataFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [loadingContent, setLoadingContent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch files from backend on mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const data = await filesService.listFiles();
        setFiles(data.files);
        setError(null);
      } catch (err) {
        setError('Failed to load files. Make sure the backend is running on port 8000.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  // Load file content when expanding
  const handleToggleFile = async (filename: string) => {
    if (expandedFile === filename) {
      setExpandedFile(null);
      return;
    }

    setExpandedFile(filename);

    if (!fileContents[filename]) {
      try {
        setLoadingContent(filename);
        const data = await filesService.getFileContent(filename);
        setFileContents(prev => ({ ...prev, [filename]: data.content }));
      } catch (err) {
        setFileContents(prev => ({ ...prev, [filename]: 'Error loading file content.' }));
        console.error(err);
      } finally {
        setLoadingContent(null);
      }
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(f =>
    f.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSize = files.reduce((sum, f) => sum + f.size_bytes, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pt-12 pb-24 px-6">
      {/* Page Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Database className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Knowledge Base</span>
            </div>
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Source Documents</h2>
              <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                {files.length} files
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search source files..."
          className="w-full h-14 pl-14 pr-6 bg-white border border-slate-200 rounded-2xl text-base font-medium text-slate-900 placeholder:text-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading source files...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl">
          <p className="text-sm font-bold text-rose-700">{error}</p>
          <p className="text-xs text-rose-500 mt-2">
            Run: <code className="bg-rose-100 px-1.5 py-0.5 rounded">cd main && uvicorn main:app --reload</code>
          </p>
        </div>
      )}

      {/* File List */}
      {!loading && !error && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" /> Source Evidence Files
            </h3>
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">
                Total: {formatSize(totalSize)} · {files.length} documents
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {filteredFiles.map((file) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={file.filename}
                  className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
                >
                  {/* File Header Row */}
                  <button
                    onClick={() => handleToggleFile(file.filename)}
                    className="w-full text-left p-6 flex items-center justify-between gap-6 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                        expandedFile === file.filename ? "bg-black text-white" : "bg-slate-100 text-slate-400"
                      )}>
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{file.filename}</div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {file.type}
                          </span>
                          <div className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {formatSize(file.size_bytes)}
                          </span>
                          <div className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {file.line_count} lines
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Indexed</span>
                      </div>
                      <div className="text-slate-400">
                        {expandedFile === file.filename ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {/* Expanded File Content */}
                  <AnimatePresence>
                    {expandedFile === file.filename && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      >
                        <div className="px-6 pb-6">
                          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl overflow-hidden">
                            {/* Content Header */}
                            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/60 bg-slate-100/50">
                              <div className="flex items-center gap-2">
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                  File Content — {file.filename}
                                </span>
                              </div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                {file.line_count} lines · {formatSize(file.size_bytes)}
                              </span>
                            </div>

                            {/* File Content with line numbers */}
                            <div className="p-5 max-h-96 overflow-y-auto">
                              {loadingContent === file.filename ? (
                                <div className="flex items-center gap-3 py-8 justify-center">
                                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                  <span className="text-sm text-slate-400 font-medium">Loading file content...</span>
                                </div>
                              ) : fileContents[file.filename] ? (
                                <div className="font-mono text-sm leading-relaxed">
                                  {fileContents[file.filename].split('\n').map((line, lineIdx) => (
                                    <div key={lineIdx} className="flex hover:bg-blue-50/50 transition-colors rounded group">
                                      <span className="select-none w-10 flex-shrink-0 text-right pr-4 text-slate-300 text-xs leading-relaxed group-hover:text-blue-400 transition-colors">
                                        {lineIdx + 1}
                                      </span>
                                      <span className="text-slate-700 whitespace-pre-wrap break-words flex-1">
                                        {line || '\u00A0'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-slate-400 italic">No content available</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredFiles.length === 0 && !loading && (
              <div className="text-center py-16">
                <p className="text-slate-400 font-medium">No files match your search.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
