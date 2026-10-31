import { motion } from "framer-motion";
import AnimatedNumber from "../common/AnimatedNumber";

const THEMES = {
  balance: { soft: "bg-balance-soft", text: "text-balance", glow: "hover:shadow-glow-balance" },
  income: { soft: "bg-income-soft", text: "text-income", glow: "hover:shadow-glow-income" },
  expense: { soft: "bg-expense-soft", text: "text-expense", glow: "hover:shadow-glow-expense" },
};

const InfoCard = ({ icon, label, value, tone = "balance", index = 0 }) => {
  const theme = THEMES[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.45 }}
      whileHover={{ y: -6 }}
      className={`glass-card flex items-center gap-4 p-5 transition-shadow ${theme.glow}`}
    >
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${theme.soft} ${theme.text}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted">{label}</p>
        <p className="truncate text-xl font-semibold text-ink sm:text-2xl">
          <AnimatedNumber value={value} />
        </p>
      </div>
    </motion.div>
  );
};

export default InfoCard;
