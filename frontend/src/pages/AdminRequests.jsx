import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { adminService } from "../services/adminService";
import { useAuth } from "../contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllRequests();
      setRequests(data);
    } catch (err) {
      setError("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN': return <span className="badge bg-success">Open</span>;
      case 'CLOSED': return <span className="badge bg-secondary">Closed</span>;
      case 'FULFILLED': return <span className="badge bg-primary">Fulfilled</span>;
      default: return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getRequestTypeInfo = (type) => {
    switch (type) {
      case 'RESOURCE':
        return { icon: <i className="bi bi-box text-warning"></i>, label: 'Resource' };
      case 'VOLUNTEER':
        return { icon: <i className="bi bi-people text-primary"></i>, label: 'Volunteer' };
      case 'FUNDRAISER':
        return { icon: <i className="bi bi-cash-coin text-success"></i>, label: 'Fundraiser' };
      default:
        return { icon: <i className="bi bi-question-circle text-muted"></i>, label: type };
    }
  };

  return (
    <AdminLayout>
      <div className="bg-light min-vh-100">
        <div className="container-fluid py-4">
          <h2 className="mb-4 text-dark fw-bold">
            <i className="bi bi-clipboard-data me-2 text-success"></i>
            All Requests
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
                  <i className="bi bi-clipboard-data me-2"></i>
                  All Requests ({requests.length})
                  <small className="text-muted ms-2">(Read-only view)</small>
                </h5>
              </div>
              <div className="card-body p-0">
                {requests.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                    No requests found
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Type</th>
                          <th>Title</th>
                          <th>NGO</th>
                          <th>Status</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((request) => {
                          const typeInfo = getRequestTypeInfo(request.requestType);
                          return (
                            <tr key={request.requestId}>
                              <td>
                                <div className="d-flex align-items-center">
                                  {typeInfo.icon}
                                  <span className="ms-2">{typeInfo.label}</span>
                                </div>
                              </td>
                              <td className="fw-medium">{request.title}</td>
                              <td>{request.ngo?.name || 'N/A'}</td>
                              <td>{getStatusBadge(request.status)}</td>
                              <td>
                                {request.requestType === 'RESOURCE' && (
                                  <small className="text-muted d-block">
                                    {request.resourceType}<br />
                                    Req: {request.quantityRequired} | Rec: {request.quantityReceived || 0}
                                  </small>
                                )}
                                {request.requestType === 'VOLUNTEER' && (
                                  <small className="text-muted">
                                    {request.description?.substring(0, 30)}...
                                  </small>
                                )}
                                {request.requestType === 'FUNDRAISER' && (
                                  <small className="text-muted">
                                    Target: ₹{request.targetAmount}<br />
                                    Collected: ₹{request.collectedAmount || 0}
                                  </small>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {!isAdmin && (
                <div className="card-footer bg-light text-center">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Admin view only - No actions available
                  </small>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}