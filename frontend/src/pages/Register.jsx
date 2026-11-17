import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/users", {
        fullName,
        email,
        password,
        role,
      });

      setMessage("Registration successful. Please login.");
      setTimeout(() => navigate("/login"), 1000);
    } catch {
      setMessage("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h2 className="auth-title">Register</h2>
        <p className="auth-subtitle">Create your candidate or recruiter account.</p>

        <form onSubmit={handleRegister} className="form-grid">
          <div className="field">
            <label className="label">Full Name</label>
            <input
              className="input"
              type="text"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="label">Role</label>
            <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">--SELECT--</option>
              <option value="USER">Candidate</option>
              <option value="RECRUITER">Recruiter</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {message && (
          <p className="message" style={{ color: message.includes("successful") ? "#73f0b0" : "#ff9aa9" }}>
            {message}
          </p>
        )}

        <p className="helper">
          Already have an account? <Link to="/login" style={{ color: "#9be7ff", fontWeight: 700 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;