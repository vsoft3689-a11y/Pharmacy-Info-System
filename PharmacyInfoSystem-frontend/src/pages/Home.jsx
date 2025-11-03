import { Link } from "react-router-dom";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Pharmacy Information System</h1>
        <p>
          Streamline pharmacy operations with ease — manage medicines,
          suppliers, and inventory all in one place.
        </p>
        <div className="home-buttons">
          {user ? (
            <>
              {user.role === "PHARMACIST" ? (
                <Link
                  to="/pharmacist/dashboard"
                  className="btn-link"
                  style={{
                    backgroundColor: "white",
                    color: "#1194b8ff",
                    fontWeight: "bolder",
                  }}
                >
                  {"->"} Dashboard
                </Link>
              ) : user.role === "SUPPLIER" ? (
                <Link
                  to="/supplier/dashboard"
                  className="btn-link"
                  style={{
                    backgroundColor: "white",
                    color: "#1194b8ff",
                    fontWeight: "bolder",
                  }}
                >
                  {"->"} Dashboard {"->"}
                </Link>
              ) : (
                <Link
                  to="/admin/dashboard"
                  className="btn-link"
                  style={{
                    backgroundColor: "white",
                    color: "#1194b8ff",
                    fontWeight: "bolder",
                  }}
                >
                  {"->"} Dashboard
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="home-btn primary">
                Login
              </Link>
              <Link to="/register" className="home-btn secondary">
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="features">
        <h2>Key Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>💊 Medicine Management</h3>
            <p>
              Easily add, update, and track medicine stocks with expiry alerts
              and supplier notifications.
            </p>
          </div>
          <div className="feature-card">
            <h3>📦 Supplier Coordination</h3>
            <p>
              Automatic supplier alerts when stock levels run low — ensuring
              timely restocking.
            </p>
          </div>
          <div className="feature-card">
            <h3>👩‍⚕️ Pharmacist Dashboard</h3>
            <p>
              A dedicated interface for pharmacists to handle sales, manage
              records, and assist patients.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
