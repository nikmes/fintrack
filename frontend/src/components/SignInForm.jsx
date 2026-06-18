import { useState } from "react";
import { getUserById } from "../services/api";

function SignInForm({ onUserSignedIn }) {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await getUserById(userId);
      onUserSignedIn(user);
      setUserId("");
    } catch (err) {
      setError("User not found. Please check the User ID.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="card form-card">
      <div className="form-card-header">
        <h2>Sign In</h2>
        <p>Enter your temporary user ID to load your dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-field full-width">
          <label>User ID</label>
          <input
            type="text"
            placeholder="Paste your user ID here"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>

        <div className="form-actions full-width">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default SignInForm;