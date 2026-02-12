import { cn } from '../utils/cn';

export const LoadingSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn(
      "relative overflow-hidden bg-slate-100 rounded-xl",
      "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:white/80 after:to-transparent",
      className
    )} />
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto py-10 opacity-70">
      {/* HUD Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl space-y-3">
            <LoadingSkeleton className="h-2 w-16" />
            <LoadingSkeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Answer Skeleton */}
      <div className="bg-white border border-slate-100 rounded-[40px] p-12 space-y-12 shadow-sm">
        <div className="flex items-center gap-4 pb-8 border-b border-slate-50">
          <LoadingSkeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <LoadingSkeleton className="h-4 w-48" />
            <LoadingSkeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="space-y-4">
          <LoadingSkeleton className="h-6 w-full" />
          <LoadingSkeleton className="h-6 w-5/6" />
          <LoadingSkeleton className="h-6 w-4/6" />
        </div>
      </div>
    </div>
  );
};
