import { motion } from "framer-motion";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";

const bars = [38, 62, 45, 80, 55, 92, 70];

const Showcase = () => (
  <div className="relative mx-auto h-[460px] w-full max-w-md">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="absolute left-0 top-0 w-64 animate-bob"
    >
      <div className="glass-card p-5 shadow-glow-balance">
        <p className="text-xs text-muted">Total Balance</p>
        <p className="mt-1 text-2xl font-semibold text-ink">$ 24,580.00</p>
        <div className="mt-4 flex h-16 items-end gap-1.5">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
              className="flex-1 rounded-t-md bg-gradient-to-t from-primary/30 to-balance"
            />
          ))}
        </div>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="absolute right-0 top-40 w-56 animate-bob [animation-delay:1s]"
    >
      <div className="glass-card flex items-center gap-3 p-4 shadow-glow-income">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-income-soft text-income">
          <FiTrendingUp size={20} />
        </div>
        <div>
          <p className="text-xs text-muted">Income</p>
          <p className="text-lg font-semibold text-income">+ $ 8,200</p>
        </div>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="absolute bottom-0 left-8 w-60 animate-bob [animation-delay:2s]"
    >
      <div className="glass-card flex items-center gap-3 p-4 shadow-glow-expense">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-expense-soft text-expense">
          <FiTrendingDown size={20} />
        </div>
        <div>
          <p className="text-xs text-muted">Expenses</p>
          <p className="text-lg font-semibold text-expense">- $ 3,140</p>
        </div>
      </div>
    </motion.div>
  </div>
);

const AuthLayout = ({ children }) => (
  <div className="grid min-h-screen lg:grid-cols-2">
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center px-5 py-10 sm:px-10"
    >
      <div className="w-full max-w-md">
        <h2 className="mb-8 flex items-center gap-2 text-xl font-semibold text-ink">
          <span>💸</span> Expense Tracker
        </h2>
        {children}
      </div>
    </motion.div>

    <div className="hidden flex-col items-center justify-center gap-10 border-l border-glass-border bg-[rgba(255,255,255,0.025)] p-10 lg:flex">
      <div className="max-w-sm text-center">
        <h3 className="text-2xl font-semibold text-ink">Take control of your money</h3>
        <p className="mt-2 text-sm text-muted">
          Track income and expenses, visualise your habits and keep your balance healthy.
        </p>
      </div>
      <Showcase />
    </div>
  </div>
);

export default AuthLayout;
