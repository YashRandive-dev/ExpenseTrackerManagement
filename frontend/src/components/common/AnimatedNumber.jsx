import { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { formatCurrency } from "../../utils/helper";

const AnimatedNumber = ({ value = 0, format = formatCurrency, duration = 1.2 }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, Number(value) || 0, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value, duration]);

  return <span>{format(display)}</span>;
};

export default AnimatedNumber;
