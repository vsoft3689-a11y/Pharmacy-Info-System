import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "../App.css";

export default function PharmacistDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    totalMedicines: 0,
    lowStock: 0,
    expiringSoon: 0,
    todaySales: 0,
  });
  const [pharmacist, setPharmacist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notRegistered, setNotRegistered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchPharmacist = async () => {
      try {
        const res = await api.get(`/pharmacist/by-user/${user.userId}`);
        setPharmacist(res.data);
        setNotRegistered(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setNotRegistered(true);
        } else {
          console.error("Error fetching pharmacist:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPharmacist();
  }, [user]);

  useEffect(() => {
    api
      .get(`/pharmacist/summary/${pharmacist?.id}`)
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Error loading summary:", err));
  }, [pharmacist]);

  console.log(summary);
  console.log(pharmacist?.id);
  if (loading) return <p>Loading...</p>;

  if (notRegistered)
    return (
      <div
        className="dashboard-container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2>You haven’t completed your Pharmacist Profile</h2>
        <p>Please fill in your details to continue managing the pharmacy.</p>
        <br />
        <Link to="/pharmacist/profile" className="btn-link">
          Complete Profile
        </Link>
      </div>
    );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="profile-card">
          <h2>Pharmacist Dashboard</h2>
          <p>Welcome, {pharmacist?.name}!</p>
        </div>
        <div>
          <br />
          <br />
          <Link to="/pharmacist/profile" className="btn-link">
            My Profile
          </Link>
        </div>
      </header>

      <section className="cards-section">
        <div className="card">
          <h4>Total Medicines</h4>
          <p>{summary.totalMedicines}</p>
        </div>
        <div className="card">
          <h4>Low Stock</h4>
          <p>{summary.lowStock}</p>
        </div>
        <div className="card">
          <h4>Expiring Soon</h4>
          <p>{summary.expiringSoon}</p>
        </div>
        <div className="card">
          <h4>Today’s Sales (₹)</h4>
          <p>{summary.todaySales}</p>
        </div>
      </section>

      <br />

      <section className="cards-section">
        <div className="card">
          <h4>Add Medicine</h4>
          <br />
          <Link
            to="/add-medicine"
            className="btn-link"
            state={{ pharmacistid: pharmacist?.id }}
          >
            View
          </Link>
        </div>
        <div className="card">
          <h4>List Medicines</h4>
          <br />
          <Link
            to="/medicine-list"
            className="btn-link"
            state={{ pharmacistid: pharmacist?.id }}
          >
            View
          </Link>
        </div>
        <div className="card">
          <h4>Sell Medicines</h4>
          <br />
          <Link
            to={`/medicine-sell`}
            state={{ pharmacistid: pharmacist?.id }}
            className="btn-link"
          >
            View
          </Link>
        </div>
        <div className="card">
          <h4>Sales Medicines</h4>
          <br />
          <Link
            to={`/medicine-saleslist`}
            className="btn-link"
            state={{ pharmacistid: pharmacist?.id }}
          >
            View
          </Link>
        </div>
      </section>
    </div>
  );
}
