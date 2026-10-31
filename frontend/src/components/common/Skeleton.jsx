export const Skeleton = ({ className = "", style }) => (
  <div style={style} className={`animate-pulse rounded-xl bg-[rgba(255,255,255,0.08)] ${className}`} />
);

export const SkeletonList = ({ count = 4, className = "" }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
    ))}
  </div>
);

export const SkeletonChart = ({ height = 280 }) => (
  <div className="flex items-end gap-3" style={{ height }}>
    {[45, 70, 35, 85, 55, 65, 40, 75].map((h, i) => (
      <Skeleton key={i} className="flex-1" style={{ height: `${h}%` }} />
    ))}
  </div>
);
