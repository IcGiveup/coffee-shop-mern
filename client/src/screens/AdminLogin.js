// FIYAZ AHMED
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/login", { email, password });

      if (data && data.isAdmin) {
        localStorage.setItem("currentUser", JSON.stringify(data));
        navigate("/admin/dashboard");
      } else {
        setError("Access denied: Not an admin account.");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="container text-center my-5">
      <h2>Admin Login</h2>
      <form
        onSubmit={handleSubmit}
        className="d-flex flex-column align-items-center mt-4"
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-success w-100">
          Login
        </button>
        {error && <p className="text-danger mt-3">{error}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;
