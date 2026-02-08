import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { donorService } from "../services/donorService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function DonorDashboard() {
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();
  const [requests, setRequests] = useState({ resourceRequests: [], volunteerRequests: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donationModal, setDonationModal] = useState({ show: false, request: null });
  const [donationAmount, setDonationAmount] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors
      // Transform flat list into categorized requests
      const data = await donorService.getAvailableRequests();
      const fundraisers = await donorService.getActiveFundraisers();

      const resourceRequests = data.filter(req => req.requestType === 'RESOURCE');
      const volunteerRequests = data.filter(req => req.requestType === 'VOLUNTEER');

      setRequests({ resourceRequests, volunteerRequests, fundraisers });
    } catch (err) {
      console.error("Fetch error details:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch requests";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async () => {
    try {
      await donorService.donateResource(donationModal.request.requestId, {
        quantityReceived: parseInt(donationAmount)
      });
      showSuccess("Resource donation submitted successfully!");
      setDonationModal({ show: false, request: null });
      setDonationAmount("");
      fetchRequests();
    } catch (err) {
      console.error("Donation error:", err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || "Failed to donate";
      showError(errorMessage);
    }
  };

  const handleVolunteer = async (requestId) => {
    try {
      await donorService.applyForVolunteer(requestId);
      showSuccess("Volunteer application submitted successfully!");
      fetchRequests();
    } catch (err) {
      console.error("Volunteer application error:", err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || "Failed to apply for volunteering";
      showError(errorMessage);
    }
  };

  return (
    <div className="min-vh-100 bg-light" style={{ paddingTop: "100px" }}>
      <div className="container py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-success text-white rounded p-4">
              <h1 className="mb-2">Donor Dashboard</h1>
              <p className="mb-0">Welcome! Browse active donation and volunteer requests to make a difference.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger alert-dismissible">
            {error}
            <button type="button" className="btn-close" onClick={() => setError("")}></button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Resource Requests */}
            <div className="row mb-5">
              <div className="col-12">
                <h3 className="text-success mb-3">
                  <i className="bi bi-box me-2"></i>
                  Resource Donations ({requests.resourceRequests?.length || 0})
                </h3>
                {requests.resourceRequests?.length === 0 ? (
                  <div className="card">
                    <div className="card-body text-center py-5">
                      <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
                      <p className="text-muted">No resource requests available</p>
                    </div>
                  </div>
                ) : (
                  <div className="row g-4">
                    {requests.resourceRequests?.map((request) => (
                      <div key={request.requestId} className="col-md-6 col-lg-4">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <h5 className="card-title text-success">{request.title}</h5>
                              <span className="badge bg-warning">Resource</span>
                            </div>
                            <p className="text-muted small mb-2">
                              <i className="bi bi-building me-1"></i>
                              {request.ngo?.name || 'NGO Name'}
                            </p>
                            <div className="mb-3">
                              <small className="text-muted">Progress</small>
                              <div className="progress mb-2" style={{ height: "8px" }}>
                                <div
                                  className="progress-bar bg-success"
                                  style={{ width: `${(request.quantityReceived / request.quantityRequired) * 100}%` }}
                                ></div>
                              </div>
                              <div className="d-flex justify-content-between">
                                <small>Received: {request.quantityReceived}</small>
                                <small>Needed: {request.quantityRequired}</small>
                              </div>
                            </div>
                            <p className="text-muted small mb-3">
                              Remaining: {request.quantityRequired - request.quantityReceived} units
                            </p>
                            <button
                              className="btn btn-success w-100"
                              onClick={() => setDonationModal({ show: true, request })}
                              disabled={(request.quantityRequired - request.quantityReceived) <= 0}
                            >
                              <i className="bi bi-heart me-2"></i>
                              {(request.quantityRequired - request.quantityReceived) <= 0 ? 'Fulfilled' : 'Donate'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fundraiser Requests */}
            <div className="row mb-5">
              <div className="col-12">
                <h3 className="text-success mb-3">
                  <i className="bi bi-cash-coin me-2"></i>
                  Fundraisers ({requests.fundraisers?.length || 0})
                </h3>
                <div className="row g-4">
                  {requests.fundraisers?.map((request) => (
                    <div key={request.requestId} className="col-md-6 col-lg-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h5 className="card-title text-success">{request.title}</h5>
                            <span className="badge bg-success">Fundraiser</span>
                          </div>
                          <p className="text-muted small mb-2">
                            <i className="bi bi-building me-1"></i>
                            {request.ngo?.name || 'NGO Name'}
                          </p>
                          <p className="card-text text-muted small">{request.description}</p>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between small text-muted mb-1">
                              <span>₹{request.collectedAmount || 0} raised</span>
                              <span>Goal: ₹{request.targetAmount}</span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                              <div
                                className="progress-bar bg-success"
                                style={{ width: `${Math.min(100, ((request.collectedAmount || 0) / request.targetAmount) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <a
                            className="btn btn-outline-success w-100"
                            href={`/donate-fundraiser/${request.requestId}`}
                          >
                            Donate Now
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!requests.fundraisers || requests.fundraisers.length === 0) && (
                    <div className="col-12">
                      <div className="card">
                        <div className="card-body text-center py-5">
                          <p className="text-muted">No fundraisers active.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Volunteer Requests */}
            <div className="row">
              <div className="col-12">
                <h3 className="text-primary mb-3">
                  <i className="bi bi-people me-2"></i>
                  Volunteer Opportunities ({requests.volunteerRequests?.length || 0})
                </h3>
                {requests.volunteerRequests?.length === 0 ? (
                  <div className="card">
                    <div className="card-body text-center py-5">
                      <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
                      <p className="text-muted">No volunteer opportunities available</p>
                    </div>
                  </div>
                ) : (
                  <div className="row g-4">
                    {requests.volunteerRequests?.map((request) => (
                      <div key={request.requestId} className="col-md-6 col-lg-4">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <h5 className="card-title text-primary">{request.title}</h5>
                              <span className="badge bg-info">Volunteer</span>
                            </div>
                            <p className="text-muted small mb-2">
                              <i className="bi bi-building me-1"></i>
                              {request.ngo?.name || 'NGO Name'}
                            </p>
                            <div className="mb-3">
                              <small className="text-muted">Volunteers</small>
                              <div className="progress mb-2" style={{ height: "8px" }}>
                                <div
                                  className="progress-bar bg-primary"
                                  style={{ width: `${(request.volunteerCount / request.volunteersRequired) * 100}%` }}
                                ></div>
                              </div>
                              <div className="d-flex justify-content-between">
                                <small>Enrolled: {request.volunteerCount}</small>
                                <small>Required: {request.volunteersRequired}</small>
                              </div>
                            </div>
                            <p className="text-muted small mb-3">
                              Slots available: {request.volunteersRequired - request.volunteerCount}
                            </p>
                            <button
                              className="btn btn-primary w-100"
                              onClick={() => handleVolunteer(request.requestId)}
                              disabled={(request.volunteersRequired - request.volunteerCount) <= 0 || request.hasApplied}
                            >
                              <i className="bi bi-person-plus me-2"></i>
                              {request.hasApplied ? 'Already Applied' : 
                               (request.volunteersRequired - request.volunteerCount) <= 0 ? 'Full' : 'Apply to Volunteer'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Donation Modal */}
      {donationModal.show && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Donate to: {donationModal.request?.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDonationModal({ show: false, request: null })}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-2">
                  <i className="bi bi-building me-1"></i>
                  NGO: {donationModal.request?.ngo?.name || 'NGO Name'}
                </p>
                <p>Remaining needed: {donationModal.request?.quantityRequired - donationModal.request?.quantityReceived} units</p>
                <div className="mb-3">
                  <label className="form-label">Quantity to donate:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    max={donationModal.request?.quantityRequired - donationModal.request?.quantityReceived}
                    min="1"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDonationModal({ show: false, request: null })}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleDonate}
                  disabled={!donationAmount || donationAmount <= 0}
                >
                  Donate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonorDashboard;