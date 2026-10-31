const express = require("express");
const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel,
} = require("../controllers/incomeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.post("/add", addIncome);
router.get("/get", getAllIncome);
router.get("/downloadexcel", downloadIncomeExcel);
router.delete("/:id", deleteIncome);

module.exports = router;
