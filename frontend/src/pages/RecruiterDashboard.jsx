import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

function RecruiterDashboard() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [branch, setBranch] = useState("AIML");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("Hybrid");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const fetchDashboard = async () => {
    setMessage("");
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:8080/recruiter/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
    } catch {
      setMessage("Failed to load recruiter dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setMessage("");
    setPosting(true);

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:8080/jobs",
        {
          title,
          company,
          branch,
          skills,
          location,
          mode,
          experienceLevel,
          salaryMin,
          salaryMax,
          description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Job posted successfully.");
      setTitle("");
      setCompany("");
      setBranch("AIML");
      setSkills("");
      setLocation("");
      setMode("Hybrid");
      setExperienceLevel("Fresher");
      setSalaryMin("");
      setSalaryMax("");
      setDescription("");

      fetchDashboard();
    } catch {
      setMessage("Failed to post job.");
    } finally {
      setPosting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <div>
              <div className="kicker">Recruiter Workspace</div>
              <h2 className="auth-title" style={{ marginBottom: 0 }}>
                Recruiter Dashboard
              </h2>
              <p className="auth-subtitle" style={{ marginTop: 8, marginBottom: 0 }}>
                Post jobs, track applications, and manage hiring activity.
              </p>
            </div>
            <button className="btn btn-danger" onClick={handleLogout} disabled={loading || posting}>
              Logout
            </button>
          </div>

          {message && (
            <p className={`message ${message.includes("successfully") ? "success" : ""}`}>
              {message}
            </p>
          )}

          <div className="split section">
            <div>
              <div className="glass-card">
                <h3 className="section-title">Post New Job</h3>
                <form onSubmit={handlePostJob} className="form-grid two">
                  <div className="field">
                    <label className="label">Job Title</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Job Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={loading || posting}
                    />
                  </div>

                  <div className="field">
                    <label className="label">Company</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      disabled={loading || posting}
                    />
                  </div>

                  <div className="field">
                    <label className="label">Branch</label>
                    <select
                      className="select"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      disabled={loading || posting}
                    >
                      <option value="AIML">AIML</option>
                      <option value="AIDS">AIDS</option>
                      <option value="EXTC">EXTC</option>
                      <option value="IT">IT</option>
                      <option value="CSE">CSE</option>
                      <option value="AUTO">AUTO</option>
                      <option value="CIVIL">CIVIL</option>
                      <option value="ELECTRICAL">ELECTRICAL</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="label">Skills</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Comma separated"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      disabled={loading || posting}
                    />
                  </div>

                  <div className="field">
                    <label className="label">Location</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={loading || posting}
                    />
                  </div>

                  <div className="field">
                    <label className="label">Mode</label>
                    <select
                      className="select"
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      disabled={loading || posting}
                    >
                      <option value="Hybrid">Hybrid</option>
                      <option value="Remote">Remote</option>
                      <option value="Onsite">Onsite</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="label">Experience Level</label>
                    <select
                      className="select"
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      disabled={loading || posting}
                    >
                      <option value="Fresher">Fresher</option>
                      <option value="Intern">Intern</option>
                      <option value="Experienced">Experienced</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="label">Salary Min (LPA)</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Min"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      disabled={loading || posting}
                    />
                  </div>

                  <div className="field">
                    <label className="label">Salary Max (LPA)</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Max"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      disabled={loading || posting}
                    />
                  </div>

                  <div className="field" style={{ gridColumn: "1 / -1" }}>
                    <label className="label">Description</label>
                    <textarea
                      className="textarea"
                      placeholder="Job Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={loading || posting}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success"
                    style={{ gridColumn: "1 / -1" }}
                    disabled={loading || posting}
                  >
                    {posting ? "Posting..." : "Post Job"}
                  </button>
                </form>
              </div>
            </div>

            <div>
              {loading && <Loader text="Loading recruiter dashboard..." />}

              <div className="stats-grid">
                <div className="stat">
                  <span className="footer-note">Jobs</span>
                  <div className="value">{data?.totalJobs ?? 0}</div>
                </div>
                <div className="stat">
                  <span className="footer-note">Applications</span>
                  <div className="value">{data?.totalApplications ?? 0}</div>
                </div>
                <div className="stat">
                  <span className="footer-note">Shortlisted</span>
                  <div className="value">{data?.shortlistedApplications ?? 0}</div>
                </div>
                <div className="stat">
                  <span className="footer-note">Rejected</span>
                  <div className="value">{data?.rejectedApplications ?? 0}</div>
                </div>
                <div className="stat">
                  <span className="footer-note">Pending</span>
                  <div className="value">{data?.pendingApplications ?? 0}</div>
                </div>
              </div>

              <div className="section split">
                <div>
                  <h3 className="section-title">Recent Jobs</h3>
                  <div className="list">
                    {data?.recentJobs?.length ? (
                      data.recentJobs.map((job) => (
                        <div key={job.id} className="item">
                          <strong>{job.title}</strong>
                          <p>{job.company}</p>
                          <p>
                            {job.branch} | {job.location} | {job.mode}
                          </p>
                          <p>
                            {job.experienceLevel} | {job.salaryMin} - {job.salaryMax} LPA
                          </p>
                          <p className="footer-note">Posted By: {job.postedBy}</p>
                        </div>
                      ))
                    ) : (
                      <p className="footer-note">No recent jobs.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="section-title">Recent Applications</h3>
                  <div className="list">
                    {data?.recentApplications?.length ? (
                      data.recentApplications.map((app) => (
                        <div key={app.id} className="item">
                          <strong>{app.candidateName}</strong>
                          <p>{app.candidateEmail}</p>
                          <p>Job ID: {app.jobId}</p>
                          <p>
                            {app.branch} | {app.location}
                          </p>
                          <p>Status: {app.status}</p>
                        </div>
                      ))
                    ) : (
                      <p className="footer-note">No recent applications.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterDashboard;