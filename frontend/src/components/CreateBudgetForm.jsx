import { useState } from "react";
import { createBudget } from "../services/api";
import { categoryOptions } from "../utils/categoryStyles";

function CreateBudgetForm({ userId, onBudgetCreated }) {
  const [category, setCategory] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!category) {
      setError("Please select a category.");
      return;
    }

    try {
      setIsSubmitting(true);

      const budget = await createBudget({
        userId,
        category,
        monthlyLimit: Number(monthlyLimit),
        currency,
      });

      onBudgetCreated(budget);

      setCategory("");
      setMonthlyLimit("");
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
        <h2>Create Budget</h2>
        <p>Set a monthly spending limit for a category.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-field">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>

            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Monthly limit</label>
          <input
            type="number"
            step="0.01"
            placeholder="Example: 500"
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(e.target.value)}
            required
          />
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
            {isSubmitting ? "Creating..." : "Create Budget"}
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default CreateBudgetForm;