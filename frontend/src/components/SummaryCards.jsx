function SummaryCards({ transactions, budgets }) {
  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-CY", {
      style: "currency",
      currency: "EUR",
    }).format(Number(amount));
  }

  const totalSpending = transactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount),
    0
  );

  const totalBudget = budgets.reduce(
    (sum, budget) => sum + Number(budget.monthlyLimit),
    0
  );

  const budgetedCategories = budgets.map((budget) =>
    budget.category.toLowerCase()
  );

  const spendingInBudgetedCategories = transactions
    .filter((transaction) =>
      budgetedCategories.includes(
        (transaction.category || "Uncategorized").toLowerCase()
      )
    )
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const budgetUsedPercentage =
    totalBudget > 0
      ? Math.round((spendingInBudgetedCategories / totalBudget) * 100)
      : 0;

  const remainingBudget = totalBudget - spendingInBudgetedCategories;

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <h3>Total Spending</h3>
        <p className="summary-value">{formatCurrency(totalSpending)}</p>
        <span className="summary-subtext">Across all transactions</span>
      </div>

      <div className="summary-card">
        <h3>Monthly Budget</h3>
        <p className="summary-value">{formatCurrency(totalBudget)}</p>
        <span className="summary-subtext">Total planned budget</span>
      </div>

      <div className="summary-card">
        <h3>Budget Used</h3>
        <p
          className={
            budgetUsedPercentage > 100
              ? "summary-value negative"
              : "summary-value"
          }
        >
          {budgetUsedPercentage}%
        </p>
        <span className="summary-subtext">Of your monthly budget</span>
      </div>

      <div className="summary-card">
        <h3>Remaining Budget</h3>
        <p
          className={
            remainingBudget < 0 ? "summary-value negative" : "summary-value"
          }
        >
          {formatCurrency(remainingBudget)}
        </p>
        <span className="summary-subtext">
          {remainingBudget < 0 ? "Over budget" : "Still available"}
        </span>
      </div>
    </div>
  );
}

export default SummaryCards;