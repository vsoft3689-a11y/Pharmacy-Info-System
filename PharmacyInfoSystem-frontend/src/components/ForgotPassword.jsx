import { useState } from "react";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("auth/forgot-password", null, {
        params: { email },
      });
      setMessage(res.data);
      setLoading(false);
    } catch (err) {
      setMessage("Error sending reset link");
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && <p className="info-msg">{message}</p>}
      </div>
    </div>
  );
}
