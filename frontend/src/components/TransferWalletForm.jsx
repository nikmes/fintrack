import { useEffect, useState } from "react";
import { transferBetweenWallets } from "../services/api";

function TransferWalletForm({ wallets, onTransferCompleted }) {
  const [sourceWalletId, setSourceWalletId] = useState("");
  const [destinationWalletId, setDestinationWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!sourceWalletId && wallets.length > 0) {
      setSourceWalletId(wallets[0].id);
      setCurrency(wallets[0].currency || "EUR");
    }
  }, [wallets, sourceWalletId]);

  function handleSourceWalletChange(walletId) {
    setSourceWalletId(walletId);

    const selectedWallet = wallets.find((wallet) => wallet.id === walletId);

    if (selectedWallet) {
      setCurrency(selectedWallet.currency || "EUR");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!sourceWalletId) {
      setError("Please select a source wallet.");
      return;
    }

    if (!destinationWalletId) {
      setError("Please enter a destination wallet ID.");
      return;
    }

    if (sourceWalletId === destinationWalletId) {
      setError("Source and destination wallets cannot be the same.");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    try {
      setIsSubmitting(true);

      await transferBetweenWallets({
        sourceWalletId,
        destinationWalletId,
        amount,
        currency,
        description,
      });

      setDestinationWalletId("");
      setAmount("");
      setDescription("");

      if (onTransferCompleted) {
        onTransferCompleted();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="card form-card">
      <div className="form-card-header">
        <h2>Transfer Funds</h2>
        <p>Move money from one wallet to another wallet.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-field">
          <label>Source wallet</label>

          <select
            value={sourceWalletId}
            onChange={(e) => handleSourceWalletChange(e.target.value)}
            required
          >
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.currency} Wallet
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Currency</label>

          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div className="form-field full-width">
          <label>Destination wallet ID</label>

          <input
            type="text"
            placeholder="Paste destination wallet ID"
            value={destinationWalletId}
            onChange={(e) => setDestinationWalletId(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label>Amount</label>

          <input
            type="number"
            step="0.01"
            placeholder="Example: 30"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label>Description</label>

          <input
            type="text"
            placeholder="Optional transfer note"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-actions full-width">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Transferring..." : "Transfer Funds"}
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default TransferWalletForm;