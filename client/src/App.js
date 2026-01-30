// FIYAZ AHMED
import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Homepage from "./screens/Homepage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cartscreen from "./screens/Cartscreen";
import Registerscreen from "./screens/Registerscreen";
import Loginscreen from "./screens/Loginscreen";
import OrderScreen from "./screens/OrderScreen.js";
import Success from "./components/Success";
import Cancel from "./components/Cancel";
import FindUs from "./screens/FindUs";
import RegisterSuccess from "./screens/RegisterSuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./screens/AdminDashboard";
import AdminLogin from "./screens/AdminLogin";
import AdminOrders from "./screens/AdminOrders";
import AdminStats from "./screens/AdminStats";

function App() {
  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <BrowserRouter>
        <Navbar />
        <main style={{ flex: "1 0 auto" }}>
          <Routes>
            {/* 🏠 Public Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/cart" element={<Cartscreen />} />
            <Route path="/register" element={<Registerscreen />} />
            <Route path="/login" element={<Loginscreen />} />
            <Route path="/orders" element={<OrderScreen />} />
            <Route path="/order/:orderId" element={<OrderScreen />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/find-us" element={<FindUs />} />
            <Route path="/register-success" element={<RegisterSuccess />} />

            {/* 🔒 Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* 🛡️ Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/stats"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminStats />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

