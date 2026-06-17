import { useEffect, useState } from "react";
import "./App.css";

import CreateUserForm from "./components/CreateUserForm";
import SignInForm from "./components/SignInForm";
import CreateAccountForm from "./components/CreateAccountForm";
import CreateTransactionForm from "./components/CreateTransactionForm";
import CreateBudgetForm from "./components/CreateBudgetForm";
import AnalyticsPanel from "./components/AnalyticsPanel";
import SummaryCards from "./components/SummaryCards";
import { getCategoryStyle } from "./utils/categoryStyles";

import { getAccounts, getTransactions, getBudgets } from "./services/api";

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

    setAuthMode("register");
  }

  return (
    <div className="app">
      <h1>FinTrack</h1>
      <p>Digital Wallet & Smart Finance Analytics Platform</p>

      <nav className="top-nav">
        <a href="#user">User</a>

        {currentUser && (
          <>
            <a href="#accounts">Accounts</a>
            <a href="#analytics">Analytics</a>
          </>
        )}

        {accounts.length > 0 && (
          <>
            <a href="#transactions">Transactions</a>
            <a href="#budgets">Budgets</a>
          </>
        )}
      </nav>

      <section id="user">
        {!currentUser && (
          <>
            <div className="auth-toggle">
              <button type="button" onClick={() => setAuthMode("register")}>
                Register
              </button>

              <button type="button" onClick={() => setAuthMode("signin")}>
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
              <h2>Accounts</h2>

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
                      <div>
                        <h3>{account.name}</h3>
                        <p>
                          {account.institution || "No institution"} •{" "}
                          {account.accountType}
                        </p>
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
                  <h2>Transactions</h2>

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
                    <div className="data-list">
                      {transactions.map((transaction) => {
  const categoryStyle = getCategoryStyle(transaction.category);

  return (
    <div className="data-row transaction-row" key={transaction.id}>
      <div>
        <div className="row-title">
          <span
            className="category-icon"
            style={{
              backgroundColor: categoryStyle.background,
              color: categoryStyle.color,
            }}
          >
            {categoryStyle.icon}
          </span>

          <h3>{transaction.category || "Uncategorized"}</h3>
        </div>

        <p>{transaction.description || "No description"}</p>

        <small>{formatDate(transaction.transactionDate)}</small>
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
                </div>
              </section>

              <section id="budgets">
  <div className="section-header">
    <h2>Budgets</h2>

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
            limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

          const actualPercentage =
            limit > 0 ? Math.round((spent / limit) * 100) : 0;

          const isOverBudget = spent > limit;
          const isWarning = actualPercentage >= 80 && !isOverBudget;

          let statusText = "On track";

          if (isOverBudget) {
            statusText = "Over budget";
          } else if (isWarning) {
            statusText = "Close to limit";
          }

          return (
            <div className="budget-card" key={budget.id}>
              <div className="budget-card-header">
  <div className="budget-category-title">
    <span
      className="category-icon"
      style={{
        backgroundColor: getCategoryStyle(budget.category).background,
        color: getCategoryStyle(budget.category).color,
      }}
    >
      {getCategoryStyle(budget.category).icon}
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
                  <strong>{formatCurrency(spent, budget.currency)}</strong>
                </div>

                <div>
                  <span>Limit</span>
                  <strong>{formatCurrency(limit, budget.currency)}</strong>
                </div>

                <div>
                  <span>{remaining < 0 ? "Overspent" : "Remaining"}</span>
                  <strong className={remaining < 0 ? "negative-text" : ""}>
                    {formatCurrency(Math.abs(remaining), budget.currency)}
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
                <small>{actualPercentage}% of budget used</small>
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
            <AnalyticsPanel userId={currentUser.id} transactions={transactions} />
          </section>
        </>
      )}
    </div>
  );
}

export default App;