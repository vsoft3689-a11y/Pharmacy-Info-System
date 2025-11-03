import { useEffect, useState } from "react";
import api from "../services/api";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminSales() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [filter, setFilter] = useState("all");
  const [totalAmount, setTotalAmount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, []);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const res = await api.get("/sales/all");
      setSales(res.data);
      setFilteredSales(res.data);
      calculateTotal(res.data);
    } catch (err) {
      console.error("Error fetching sales", err);
    }
  };

  const calculateTotal = (list) => {
    const total = list.reduce((sum, sale) => sum + sale.totalAmount, 0);
    setTotalAmount(total);
  };

  const filterSales = (type) => {
    setFilter(type);
    if (type === "today") {
      const today = new Date().toISOString().slice(0, 10);
      const filtered = sales.filter((sale) => sale.saleDate.startsWith(today));
      setFilteredSales(filtered);
      calculateTotal(filtered);
    } else {
      setFilteredSales(sales);
      calculateTotal(sales);
    }
  };

  return (
    <div className="dashboard-container">
      {/* <header className="dashboard-header"> */}
      <h2>Sales Reports</h2>
      <br />
      {/* </header> */}

      <div className="filter-bar-modern">
        <div className="filter-bar">
          <div className="filter-buttons">
            <button
              className={`filter-btn-modern ${
                filter === "all" ? "active" : ""
              }`}
              onClick={() => filterSales("all")}
            >
              📋 All Sales
            </button>

            <button
              className={`filter-btn-modern ${
                filter === "today" ? "active" : ""
              }`}
              onClick={() => filterSales("today")}
            >
              🌤 Today’s Sales
            </button>
          </div>
          <br />
          <div className="total-card">
            <h4>Total Sales</h4>
            <p>₹{totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="admin-container">
        <table className="medicine-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Pharmacist</th>
              <th>Total Amount (₹)</th>
              <th>Date</th>
              <th>Sale Items</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale, index) => (
                <tr key={sale.id}>
                  <td>{index + 1}</td>
                  <td>{sale.patientName}</td>
                  <td>{sale.pharmacist?.name}</td>
                  <td>{sale.totalAmount.toFixed(2)}</td>
                  <td>{new Date(sale.saleDate).toLocaleString()}</td>
                  <td>
                    <ul className="sale-items-list">
                      {sale.saleItems?.map((item, i) => (
                        <li key={i}>
                          {item.medicine?.name} — {item.quantity} × ₹
                          {item.price.toFixed(2)} = ₹{item.total.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No sales found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
