import { useEffect, useState } from "react";
import api from "../services/api";

export default function NGODonationRequests({ ngoId }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ============================
     LOAD DONATIONS FROM BACKEND
     ============================ */
  useEffect(() => {
    api.get(`/ngo/${ngoId}/donations`)
      .then(res => {
        setDonations(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load donations", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="donation-section mt-5">
      <div className="section-header mb-4">
        <h2>💰 Donations Received</h2>
        <p className="text-muted">
          View all donations made by donors to your fundraisers.
        </p>
      </div>

      {/* LOADING */}
      {loading && <p>Loading donations...</p>}

      {/* EMPTY STATE */}
      {!loading && donations.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h5>No Donations Yet</h5>
          <p>Your fundraiser has not received any donations yet.</p>
        </div>
      )}

      {/* DONATION LIST */}
      {!loading && donations.length > 0 && (
        <div className="requests-grid">
          {donations.map((donation, index) => (
            <div key={index} className="request-card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <strong>{donation.fundraiserTitle}</strong>
                <span className="badge bg-success">
                  ₹{donation.amount}
                </span>
              </div>

              <div className="mt-2">
                <p className="mb-1">
                  <b>Donor:</b> {donation.donorName}
                </p>
                <p className="mb-1">
                  <b>Amount:</b> ₹{donation.amount}
                </p>
                <small className="text-muted">
                  Donated on {new Date(donation.donatedAt).toLocaleString()}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
