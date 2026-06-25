import { useState } from "react";
import { loginUser } from "../services/api";

function SignInForm({ onUserSignedIn, onNotify }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      onUserSignedIn(data.user);

      setEmail("");
      setPassword("");
    } catch (err) {
      const message =
        err.status === 401
          ? "Invalid email or password."
          : err.message || "Unable to sign in right now.";

      setError(message);
      onNotify?.({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="card form-card">
      <div className="form-card-header">
        <h2>Sign In</h2>
        <p>Enter your email and password to load your FinTrack dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-field full-width">
          <label>Email</label>
          <input
            type="email"
            placeholder="Example: demetris@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-field full-width">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-actions full-width">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting && <span className="button-spinner" aria-hidden="true"></span>}
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default SignInForm;
