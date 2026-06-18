import { useState } from "react";
import { createAccount } from "../services/api";

function CreateAccountForm({ userId, onAccountCreated }) {
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [accountType, setAccountType] = useState("Wallet");
  const [currency, setCurrency] = useState("EUR");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const account = await createAccount({
        userId,
        name,
        institution,
        accountType,
        currency,
      });

      onAccountCreated(account);

      setName("");
      setInstitution("");
      setAccountType("Wallet");
      setCurrency("EUR");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="card form-card">
      <div className="form-card-header">
        <h2>Create Account</h2>
        <p>Add a wallet, bank account, savings account, or card.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-field">
          <label>Account name</label>
          <input
            type="text"
            placeholder="Example: Main Wallet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label>Institution</label>
          <input
            type="text"
            placeholder="Example: Revolut, Hellenic Bank"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Account type</label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
          >
            <option value="Wallet">Wallet</option>
            <option value="Bank">Bank</option>
            <option value="Savings">Savings</option>
            <option value="Card">Card</option>
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

        <div className="form-actions full-width">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default CreateAccountForm;