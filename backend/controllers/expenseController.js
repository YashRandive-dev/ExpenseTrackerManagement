const mongoose = require("mongoose");
const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// POST /api/v1/expense/add
exports.addExpense = async (req, res) => {
  try {
    const { icon, category, amount, date } = req.body;

    if (!category || amount === undefined || amount === "" || !date) {
      return res.status(400).json({ message: "Category, amount and date are required" });
    }
    const numeric = Number(amount);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return res.status(400).json({ message: "Amount must be a number greater than 0" });
    }
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const expense = await Expense.create({
      userId: req.user._id,
      icon: icon || undefined,
      category: category.trim(),
      amount: numeric,
      date: parsedDate,
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/v1/expense/get
exports.getAllExpense = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/v1/expense/:id
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid expense id" });
    }
    const deleted = await Expense.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/v1/expense/downloadexcel
exports.downloadExpenseExcel = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
    const rows = expenses.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date.toISOString().split("T")[0],
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 28 }, { wch: 14 }, { wch: 14 }];
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");
    const buffer = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", 'attachment; filename="expense_details.xlsx"');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
