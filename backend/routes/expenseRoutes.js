const express = require("express");
const {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpenseExcel,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.post("/add", addExpense);
router.get("/get", getAllExpense);
router.get("/downloadexcel", downloadExpenseExcel);
router.delete("/:id", deleteExpense);

module.exports = router;
