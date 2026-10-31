import { formatCurrency } from "../../utils/helper";

const CustomTooltip = ({ active, payload, label, color = "rgba(124, 92, 255, 1)" }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const title = item.payload?.name || label;

  return (
    <div
      className="rounded-xl border px-3 py-2 text-xs shadow-glow"
      style={{
        background: "rgba(18, 20, 44, 0.92)",
        borderColor: "rgba(255, 255, 255, 0.14)",
        backdropFilter: "blur(10px)",
      }}
    >
      <p className="mb-0.5 font-semibold" style={{ color }}>
        {title}
      </p>
      <p className="text-sm text-ink">{formatCurrency(item.value)}</p>
    </div>
  );
};

export default CustomTooltip;
