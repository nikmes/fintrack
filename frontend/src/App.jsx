import { useEffect, useState } from "react";
import "./App.css";

import CreateUserForm from "./components/CreateUserForm";
import SignInForm from "./components/SignInForm";
import CreateAccountForm from "./components/CreateAccountForm";
import CreateTransactionForm from "./components/CreateTransactionForm";
import CreateBudgetForm from "./components/CreateBudgetForm";
import AnalyticsPanel from "./components/AnalyticsPanel";
import SummaryCards from "./components/SummaryCards";

import { getAccounts, getTransactions, getBudgets } from "./services/api";
import { getCategoryStyle } from "./utils/categoryStyles";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);

  const [authMode, setAuthMode] = useState("register");
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionCategoryFilter, setTransactionCategoryFilter] =
  useState("All");
  const [transactionSort, setTransactionSort] = useState("newest");
  const [activeSection, setActiveSection] = useState("user");

  useEffect(() => {
    async function loadUserData() {
      if (!currentUser) {
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      setIsLoadingData(true);

      try {
        const accountsData = await getAccounts(currentUser.id);
        const transactionsData = await getTransactions(currentUser.id);
        const budgetsData = await getBudgets(currentUser.id);

        setAccounts(accountsData);
        setTransactions(transactionsData);
        setBudgets(budgetsData);
      } catch (err) {
        console.error("Failed to load user data:", err);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadUserData();
  }, [currentUser]);

  function formatCurrency(amount, currency = "EUR") {
    return new Intl.NumberFormat("en-CY", {
      style: "currency",
      currency,
    }).format(Number(amount));
  }

  function formatDate(dateString) {
    if (!dateString) {
      return "No date";
    }

    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getSpentForCategory(category) {
    return transactions
      .filter(
        (transaction) =>
          (transaction.category || "Uncategorized").toLowerCase() ===
          category.toLowerCase()
      )
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  }

  function getUserInitials() {
    const name = currentUser?.fullName || currentUser?.email || "User";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function getDisplayName() {
    if (currentUser?.fullName) {
      return currentUser.fullName;
    }

    if (currentUser?.email) {
      return currentUser.email.split("@")[0];
    }

    return "User";
  }
function getAccountIcon(accountType) {
  const type = (accountType || "").toLowerCase();

  if (type.includes("wallet")) {
    return "👛";
  }

  if (type.includes("bank")) {
    return "🏦";
  }

  if (type.includes("saving")) {
    return "💰";
  }

  if (type.includes("card")) {
    return "💳";
  }

  return "💼";
}
  function handleAccountCreated(account) {
    setAccounts([account, ...accounts]);
    setShowAccountForm(false);
  }

  function handleTransactionCreated(transaction) {
    setTransactions([transaction, ...transactions]);
    setShowTransactionForm(false);
  }

  function handleBudgetCreated(budget) {
    setBudgets([budget, ...budgets]);
    setShowBudgetForm(false);
  }

  function handleClearCurrentUser() {
    localStorage.removeItem("currentUser");

    setCurrentUser(null);
    setAccounts([]);
    setTransactions([]);
    setBudgets([]);

    setShowAccountForm(false);
    setShowTransactionForm(false);
    setShowBudgetForm(false);

    setTransactionSearch("");
    setTransactionCategoryFilter("All");
    setTransactionSort("newest");
    setActiveSection("user");

    setAuthMode("register");
  }

  const transactionCategories = [
    "All",
    ...new Set(
      transactions.map(
        (transaction) => transaction.category || "Uncategorized"
      )
    ),
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const category = transaction.category || "Uncategorized";
    const description = transaction.description || "";
    const amount = String(transaction.amount);
    const date = transaction.transactionDate || "";

    const search = transactionSearch.toLowerCase();

    const matchesSearch =
      category.toLowerCase().includes(search) ||
      description.toLowerCase().includes(search) ||
      amount.includes(transactionSearch) ||
      date.includes(transactionSearch);

    const matchesCategory =
      transactionCategoryFilter === "All" ||
      category === transactionCategoryFilter;

    return matchesSearch && matchesCategory;
  });
const sortedFilteredTransactions = [...filteredTransactions].sort((a, b) => {
  if (transactionSort === "newest") {
    return new Date(b.transactionDate || 0) - new Date(a.transactionDate || 0);
  }

  if (transactionSort === "oldest") {
    return new Date(a.transactionDate || 0) - new Date(b.transactionDate || 0);
  }

  if (transactionSort === "highest") {
    return Number(b.amount) - Number(a.amount);
  }

  if (transactionSort === "lowest") {
    return Number(a.amount) - Number(b.amount);
  }

  return 0;
});

const filteredTransactionTotal = filteredTransactions.reduce(
  (sum, transaction) => sum + Number(transaction.amount),
  0
);
  return (
    <div className="app">
      <header className="hero">
  <div className="hero-badge">💳 Smart finance dashboard</div>

  <h1>FinTrack</h1>

  <p>
    Track accounts, budgets, transactions and spending insights in one clean
    dashboard.
  </p>
</header>

      <nav className="top-nav">
  <a
    href="#user"
    className={activeSection === "user" ? "active" : ""}
    onClick={() => setActiveSection("user")}
  >
    User
  </a>

  {currentUser && (
    <>
      <a
        href="#accounts"
        className={activeSection === "accounts" ? "active" : ""}
        onClick={() => setActiveSection("accounts")}
      >
        Accounts
      </a>

      <a
        href="#analytics"
        className={activeSection === "analytics" ? "active" : ""}
        onClick={() => setActiveSection("analytics")}
      >
        Analytics
      </a>
    </>
  )}

  {accounts.length > 0 && (
    <>
      <a
        href="#transactions"
        className={activeSection === "transactions" ? "active" : ""}
        onClick={() => setActiveSection("transactions")}
      >
        Transactions
      </a>

      <a
        href="#budgets"
        className={activeSection === "budgets" ? "active" : ""}
        onClick={() => setActiveSection("budgets")}
      >
        Budgets
      </a>
    </>
  )}
</nav>

      <section id="user">
        {!currentUser && (
          <>
            <div className="auth-toggle">
  <button
    type="button"
    className={authMode === "register" ? "active" : ""}
    onClick={() => setAuthMode("register")}
  >
    Register
  </button>

  <button
    type="button"
    className={authMode === "signin" ? "active" : ""}
    onClick={() => setAuthMode("signin")}
  >
    Sign In
  </button>
</div>

            {authMode === "register" ? (
              <CreateUserForm onUserCreated={setCurrentUser} />
            ) : (
              <SignInForm onUserSignedIn={setCurrentUser} />
            )}
          </>
        )}

        {currentUser && (
          <div className="card profile-card">
            <div className="profile-main">
              <div className="profile-avatar">{getUserInitials()}</div>

              <div className="profile-info">
                <p className="welcome-label">Welcome back</p>
                <h2>{getDisplayName()}</h2>
                <p>{currentUser.email}</p>
              </div>

              <button
                type="button"
                className="sign-out-button"
                onClick={handleClearCurrentUser}
              >
                Sign Out
              </button>
            </div>

            <div className="profile-stats">
              <div>
                <span>{accounts.length}</span>
                <p>Accounts</p>
              </div>

              <div>
                <span>{transactions.length}</span>
                <p>Transactions</p>
              </div>

              <div>
                <span>{budgets.length}</span>
                <p>Budgets</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {isLoadingData && (
        <div className="card">
          <p>Loading user data...</p>
        </div>
      )}

      {currentUser && (
        <section className="dashboard-summary">
          <h2 className="section-title">Dashboard Summary</h2>

          <SummaryCards
            accounts={accounts}
            transactions={transactions}
            budgets={budgets}
          />
        </section>
      )}

      {currentUser && (
        <>
          <section id="accounts">
            <div className="section-header">
  <div className="section-title-block">
    <h2>Accounts</h2>
    <p>Manage your wallets, bank accounts, cards and savings.</p>
  </div>

  <button
    type="button"
    onClick={() => setShowAccountForm(!showAccountForm)}
  >
    {showAccountForm ? "Cancel" : "+ Add Account"}
  </button>
</div>

            {showAccountForm && (
              <CreateAccountForm
                userId={currentUser.id}
                onAccountCreated={handleAccountCreated}
              />
            )}

            <div className="card dashboard-card">
              {accounts.length === 0 ? (
                <div className="empty-state">
                  <h3>No accounts yet</h3>
                  <p>Add your first wallet, bank account, or savings account.</p>
                </div>
              ) : (
                <div className="data-list">
                  {accounts.map((account) => (
  <div className="data-row account-row" key={account.id}>
    <div className="account-left">
      <div className="account-icon">
        {getAccountIcon(account.accountType)}
      </div>

      <div>
        <h3>{account.name}</h3>

        <p>
          {account.institution || "No institution"} •{" "}
          {account.accountType} account
        </p>

        <small>
          Created {formatDate(account.createdAt)}
        </small>
      </div>
    </div>

    <span className="badge">{account.currency}</span>
  </div>
))}
                </div>
              )}
            </div>
          </section>

          {accounts.length > 0 && (
            <>
              <section id="transactions">
                <div className="section-header">
  <div className="section-title-block">
    <h2>Transactions</h2>
    <p>Track, search, filter and sort your spending activity.</p>
  </div>

  <button
    type="button"
    onClick={() =>
      setShowTransactionForm(!showTransactionForm)
    }
  >
    {showTransactionForm ? "Cancel" : "+ Add Transaction"}
  </button>
</div>

                {showTransactionForm && (
                  <CreateTransactionForm
                    userId={currentUser.id}
                    accounts={accounts}
                    onTransactionCreated={handleTransactionCreated}
                  />
                )}

                <div className="card dashboard-card">
                  {transactions.length === 0 ? (
                    <div className="empty-state">
                      <h3>No transactions yet</h3>
                      <p>Add your first transaction to start tracking spending.</p>
                    </div>
                  ) : (
                    <>
                      <div className="transaction-tools">
  <input
    type="text"
    placeholder="Search transactions..."
    value={transactionSearch}
    onChange={(e) => setTransactionSearch(e.target.value)}
  />

  <select
    value={transactionCategoryFilter}
    onChange={(e) => setTransactionCategoryFilter(e.target.value)}
  >
    {transactionCategories.map((category) => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
  </select>

  <select
    value={transactionSort}
    onChange={(e) => setTransactionSort(e.target.value)}
  >
    <option value="newest">Newest first</option>
    <option value="oldest">Oldest first</option>
    <option value="highest">Highest amount</option>
    <option value="lowest">Lowest amount</option>
  </select>
</div>

<div className="transaction-stats">
  <span>
    Showing {filteredTransactions.length} of {transactions.length} transactions
  </span>

  <strong>Filtered total: {formatCurrency(filteredTransactionTotal)}</strong>
</div>

                      {filteredTransactions.length === 0 ? (
                        <div className="empty-state">
                          <h3>No matching transactions</h3>
                          <p>Try changing your search or category filter.</p>
                        </div>
                      ) : (
                        <div className="data-list">
{sortedFilteredTransactions.map((transaction) => {
                              const categoryStyle = getCategoryStyle(
                              transaction.category
                            );

                            return (
                              <div
                                className="data-row transaction-row"
                                key={transaction.id}
                              >
                                <div>
                                  <div className="row-title">
                                    <span
                                      className="category-icon"
                                      style={{
                                        backgroundColor:
                                          categoryStyle.background,
                                        color: categoryStyle.color,
                                      }}
                                    >
                                      {categoryStyle.icon}
                                    </span>

                                    <h3>
                                      {transaction.category ||
                                        "Uncategorized"}
                                    </h3>
                                  </div>

                                  <p>
                                    {transaction.description ||
                                      "No description"}
                                  </p>

                                  <small>
                                    {formatDate(
                                      transaction.transactionDate
                                    )}
                                  </small>
                                </div>

                                <strong className="amount">
                                  {formatCurrency(
                                    transaction.amount,
                                    transaction.currency || "EUR"
                                  )}
                                </strong>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </section>

              <section id="budgets">
                <div className="section-header">
  <div className="section-title-block">
    <h2>Budgets</h2>
    <p>Set monthly limits and monitor how much budget remains.</p>
  </div>

  <button
    type="button"
    onClick={() => setShowBudgetForm(!showBudgetForm)}
  >
    {showBudgetForm ? "Cancel" : "+ Add Budget"}
  </button>
</div>

                {showBudgetForm && (
                  <CreateBudgetForm
                    userId={currentUser.id}
                    onBudgetCreated={handleBudgetCreated}
                  />
                )}

                <div className="card dashboard-card">
                  {budgets.length === 0 ? (
                    <div className="empty-state">
                      <h3>No budgets yet</h3>
                      <p>Create monthly category limits for your spending.</p>
                    </div>
                  ) : (
                    <div className="data-list">
                      {budgets.map((budget) => {
                        const spent = getSpentForCategory(budget.category);
                        const limit = Number(budget.monthlyLimit);
                        const remaining = limit - spent;

                        const percentage =
                          limit > 0
                            ? Math.min((spent / limit) * 100, 100)
                            : 0;

                        const actualPercentage =
                          limit > 0
                            ? Math.round((spent / limit) * 100)
                            : 0;

                        const isOverBudget = spent > limit;
                        const isWarning =
                          actualPercentage >= 80 && !isOverBudget;

                        let statusText = "On track";

                        if (isOverBudget) {
                          statusText = "Over budget";
                        } else if (isWarning) {
                          statusText = "Close to limit";
                        }

                        const budgetCategoryStyle = getCategoryStyle(
                          budget.category
                        );

                        return (
                          <div className="budget-card" key={budget.id}>
                            <div className="budget-card-header">
                              <div className="budget-category-title">
                                <span
                                  className="category-icon"
                                  style={{
                                    backgroundColor:
                                      budgetCategoryStyle.background,
                                    color: budgetCategoryStyle.color,
                                  }}
                                >
                                  {budgetCategoryStyle.icon}
                                </span>

                                <div>
                                  <h3>{budget.category}</h3>
                                  <p>Monthly spending limit</p>
                                </div>
                              </div>

                              <span
                                className={
                                  isOverBudget
                                    ? "budget-status danger"
                                    : isWarning
                                    ? "budget-status warning"
                                    : "budget-status"
                                }
                              >
                                {statusText}
                              </span>
                            </div>

                            <div className="budget-money-row">
                              <div>
                                <span>Spent</span>
                                <strong>
                                  {formatCurrency(spent, budget.currency)}
                                </strong>
                              </div>

                              <div>
                                <span>Limit</span>
                                <strong>
                                  {formatCurrency(limit, budget.currency)}
                                </strong>
                              </div>

                              <div>
                                <span>
                                  {remaining < 0 ? "Overspent" : "Remaining"}
                                </span>
                                <strong
                                  className={
                                    remaining < 0 ? "negative-text" : ""
                                  }
                                >
                                  {formatCurrency(
                                    Math.abs(remaining),
                                    budget.currency
                                  )}
                                </strong>
                              </div>
                            </div>

                            <div className="progress-bar budget-progress">
                              <div
                                className={
                                  isOverBudget
                                    ? "progress-fill danger"
                                    : isWarning
                                    ? "progress-fill warning"
                                    : "progress-fill"
                                }
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>

                            <div className="budget-footer">
                              <small>
                                {actualPercentage}% of budget used
                              </small>
                              <small>
                                {isOverBudget
                                  ? "You passed your monthly limit"
                                  : "You are still within your budget"}
                              </small>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          <section id="analytics">
            <div className="section-header">
  <div className="section-title-block">
    <h2>Analytics</h2>
    <p>Visual insights based on your transaction categories.</p>
  </div>
</div>

            <AnalyticsPanel
              userId={currentUser.id}
              transactions={transactions}
            />
          </section>
        </>
      )}

      <footer className="footer">
        <p>FinTrack © 2026</p>
        <span>Digital Wallet & Smart Finance Analytics Platform</span>
      </footer>
    </div>
  );
}

export default App;