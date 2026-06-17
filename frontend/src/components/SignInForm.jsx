import { useState } from "react";
import { getUserById } from "../services/api";

function SignInForm({ onUserSignedIn }) {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    try {
      const user = await getUserById(userId);
      onUserSignedIn(user);
      setUserId("");
    } catch (err) {
      setError("User not found. Please check the User ID.");
    }
  }

  return (
    <div className="card">
      <h2>Sign In</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />

        <button type="submit">Sign In</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default SignInForm;