import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import api from "../services/api";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get("auth/admin/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch summary", err);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="profile-card">
          <h2>Admin Dashboard</h2>
          <p>Welcome, Administrator!</p>
        </div>
      </header>

      {/* Summary Statistics */}
      <section className="cards-section">
        <div className="card">
          <h4>Total Medicines</h4>
          <p>{summary.totalMedicines || 0}</p>
        </div>
        <div className="card">
          <h4>Total Pharmacists</h4>
          <p>{summary.totalPharmacists || 0}</p>
        </div>
        <div className="card">
          <h4>Total Suppliers</h4>
          <p>{summary.totalSuppliers || 0}</p>
        </div>
        <div className="card">
          <h4>Pending Orders</h4>
          <p>{summary.pendingOrders || 0}</p>
        </div>
        <div className="card">
          <h4>Delivered Orders</h4>
          <p>{summary.deliveredOrders || 0}</p>
        </div>
        <div className="card">
          <h4>Today’s Sales (₹)</h4>
          <p>{summary.todaySales || 0}</p>
        </div>
        <div className="card">
          <h4>Total Sales (₹)</h4>
          <p>{summary.totalSales || 0}</p>
        </div>
      </section>

      <br />

      {/* Management Sections */}
      <section className="cards-section">
        <div className="card">
          <h4>Manage Pharmacists</h4>
          <br />
          <Link to="/admin/pharmacists" className="btn-link">
            View
          </Link>
        </div>
        <div className="card">
          <h4>Manage Suppliers</h4>
          <br />
          <Link to="/admin/suppliers" className="btn-link">
            View
          </Link>
        </div>
        <div className="card">
          <h4>Manage Medicines</h4>
          <br />
          <Link to="/admin/medicines" className="btn-link">
            View
          </Link>
        </div>
        <div className="card">
          <h4>Orders Overview</h4>
          <br />
          <Link to="/admin/orders" className="btn-link">
            View
          </Link>
        </div>
        <div className="card">
          <h4>Sales Reports</h4>
          <br />
          <Link to="/admin/sales" className="btn-link">
            View
          </Link>
        </div>
      </section>
      <br />
      {/* Analytics and Monitoring */}
      {/* <section className="cards-section">
        <div className="card">
          <h4>Low Stock Medicines</h4>
          <Link to="/admin/low-stock" className="btn-link">
            View
          </Link>
        </div>
        <div className="card">
          <h4>Expiring Medicines</h4>
          <Link to="/admin/expiring" className="btn-link">
            View
          </Link>
        </div>
        <div className="card">
          <h4>Revenue Analytics</h4>
          <Link to="/admin/revenue" className="btn-link">
            View
          </Link>
        </div>
        <div className="card">
          <h4>System Users</h4>
          <Link to="/admin/users" className="btn-link">
            View
          </Link>
        </div>
      </section> */}
    </div>
  );
}
