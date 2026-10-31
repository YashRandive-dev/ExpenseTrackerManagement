import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import CustomTooltip from "./CustomTooltip";
import EmptyState from "../common/EmptyState";
import { formatCurrency } from "../../utils/helper";

export const PALETTE = [
  "rgba(124, 92, 255, 1)",
  "rgba(34, 211, 160, 1)",
  "rgba(56, 189, 248, 1)",
  "rgba(255, 82, 120, 1)",
  "rgba(251, 191, 36, 1)",
  "rgba(244, 114, 182, 1)",
];

/** data: [{ name, amount }], colors: string[] */
const DonutChart = ({ data = [], colors = PALETTE, centerLabel, centerValue, height = 280 }) => {
  const hasData = data.some((d) => d.amount > 0);

  if (!hasData) {
    return <EmptyState title="No data to chart" message="Add some transactions to see this chart." />;
  }

  return (
    <div>
      <div className="relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="name"
              innerRadius="62%"
              outerRadius="88%"
              paddingAngle={3}
              stroke="none"
              animationDuration={900}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {centerLabel && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-muted">{centerLabel}</span>
            <span className="text-lg font-semibold text-ink">{formatCurrency(centerValue)}</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 text-xs text-muted">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[i % colors.length] }} />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
