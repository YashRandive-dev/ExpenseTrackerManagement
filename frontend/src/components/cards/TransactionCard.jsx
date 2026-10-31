import { motion } from "framer-motion";
import { FiTrash2, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { formatCurrency, formatDate } from "../../utils/helper";

/**
 * type: "income" | "expense"
 * Delete button is revealed on hover (always visible on touch screens).
 */
const TransactionCard = ({ type, title, icon, date, amount, onDelete, index = 0 }) => {
  const isIncome = type === "income";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index, 10) * 0.05, duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="group flex items-center gap-3 rounded-2xl border border-transparent p-3 transition-colors hover:border-glass-border hover:bg-glass"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-2xl">
        {icon || (isIncome ? "💰" : "🛒")}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{title}</p>
        <p className="text-xs text-muted">{formatDate(date)}</p>
      </div>

      <div className="flex items-center gap-2">
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${title}`}
            className="rounded-lg p-2 text-muted transition hover:bg-expense-soft hover:text-expense md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
          >
            <FiTrash2 size={16} />
          </button>
        )}
        <div
          className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold sm:text-sm ${
            isIncome ? "bg-income-soft text-income" : "bg-expense-soft text-expense"
          }`}
        >
          <span>
            {isIncome ? "+" : "-"}
            {formatCurrency(amount)}
          </span>
          {isIncome ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionCard;
