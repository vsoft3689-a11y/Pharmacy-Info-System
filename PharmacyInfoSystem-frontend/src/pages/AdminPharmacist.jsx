import { useEffect, useState } from "react";
import api from "../services/api";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminPharmacists() {
  const [pharmacists, setPharmacists] = useState([]);
  const [message, setMessage] = useState("");
  //   const [newPharmacist, setNewPharmacist] = useState({
  //     name: "",
  //     email: "",
  //     contact: "",
  //     password: "",
  //   });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchPharmacists();
  }, []);

  const fetchPharmacists = async () => {
    try {
      const res = await api.get("/pharmacist/all");
      setPharmacists(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load pharmacists");
    }
  };

  const handleAddPharmacist = async (e) => {
    e.preventDefault();
    try {
      await api.post("/pharmacist/create", newPharmacist);
      setMessage("Pharmacist added successfully!");
      //   setNewPharmacist({ name: "", email: "", phone: "", password: "" });
      fetchPharmacists();
    } catch (err) {
      console.error(err);
      setMessage("Failed to add pharmacist");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this pharmacist?")) {
      try {
        await api.delete(`/pharmacist/${id}`);
        setMessage("Pharmacist deleted successfully!");
        fetchPharmacists();
      } catch (err) {
        console.error(err);
        setMessage("Failed to delete pharmacist");
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="admin-container">
        <h2>Manage Pharmacists</h2>
        <br />
        {message && <p className="message">{message}</p>}

        {/* Add Pharmacist Form */}
        {/* <div className="add-form">
        <h3>Add New Pharmacist</h3>
        <form onSubmit={handleAddPharmacist}>
          <input
            type="text"
            placeholder="Name"
            value={newPharmacist.name}
            onChange={(e) =>
              setNewPharmacist({ ...newPharmacist, name: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newPharmacist.email}
            onChange={(e) =>
              setNewPharmacist({ ...newPharmacist, email: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={newPharmacist.phone}
            onChange={(e) =>
              setNewPharmacist({ ...newPharmacist, phone: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newPharmacist.password}
            onChange={(e) =>
              setNewPharmacist({ ...newPharmacist, password: e.target.value })
            }
            required
          />
          <button type="submit" className="btn-submit">
            Add Pharmacist
          </button>
        </form>
      </div> */}

        {/* Pharmacist List */}
        <table className="medicine-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Qualification</th>
              <th>Address</th>
              <th>Contact</th>
              {/* <th>Joined Date</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pharmacists.length > 0 ? (
              pharmacists.map((ph) => (
                <tr key={ph.id}>
                  <td>{ph.id}</td>
                  <td>{ph.name}</td>
                  <td>{ph.email}</td>
                  <td>{ph.qualification}</td>
                  <td>{ph.address}</td>
                  <td>{ph.contact}</td>
                  {/* <td>{ph.createdAt ? ph.createdAt.split("T")[0] : "N/A"}</td> */}
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(ph.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No pharmacists found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
