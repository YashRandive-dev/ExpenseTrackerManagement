import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import TransactionPanel from "../../components/cards/TransactionPanel";
import BarChartView from "../../components/charts/BarChartView";
import Modal from "../../components/modals/Modal";
import AddIncomeForm from "../../components/modals/AddIncomeForm";
import DeleteAlert from "../../components/modals/DeleteAlert";
import { SkeletonChart } from "../../components/common/Skeleton";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { downloadBlob, getErrorMessage, groupByDate } from "../../utils/helper";

const Income = () => {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchIncome = useCallback(async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.INCOME.GET_ALL);
      setIncome(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not load income"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncome();
  }, [fetchIncome]);

  const chartData = useMemo(() => groupByDate(income), [income]);

  const handleAdd = async (values) => {
    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD, values);
      setShowAdd(false);
      toast.success("Income added");
      fetchIncome();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not add income"));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE(deleteId));
      setIncome((list) => list.filter((i) => i._id !== deleteId));
      setDeleteId(null);
      toast.success("Income deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete income"));
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD, { responseType: "blob" });
      downloadBlob(res.data, "income_details.xlsx");
      toast.success("Downloaded income_details.xlsx");
    } catch (err) {
      toast.error(getErrorMessage(err, "Download failed"));
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h5 className="text-base font-semibold text-ink">Income Overview</h5>
            <p className="text-xs text-muted">Track your earnings over time and analyze your income trends.</p>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} className="btn-gradient" onClick={() => setShowAdd(true)}>
            <FiPlus size={16} /> Add Income
          </motion.button>
        </div>
        {loading ? <SkeletonChart /> : <BarChartView id="income-bar" data={chartData} color="rgba(34, 211, 160, 1)" />}
      </section>

      <TransactionPanel
        title="Income Sources"
        type="income"
        items={income}
        loading={loading}
        columns={2}
        onDelete={(id) => setDeleteId(id)}
        onDownload={income.length ? handleDownload : undefined}
        emptyTitle="No income recorded"
        emptyMessage="Click “Add Income” to record your first source."
      />

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Income">
        <AddIncomeForm onAddIncome={handleAdd} />
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => !deleting && setDeleteId(null)} title="Delete Income">
        <DeleteAlert
          content="Are you sure you want to delete this income entry? This action cannot be undone."
          loading={deleting}
          onCancel={() => setDeleteId(null)}
          onDelete={handleDelete}
        />
      </Modal>
    </div>
  );
};

export default Income;
