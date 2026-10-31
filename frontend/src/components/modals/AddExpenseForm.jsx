import TransactionForm from "./TransactionForm";

const AddExpenseForm = ({ onAddExpense }) => (
  <TransactionForm
    nameField="category"
    nameLabel="Category"
    namePlaceholder="Rent, Groceries, etc."
    fallbackIcon="🛒"
    submitLabel="Add Expense"
    onSubmit={onAddExpense}
  />
);

export default AddExpenseForm;
