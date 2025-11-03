import { useEffect, useState } from "react";
import api from "../services/api";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function PharmacistAddMedicineForm() {
  const [formData, setFormData] = useState({
    name: "",
    batch_no: "",
    price: "",
    quantity: "",
    reorder_level: "",
    expiryDate: "",
    supplierId: "",
  });
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { pharmacistid } = location.state;

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, []);

  useEffect(() => {
    // Fetch suppliers for dropdown
    const fetchSuppliers = async () => {
      try {
        const res = await api.get("/suppliers/all");
        setSuppliers(res.data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/medicines/add-medicines", formData);
      setMessage("Order placed successfully!");
      setFormData({
        name: "",
        batch_no: "",
        price: "",
        quantity: "",
        reorder_level: "",
        expiryDate: "",
        supplierId: "",
        pharmacistId: pharmacistid,
      });
    } catch (err) {
      console.error(err);
      setMessage("Failed to add medicine. Try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="medicine-form-container">
        <h2>Add Medicine</h2>
        <form onSubmit={handleSubmit} className="medicine-form">
          <div className="form-group">
            <label>Medicine Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter medicine name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Batch Number</label>
            <input
              type="text"
              name="batch_no"
              placeholder="Enter batch number"
              value={formData.batch_no}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Reorder Level</label>
            <input
              type="number"
              name="reorder_level"
              placeholder="Enter reorder level"
              value={formData.reorder_level}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Supplier</label>
            <select
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-submit">
            Place Order
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
