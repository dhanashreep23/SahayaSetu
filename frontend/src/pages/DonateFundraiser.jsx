import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const DonateFundraiser = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [fundraiser, setFundraiser] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/donor/fundraisers");
      const found = res.data.find(
        (f) => f.requestId === Number(requestId)
      );
      setFundraiser(found);
    };
    load();
  }, [requestId]);

  const payNow = async () => {
    const donateAmount = Number(amount);
    if (!donateAmount || donateAmount <= 0) {
      alert("Enter valid amount");
      return;
    }

    const user = JSON.parse(localStorage.getItem("sahayasetu_user"));

    if (!user?.token) {
      alert("Please login to donate");
      return;
    }

    // Get donor ID from user data
    const donorId = user.donorId ?? user.userId ?? user.id;

    if (!donorId) {
      alert("Invalid user session. Please login again.");
      return;
    }

    const res = await fetch("http://localhost:8080/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ amount: donateAmount }),
    });

    const order = await res.json();

    const options = {
      key: "rzp_test_S8vY8Zt6Se2aKP",
      amount: order.amount,
      currency: "INR",
      name: "SahayaSetu",
      description: fundraiser.title,
      order_id: order.id,

      handler: async (response) => {
        await api.post(
          `/donor/requests/${requestId}/donate?donorId=${donorId}`,
          {
            amount: donateAmount,
            paymentMode: "ONLINE",
            paymentReference: response.razorpay_payment_id,
          }
        );

        alert("Donation successful ✅");
        navigate("/donor-dashboard");
      },
    };

    new window.Razorpay(options).open();
  };

  if (!fundraiser) return <p className="text-center mt-5">Loading...</p>;

  const progress =
    (fundraiser.collectedAmount / fundraiser.targetAmount) * 100;

  return (
    <div className="container d-flex justify-content-center page-spacer">

      <div className="card shadow-lg p-4" style={{ maxWidth: "520px", width: "100%" }}>

        <h3 className="fw-bold mb-1">{fundraiser.title}</h3>
        <p className="text-muted small mb-2">
          <i className="bi bi-building me-1"></i>
          {fundraiser.ngo?.name || 'NGO Name'}
        </p>
        <p className="text-muted mb-3">{fundraiser.description}</p>

        {/* Progress */}
        <div className="mb-2">
          <div className="d-flex justify-content-between small fw-semibold">
            <span>₹{fundraiser.collectedAmount} raised</span>
            <span>₹{fundraiser.targetAmount}</span>
          </div>
          <div className="progress mt-1" style={{ height: "8px" }}>
            <div
              className="progress-bar bg-success"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Donation Box */}
        <div className="border rounded p-3 mt-4 bg-light">
          <label className="fw-semibold mb-2">Donate Amount (₹)</label>
          <input
            type="number"
            className="form-control mb-3"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            className="btn btn-success w-100 fw-semibold mb-3"
            onClick={payNow}
          >
            Pay with Razorpay
          </button>

          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonateFundraiser;
