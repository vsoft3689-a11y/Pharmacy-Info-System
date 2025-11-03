import { useEffect, useState } from "react";
import api from "../services/api";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminMedicines() {
  const [medicines, setMedicines] = useState([]);
  //   const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");
  //   const [newMedicine, setNewMedicine] = useState({
  //     name: "",
  //     batch_no: "",
  //     price: "",
  //     quantity: "",
  //     reorder_level: "",
  //     expiryDate: "",
  //     supplierId: "",
  //   });
  //   const [editingMedicine, setEditingMedicine] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchMedicines();
    // fetchSuppliers();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await api.get("/medicines/all");
      setMedicines(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load medicines");
    }
  };

  //   const fetchSuppliers = async () => {
  //     try {
  //       const res = await api.get("/suppliers");
  //       setSuppliers(res.data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   const handleAddMedicine = async (e) => {
  //     e.preventDefault();
  //     try {
  //       await api.post("/admin/medicines", newMedicine);
  //       setMessage("Medicine added successfully!");
  //       setNewMedicine({
  //         name: "",
  //         batch_no: "",
  //         price: "",
  //         quantity: "",
  //         reorder_level: "",
  //         expiryDate: "",
  //         supplierId: "",
  //       });
  //       fetchMedicines();
  //     } catch (err) {
  //       console.error(err);
  //       setMessage("Failed to add medicine");
  //     }
  //   };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await api.delete(`/admin/medicines/${id}`);
        setMessage("Medicine deleted successfully!");
        fetchMedicines();
      } catch (err) {
        console.error(err);
        setMessage("Failed to delete medicine");
      }
    }
  };

  //   const handleEdit = (medicine) => {
  //     setEditingMedicine({ ...medicine, supplierId: medicine.supplier?.id || "" });
  //   };

  //   const handleUpdateMedicine = async (e) => {
  //     e.preventDefault();
  //     try {
  //       await api.put(`/admin/medicines/${editingMedicine.id}`, editingMedicine);
  //       setMessage("Medicine updated successfully!");
  //       setEditingMedicine(null);
  //       fetchMedicines();
  //     } catch (err) {
  //       console.error(err);
  //       setMessage("Failed to update medicine");
  //     }
  //   };

  const filterInventory = (type) => {
    setFilter(type);
  };

  const filteredInventory = medicines.filter((item) => {
    if (filter === "low") return item.quantity <= item.reorder_level;
    if (filter === "expired") return new Date(item.expiryDate) < new Date();
    return true;
  });

  return (
    <div className="dashboard-container">
      <div className="admin-container">
        <h2>Manage Medicines</h2>
        <br />
        {message && <p className="message">{message}</p>}

        {/* Add Medicine Form */}
        {/* <div className="add-form">
        <h3>Add New Medicine</h3>
        <form onSubmit={handleAddMedicine}>
          <input
            type="text"
            placeholder="Medicine Name"
            value={newMedicine.name}
            onChange={(e) =>
              setNewMedicine({ ...newMedicine, name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Batch No"
            value={newMedicine.batch_no}
            onChange={(e) =>
              setNewMedicine({ ...newMedicine, batch_no: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newMedicine.price}
            onChange={(e) =>
              setNewMedicine({ ...newMedicine, price: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newMedicine.quantity}
            onChange={(e) =>
              setNewMedicine({ ...newMedicine, quantity: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Reorder Level"
            value={newMedicine.reorder_level}
            onChange={(e) =>
              setNewMedicine({ ...newMedicine, reorder_level: e.target.value })
            }
            required
          />
          <input
            type="date"
            placeholder="Expiry Date"
            value={newMedicine.expiryDate}
            onChange={(e) =>
              setNewMedicine({ ...newMedicine, expiryDate: e.target.value })
            }
            required
          />
          <select
            value={newMedicine.supplierId}
            onChange={(e) =>
              setNewMedicine({ ...newMedicine, supplierId: e.target.value })
            }
            required
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-submit">
            Add Medicine
          </button>
        </form>
      </div> */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            className="filter-bar-modern"
            style={{
              padding: "20px",
              // backgroundColor: "#f9fafc",
              borderRadius: "5px",
            }}
          >
            <button
              className={`filter-btn-modern ${
                filter === "all" ? "active" : ""
              }`}
              onClick={() => filterInventory("all")}
            >
              All
            </button>
            <button
              className={`filter-btn-modern ${
                filter === "low" ? "active" : ""
              }`}
              onClick={() => filterInventory("low")}
            >
              Low Stock
            </button>
            <button
              className={`filter-btn-modern ${
                filter === "expired" ? "active" : ""
              }`}
              onClick={() => filterInventory("expired")}
            >
              Expired
            </button>
          </div>
        </div>

        {/* Medicines Table */}
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
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((m) => (
                //   <tr key={m.id}>
                <tr
                  key={m.id}
                  style={{
                    backgroundColor:
                      new Date(m.expiryDate) < new Date()
                        ? "#ffe5e5"
                        : m.quantity <= m.reorder_level
                        ? "#fdfbfbff"
                        : "white",
                  }}
                >
                  <td>{m.id}</td>
                  <td>{m.name}</td>
                  <td>{m.batch_no}</td>
                  <td>{m.price}</td>

                  <td
                    style={{
                      color: m.quantity <= m.reorder_level ? "red" : "white",
                      fontWeight: m.quantity <= m.reorder_level ? "800" : null,
                    }}
                  >
                    {m.quantity}
                  </td>
                  <td>{m.reorder_level}</td>
                  <td>{m.expiryDate}</td>
                  <td>{m.supplier?.name || "N/A"}</td>
                  <td>
                    {/* <button
                    className="btn-edit"
                    onClick={() => handleEdit(m)}
                    style={{ marginRight: "5px" }}
                  >
                    Edit
                  </button> */}
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(m.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No medicines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Edit Medicine Modal */}
        {/* {editingMedicine && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Medicine</h3>
            <form onSubmit={handleUpdateMedicine}>
              <input
                type="text"
                value={editingMedicine.name}
                onChange={(e) =>
                  setEditingMedicine({
                    ...editingMedicine,
                    name: e.target.value,
                  })
                }
              />
              <input
                type="text"
                value={editingMedicine.batch_no}
                onChange={(e) =>
                  setEditingMedicine({
                    ...editingMedicine,
                    batch_no: e.target.value,
                  })
                }
              />
              <input
                type="number"
                value={editingMedicine.price}
                onChange={(e) =>
                  setEditingMedicine({
                    ...editingMedicine,
                    price: e.target.value,
                  })
                }
              />
              <input
                type="number"
                value={editingMedicine.quantity}
                onChange={(e) =>
                  setEditingMedicine({
                    ...editingMedicine,
                    quantity: e.target.value,
                  })
                }
              />
              <input
                type="number"
                value={editingMedicine.reorder_level}
                onChange={(e) =>
                  setEditingMedicine({
                    ...editingMedicine,
                    reorder_level: e.target.value,
                  })
                }
              />
              <input
                type="date"
                value={editingMedicine.expiryDate}
                onChange={(e) =>
                  setEditingMedicine({
                    ...editingMedicine,
                    expiryDate: e.target.value,
                  })
                }
              />
              <select
                value={editingMedicine.supplierId}
                onChange={(e) =>
                  setEditingMedicine({
                    ...editingMedicine,
                    supplierId: e.target.value,
                  })
                }
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <div className="modal-buttons">
                <button type="submit" className="btn-submit">
                  Update
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditingMedicine(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
      </div>
    </div>
  );
}
