import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCreditCard, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import toast from "react-hot-toast";
import InfoCard from "../../components/cards/InfoCard";
import TransactionPanel from "../../components/cards/TransactionPanel";
import DonutChart from "../../components/charts/DonutChart";
import BarChartView from "../../components/charts/BarChartView";
import { Skeleton, SkeletonChart } from "../../components/common/Skeleton";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { getErrorMessage, groupByDate, groupByField } from "../../utils/helper";

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
        if (active) setData(res.data);
      } catch (err) {
        toast.error(getErrorMessage(err, "Could not load dashboard"));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const overview = useMemo(
    () => [
      { name: "Total Balance", amount: Math.max(data?.totalBalance || 0, 0) },
      { name: "Total Income", amount: data?.totalIncome || 0 },
      { name: "Total Expenses", amount: data?.totalExpenses || 0 },
    ],
    [data]
  );

  const expenseBars = useMemo(() => groupByDate(data?.last30DaysExpenses?.transactions), [data]);
  const incomePie = useMemo(() => groupByField(data?.last60DaysIncome?.transactions, "source"), [data]);

  return (
    <div className="space-y-6">
      {/* Summary */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[98px] !rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard index={0} tone="balance" icon={<FiDollarSign />} label="Total Balance" value={data?.totalBalance} />
          <InfoCard index={1} tone="income" icon={<FiTrendingUp />} label="Total Income" value={data?.totalIncome} />
          <InfoCard index={2} tone="expense" icon={<FiCreditCard />} label="Total Expenses" value={data?.totalExpenses} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <TransactionPanel
          title="Recent Transactions"
          items={data?.recentTransactions}
          loading={loading}
          onSeeAll={() => navigate("/expense")}
          emptyTitle="No transactions yet"
          emptyMessage="Add income or expenses to see them here."
        />

        <div className="glass-card p-5">
          <h5 className="mb-4 text-base font-semibold text-ink">Financial Overview</h5>
          {loading ? (
            <SkeletonChart />
          ) : (
            <DonutChart
              data={overview}
              colors={["rgba(56, 189, 248, 1)", "rgba(34, 211, 160, 1)", "rgba(255, 82, 120, 1)"]}
              centerLabel="Total Balance"
              centerValue={data?.totalBalance}
            />
          )}
        </div>

        <TransactionPanel
          title="Expenses"
          type="expense"
          items={data?.recentExpenses}
          loading={loading}
          onSeeAll={() => navigate("/expense")}
          emptyTitle="No expenses yet"
        />

        <div className="glass-card p-5">
          <h5 className="mb-4 text-base font-semibold text-ink">Last 30 Days Expenses</h5>
          {loading ? <SkeletonChart /> : <BarChartView id="home-exp" data={expenseBars} color="rgba(255, 82, 120, 1)" />}
        </div>

        <div className="glass-card p-5">
          <h5 className="mb-4 text-base font-semibold text-ink">Last 60 Days Income</h5>
          {loading ? (
            <SkeletonChart />
          ) : (
            <DonutChart data={incomePie} centerLabel="Total Income" centerValue={data?.last60DaysIncome?.total} />
          )}
        </div>

        <TransactionPanel
          title="Income"
          type="income"
          items={data?.recentIncome}
          loading={loading}
          onSeeAll={() => navigate("/income")}
          emptyTitle="No income yet"
        />
      </div>
    </div>
  );
};

export default Home;
