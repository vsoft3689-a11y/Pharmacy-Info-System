import { useEffect, useState } from "react";
import api from "../services/api";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders/all");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  // const updateStatus = async (orderId, status) => {
  //   try {
  //     await api.put(`/orders/${orderId}/status?status=${status}`);
  //     loadOrders();
  //   } catch (err) {
  //     console.error("Error updating order status", err);
  //   }
  // };

  return (
    <div className="dashboard-container">
      <div className="admin-container">
        {/* <header className="dashboard-header"> */}
        <h2>Orders Overview</h2>
        <br />
        {/* </header> */}

        {/* <div className="table-container"> */}
        <table className="medicine-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Medicine</th>
              <th>Quantity</th>
              <th>Supplier</th>
              <th>Pharmacist</th>
              <th>Status</th>
              <th>Date</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.medicineName}</td>
                  <td>{order.quantity}</td>
                  <td>{order.supplier?.name}</td>
                  <td>{order.pharmacist?.name}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        order.status === "PENDING"
                          ? "pending"
                          : order.status === "CONFIRMED"
                          ? "confirmed"
                          : "delivered"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.orderDate).toLocaleString()}</td>
                  {/* <td>
                    {order.status === "PENDING" && (
                      <button
                        className="btn-primary"
                        onClick={() =>
                          updateStatus(order.id, "CONFIRMED")
                        }
                      >
                        Confirm
                      </button>
                    )}
                    {order.status === "CONFIRMED" && (
                      <button
                        className="btn-success"
                        onClick={() =>
                          updateStatus(order.id, "DELIVERED")
                        }
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
