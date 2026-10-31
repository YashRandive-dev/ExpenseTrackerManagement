const Blobs = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div className="absolute -left-24 -top-24 h-96 w-96 animate-float rounded-full bg-[rgba(124,92,255,0.35)] blur-3xl" />
    <div className="absolute -right-20 top-1/3 h-[26rem] w-[26rem] animate-float-slow rounded-full bg-[rgba(56,189,248,0.22)] blur-3xl" />
    <div className="absolute -bottom-32 left-1/3 h-96 w-96 animate-float rounded-full bg-[rgba(255,82,120,0.2)] blur-3xl" />
    <div className="absolute bottom-10 right-1/4 h-64 w-64 animate-float-slow rounded-full bg-[rgba(34,211,160,0.15)] blur-3xl" />
  </div>
);

export default Blobs;
