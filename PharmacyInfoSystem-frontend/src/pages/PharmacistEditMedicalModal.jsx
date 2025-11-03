import { useState, useEffect } from "react";
import api from "../services/api";

export default function PharmacistEditMedicineModal({
  show,
  onClose,
  medicine,
  onUpdate,
}) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    batch_no: "",
    price: "",
    quantity: "",
    reorder_level: "",
    expiryDate: "",
    supplierId: "",
  });

  useEffect(() => {
    if (medicine) {
      setFormData({
        id: medicine.id,
        name: medicine.name,
        batch_no: medicine.batch_no,
        price: medicine.price,
        quantity: medicine.quantity,
        reorder_level: medicine.reorder_level,
        expiryDate: medicine.expiryDate,
        supplierId: medicine.supplier?.id || "",
      });
    }
  }, [medicine]);

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/medicines/${formData.id}`, formData);
      onUpdate(); // refresh medicine list
      onClose();
    } catch (error) {
      console.error("Error updating medicine:", error);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Edit Medicine</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Medicine Name"
            style={styles.input}
            readOnly
          />
          <input
            type="text"
            name="batch_no"
            value={formData.batch_no}
            onChange={handleChange}
            placeholder="Batch No"
            style={styles.input}
            readOnly
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            style={styles.input}
            required
          />
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            style={styles.input}
          />
          <input
            type="number"
            name="reorder_level"
            value={formData.reorder_level}
            onChange={handleChange}
            placeholder="Reorder Level"
            style={styles.input}
            readOnly
          />
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.saveBtn}>
              Save
            </button>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  modal: {
    background: "#fff",
    borderRadius: "10px",
    padding: "25px",
    width: "400px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  title: {
    textAlign: "center",
    marginBottom: "15px",
    color: "#007bff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  saveBtn: {
    background: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
