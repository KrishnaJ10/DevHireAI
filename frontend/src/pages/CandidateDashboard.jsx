import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";


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

const DEMO_JOBS = [
  {
    id: 1,
    title: "Junior AIML Engineer",
    company: "KPMG",
    branch: "AIML",
    location: "Bangalore",
    mode: "Hybrid",
    experienceLevel: "Fresher",
    salaryMin: "4",
    salaryMax: "8",
  },
  {
    id: 2,
    title: "Software Developer",
    company: "TCS",
    branch: "IT",
    location: "Mumbai",
    mode: "Onsite",
    experienceLevel: "Fresher",
    salaryMin: "3.5",
    salaryMax: "7",
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "Accenture",
    branch: "AIDS",
    location: "Pune",
    mode: "Hybrid",
    experienceLevel: "Intern",
    salaryMin: "4",
    salaryMax: "6.5",
  },
  {
    id: 4,
    title: "Embedded Systems Engineer",
    company: "Infosys",
    branch: "EXTC",
    location: "Hyderabad",
    mode: "Onsite",
    experienceLevel: "Fresher",
    salaryMin: "4",
    salaryMax: "7",
  },
  {
    id: 5,
    title: "Civil Site Engineer",
    company: "L&T",
    branch: "CIVIL",
    location: "Mumbai",
    mode: "Onsite",
    experienceLevel: "Fresher",
    salaryMin: "3.5",
    salaryMax: "6",
  },
  {
    id: 6,
    title: "Electrical Design Engineer",
    company: "Siemens",
    branch: "ELECTRICAL",
    location: "Chennai",
    mode: "Hybrid",
    experienceLevel: "Experienced",
    salaryMin: "5",
    salaryMax: "9",
  },
];

function CandidateDashboard() {
  const [branch, setBranch] = useState("");
  const [location, setLocation] = useState("");
  const [resumeScore, setResumeScore] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [careerData, setCareerData] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState("");
  const [careerMessage, setCareerMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [careerLoading, setCareerLoading] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [applyMessage, setApplyMessage] = useState("");
  const [randomJobs, setRandomJobs] = useState([]);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const payload = token ? decodeJwt(token) : null;
  const candidateEmail = payload?.sub || "";
  const candidateName = dashboardData?.name || candidateEmail?.split("@")[0] || "Candidate";

  useEffect(() => {
    if (!token) navigate("/login");
  }, [navigate, token]);

  const goToJobDetails = (job) => {
  navigate("/job-details", { state: { job } });
};

  const fetchDashboard = async () => {
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:8080/candidate/dashboard?branch=${encodeURIComponent(branch)}&location=${encodeURIComponent(location)}&resumeScore=${resumeScore === "" ? 0 : Number(resumeScore)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboardData(response.data);
    } catch {
      setMessage("Failed to load candidate dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const handleResumeAnalysis = async () => {
    setCareerMessage("");
    setCareerData(null);
    setApplyMessage("");

    if (!branch) {
      setCareerMessage("Please select your branch first.");
      return;
    }

    if (!location) {
      setCareerMessage("Please enter your location first.");
      return;
    }

    if (!resumeFile) {
      setCareerMessage("Please choose a PDF resume first.");
      return;
    }

    setCareerLoading(true);

    const formData = new FormData();
    formData.append("branch", branch);
    formData.append("location", location);
    formData.append("file", resumeFile);

    try {
      const response = await axios.post(
        "http://localhost:8080/career/recommend",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCareerData(response.data);

      if (response.data?.resumeScore !== undefined) {
        setResumeScore(response.data.resumeScore);
      }

      const shuffled = [...DEMO_JOBS].sort(() => Math.random() - 0.5);
      setRandomJobs(shuffled.slice(0, 3));
    } catch {
      setCareerMessage("Failed to analyze resume.");
    } finally {
      setCareerLoading(false);
    }
  };

  const handleApply = async (job) => {
    setApplyMessage("");
    setApplyingJobId(job.id);

    try {
      await axios.post("http://localhost:8080/applications", {
        jobId: job.id,
        candidateName: candidateName,
        candidateEmail: candidateEmail,
        branch: branch,
        location: location,
      });

      setApplyMessage(`Applied for ${job.title} successfully.`);
      fetchDashboard();
    } catch {
      setApplyMessage(`Failed to apply for ${job.title}.`);
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
              <div className="kicker">Candidate Workspace</div>
              <h2 className="auth-title" style={{ marginBottom: 0 }}>
                Candidate Dashboard
              </h2>
              <p className="auth-subtitle" style={{ marginTop: 8, marginBottom: 0 }}>
                Upload your resume, get career insights, and discover matching jobs.
              </p>
            </div>
            <button
              className="btn btn-danger"
              onClick={handleLogout}
              disabled={loading || careerLoading || applyingJobId !== null}
            >
              Logout
            </button>
          </div>

          <div className="split section">
            <div>
              <div className="glass-card">
                <h3 className="section-title">Dashboard Inputs</h3>
                <div className="form-grid">
                  <div className="field">
                    <label className="label">Branch</label>
                    <select
                      className="select"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      disabled={loading || careerLoading || applyingJobId !== null}
                    >
                      <option value="">Select Branch</option>
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
                    <label className="label">Location</label>
                    <input
                      className="input"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter location"
                      disabled={loading || careerLoading || applyingJobId !== null}
                    />
                  </div>

                  <div className="field">
                    <label className="label">Resume Score</label>
                    <input
                      className="input"
                      type="number"
                      value={resumeScore}
                      onChange={(e) => setResumeScore(e.target.value)}
                      placeholder="Will update after analysis"
                      disabled={loading || careerLoading || applyingJobId !== null}
                    />
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={fetchDashboard}
                    disabled={loading || careerLoading || applyingJobId !== null}
                  >
                    {loading ? "Loading..." : "Load Dashboard"}
                  </button>
                </div>

                {loading && <Loader text="Loading dashboard..." />}

                {message && <p className="message">{message}</p>}

                {dashboardData && !loading && (
                  <div className="section">
                    <div className="stats-grid">
                      <div className="stat">
                        <span className="footer-note">Name</span>
                        <div className="value" style={{ fontSize: 18 }}>
                          {dashboardData.name}
                        </div>
                      </div>
                      <div className="stat">
                        <span className="footer-note">Applications</span>
                        <div className="value">{dashboardData.totalApplications}</div>
                      </div>
                      <div className="stat">
                        <span className="footer-note">Shortlisted</span>
                        <div className="value">{dashboardData.shortlistedApplications}</div>
                      </div>
                      <div className="stat">
                        <span className="footer-note">Rejected</span>
                        <div className="value">{dashboardData.rejectedApplications}</div>
                      </div>
                      <div className="stat">
                        <span className="footer-note">Pending</span>
                        <div className="value">{dashboardData.pendingApplications}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="glass-card">
                <h3 className="section-title">Resume Upload & Career Match</h3>

                <div className="form-grid">
                  <div className="field">
                    <label className="label">Resume PDF</label>
                    <input
                      className="input"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      disabled={loading || careerLoading || applyingJobId !== null}
                    />
                  </div>

                  <button
                    className="btn btn-success"
                    onClick={handleResumeAnalysis}
                    disabled={loading || careerLoading || applyingJobId !== null}
                  >
                    {careerLoading ? "Analyzing..." : "Upload Resume & Analyze"}
                  </button>
                </div>

                {careerLoading && <Loader text="Analyzing resume..." />}

                {careerMessage && <p className="message">{careerMessage}</p>}
                {applyMessage && <p className="message success">{applyMessage}</p>}

                {careerData && !careerLoading && (
                  <div className="section">
                    <div className="badges" style={{ marginBottom: 12 }}>
                      <span className="badge">Branch: {careerData.branch}</span>
                      <span className="badge">Score: {careerData.resumeScore}</span>
                    </div>

                    <div className="card" style={{ padding: 18, marginBottom: 14 }}>
                      <h4 className="section-title" style={{ marginTop: 0 }}>
                        Matched Skills
                      </h4>
                      <p className="footer-note">
                        {careerData.matchedSkills?.join(", ") || "None"}
                      </p>

                      <h4 className="section-title">Missing Skills</h4>
                      <p className="footer-note">
                        {careerData.missingSkills?.join(", ") || "None"}
                      </p>

                      <h4 className="section-title">Suggestions</h4>
                      <ul>
                        {careerData.suggestions?.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <h4 className="section-title">Recommended Jobs</h4>
                    <div className="list">
                      {careerData.recommendedJobs?.length ? (
                        careerData.recommendedJobs.map((item) => (
                          <div key={item.job.id} className="item">
                            <strong>{item.job.title}</strong>
                            <p>{item.job.company}</p>
                            <p>Score: {item.score}</p>
                            <p>
                              {item.job.branch} | {item.job.location}
                            </p>
                            <p className="footer-note">
                              Reasons: {item.reasons?.join(", ")}
                            </p>

                            <button
  className="btn btn-success"
  style={{ marginTop: 10 }}
  onClick={() => goToJobDetails(item.job)}
>
  Apply
</button>
                          </div>
                        ))
                      ) : (
                        <p className="footer-note">No recommended jobs found.</p>
                      )}
                    </div>

                    <h4 className="section-title" style={{ marginTop: "24px" }}>
                      Random Jobs
                    </h4>

                    <div className="list">
                      {randomJobs.length ? (
                        randomJobs.map((job) => (
                          <div key={job.id} className="item">
                            <strong>{job.title}</strong>
                            <p>{job.company}</p>
                            <p>
                              {job.branch} | {job.location} | {job.mode}
                            </p>
                            <p>
                              {job.experienceLevel} | Salary: {job.salaryMin} - {job.salaryMax} LPA
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="footer-note">No random jobs loaded yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateDashboard;