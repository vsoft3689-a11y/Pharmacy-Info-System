import { useEffect, useState } from "react";
import api from "../services/api";
import "../App.css";
import PharmacistEditMedicineModal from "./PharmacistEditMedicalModal";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PharmacistMedicinesList() {
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [message, setMessage] = useState("");
  const [showOrderPrompt, setShowOrderPrompt] = useState(false);
  const [orderQty, setOrderQty] = useState("");
  const [orders, setOrders] = useState([]); // store latest order statuses
  const location = useLocation();
  const { pharmacistid } = location.state;
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchMedicines();
    fetchOrders();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await api.get(`/medicines/by-pharmacist/${pharmacistid}`);
      setMedicines(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load medicines");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/orders/by-pharmacist/${pharmacistid}`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await api.delete(`/pharmacist/medicines/${id}`);
        setMessage("Medicine deleted successfully");
        fetchMedicines();
      } catch (err) {
        console.error(err);
        setMessage("Failed to delete medicine");
      }
    }
  };

  const handleRequestOrder = (medicine) => {
    if (!medicine.supplier?.id) {
      alert("Supplier not found for this medicine.");
      return;
    }
    setSelectedMedicine(medicine);
    setShowOrderPrompt(true);
    setOrderQty(medicine.reorder_level * 2);
  };

  const confirmOrderRequest = async () => {
    if (!orderQty || isNaN(orderQty) || orderQty <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    try {
      const orderPayload = {
        medicineId: selectedMedicine.id,
        medicineName: selectedMedicine.name,
        quantity: Number(orderQty),
        pharmacist: { id: pharmacistid },
        supplier: { id: selectedMedicine.supplier.id },
      };

      await api.post("/orders/request", orderPayload);

      setMessage("Order request sent successfully!");
      setShowOrderPrompt(false);
      setSelectedMedicine(null);

      // Refresh orders to reflect "PENDING"
      fetchOrders();
    } catch (err) {
      console.error(err);
      setMessage("Failed to create order request");
    }
  };

  const getOrderStatus = (medicineName) => {
    const recentOrder = orders
      .filter((o) => o.medicineName === medicineName)
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))[0];
    return recentOrder ? recentOrder.status : null;
  };

  return (
    <div className="dashboard-container">
      <div className="medicine-list-container">
        <h2>Medicine Inventory</h2>
        {message && <p className="message">{message}</p>}

        <table className="medicine-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Batch No</th>
              <th>Price (₹)</th>
              <th>Quantity</th>
              <th>Reorder Level</th>
              <th>Expiry Date</th>
              <th>Supplier</th>
              <th>Actions</th>
              {orders.length > 0 && <th>Status</th>}
            </tr>
          </thead>
          <tbody>
            {medicines.length > 0 ? (
              medicines.map((med) => {
                const orderStatus = getOrderStatus(med.name);

                return (
                  <tr key={med.id}>
                    <td>{med.id}</td>
                    <td>{med.name}</td>
                    <td>{med.batch_no}</td>
                    <td>{med.price}</td>
                    <td
                      style={{
                        color:
                          med.quantity <= med.reorder_level ? "red" : "black",
                        fontWeight:
                          med.quantity <= med.reorder_level ? "bold" : "normal",
                      }}
                    >
                      {med.quantity}
                    </td>
                    <td>{med.reorder_level}</td>
                    <td>{med.expiryDate}</td>
                    <td>{med.supplier?.name || "N/A"}</td>
                    <td>
                      <PharmacistEditMedicineModal
                        show={showEdit}
                        onClose={() => setShowEdit(false)}
                        medicine={selectedMedicine}
                        onUpdate={fetchMedicines}
                      />
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setSelectedMedicine(med);
                          setShowEdit(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(med.id)}
                      >
                        Delete
                      </button>

                      {/* Always show order or reorder button if needed */}
                      {!orderStatus && med.quantity <= med.reorder_level && (
                        <button
                          className="btn-submit"
                          style={{ marginLeft: "5px" }}
                          onClick={() => handleRequestOrder(med)}
                        >
                          Order
                        </button>
                      )}
                    </td>

                    {/* Status column — only for medicines with orders */}
                    {orderStatus && (
                      <td>
                        {orderStatus === "PENDING" && (
                          <span className="status-tag status-pending">
                            PENDING
                          </span>
                        )}
                        {orderStatus === "DELIVERED" && (
                          <>
                            {med.quantity <= med.reorder_level ? (
                              <button
                                className="btn-submit"
                                style={{ marginLeft: "5px" }}
                                onClick={() => handleRequestOrder(med)}
                              >
                                Reorder
                              </button>
                            ) : (
                              <span className="status-tag status-delivered">
                                DELIVERED
                              </span>
                            )}
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No medicines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showOrderPrompt && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Order Request for "{selectedMedicine?.name}"</h3>
              <p>Enter the quantity you want to order:</p>
              <input
                type="number"
                value={orderQty}
                min="1"
                onChange={(e) => setOrderQty(e.target.value)}
                className="order-input"
              />
              <div className="modal-actions">
                <button className="btn-submit" onClick={confirmOrderRequest}>
                  Confirm Order
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => setShowOrderPrompt(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
