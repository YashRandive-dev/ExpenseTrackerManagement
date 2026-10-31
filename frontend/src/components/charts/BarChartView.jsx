import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import CustomTooltip from "./CustomTooltip";
import EmptyState from "../common/EmptyState";

/** data: [{ label, amount }] */
const BarChartView = ({ data = [], color = "rgba(255, 82, 120, 1)", id = "bar", height = 300 }) => {
  if (!data.length) {
    return <EmptyState title="No data to chart" message="Add some transactions to see this chart." />;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.25} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.07)" />
        <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip color={color} />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
        <Bar dataKey="amount" fill={`url(#${id}-grad)`} radius={[8, 8, 0, 0]} maxBarSize={44} animationDuration={900} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartView;
