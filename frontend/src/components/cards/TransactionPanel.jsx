import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight, FiDownload } from "react-icons/fi";
import TransactionCard from "./TransactionCard";
import EmptyState from "../common/EmptyState";
import { SkeletonList } from "../common/Skeleton";

/**
 * Generic glass panel listing transactions.
 * items: [{ _id, icon, date, amount, source|category, type? }]
 * type: default type for items (items may override with item.type)
 */
const TransactionPanel = ({
  title,
  items = [],
  type,
  loading = false,
  onSeeAll,
  onDownload,
  onDelete,
  columns = 1,
  emptyTitle,
  emptyMessage,
  limit,
  className = "",
}) => {
  const list = limit ? items.slice(0, limit) : items;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`glass-card p-5 ${className}`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h5 className="text-base font-semibold text-ink">{title}</h5>
        <div className="flex gap-2">
          {onDownload && (
            <button type="button" className="btn-ghost !px-3 !py-2 text-xs" onClick={onDownload}>
              <FiDownload size={14} /> Download
            </button>
          )}
          {onSeeAll && (
            <button type="button" className="btn-ghost !px-3 !py-2 text-xs" onClick={onSeeAll}>
              See All <FiArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <SkeletonList count={limit || 4} />
      ) : list.length === 0 ? (
        <EmptyState title={emptyTitle} message={emptyMessage} />
      ) : (
        <div className={`grid gap-x-6 gap-y-1 ${columns === 2 ? "md:grid-cols-2" : ""}`}>
          <AnimatePresence initial={false}>
            {list.map((item, i) => {
              const t = item.type || type;
              return (
                <TransactionCard
                  key={item._id}
                  index={i}
                  type={t}
                  icon={item.icon}
                  title={t === "income" ? item.source : item.category}
                  date={item.date}
                  amount={item.amount}
                  onDelete={onDelete ? () => onDelete(item._id) : undefined}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );
};

export default TransactionPanel;
