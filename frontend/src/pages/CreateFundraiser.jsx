import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api.js";

const CreateFundraiser = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetAmount: "",
    deadline: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/ngo/requests/fundraiser?ngoId=${user.ngoId}`, form);
      alert("✅ Fundraiser created successfully");
      navigate('/ngo-dashboard');
    } catch (err) {
      alert(err.response?.data || "❌ Error creating fundraiser");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5 mt-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm">
              
              {/* HEADER */}
              <div className="card-header bg-success text-white">
                <h4 className="mb-0">💰 Create Fundraiser</h4>
                <p className="mb-0 small">Start a new fundraising campaign to collect monetary donations</p>
              </div>

              {/* BODY */}
              <div className="card-body p-4">
                <form onSubmit={submitHandler}>
                  
                  {/* TITLE */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Fundraiser Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      placeholder="e.g. Help Flood Victims in Assam"
                      value={form.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      placeholder="Explain why this fundraiser is important..."
                      value={form.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  {/* TARGET AMOUNT */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Target Amount (₹) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="targetAmount"
                      placeholder="e.g. 50000"
                      value={form.targetAmount}
                      onChange={handleChange}
                      required
                      min="1"
                    />
                  </div>

                  {/* DEADLINE */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Deadline <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="deadline"
                      value={form.deadline}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* BUTTONS */}
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate('/ngo-dashboard')}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success flex-fill"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Fundraiser"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFundraiser;
