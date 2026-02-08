import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="bg-light min-vh-100">
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-12">
              <h2 className="mb-4 text-dark fw-bold">Admin Dashboard</h2>
              
              <div className="row g-4">
                {/* All Donors Card */}
                <div className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body text-center p-4">
                      <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                           style={{ width: "80px", height: "80px" }}>
                        <i className="bi bi-people-fill text-success fs-1"></i>
                      </div>
                      <h4 className="card-title text-success">All Donors</h4>
                      <p className="card-text text-muted">View and manage all registered donors</p>
                      <button 
                        className="btn btn-success"
                        onClick={() => navigate("/admin/donors")}
                      >
                        <i className="bi bi-eye me-2"></i>
                        View Donors
                      </button>
                    </div>
                  </div>
                </div>

                {/* All NGOs Card */}
                <div className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body text-center p-4">
                      <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                           style={{ width: "80px", height: "80px" }}>
                        <i className="bi bi-building text-primary fs-1"></i>
                      </div>
                      <h4 className="card-title text-primary">All NGOs</h4>
                      <p className="card-text text-muted">Approve, disable, and manage NGOs</p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => navigate("/admin/ngos")}
                      >
                        <i className="bi bi-gear me-2"></i>
                        Manage NGOs
                      </button>
                    </div>
                  </div>
                </div>

                {/* All Requests Card */}
                <div className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body text-center p-4">
                      <div className="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" 
                           style={{ width: "80px", height: "80px" }}>
                        <i className="bi bi-clipboard-data text-info fs-1"></i>
                      </div>
                      <h4 className="card-title text-info">All Requests</h4>
                      <p className="card-text text-muted">View all NGO requests (read-only)</p>
                      <button 
                        className="btn btn-info"
                        onClick={() => navigate("/admin/requests")}
                      >
                        <i className="bi bi-eye me-2"></i>
                        View Requests
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}