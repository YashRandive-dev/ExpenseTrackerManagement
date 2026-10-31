import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../inputs/Input";
import EmojiPickerPopup from "../inputs/EmojiPickerPopup";
import Spinner from "../common/Spinner";
import { toInputDate } from "../../utils/helper";

/**
 * Shared form for Add Income / Add Expense.
 * nameField: "source" | "category"
 */
const TransactionForm = ({ nameField, nameLabel, namePlaceholder, fallbackIcon, submitLabel, onSubmit }) => {
  const [values, setValues] = useState({
    [nameField]: "",
    amount: "",
    date: toInputDate(),
    icon: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!values[nameField].trim()) next[nameField] = `${nameLabel} is required`;
    const amount = Number(values.amount);
    if (values.amount === "" || !Number.isFinite(amount) || amount <= 0) {
      next.amount = "Enter an amount greater than 0";
    }
    if (!values.date) next.date = "Date is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit({ ...values, amount: Number(values.amount) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <EmojiPickerPopup
        icon={values.icon}
        fallback={fallbackIcon}
        onSelect={(emoji) => setValues((v) => ({ ...v, icon: emoji }))}
      />

      <div className="space-y-4">
        <Input
          label={nameLabel}
          placeholder={namePlaceholder}
          value={values[nameField]}
          onChange={set(nameField)}
          error={errors[nameField]}
        />
        <Input
          label="Amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={values.amount}
          onChange={set("amount")}
          error={errors.amount}
        />
        <Input label="Date" type="date" value={values.date} onChange={set("date")} error={errors.date} />
      </div>

      <div className="mt-6 flex justify-end">
        <motion.button whileTap={{ scale: 0.95 }} type="submit" className="btn-gradient" disabled={saving}>
          {saving ? <Spinner /> : submitLabel}
        </motion.button>
      </div>
    </form>
  );
};

export default TransactionForm;
