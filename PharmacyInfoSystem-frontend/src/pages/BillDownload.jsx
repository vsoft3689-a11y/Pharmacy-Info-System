import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function BillDownload({ saleId }) {
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await api.get(`/sales/${saleId}`);
        setSale(res.data);
      } catch (err) {
        setError("Failed to load sale details.");
      } finally {
        setLoading(false);
      }
    };
    fetchSale();
  }, [saleId]);

  const handleDownload = async () => {
    try {
      const res = await api.get(`/bill/${saleId}/pdf`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `bill_${saleId}.pdf`;
      link.click();
    } catch (err) {
      alert("Failed to download bill.");
    }
  };

  if (loading) return <p>Loading sale details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!sale) return <p>No sale found.</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Pharmacy Invoice</h2>

      <div style={styles.details}>
        <p><strong>Sale ID:</strong> {sale.id}</p>
        <p><strong>Patient Name:</strong> {sale.patientName}</p>
        <p><strong>Pharmacist ID:</strong> {sale.pharmacistId}</p>
        <p><strong>Total Amount:</strong> ₹{sale.totalAmount}</p>
      </div>

      <h3 style={styles.subHeading}>Medicines</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Medicine ID</th>
            <th>Quantity</th>
            <th>Price (₹)</th>
          </tr>
        </thead>
        <tbody>
          {sale.items?.map((item, index) => (
            <tr key={index}>
              <td>{item.medicineId}</td>
              <td>{item.quantitySold}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button style={styles.button} onClick={handleDownload}>
        📄 Download Bill PDF
      </button>
    </div>
  );
}

const styles = {
  container: {
    width: "70%",
    margin: "40px auto",
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#2b7a78",
    fontSize: "24px",
    marginBottom: "20px",
  },
  details: {
    background: "#f9f9f9",
    padding: "10px 15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  subHeading: {
    color: "#3a3a3a",
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  button: {
    display: "block",
    margin: "20px auto 0",
    backgroundColor: "#2b7a78",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
  th: {
    backgroundColor: "#def2f1",
  },
};
