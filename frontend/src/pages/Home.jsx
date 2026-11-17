import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page home-page">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="container">
        <section className="hero">
          <div className="hero-panel hero-left">
            <div className="kicker">AI Career Intelligence for Engineering Students</div>

            <h1 className="hero-title">
              <span>DevHire AI</span>
            </h1>

            <p className="hero-text">
              DevHire AI is an intelligent career platform designed for engineering students and recruiters. It allows candidates to upload their resume, analyze branch-specific skills, identify missing areas, and receive job recommendations based on their profile, branch, and location. Recruiters can post real job openings, review applications, and manage candidates through a simple dashboard. The platform combines resume intelligence, job matching, and recruiter management in one place to make the hiring process smarter and more efficient.
            </p>

            <div className="actions">
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
            </div>

            <div className="hero-metrics">
              <div className="metric-card">
                <div className="metric-value">PDF</div>
                <div className="metric-label">Resume upload</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">AI</div>
                <div className="metric-label">Branch scoring</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">Jobs</div>
                <div className="metric-label">Smart matching</div>
              </div>
            </div>
          </div>

          <div className="hero-panel hero-right">
            <div className="glass-card">
              <div className="section-title">What it does</div>
              <div className="feature-stack">
                <div className="feature-card">
                  <h4>Resume Intelligence</h4>
                  <p>Extracts text from your PDF, checks skills, and gives a resume score.</p>
                </div>
                <div className="feature-card">
                  <h4>Job Matching</h4>
                  <p>Recommends jobs by branch, location, and profile strength.</p>
                </div>
                <div className="feature-card">
                  <h4>Recruiter Portal</h4>
                  <p>Recruiters post jobs, review applications, and shortlist candidates.</p>
                </div>
              </div>
            </div>

            <div className="preview-card">
              <div className="preview-top">
                <span className="pulse-dot" />
                Live preview
              </div>
              <div className="preview-row">
                <span>Resume Score</span>
                <strong>82 / 100</strong>
              </div>
              <div className="preview-row">
                <span>Matched Skills</span>
                <strong>Python, SQL, ML</strong>
              </div>
              <div className="preview-row">
                <span>Recommended</span>
                <strong>AIML • Bangalore</strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;