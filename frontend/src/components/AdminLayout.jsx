import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div className="bg-white border-end" style={{ width: "250px", position: "fixed", top: "0", bottom: "0", overflowY: "auto" }}>
        <div className="p-3 border-bottom">
          <h6 className="text-muted mb-0">
            <i className="bi bi-shield-check me-2 text-success"></i>
            Admin Panel
          </h6>
        </div>
        
        <nav className="nav flex-column p-3">
          <button
            className={`nav-link btn text-start border-0 mb-2 ${isActive('/admin-dashboard') ? 'bg-success text-white' : 'text-dark'}`}
            onClick={() => navigate("/admin-dashboard")}
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </button>
          
          <button
            className={`nav-link btn text-start border-0 mb-2 ${isActive('/admin/donors') ? 'bg-success text-white' : 'text-dark'}`}
            onClick={() => navigate("/admin/donors")}
          >
            <i className="bi bi-people me-2"></i>
            All Donors
          </button>
          
          <button
            className={`nav-link btn text-start border-0 mb-2 ${isActive('/admin/ngos') ? 'bg-success text-white' : 'text-dark'}`}
            onClick={() => navigate("/admin/ngos")}
          >
            <i className="bi bi-building me-2"></i>
            All NGOs
          </button>
          
          <button
            className={`nav-link btn text-start border-0 mb-2 ${isActive('/admin/requests') ? 'bg-success text-white' : 'text-dark'}`}
            onClick={() => navigate("/admin/requests")}
          >
            <i className="bi bi-clipboard-data me-2"></i>
            All Requests
          </button>
        </nav>

        <div className="mt-auto p-3 border-top">
          <button className="btn btn-outline-danger btn-sm w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: "250px", width: "calc(100% - 250px)" }}>
        {children}
      </div>
    </div>
  );
}