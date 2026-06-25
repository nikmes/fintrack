import { useState } from "react";
import { createWallet } from "../services/api";

function CreateWalletForm({ onWalletCreated, onNotify }) {
  const [currency, setCurrency] = useState("EUR");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const wallet = await createWallet({
        currency,
      });

      onWalletCreated(wallet);
      setCurrency("EUR");
    } catch (err) {
      const message = err.message || "Could not create wallet.";

      setError(message);
      onNotify?.({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="card form-card">
      <div className="form-card-header">
        <h2>Create Wallet</h2>
        <p>Create a wallet for a specific currency.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-field full-width">
          <label>Currency</label>

          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div className="form-actions full-width">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting && <span className="button-spinner" aria-hidden="true"></span>}
            {isSubmitting ? "Creating..." : "Create Wallet"}
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default CreateWalletForm;
