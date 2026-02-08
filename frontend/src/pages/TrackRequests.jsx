import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ngoService } from "../services/ngoService";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import NGODonationRequests from "../components/NGODonationRequests";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function TrackRequests() {
    const { user } = useAuth();
    const { showError, showSuccess } = useToast();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showDetailsModal, setShowDetailsModal] = useState({ show: false, request: null });
    const [requestDetails, setRequestDetails] = useState(null);

    useEffect(() => {
        if (user?.ngoId) {
            fetchRequests();
        }
    }, [user]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await ngoService.getOwnRequests(user.ngoId);
            setRequests(data);
        } catch (err) {
            setError("Failed to fetch requests");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseRequest = async (requestId) => {
        if (window.confirm('Are you sure you want to close this request?')) {
            try {
                await ngoService.closeRequest(requestId, user.ngoId);
                showSuccess('Request closed successfully!');
                fetchRequests();
            } catch (err) {
                const errorMessage = err.response?.data || err.message || 'Failed to close request';
                showError(errorMessage);
            }
        }
    };

    const handleViewDetails = async (request) => {
        try {
            const details = await ngoService.getRequestDetails(request.requestId);
            setRequestDetails(details);
            setShowDetailsModal({ show: true, request });
        } catch (err) {
            const errorMessage = err.response?.data || err.message || 'Failed to load request details';
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

    const getRequestTypeIcon = (type) => {
        switch (type) {
            case 'RESOURCE': return <i className="bi bi-box text-warning"></i>;
            case 'VOLUNTEER': return <i className="bi bi-people text-primary"></i>;
            case 'FUNDRAISER': return <i className="bi bi-cash-coin text-success"></i>;
            default: return <i className="bi bi-question-circle"></i>;
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5 mt-5">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-success">
                        <i className="bi bi-activity me-2"></i>
                        Track Requests
                    </h2>
                    <Link to="/ngo-dashboard" className="btn btn-outline-success">
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Dashboard
                    </Link>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status"></div>
                    </div>
                ) : (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-0">
                            {requests.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                                    No requests found
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0 align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Type</th>
                                                <th>Title</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Progress</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requests.map((req) => (
                                                <tr key={req.requestId}>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            {getRequestTypeIcon(req.requestType)}
                                                            <span className="small fw-semibold">{req.requestType}</span>
                                                        </div>
                                                    </td>
                                                    <td className="fw-medium">{req.title}</td>
                                                    <td className="text-muted small">
                                                        {new Date(req.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td>{getStatusBadge(req.status)}</td>
                                                    <td style={{ minWidth: '200px' }}>
                                                        {req.requestType === 'RESOURCE' && (
                                                            <div>
                                                                <div className="d-flex justify-content-between small text-muted mb-1">
                                                                    <span>{req.quantityReceived || 0} / {req.quantityRequired}</span>
                                                                    <span>{Math.round(((req.quantityReceived || 0) / req.quantityRequired) * 100)}%</span>
                                                                </div>
                                                                <div className="progress" style={{ height: '6px' }}>
                                                                    <div
                                                                        className="progress-bar bg-warning"
                                                                        style={{ width: `${Math.min(100, ((req.quantityReceived || 0) / req.quantityRequired) * 100)}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {req.requestType === 'FUNDRAISER' && (
                                                            <div>
                                                                <div className="d-flex justify-content-between small text-muted mb-1">
                                                                    <span>₹{req.collectedAmount || 0} / ₹{req.targetAmount}</span>
                                                                    <span>{Math.round(((req.collectedAmount || 0) / req.targetAmount) * 100)}%</span>
                                                                </div>
                                                                <div className="progress" style={{ height: '6px' }}>
                                                                    <div
                                                                        className="progress-bar bg-success"
                                                                        style={{ width: `${Math.min(100, ((req.collectedAmount || 0) / req.targetAmount) * 100)}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {req.requestType === 'VOLUNTEER' && (
                                                            <button
                                                                className="btn btn-sm btn-outline-info"
                                                                onClick={() => handleViewDetails(req)}
                                                            >
                                                                See Details
                                                            </button>
                                                        )}
                                                        {req.requestType === 'RESOURCE' && (
                                                            <button
                                                                className="btn btn-sm btn-outline-info"
                                                                onClick={() => handleViewDetails(req)}
                                                            >
                                                                See Details
                                                            </button>
                                                        )}
                                                        {req.requestType === 'FUNDRAISER' && (
                                                            <button
                                                                className="btn btn-sm btn-outline-info"
                                                                onClick={() => handleViewDetails(req)}
                                                            >
                                                                See Details
                                                            </button>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {req.status === 'OPEN' && (
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleCloseRequest(req.requestId)}
                                                            >
                                                                Close
                                                            </button>
                                                        )}
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

                {/* Donations Received Section */}
                <div className="mt-5">
                    <NGODonationRequests ngoId={user?.ngoId} />
                </div>

                {/* Request Details Modal */}
                {showDetailsModal.show && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {getRequestTypeIcon(showDetailsModal.request?.requestType)} {showDetailsModal.request?.title} - Details
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowDetailsModal({ show: false, request: null })}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    {requestDetails ? (
                                        <div>
                                            <div className="mb-3">
                                                <strong>Description:</strong>
                                                <p>{showDetailsModal.request?.description}</p>
                                            </div>
                                            
                                            {showDetailsModal.request?.requestType === 'VOLUNTEER' && (
                                                <div>
                                                    <h6>Volunteer Applications ({requestDetails.applicants?.length || 0})</h6>
                                                    {requestDetails.applicants?.length === 0 ? (
                                                        <p className="text-muted">No applications yet</p>
                                                    ) : (
                                                        <div className="table-responsive">
                                                            <table className="table table-sm">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Name</th>
                                                                        <th>Email</th>
                                                                        <th>Applied Date</th>
                                                                        <th>Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {requestDetails.applicants.map((applicant, index) => (
                                                                        <tr key={index}>
                                                                            <td>{applicant.donorName}</td>
                                                                            <td>{applicant.donorEmail}</td>
                                                                            <td>{new Date(applicant.appliedAt).toLocaleDateString()}</td>
                                                                            <td><span className="badge bg-info">{applicant.status}</span></td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {showDetailsModal.request?.requestType === 'RESOURCE' && (
                                                <div>
                                                    <h6>Resource Contributions ({requestDetails.contributors?.length || 0})</h6>
                                                    {requestDetails.contributors?.length === 0 ? (
                                                        <p className="text-muted">No contributions yet</p>
                                                    ) : (
                                                        <div className="table-responsive">
                                                            <table className="table table-sm">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Donor Name</th>
                                                                        <th>Email</th>
                                                                        <th>Quantity</th>
                                                                        <th>Date</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {requestDetails.contributors.map((contributor, index) => (
                                                                        <tr key={index}>
                                                                            <td>{contributor.donorName}</td>
                                                                            <td>{contributor.donorEmail}</td>
                                                                            <td>{contributor.quantity}</td>
                                                                            <td>{new Date(contributor.contributedAt).toLocaleDateString()}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {showDetailsModal.request?.requestType === 'FUNDRAISER' && (
                                                <div>
                                                    <h6>Donations ({requestDetails.donors?.length || 0})</h6>
                                                    {requestDetails.donors?.length === 0 ? (
                                                        <p className="text-muted">No donations yet</p>
                                                    ) : (
                                                        <div className="table-responsive">
                                                            <table className="table table-sm">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Donor Name</th>
                                                                        <th>Email</th>
                                                                        <th>Amount</th>
                                                                        <th>Date</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {requestDetails.donors.map((donor, index) => (
                                                                        <tr key={index}>
                                                                            <td>{donor.donorName}</td>
                                                                            <td>{donor.donorEmail}</td>
                                                                            <td className="text-success fw-bold">₹{donor.amount}</td>
                                                                            <td>{new Date(donor.donatedAt).toLocaleDateString()}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-3">
                                            <div className="spinner-border text-primary" role="status"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowDetailsModal({ show: false, request: null })}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
