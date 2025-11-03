import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function SupplierDashboard() {
  const [supplier, setSupplier] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [notRegistered, setNotRegistered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchSupplier();
    }
  }, [user]);

  const fetchSupplier = async () => {
    try {
      const { data } = await api.get(`/suppliers/by-user/${user.userId}`);
      setSupplier(data);
      // fetchMedicines(data.id);
      fetchOrders(data.id);
      setNotRegistered(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setNotRegistered(true);
      } else {
        console.error("Error fetching supplier:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // const fetchMedicines = async (supplierId) => {
  //   try {
  //     const { data } = await api.get(`/medicines/by-supplier/${supplierId}`);
  //     setMedicines(data);
  //   } catch (error) {
  //     console.error("Error fetching medicines:", error);
  //   }
  // };

  const fetchOrders = async (supplierId) => {
    try {
      const { data } = await api.get(`/orders/by-supplier/${supplierId}`);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  if (loading) return <div className="dashboard">Loading...</div>;

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
        <h2>You haven’t completed your Supplier Profile</h2>
        <p>Please fill in your details to continue managing the supply.</p>
        <br />
        <Link to="/supplier/profile" className="btn-link">
          Complete Profile
        </Link>
      </div>
    );

  // Order Summary
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="profile-card">
          <h2>Supplier Dashboard</h2>
          <p>Welcome, {supplier?.name}!</p>
        </div>
        <div>
          <br />
          <br />
          <Link
            to="/supplier/profile"
            className="btn-link"
            style={{ marginTop: "20px" }}
          >
            My Profile
          </Link>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="cards-section">
        <div className="card">
          <h4>Total Orders</h4>
          <p>{totalOrders}</p>
        </div>
        <div className="card">
          <h4>Pending Orders</h4>
          <p>{pendingOrders}</p>
        </div>
        <div className="card">
          <h4>Delivered Orders</h4>
          <p>{deliveredOrders}</p>
        </div>
      </div>
      <br />
      <div className="cards-section">
        <div className="card">
          <h4>Medicine Orders</h4>
          <br />
          <Link
            to="/supplier/pharmacist/orders"
            className="btn-link"
            state={{ supplierid: supplier?.id }}
          >
            View
          </Link>
        </div>
        <div className="card">
          <h4>Medicine Delivered</h4>
          <br />
          <Link
            to="/supplier/pharmacist/delivered"
            className="btn-link"
            state={{ supplierid: supplier?.id }}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
