const mongoose = require("mongoose");
const xlsx = require("xlsx");
const Income = require("../models/Income");

// POST /api/v1/income/add
exports.addIncome = async (req, res) => {
  try {
    const { icon, source, amount, date } = req.body;

    if (!source || amount === undefined || amount === "" || !date) {
      return res.status(400).json({ message: "Source, amount and date are required" });
    }
    const numeric = Number(amount);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return res.status(400).json({ message: "Amount must be a number greater than 0" });
    }
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const income = await Income.create({
      userId: req.user._id,
      icon: icon || undefined,
      source: source.trim(),
      amount: numeric,
      date: parsedDate,
    });
    res.status(201).json(income);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/v1/income/get
exports.getAllIncome = async (req, res) => {
  try {
    const income = await Income.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/v1/income/:id
exports.deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid income id" });
    }
    const deleted = await Income.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!deleted) {
      return res.status(404).json({ message: "Income not found" });
    }
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/v1/income/downloadexcel
exports.downloadIncomeExcel = async (req, res) => {
  try {
    const income = await Income.find({ userId: req.user._id }).sort({ date: -1 });
    const rows = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toISOString().split("T")[0],
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 28 }, { wch: 14 }, { wch: 14 }];
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    const buffer = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", 'attachment; filename="income_details.xlsx"');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
