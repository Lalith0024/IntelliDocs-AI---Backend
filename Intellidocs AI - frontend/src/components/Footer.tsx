export const Footer = () => {
  return (
    <footer className="mt-auto py-10 px-8 border-t border-slate-200/60 bg-white">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
        <span>© 2026 IntelliDocs AI - Enterprise Neural retrieval</span>
        <div className="flex gap-8">
          <a href="#" className="hover:text-slate-900 transition-colors">Compliance</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Engine Docs</a>
        </div>
      </div>
    </footer>
  );
};
