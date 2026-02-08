import React from "react";
import { Link } from "react-router-dom";
import { HeartHandshake, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, isDonor, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold text-success d-flex align-items-center" to="/">
          <HeartHandshake className="me-2" /> SAHAYASETU
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item px-2">
              <Link className="nav-link fw-semibold" to="/">Home</Link>
            </li>


            {/* Show Donor Dashboard only for authenticated donors */}
            {isAuthenticated && isDonor && (
              <>
                <li className="nav-item px-2">
                  <Link className="nav-link fw-semibold" to="/donor-dashboard">Donor Dashboard</Link>
                </li>
                <li className="nav-item px-2">
                  <Link className="nav-link fw-semibold" to="/track-contributions">Track Contributions</Link>
                </li>
              </>
            )}

            {/* Show NGO Dashboard only for authenticated NGOs */}
            {isAuthenticated && !isDonor && (
              <>
                <li className="nav-item px-2">
                  <Link className="nav-link fw-semibold" to="/ngo-dashboard">NGO Dashboard</Link>
                </li>
                <li className="nav-item px-2">
                  <Link className="nav-link fw-semibold" to="/track-requests">Track Requests</Link>
                </li>
              </>
            )}

            <li className="nav-item px-2">
              <Link className="nav-link fw-semibold" to="/about">About Us</Link>
            </li>

            <li className="nav-item px-2">
              <Link className="nav-link fw-semibold" to="/contact">Contact Us</Link>
            </li>

            {/* Authentication Section */}
            {!isAuthenticated ? (
              <>
                <li className="nav-item px-2 d-flex align-items-center">
                  <LogIn size={18} className="me-1 text-success" />
                  <Link className="nav-link fw-semibold" to="/login">Login</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-warning fw-bold px-4 rounded-pill" to="/register">
                    Join Our Mission
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item px-2 d-flex align-items-center">
                  <User size={18} className="me-1 text-success" />
                  <span className="nav-link fw-semibold text-success">{user?.name}</span>
                </li>
                <li className="nav-item px-2">
                  <button
                    className="btn btn-outline-danger fw-semibold px-3 d-flex align-items-center"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="me-1" />
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
