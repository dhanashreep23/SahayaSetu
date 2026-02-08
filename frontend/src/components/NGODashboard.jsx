import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { ngoService } from "../services/ngoService";
import { Link } from 'react-router-dom';
import NGODonationRequests from './NGODonationRequests';
import NGOProfileEdit from './NGOProfileEdit';
import './NGODashboard.css';

export default function NGODashboard() {
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [requests, setRequests] = useState({
    resourceRequests: [],
    volunteerRequests: [],
    fundraiserRequests: []
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState({ type: '', show: false });
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.ngoId) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await ngoService.getOwnRequests(user.ngoId);
      setRequests({
        resourceRequests: data.filter(r => r.requestType === 'RESOURCE'),
        volunteerRequests: data.filter(r => r.requestType === 'VOLUNTEER'),
        fundraiserRequests: data.filter(r => r.requestType === 'FUNDRAISER')
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    try {
      const requestData = { ...formData, ngoId: user.ngoId };
      if (showModal.type === 'resource') {
        await ngoService.createResourceRequest(requestData);
        showSuccess("Resource Request Created!");
      } else {
        await ngoService.createVolunteerRequest(requestData);
        showSuccess("Volunteer Request Created!");
      }
      setShowModal({ type: '', show: false });
      setFormData({});
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to create request";
      showError(errorMessage);
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

  return (
    <div className="ngo-dashboard">
      <div className="container-fluid">
        <div className="dashboard-header">
          <div className="text-center py-5">
            <h1 className="display-4">NGO Dashboard</h1>
            <p className="lead">Welcome, {user?.name || 'NGO'}! Manage your profile and donation activities here.</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            My Requests
          </button>
          <button
            className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Requests
          </button>
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Edit Profile
          </button>
          <button
            className={`tab-btn ${activeTab === 'responses' ? 'active' : ''}`}
            onClick={() => setActiveTab('responses')}
          >
            Donor Responses
          </button>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {activeTab === 'dashboard' && (
            <div>
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
              ) : (
                <>
                  {/* Fundraiser Requests */}
                  {requests.fundraiserRequests?.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-success mb-3">💰 Fundraiser Requests</h4>
                      <div className="row g-4">
                        {requests.fundraiserRequests.map(req => (
                          <div key={req.requestId} className="col-md-6 col-lg-4">
                            <div className="card shadow-sm h-100">
                              <div className="card-body">
                                <h5 className="card-title text-success">{req.title}</h5>
                                {getStatusBadge(req.status)}
                                <div className="mt-3">
                                  <div className="d-flex justify-content-between">
                                    <small>Target: ₹{req.targetAmount}</small>
                                    <small>Collected: ₹{req.collectedAmount || 0}</small>
                                  </div>
                                  <div className="progress mt-1" style={{ height: '6px' }}>
                                    <div className="progress-bar bg-success" style={{ width: `${Math.min(100, (req.collectedAmount / req.targetAmount) * 100)}%` }}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resource Requests */}
                  {requests.resourceRequests?.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-warning mb-3">📦 Resource Requests</h4>
                      <div className="row g-4">
                        {requests.resourceRequests.map(req => (
                          <div key={req.requestId} className="col-md-6 col-lg-4">
                            <div className="card shadow-sm h-100">
                              <div className="card-body">
                                <h5 className="card-title text-warning">{req.title}</h5>
                                {getStatusBadge(req.status)}
                                <p className="small text-muted mb-2">{req.resourceType}</p>
                                <div className="mt-2">
                                  <div className="d-flex justify-content-between">
                                    <small>Required: {req.quantityRequired}</small>
                                    <small>Received: {req.quantityReceived || 0}</small>
                                  </div>
                                  <div className="progress mt-1" style={{ height: '6px' }}>
                                    <div className="progress-bar bg-warning" style={{ width: `${Math.min(100, (req.quantityReceived / req.quantityRequired) * 100)}%` }}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Volunteer Requests */}
                  {requests.volunteerRequests?.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-primary mb-3">🤝 Volunteer Requests</h4>
                      <div className="row g-4">
                        {requests.volunteerRequests.map(req => (
                          <div key={req.requestId} className="col-md-6 col-lg-4">
                            <div className="card shadow-sm h-100">
                              <div className="card-body">
                                <h5 className="card-title text-primary">{req.title}</h5>
                                {getStatusBadge(req.status)}
                                <p className="small text-muted mb-2">{req.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feature Cards (Show only if no requests, or always? Maybe better to hide feature cards here and keep in 'Create' tab) */}
                  {/* The previous design had feature cards in Dashboard, but now we have a dedicated Create Tab. So we can remove them from here to reduce clutter, or keep them as 'shortcuts'. */}
                  {/* Given the user wants to View Status, I'll prioritize the lists. */}
                </>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="container">
              <h3 className="mb-4">Create New Request</h3>
              <div className="row g-4">
                {/* Create Fundraiser Link */}
                <div className="col-md-4">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body text-center">
                      <div className="display-4 text-success mb-3">💰</div>
                      <h4 className="card-title">Create Fundraiser</h4>
                      <p className="card-text text-muted">Start a new fundraising campaign to collect monetary donations.</p>
                      <Link to="/create-fundraiser" className="btn btn-success w-100 rounded-pill">
                        Launch Fundraiser
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Create Resource Request */}
                <div className="col-md-4">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body text-center">
                      <div className="display-4 text-warning mb-3">📦</div>
                      <h4 className="card-title">Request Resources</h4>
                      <p className="card-text text-muted">Ask donors for physical items like food, clothes, or medicines.</p>
                      <button
                        className="btn btn-warning w-100 rounded-pill text-white"
                        onClick={() => setShowModal({ type: 'resource', show: true })}
                      >
                        Request Resources
                      </button>
                    </div>
                  </div>
                </div>

                {/* Create Volunteer Request */}
                <div className="col-md-4">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body text-center">
                      <div className="display-4 text-primary mb-3">🤝</div>
                      <h4 className="card-title">Recruit Volunteers</h4>
                      <p className="card-text text-muted">Find dedicated volunteers to help with your on-ground activities.</p>
                      <button
                        className="btn btn-primary w-100 rounded-pill"
                        onClick={() => setShowModal({ type: 'volunteer', show: true })}
                      >
                        Recruit Volunteers
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <NGOProfileEdit ngoData={user} />
          )}

          {activeTab === 'responses' && (
            <div>
              <h3 className="mb-4">Fundraiser Donations & Responses</h3>
              <p className="text-muted mb-4">Respond to your generous donors and build lasting relationships.</p>
              <div className="text-center">
                <Link to="/fundraiser-responses" className="btn btn-success btn-lg">
                  <i className="bi bi-heart me-2"></i>
                  View & Respond to Donations
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Request Modal */}
      {showModal.show && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Create {showModal.type === 'resource' ? 'Resource' : 'Volunteer'} Request
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal({ type: '', show: false })}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
                {showModal.type === 'resource' ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Resource Type</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Rice, Blankets"
                        value={formData.resourceType || ''}
                        onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Quantity Required</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.quantityRequired || ''}
                        onChange={(e) => setFormData({ ...formData, quantityRequired: parseInt(e.target.value) })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Skills Required</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Teaching, Nursing"
                        value={formData.skillsRequired || ''}
                        onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Volunteers Required</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.volunteersRequired || ''}
                        onChange={(e) => setFormData({ ...formData, volunteersRequired: parseInt(e.target.value) })}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal({ type: '', show: false })}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateRequest}
                >
                  Create Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}