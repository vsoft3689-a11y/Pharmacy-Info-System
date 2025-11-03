import { useEffect, useState } from "react";
import api from "../services/api";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState("");
  //   const [newSupplier, setNewSupplier] = useState({
  //     name: "",
  //     email: "",
  //     phone: "",
  //     company: "",
  //     address: "",
  //   });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers/all");
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load suppliers");
    }
  };

  //   const handleAddSupplier = async (e) => {
  //     e.preventDefault();
  //     try {
  //       await api.post("/suppliers/create", newSupplier);
  //       setMessage("Supplier added successfully!");
  //       setNewSupplier({
  //         name: "",
  //         email: "",
  //         phone: "",
  //         company: "",
  //         address: "",
  //       });
  //       fetchSuppliers();
  //     } catch (err) {
  //       console.error(err);
  //       setMessage("Failed to add supplier");
  //     }
  //   };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await api.delete(`/suppliers/${id}`);
        setMessage("Supplier deleted successfully!");
        fetchSuppliers();
      } catch (err) {
        console.error(err);
        setMessage("Failed to delete supplier");
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="admin-container">
        <h2>Manage Suppliers</h2>
        <br />
        {message && <p className="message">{message}</p>}

        {/* Add Supplier Form */}
        {/* <div className="add-form">
        <h3>Add New Supplier</h3>
        <form onSubmit={handleAddSupplier}>
          <input
            type="text"
            placeholder="Name"
            value={newSupplier.name}
            onChange={(e) =>
              setNewSupplier({ ...newSupplier, name: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newSupplier.email}
            onChange={(e) =>
              setNewSupplier({ ...newSupplier, email: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={newSupplier.phone}
            onChange={(e) =>
              setNewSupplier({ ...newSupplier, phone: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Company"
            value={newSupplier.company}
            onChange={(e) =>
              setNewSupplier({ ...newSupplier, company: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={newSupplier.address}
            onChange={(e) =>
              setNewSupplier({ ...newSupplier, address: e.target.value })
            }
            required
          />
          <button type="submit" className="btn-submit">
            Add Supplier
          </button>
        </form>
      </div> */}

        {/* Supplier List */}
        <table className="medicine-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Company</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.contact}</td>
                  <td>{s.companyName}</td>
                  <td>{s.address}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(s.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
