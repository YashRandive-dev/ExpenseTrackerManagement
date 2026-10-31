import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import CustomTooltip from "./CustomTooltip";
import EmptyState from "../common/EmptyState";

/** data: [{ label, amount }] */
const AreaChartView = ({ data = [], color = "rgba(255, 82, 120, 1)", id = "area", height = 300 }) => {
  if (!data.length) {
    return <EmptyState title="No data to chart" message="Add some transactions to see this chart." />;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.55} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.07)" />
        <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip color={color} />} cursor={{ stroke: "rgba(255,255,255,0.2)" }} />
        <Area
          type="monotone"
          dataKey="amount"
          stroke={color}
          strokeWidth={3}
          fill={`url(#${id}-grad)`}
          dot={{ r: 4, fill: color, strokeWidth: 0 }}
          activeDot={{ r: 6 }}
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartView;
