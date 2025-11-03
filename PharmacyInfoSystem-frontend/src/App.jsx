import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import PharmacistAddMedicineForm from "./pages/PharmacistAddMedicineForm";
import PharmacistMedicinesList from "./pages/PharmacistMedicinesList";
import PharmacistProfile from "./pages/PharmacistProfile";
import SupplierProfile from "./pages/SupplierProfile";
import PharmacistSellMedicine from "./pages/PharmacistSellMedicine";
import PharmacistSalesList from "./pages/PharmacistSalesList";
import SupplierMedicineOrders from "./pages/SupplierMedicineOrders";
import SupplierMedineDeliveried from "./pages/SupplierMedineDeliveried";
import AdminPharmacists from "./pages/AdminPharmacist";
import AdminSuppliers from "./pages/AdminSuppliers";
import AdminMedicines from "./pages/AdminMedicines";
import AdminOrders from "./pages/AdminOrders";
import AdminSales from "./pages/AdminSales";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/pharmacist/dashboard" element={<PharmacistDashboard />} />
        <Route path="/supplier/dashboard" element={<SupplierDashboard />} />

        <Route path="/pharmacist/profile" element={<PharmacistProfile />} />
        <Route path="/supplier/profile" element={<SupplierProfile />} />

        <Route path="/add-medicine" element={<PharmacistAddMedicineForm />} />
        <Route path="/medicine-list" element={<PharmacistMedicinesList />} />
        <Route path="/medicine-sell" element={<PharmacistSellMedicine />} />

        <Route path="/medicine-saleslist" element={<PharmacistSalesList />} />

        <Route
          path="/supplier/pharmacist/orders"
          element={<SupplierMedicineOrders />}
        />
        <Route
          path="/supplier/pharmacist/delivered"
          element={<SupplierMedineDeliveried />}
        />

        <Route path="/admin/pharmacists" element={<AdminPharmacists />} />
        <Route path="/admin/suppliers" element={<AdminSuppliers />} />
        <Route path="/admin/medicines" element={<AdminMedicines />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/sales" element={<AdminSales />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
