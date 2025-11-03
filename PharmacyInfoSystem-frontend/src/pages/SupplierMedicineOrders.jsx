import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";

const SupplierMedicineOrders = () => {
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const { supplierid } = location.state;
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = async (s) => {
    try {
      const { data } = await api.get(`/orders/by-supplier/${supplierid}`);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="admin-container">
        <h2>Medicine Orders</h2>
        <br />
        <table className="medicine-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Medicine</th>
              <th>Quantity</th>
              <th>Pharmacist</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.medicineName}</td>
                  <td>{order.quantity}</td>
                  <td>{order.pharmacist?.name}</td>
                  <td>{order.status}</td>
                  <td>
                    {order.status === "PENDING" ? (
                      <button
                        className="btn-link"
                        style={{ backgroundColor: "#4e97e4ff" }}
                        onClick={() => updateStatus(order.id, "DELIVERED")}
                      >
                        Mark Delivered
                      </button>
                    ) : (
                      <span className="status-badge delivered">Delivered</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <>
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No orders found.
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierMedicineOrders;
