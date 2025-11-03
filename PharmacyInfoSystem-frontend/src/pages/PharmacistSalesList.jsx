import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext"; // assuming you store logged-in user here
import { useLocation, useNavigate } from "react-router-dom";

export default function PharmacistSalesList() {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth(); // user.pharmacistId expected
  const location = useLocation();
  const { pharmacistid } = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, []);

  useEffect(() => {
    const endpoint =
      user?.role === "PHARMACIST"
        ? `/sales/pharmacist/${pharmacistid}`
        : "/sales/all";

    api
      .get(endpoint)
      .then((res) => setSales(res.data))
      .catch(() => setError("Failed to load sales data"));
  }, [user]);

  console.log(sales);
  return (
    <div className="dashboard-container">
      <div className="admin-container">
        <h2 style={styles.title}>
          {user.role === "PHARMACIST" ? `🧾 Sales History` : "🧾 All Sales"}
        </h2>

        {error && <p style={styles.error}>{error}</p>}

        <table className="medicine-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Pharmacist</th>
              <th>Date</th>
              <th>Total</th>
              <th>Medicines</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.empty}>
                  No sales found
                </td>
              </tr>
            ) : (
              sales.map((sale, index) => (
                <tr key={sale.id}>
                  <td>{index + 1}</td>
                  <td>{sale.patientName}</td>
                  <td>{sale.pharmacist?.name || "—"}</td>
                  <td>{new Date(sale.saleDate).toLocaleString()}</td>
                  <td>₹{sale.totalAmount.toFixed(2)}</td>
                  <td>
                    {sale.saleItems?.map((item) => (
                      <div key={item.id} style={styles.medicineItem}>
                        {item.medicine?.name} ({item.quantity} × ₹{item.price})
                        = ₹{item.total}
                      </div>
                    ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  title: {
    textAlign: "center",
    color: "#2a6592",
    marginBottom: "20px",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    padding: "15px",
  },
};
