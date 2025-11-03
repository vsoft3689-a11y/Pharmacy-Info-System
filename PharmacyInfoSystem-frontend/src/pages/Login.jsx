import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../App.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "PHARMACIST") return navigate("/pharmacist/dashboard");
      else if (user.role === "SUPPLIER") return navigate("/supplier/dashboard");
      else navigate("/admin/dashboard");
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === "ADMIN") navigate("/admin/dashboard");
      else if (user.role === "PHARMACIST") navigate("/pharmacist/dashboard");
      else if (user.role === "SUPPLIER") navigate("/supplier/dashboard");
    } catch (err) {
      setError(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Sign In</button>
          
          <p className="login-redirect">
            New User? <Link to="/register">Register</Link>
          </p>
          <p className="login-redirect"><Link to="/forgot-password">Forgot Password?</Link></p>
        </form>
      </div>
    </div>
  );
}
