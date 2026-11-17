import { Link, useNavigate, useLocation } from "react-router-dom";

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

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const payload = token ? decodeJwt(token) : null;
  const role = payload?.role?.toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const dashboardLink =
    role === "RECRUITER" ? "/recruiter-dashboard" : "/candidate-dashboard";

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        DevHire AI
      </Link>

      <div className="nav-links">
        <Link to="/" className="nav-link">
          Home
        </Link>

        {token ? (
          <>
            <Link to={dashboardLink} className="nav-link">
              Dashboard
            </Link>
            <button className="btn btn-light" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : location.pathname === "/" ? null : null}
      </div>
    </nav>
  );
}

export default Navbar;