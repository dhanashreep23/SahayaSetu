import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

// Helper function to get donor ID from logged in user
const getDonorId = () => {
  const user = localStorage.getItem('sahayasetu_user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.donorId ?? userData.userId ?? userData.id ?? null;
    } catch (e) {
      return null;
    }
  }
  return null;
};

const TrackContributions = () => {
  const { user } = useAuth();
  const [contributions, setContributions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    try {
      setLoading(true);
      setError("");
      
      const donorId = getDonorId();
      
      if (!donorId) {
        setError("Please log in to view contributions");
        return;
      }
      
      console.log('Fetching contributions for donor ID:', donorId);
      const response = await api.get(`/donor/contributions?donorId=${donorId}`);
      setContributions(response.data);
    } catch (err) {
      console.error('Error fetching contributions:', err);
      setError(err.response?.data || "Failed to fetch contributions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center" style={{ paddingTop: "100px" }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light" style={{ paddingTop: "100px" }}>
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-success text-white rounded p-4">
              <h1 className="mb-2">Track Contributions</h1>
              <p className="mb-0">View all your donations, resource contributions, and volunteer applications.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {contributions && (
          <>
            {/* Monetary Donations */}
            <div className="row mb-5">
              <div className="col-12">
                <h3 className="text-success mb-3">
                  <i className="bi bi-cash-coin me-2"></i>
                  Monetary Donations ({contributions.donations?.length || 0})
                </h3>
                {contributions.donations?.length === 0 ? (
                  <div className="card">
                    <div className="card-body text-center py-5">
                      <p className="text-muted">No monetary donations yet</p>
                    </div>
                  </div>
                ) : (
                  <div className="card">
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Fundraiser</th>
                              <th>Amount</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contributions.donations?.map((donation, index) => (
                              <tr key={index}>
                                <td>{donation.fundraiserTitle}</td>
                                <td className="text-success fw-bold">₹{donation.amount}</td>
                                <td>{new Date(donation.donatedAt).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resource Contributions */}
            <div className="row mb-5">
              <div className="col-12">
                <h3 className="text-warning mb-3">
                  <i className="bi bi-box me-2"></i>
                  Resource Contributions ({contributions.resourceContributions?.length || 0})
                </h3>
                {contributions.resourceContributions?.length === 0 ? (
                  <div className="card">
                    <div className="card-body text-center py-5">
                      <p className="text-muted">No resource contributions yet</p>
                    </div>
                  </div>
                ) : (
                  <div className="card">
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Request</th>
                              <th>Resource Type</th>
                              <th>Quantity</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contributions.resourceContributions?.map((contribution, index) => (
                              <tr key={index}>
                                <td>{contribution.requestTitle}</td>
                                <td>{contribution.resourceType}</td>
                                <td className="text-warning fw-bold">{contribution.quantity}</td>
                                <td>{new Date(contribution.contributedAt).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Volunteer Applications */}
            <div className="row">
              <div className="col-12">
                <h3 className="text-primary mb-3">
                  <i className="bi bi-people me-2"></i>
                  Volunteer Applications ({contributions.volunteerApplications?.length || 0})
                </h3>
                {contributions.volunteerApplications?.length === 0 ? (
                  <div className="card">
                    <div className="card-body text-center py-5">
                      <p className="text-muted">No volunteer applications yet</p>
                    </div>
                  </div>
                ) : (
                  <div className="card">
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Request</th>
                              <th>Status</th>
                              <th>Applied Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contributions.volunteerApplications?.map((application, index) => (
                              <tr key={index}>
                                <td>{application.requestTitle}</td>
                                <td>
                                  <span className={`badge ${application.status === 'APPLIED' ? 'bg-info' : 'bg-success'}`}>
                                    {application.status}
                                  </span>
                                </td>
                                <td>{new Date(application.appliedAt).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrackContributions;