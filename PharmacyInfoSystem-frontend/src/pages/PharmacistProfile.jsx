import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function PharmacistProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    qualification: "",
  });
  const [message, setMessage] = useState("");
  const [isEditable, setIsEditable] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, []);

  // Fetch pharmacist profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/pharmacist/by-user/${user.userId}`);
        setForm(res.data);
        setIsEditable(false);
      } catch (error) {
        console.log("No existing profile, you can create one");
      }
    };
    fetchProfile();
  }, [user.userId]);

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/pharmacist/update/${user.userId}`, form);
      setMessage("Profile updated successfully!");
      setIsEditable(false);
    } catch (error) {
      console.error(error);
      setMessage("Error updating profile.");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>Pharmacist Profile</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!isEditable}
            required
          />

          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={!isEditable}
            required
          />

          <label>Contact</label>
          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            disabled={!isEditable}
            required
          />

          <label>Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            disabled={!isEditable}
            required
          />

          <label>Qualification</label>
          <input
            name="qualification"
            value={form.qualification}
            disabled={!isEditable}
            onChange={handleChange}
            required
          />
          {isEditable ? (
            <>
              <button type="submit" className="btn-save">
                Save Profile
              </button>
            </>
          ) : (
            <Link to="/pharmacist/dashboard" className="btn-link">
              Back
            </Link>
          )}
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
