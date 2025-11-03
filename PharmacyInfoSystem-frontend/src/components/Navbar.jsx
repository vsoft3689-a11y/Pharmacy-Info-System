import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import "../App.css";

export default function NavBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-logo" to="/" onClick={closeMenu}>
          Pharmacy PIS
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <div className={menuOpen ? "bar open" : "bar"}></div>
          <div className={menuOpen ? "bar open" : "bar"}></div>
          <div className={menuOpen ? "bar open" : "bar"}></div>
        </div>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          {user ? (
            <>
              {user.role === "PHARMACIST" ? (
                <Link to="/pharmacist/dashboard" className="nav-link" onClick={closeMenu}>
                  Dashboard
                </Link>
              ) : user.role === "SUPPLIER" ? (
                <Link to="/supplier/dashboard" className="nav-link" onClick={closeMenu}>
                  Dashboard
                </Link>
              ) : (
                <Link to="/admin/dashboard" className="nav-link" onClick={closeMenu}>
                  Dashboard
                </Link>
              )}
              <button className="logout-btn" onClick={() => { handleLogout(); closeMenu(); }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="nav-link" onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
