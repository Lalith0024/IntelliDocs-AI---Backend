import { cn } from '../utils/cn';

interface ConfidenceBadgeProps {
  level: 'High' | 'Medium' | 'Low' | string;
  className?: string;
}

export const ConfidenceBadge = ({ level, className }: ConfidenceBadgeProps) => {
  const getStyles = () => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border-amber-100';
      case 'low':
        return 'text-rose-700 bg-rose-50 border-rose-100';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[9px] font-bold border uppercase tracking-widest transition-all",
      getStyles(),
      className
    )}>
      {level.charAt(0).toUpperCase() + level.slice(1)} Confidence
    </span>
  );
};
