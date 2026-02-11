import { LayoutDashboard, Database, BarChart3, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../utils/cn';

export const Header = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Research', to: '/' },
    { icon: Database, label: 'Files', to: '/files' },
    { icon: BarChart3, label: 'Analytics', to: '/analytics' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="IntelliDocs AI Logo" className="w-8 h-8 rounded-lg shadow-sm" />
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-bold text-slate-900 tracking-tight">IntelliDocs AI</h1>
          <span className="text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white px-2 py-0.5 rounded-full shadow-sm">Beta</span>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
              isActive
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
          <Settings className="w-4 h-4" />
        </button>
        <div className="h-4 w-[1px] bg-slate-200" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
            KL
          </div>
        </div>
      </div>
    </header>
  );
};
