import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { adminService } from "../services/adminService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function AdminNGOs() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllNGOs();
      setNgos(data);
    } catch (err) {
      setError("Failed to fetch NGOs");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (ngoId) => {
    try {
      setActionLoading(prev => ({ ...prev, [ngoId]: 'approving' }));
      await adminService.approveNGO(ngoId);
      await fetchNGOs();
    } catch (err) {
      setError("Failed to approve NGO");
    } finally {
      setActionLoading(prev => ({ ...prev, [ngoId]: null }));
    }
  };

  const handleDisapprove = async (ngoId) => {
    try {
      setActionLoading(prev => ({ ...prev, [ngoId]: 'disapproving' }));
      await adminService.disapproveNGO(ngoId);
      await fetchNGOs();
    } catch (err) {
      setError("Failed to disapprove NGO");
    } finally {
      setActionLoading(prev => ({ ...prev, [ngoId]: null }));
    }
  };

  const handleDisable = async (ngoId) => {
    try {
      setActionLoading(prev => ({ ...prev, [ngoId]: 'disabling' }));
      await adminService.disableNGO(ngoId);
      await fetchNGOs();
    } catch (err) {
      setError("Failed to disable NGO");
    } finally {
      setActionLoading(prev => ({ ...prev, [ngoId]: null }));
    }
  };

  const handleEnable = async (ngoId) => {
    try {
      setActionLoading(prev => ({ ...prev, [ngoId]: 'enabling' }));
      await adminService.enableNGO(ngoId);
      await fetchNGOs();
    } catch (err) {
      setError("Failed to enable NGO");
    } finally {
      setActionLoading(prev => ({ ...prev, [ngoId]: null }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <span className="badge bg-warning">Pending</span>;
      case "APPROVED":
        return <span className="badge bg-success">Approved</span>;
      case "REJECTED":
        return <span className="badge bg-danger">Rejected</span>;
      case "DISABLED":
        return <span className="badge bg-secondary">Disabled</span>;
      default:
        return <span className="badge bg-light text-dark">Unknown</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="bg-light min-vh-100">
        <div className="container-fluid py-4">
          <h2 className="mb-4 text-dark fw-bold">
            <i className="bi bi-building me-2 text-success"></i>
            All NGOs
          </h2>

          {error && (
            <div className="alert alert-danger alert-dismissible">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
              ></button>
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
                  <i className="bi bi-building me-2"></i>
                  Registered NGOs ({ngos.length})
                </h5>
              </div>
              <div className="card-body p-0">
                {ngos.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                    No NGOs found
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Darpan ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>City</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ngos.map((ngo) => (
                          <tr key={ngo.ngoId}>
                            <td className="fw-medium">{ngo.ngoId}</td>
                            <td className="text-muted">{ngo.darpanId}</td>
                            <td>{ngo.name}</td>
                            <td>{ngo.email}</td>
                            <td>{ngo.city}</td>
                            <td>{getStatusBadge(ngo.status)}</td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                {ngo.status === "PENDING" && (
                                  <>
                                    <button
                                      className="btn btn-success"
                                      onClick={() => handleApprove(ngo.ngoId)}
                                      disabled={actionLoading[ngo.ngoId]}
                                    >
                                      {actionLoading[ngo.ngoId] === 'approving' ? (
                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                      ) : (
                                        <i className="bi bi-check-circle me-1"></i>
                                      )}
                                      Approve
                                    </button>
                                    <button
                                      className="btn btn-danger"
                                      onClick={() => handleDisapprove(ngo.ngoId)}
                                      disabled={actionLoading[ngo.ngoId]}
                                    >
                                      {actionLoading[ngo.ngoId] === 'disapproving' ? (
                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                      ) : (
                                        <i className="bi bi-x-circle me-1"></i>
                                      )}
                                      Disapprove
                                    </button>
                                  </>
                                )}
                                {ngo.status === "APPROVED" && (
                                  <button
                                    className="btn btn-warning"
                                    onClick={() => handleDisable(ngo.ngoId)}
                                    disabled={actionLoading[ngo.ngoId]}
                                  >
                                    {actionLoading[ngo.ngoId] === 'disabling' ? (
                                      <span className="spinner-border spinner-border-sm me-1"></span>
                                    ) : (
                                      <i className="bi bi-x-circle me-1"></i>
                                    )}
                                    Disable
                                  </button>
                                )}
                                {ngo.status === "DISABLED" && (
                                  <button
                                    className="btn btn-success"
                                    onClick={() => handleEnable(ngo.ngoId)}
                                    disabled={actionLoading[ngo.ngoId]}
                                  >
                                    {actionLoading[ngo.ngoId] === 'enabling' ? (
                                      <span className="spinner-border spinner-border-sm me-1"></span>
                                    ) : (
                                      <i className="bi bi-check-circle me-1"></i>
                                    )}
                                    Enable
                                  </button>
                                )}
                              </div>
                            </td>
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
    </AdminLayout >
  );
}