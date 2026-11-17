import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

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

function JobDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);

  const token = localStorage.getItem("token");
  const payload = token ? decodeJwt(token) : null;
  const candidateEmail = payload?.sub || "";
  const candidateName = payload?.name || candidateEmail?.split("@")[0] || "Candidate";

  if (!job) {
    return (
      <div className="page">
        <div className="container">
          <div className="card">
            <h2 className="auth-title">Job not found</h2>
            <p className="footer-note">No job data was passed to this page.</p>
            <button className="btn btn-primary" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleApply = async () => {
    setMessage("");
    setApplying(true);

    try {
      await axios.post("http://localhost:8080/applications", {
        jobId: job.id,
        candidateName,
        candidateEmail,
        branch: job.branch || "",
        location: job.location || "",
      });

      setMessage("Applied successfully.");
    } catch {
      setMessage("Failed to apply for this job.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <div className="kicker">Job Details</div>
          <h2 className="auth-title">{job.title}</h2>
          <p className="auth-subtitle">{job.company}</p>

          <div className="list">
            <div className="item">
              <p><b>Branch:</b> {job.branch}</p>
              <p><b>Location:</b> {job.location}</p>
              <p><b>Mode:</b> {job.mode}</p>
              <p><b>Experience:</b> {job.experienceLevel}</p>
              <p><b>Salary:</b> {job.salaryMin} - {job.salaryMax} LPA</p>
              <p><b>Posted By:</b> {job.postedBy || "Recruiter"}</p>
              <p><b>Description:</b> {job.description || "No description provided."}</p>
              {job.skills && <p><b>Skills:</b> {job.skills}</p>}
            </div>
          </div>

          {message && <p className="message success">{message}</p>}

          <div style={{ display: "flex", gap: "12px", marginTop: "18px", flexWrap: "wrap" }}>
            <button className="btn btn-success" onClick={handleApply} disabled={applying}>
              {applying ? "Applying..." : "Apply Now"}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;