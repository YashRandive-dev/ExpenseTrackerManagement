import TransactionForm from "./TransactionForm";

const AddIncomeForm = ({ onAddIncome }) => (
  <TransactionForm
    nameField="source"
    nameLabel="Income Source"
    namePlaceholder="Freelance, Salary, etc."
    fallbackIcon="💰"
    submitLabel="Add Income"
    onSubmit={onAddIncome}
  />
);

export default AddIncomeForm;
