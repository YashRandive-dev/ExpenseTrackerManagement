const EmptyState = ({ title = "Nothing here yet", message = "Add your first entry to get started." }) => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <svg width="140" height="120" viewBox="0 0 140 120" fill="none" aria-hidden="true">
      <ellipse cx="70" cy="108" rx="44" ry="6" fill="rgba(124,92,255,0.18)" />
      <rect x="22" y="30" width="96" height="66" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" />
      <rect x="34" y="46" width="50" height="8" rx="4" fill="rgba(124,92,255,0.6)" />
      <rect x="34" y="62" width="72" height="6" rx="3" fill="rgba(255,255,255,0.18)" />
      <rect x="34" y="76" width="40" height="6" rx="3" fill="rgba(255,255,255,0.12)" />
      <circle cx="112" cy="30" r="16" fill="rgba(34,211,160,0.2)" stroke="rgba(34,211,160,0.8)" />
      <path d="M112 23v14M105 30h14" stroke="rgba(34,211,160,1)" strokeWidth="3" strokeLinecap="round" />
    </svg>
    <p className="mt-3 text-sm font-medium text-ink">{title}</p>
    <p className="mt-1 max-w-xs text-xs text-muted">{message}</p>
  </div>
);

export default EmptyState;
