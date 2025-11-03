import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== newConfirmPassword)
      return alert("Passwords are not matched!");

    try {
      const res = await api.post("/auth/reset-password", null, {
        params: { token, newPassword },
      });
      setMessage(res.data);
      if (res.data) {
        logout();
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch {
      setMessage("Error resetting password");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter confirm new password"
            value={newConfirmPassword}
            onChange={(e) => setNewConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        {message && <p className="info-msg">{message}</p>}
      </div>
    </div>
  );
}
