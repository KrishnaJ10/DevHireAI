import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function decodeJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/users/login", {
        email,
        password,
      });

      const token = response.data;

      if (!token || token === "Invalid Email or Password") {
        setMessage("Invalid email or password");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);

      const payload = decodeJwt(token);
      const role = payload?.role?.toUpperCase();

      if (role === "RECRUITER") navigate("/recruiter-dashboard");
      else navigate("/candidate-dashboard");
    } catch {
      setMessage("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h2 className="auth-title">Login</h2>
        <p className="auth-subtitle">Access your candidate or recruiter dashboard.</p>

        <form onSubmit={handleLogin} className="form-grid">
          <div className="field">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="helper">
          Don’t have an account? <Link to="/register" style={{ color: "#9be7ff", fontWeight: 700 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;