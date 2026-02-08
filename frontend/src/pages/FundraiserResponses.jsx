import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const FundraiserResponses = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responseModal, setResponseModal] = useState({ show: false, donation: null });
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/ngo/fundraiser-donations?ngoId=${user.ngoId}`);
      setDonations(response.data);
    } catch (err) {
      setError("Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  };

  const sendResponse = async () => {
    try {
      await api.post(`/ngo/donation-response`, {
        donationId: responseModal.donation.donationId,
        message: responseMessage
      });
      
      setResponseModal({ show: false, donation: null });
      setResponseMessage("");
      alert("Response sent successfully!");
      fetchDonations();
    } catch (err) {
      setError("Failed to send response");
    }
  };

  return (
    <div className="min-vh-100 bg-light" style={{ paddingTop: "100px" }}>
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-success text-white rounded p-4">
              <h1 className="mb-2">Fundraiser Donations</h1>
              <p className="mb-0">Respond to your generous donors and build relationships.</p>
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
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0 text-success">
                    <i className="bi bi-heart me-2"></i>
                    Recent Donations ({donations.length})
                  </h5>
                </div>
                <div className="card-body p-0">
                  {donations.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                      No donations received yet
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Donor</th>
                            <th>Fundraiser</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.map((donation) => (
                            <tr key={donation.donationId}>
                              <td>
                                <div>
                                  <strong>{donation.donorName}</strong>
                                  <br />
                                  <small className="text-muted">{donation.donorEmail}</small>
                                </div>
                              </td>
                              <td>{donation.fundraiserTitle}</td>
                              <td>
                                <span className="fw-bold text-success">₹{donation.amount}</span>
                              </td>
                              <td>
                                <small>{new Date(donation.donationDate).toLocaleDateString()}</small>
                              </td>
                              <td>
                                {donation.responseStatus ? (
                                  <span className="badge bg-success">Responded</span>
                                ) : (
                                  <span className="badge bg-warning">Pending</span>
                                )}
                              </td>
                              <td>
                                {!donation.responseStatus && (
                                  <button
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => setResponseModal({ show: true, donation })}
                                  >
                                    <i className="bi bi-reply me-1"></i>
                                    Respond
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
            </div>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {responseModal.show && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Respond to {responseModal.donation?.donorName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setResponseModal({ show: false, donation: null })}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <p><strong>Donation:</strong> ₹{responseModal.donation?.amount}</p>
                  <p><strong>Fundraiser:</strong> {responseModal.donation?.fundraiserTitle}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label">Thank you message:</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Write a personalized thank you message..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setResponseModal({ show: false, donation: null })}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={sendResponse}
                  disabled={!responseMessage.trim()}
                >
                  Send Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundraiserResponses;