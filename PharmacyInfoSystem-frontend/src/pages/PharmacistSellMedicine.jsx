import { useEffect, useState } from "react";
import api from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PharmacistSellMedicine() {
  const [medicines, setMedicines] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const location = useLocation();
  const { pharmacistid } = location.state;
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log(pharmacistid)
  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, []);

  // Fetch available medicines
  useEffect(() => {
    api
      .get(`/medicines/by-pharmacist/${pharmacistid}`)
      .then((res) => setMedicines(res.data))
      .catch(() => setError("Failed to load medicines"));

    api
      .get(`/sales/pharmacist/${pharmacistid}`)
      .then((res) => console.log(res.data));
  }, []);

  // When medicine selected from dropdown
  const handleSelectMedicine = (e) => {
    const medicineId = e.target.value;
    if (!medicineId) return;

    const med = medicines.find((m) => m.id === parseInt(medicineId));
    if (!med) return;

    // Prevent duplicates
    const alreadyAdded = selectedItems.some(
      (item) => item.medicineId === med.id
    );
    if (alreadyAdded) {
      setError("Medicine already added!");
      setTimeout(() => setError(""), 2000);
      setSelectedMedicine(""); // reset dropdown
      return;
    }

    setSelectedItems([
      ...selectedItems,
      { medicineId: med.id, quantity: 1, price: med.price, name: med.name },
    ]);
    setSelectedMedicine(""); // reset dropdown
  };

  // Update quantity
  const handleQuantityChange = (index, value) => {
    const items = [...selectedItems];
    items[index].quantity = parseInt(value);
    setSelectedItems(items);
  };

  // Remove item
  const removeItem = (index) => {
    const items = [...selectedItems];
    items.splice(index, 1);
    setSelectedItems(items);
  };

  // Submit sale
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const saleData = {
        patientName,
        pharmacist: { id: pharmacistid },
        saleItems: selectedItems.map((item) => ({
          medicine: { id: parseInt(item.medicineId) },
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await api.post("/sales/create", saleData);
      setSuccess("Sale completed successfully!");
      setSelectedItems([]);
      setPatientName("");
    } catch (err) {
      setError("Sale failed. Check stock or inputs.");
    }
  };

  return (
    <div className="dashboard-container">
      <div style={styles.container}>
        <h2 style={styles.title}>Sell Medicines</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label>Patient Name:</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <label>Select Medicine:</label>
          <select
            value={selectedMedicine}
            onChange={handleSelectMedicine}
            style={styles.select}
          >
            <option value="">-- Select Medicine --</option>
            {medicines.map((med) => (
              <option key={med.id} value={med.id}>
                {med.name} - ₹{med.price}
              </option>
            ))}
          </select>

          {selectedItems.length > 0 && (
            <div>
              <h4 style={styles.subTitle}>🧾 Selected Medicines</h4>
              {selectedItems.map((item, index) => (
                <div key={index} style={styles.medicineRow}>
                  <span>{item.name}</span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value)
                    }
                    style={styles.inputSmall}
                  />
                  {/* Unit Price */}
                  <span>₹{item.price}</span>
                  {/* Total for this medicine — safe check for empty or invalid values */}
                  <span>
                    ₹
                    {item.quantity && !isNaN(item.quantity)
                      ? (item.price * parseFloat(item.quantity)).toFixed(2)
                      : "0.00"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    style={styles.removeBtn}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="btn-link">
            Complete Sale
          </button>

          {success && <p style={styles.success}>{success}</p>}
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    color: "#2a6592",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  inputSmall: {
    width: "60px",
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  medicineRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#fff",
    padding: "10px",
    borderRadius: "8px",
    marginTop: "10px",
  },
  submitBtn: {
    background: "#3248b9ff",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  removeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "red",
    fontSize: "18px",
  },
  success: {
    color: "green",
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  subTitle: {
    marginTop: "10px",
    color: "#444",
  },
};
