import { useEffect, useState } from "react";
import { transferBetweenWallets, lookupWalletByEmail } from "../services/api";

function TransferWalletForm({ wallets, onTransferCompleted }) {
  const [sourceWalletId, setSourceWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [description, setDescription] = useState("");

  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientWallets, setRecipientWallets] = useState([]);
  const [destinationWalletId, setDestinationWalletId] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState("");

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

    resetRecipient();
  }

  function handleCurrencyChange(value) {
    setCurrency(value);
    resetRecipient();
  }

  function resetRecipient() {
    setRecipientName("");
    setRecipientWallets([]);
    setDestinationWalletId("");
    setLookupError("");
  }

  async function handleFindRecipient() {
    setLookupError("");
    resetRecipient();

    if (!recipientEmail.trim()) {
      setLookupError("Enter the recipient's email.");
      return;
    }

    try {
      setIsLookingUp(true);

      const result = await lookupWalletByEmail(recipientEmail, currency);

      setRecipientName(result.fullName);
      setRecipientWallets(result.wallets);

      if (result.wallets.length === 1) {
        setDestinationWalletId(result.wallets[0].id);
      }
    } catch (err) {
      setLookupError(err.message);
    } finally {
      setIsLookingUp(false);
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
      setError("Please find a recipient and select which wallet to send to.");
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

      setRecipientEmail("");
      resetRecipient();
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
                {wallet.name ? `${wallet.name} (${wallet.currency})` : `${wallet.currency} Wallet`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Currency</label>

          <select value={currency} onChange={(e) => handleCurrencyChange(e.target.value)}>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div className="form-field full-width">
          <label>Recipient's email</label>

          <div className="form-inline-action">
            <input
              type="email"
              placeholder="Example: friend@email.com"
              value={recipientEmail}
              onChange={(e) => {
                setRecipientEmail(e.target.value);
                resetRecipient();
              }}
              required
            />

            <button type="button" onClick={handleFindRecipient} disabled={isLookingUp}>
              {isLookingUp ? "Searching..." : "Find"}
            </button>
          </div>

          {lookupError && <p className="error">{lookupError}</p>}

          {recipientName && (
            <p className="success">Sending to {recipientName}</p>
          )}
        </div>

        {recipientWallets.length > 1 && (
          <div className="form-field full-width">
            <label>Recipient's wallet</label>

            <select
              value={destinationWalletId}
              onChange={(e) => setDestinationWalletId(e.target.value)}
              required
            >
              <option value="">Select a wallet</option>

              {recipientWallets.map((wallet) => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.name} ({wallet.currency})
                </option>
              ))}
            </select>
          </div>
        )}

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
          <button type="submit" disabled={isSubmitting || !destinationWalletId}>
            {isSubmitting ? "Transferring..." : "Transfer Funds"}
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default TransferWalletForm;
