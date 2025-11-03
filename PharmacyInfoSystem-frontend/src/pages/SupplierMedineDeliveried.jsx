import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const SupplierMedineDeliveried = () => {
  const [medicines, setMedicines] = useState([]);
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
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const { data } = await api.get(`/medicines/by-supplier/${supplierid}`);
      setMedicines(data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };
  return (
    <div className="dashboard-container">
      <div className="admin-container">
        <h2>Medicines Supplied</h2>
        <br />
        <table className="medicine-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Batch No</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {medicines.length > 0 ? (
              medicines.map((med) => (
                <tr key={med.id}>
                  <td>{med.id}</td>
                  <td>{med.name}</td>
                  <td>{med.batch_no}</td>
                  <td>₹{med.price}</td>
                  <td>{med.quantity}</td>
                  <td>{med.expiryDate}</td>
                </tr>
              ))
            ) : (
              <>
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No medicines supplied yet.
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

export default SupplierMedineDeliveried;
