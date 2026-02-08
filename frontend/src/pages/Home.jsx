import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  BookOpen,
  HeartPulse,
  Wrench,
} from "lucide-react";

import heroImage from "../assets/Image1.png";

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* HERO SECTION */}
      <header
        className="vh-100 d-flex align-items-center text-white"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${heroImage}) center/cover no-repeat`
        }}
      >
        <div className="container-fluid px-5">
          <div className="row">
            <div className="col-lg-8">
              <span className="badge bg-success mb-3 px-3 py-2 text-uppercase">
                Registered NGO | 80G Certified
              </span>

              <h1 className="display-3 fw-bold mb-4">
                Building Bridges of Hope,<br />
                <span className="text-warning">One Life at a Time</span>
              </h1>

              <p className="lead mb-5 opacity-90">
                Sahyasetu is a non-profit organization dedicated to empowering underserved
                communities through sustainable education, healthcare, and livelihood initiatives.
              </p>

              {!isAuthenticated && (
                <div className="d-flex gap-3">
                  <Link to="/register" className="btn btn-success btn-lg px-4 fw-bold">
                    Join Our Mission
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* WHY WE EXIST */}
      <section className="py-5 bg-light">
        <div className="container py-5 text-center">
          <h2 className="fw-bold mb-2">Why We Exist</h2>
          <div className="bg-success mx-auto mb-5" style={{ width: 60, height: 4 }}></div>

          <div className="row g-4">
            <FeatureCard
              icon={<BookOpen size={48} />}
              title="Knowledge for All"
              text="Providing quality education and resources to children in remote rural areas."
            />
            <FeatureCard
              icon={<HeartPulse size={48} />}
              title="Wellness First"
              text="Ensuring healthcare access and medical camps for marginalized communities."
            />
            <FeatureCard
              icon={<Wrench size={48} />}
              title="Skill Building"
              text="Empowering adults with vocational training for sustainable financial independence."
            />
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="py-5 bg-success text-white">
        <div className="container text-center">
          <div className="row g-4">
            <StatBox number="5000+" label="Lives Impacted" />
            <StatBox number="15+" label="Active Projects" />
            <StatBox number="200+" label="Dedicated Volunteers" />
            <StatBox number="50+" label="Villages Reached" />
          </div>
        </div>
      </section>
    </div>
  );
}

/* HELPER COMPONENTS */

function FeatureCard({ icon, title, text }) {
  return (
    <div className="col-sm-10 col-md-6 col-lg-4">
      <div className="card h-100 border-0 shadow-sm p-4 text-center feature-card">
        <div className="text-success mb-3">{icon}</div>
        <h5 className="fw-bold mb-3">{title}</h5>
        <p className="text-muted small mb-0">{text}</p>
      </div>
    </div>
  );
}

function StatBox({ number, label }) {
  return (
    <div className="col-md-3">
      <h2 className="display-6 fw-bold mb-0">{number}</h2>
      <p className="text-uppercase small mb-0 opacity-75">{label}</p>
    </div>
  );
}

export default Home;
