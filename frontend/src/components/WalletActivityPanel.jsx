import { useEffect, useState } from "react";
import { getWalletTransactions } from "../services/api";

function WalletActivityPanel({ wallets }) {
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedWalletId && wallets.length > 0) {
      setSelectedWalletId(wallets[0].id);
    }
  }, [wallets, selectedWalletId]);

  useEffect(() => {
    if (selectedWalletId) {
      loadWalletTransactions(selectedWalletId);
    }
  }, [selectedWalletId]);

  async function loadWalletTransactions(walletId = selectedWalletId) {
    if (!walletId) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const data = await getWalletTransactions(walletId);
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function formatCurrency(amount, currency = "EUR") {
    return new Intl.NumberFormat("en-CY", {
      style: "currency",
      currency,
    }).format(Number(amount || 0));
  }

  function formatDate(dateString) {
    if (!dateString) {
      return "No date";
    }

    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getWalletEffect(transaction) {
    const posting = transaction.postings?.find(
      (item) => item.walletId === selectedWalletId
    );

    if (!posting) {
      return {
        sign: "",
        amount: transaction.amount,
        currency: transaction.currency || "EUR",
      };
    }

    const isCredit = posting.direction?.toLowerCase() === "credit";

    return {
      sign: isCredit ? "+" : "-",
      amount: posting.amount,
      currency: posting.currency || transaction.currency || "EUR",
    };
  }

  function getTransactionLabel(transaction) {
    const type = transaction.type || "transaction";

    if (type.toLowerCase() === "deposit") {
      return "Deposit";
    }

    if (type.toLowerCase() === "transfer") {
      return "Transfer";
    }

    return type;
  }

  return (
    <div className="card dashboard-card wallet-activity-card">
      {wallets.length === 0 ? (
        <div className="empty-state">
          <h3>No wallets available</h3>
          <p>Create a wallet first to view wallet activity.</p>
        </div>
      ) : (
        <>
          <div className="wallet-activity-toolbar">
            <div className="form-field wallet-activity-select">
              <label>Select wallet</label>

              <select
                value={selectedWalletId}
                onChange={(e) => setSelectedWalletId(e.target.value)}
              >
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.currency} Wallet
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => loadWalletTransactions()}
              disabled={!selectedWalletId || isLoading}
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          {transactions.length === 0 ? (
            <div className="empty-state">
              <h3>No wallet activity yet</h3>
              <p>Deposits and transfers will appear here.</p>
            </div>
          ) : (
            <div className="data-list">
              {transactions.map((transaction) => {
                const effect = getWalletEffect(transaction);
                const isCredit = effect.sign === "+";

                return (
                  <div className="data-row transaction-row" key={transaction.id}>
                    <div>
                      <div className="row-title">
                        <span
                          className={
                            isCredit
                              ? "activity-icon credit"
                              : "activity-icon debit"
                          }
                        >
                          {isCredit ? "↓" : "↑"}
                        </span>

                        <h3>{getTransactionLabel(transaction)}</h3>
                      </div>

                      <p>{transaction.description || "No description"}</p>

                      <small>{formatDate(transaction.createdAt)}</small>
                    </div>

                    <strong
                      className={
                        isCredit
                          ? "activity-amount credit"
                          : "activity-amount debit"
                      }
                    >
                      {effect.sign}
                      {formatCurrency(effect.amount, effect.currency)}
                    </strong>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default WalletActivityPanel;