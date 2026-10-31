import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import TransactionPanel from "../../components/cards/TransactionPanel";
import AreaChartView from "../../components/charts/AreaChartView";
import Modal from "../../components/modals/Modal";
import AddExpenseForm from "../../components/modals/AddExpenseForm";
import DeleteAlert from "../../components/modals/DeleteAlert";
import { SkeletonChart } from "../../components/common/Skeleton";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { downloadBlob, getErrorMessage, groupByDate } from "../../utils/helper";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL);
      setExpenses(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not load expenses"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const chartData = useMemo(() => groupByDate(expenses), [expenses]);

  const handleAdd = async (values) => {
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD, values);
      setShowAdd(false);
      toast.success("Expense added");
      fetchExpenses();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not add expense"));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE(deleteId));
      setExpenses((list) => list.filter((e) => e._id !== deleteId));
      setDeleteId(null);
      toast.success("Expense deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete expense"));
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD, { responseType: "blob" });
      downloadBlob(res.data, "expense_details.xlsx");
      toast.success("Downloaded expense_details.xlsx");
    } catch (err) {
      toast.error(getErrorMessage(err, "Download failed"));
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h5 className="text-base font-semibold text-ink">Expense Overview</h5>
            <p className="text-xs text-muted">Track your spending trends over time and gain insights.</p>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} className="btn-gradient" onClick={() => setShowAdd(true)}>
            <FiPlus size={16} /> Add Expense
          </motion.button>
        </div>
        {loading ? <SkeletonChart /> : <AreaChartView id="expense-area" data={chartData} color="rgba(255, 82, 120, 1)" />}
      </section>

      <TransactionPanel
        title="All Expenses"
        type="expense"
        items={expenses}
        loading={loading}
        columns={2}
        onDelete={(id) => setDeleteId(id)}
        onDownload={expenses.length ? handleDownload : undefined}
        emptyTitle="No expenses recorded"
        emptyMessage="Click “Add Expense” to log your first one."
      />

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Expense">
        <AddExpenseForm onAddExpense={handleAdd} />
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => !deleting && setDeleteId(null)} title="Delete Expense">
        <DeleteAlert
          content="Are you sure you want to delete this expense? This action cannot be undone."
          loading={deleting}
          onCancel={() => setDeleteId(null)}
          onDelete={handleDelete}
        />
      </Modal>
    </div>
  );
};

export default Expense;
