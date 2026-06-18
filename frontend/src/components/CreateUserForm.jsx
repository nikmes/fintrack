import { useState } from "react";
import { createUser } from "../services/api";

function CreateUserForm({ onUserCreated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      await createUser({
        email,
        password,
        fullName,
      });

      setEmail("");
      setPassword("");
      setFullName("");

      setMessage("Account created successfully. Please sign in.");

      if (onUserCreated) {
        onUserCreated();
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
        <h2>Create Account</h2>
        <p>Register a user profile, then sign in to access your dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="Example: demetris@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-field full-width">
          <label>Full name</label>
          <input
            type="text"
            placeholder="Example: Demetris Demetriou"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="form-actions full-width">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default CreateUserForm;