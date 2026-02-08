import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const FundraiserList = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const navigate = useNavigate();

  const loadFundraisers = async () => {
    const res = await api.get("/donor/fundraisers");
    setFundraisers(res.data);
  };

  useEffect(() => {
    loadFundraisers();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Active Fundraisers</h2>

      {fundraisers.map((f) => (
        <div key={f.requestId} className="card mb-3">
          <div className="card-body">
            <h4>{f.title}</h4>
            <p>{f.description}</p>
            <p><b>Target:</b> ₹{f.targetAmount}</p>
            <p><b>Collected:</b> ₹{f.collectedAmount}</p>

            <button
              className="btn btn-success"
              onClick={() => navigate(`/donate-fundraiser/${f.requestId}`)}
            >
              Donate
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FundraiserList;
