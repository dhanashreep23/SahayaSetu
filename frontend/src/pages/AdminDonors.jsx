import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { adminService } from "../services/adminService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function AdminDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllDonors();
      setDonors(data);
    } catch (err) {
      setError("Failed to fetch donors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-light min-vh-100">
        <div className="container-fluid py-4">
          <h2 className="mb-4 text-dark fw-bold">
            <i className="bi bi-people-fill me-2 text-success"></i>
            All Donors
          </h2>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 text-success">
                  <i className="bi bi-people-fill me-2"></i>
                  Registered Donors ({donors.length})
                </h5>
              </div>
              <div className="card-body p-0">
                {donors.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                    No donors found
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Full Name</th>
                          <th>Phone</th>
                          <th>City</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donors.map((donor) => (
                          <tr key={donor.donorId}>
                            <td className="fw-medium">{donor.donorId}</td>
                            <td>{donor.fullName}</td>
                            <td>{donor.phone}</td>
                            <td>{donor.city}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}