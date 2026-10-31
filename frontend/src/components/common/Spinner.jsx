const Spinner = ({ size = 18 }) => (
  <span
    style={{ width: size, height: size }}
    className="inline-block animate-spin rounded-full border-2 border-white/30 border-t-white"
  />
);

export const FullScreenLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-soft border-t-primary" />
  </div>
);

export default Spinner;
