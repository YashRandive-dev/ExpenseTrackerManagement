import { useCallback, useEffect, useState } from "react";

/** Seconds-left counter for "resend code" buttons. */
export const useCountdown = (initial = 60) => {
  const [left, setLeft] = useState(initial);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const restart = useCallback((n = initial) => setLeft(n), [initial]);
  return [left, restart];
};
