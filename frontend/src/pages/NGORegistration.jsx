import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function NGORegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    darpanId: "",
    address: "",
    city: "",
    email: "",
    contactPhone: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "NGO name is required";
    const darpanRegex = /^[A-Z]{2}\/[0-9]{4}\/[0-9]{7}$/;
    if (!formData.darpanId) {
      newErrors.darpanId = "Darpan ID is required";
    } else if (!darpanRegex.test(formData.darpanId)) {
      newErrors.darpanId = "Invalid Format. Expected: XX/YYYY/NNNNNNN (e.g. RJ/2024/1234567)";
    }

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.contactPhone) newErrors.contactPhone = "Contact phone is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setApiError("");

    try {
      await authService.registerNGO({
        name: formData.name,
        darpanId: formData.darpanId,
        email: formData.email,
        contactPhone: formData.contactPhone,
        addressLine1: formData.address,
        city: formData.city,
        password: formData.password,
      });

      alert("NGO registered successfully! Awaiting admin approval. Please login after approval.");
      navigate("/login/ngo");
    } catch (err) {
      if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          setApiError(errorData);
        } else if (errorData.errors) {
          setErrors(errorData.errors);
        } else {
          setApiError("Registration failed. Please check your input.");
        }
      } else {
        setApiError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0" style={{ borderRadius: "12px" }}>
              <div className="card-body p-4">

                <div className="text-center mb-4">
                  <div
                    className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "70px", height: "70px" }}
                  >
                    <i className="bi bi-building text-success fs-2"></i>
                  </div>
                  <h3 className="fw-bold text-success">NGO Registration</h3>
                  <p className="text-muted">
                    Register your NGO to manage donations and campaigns
                  </p>
                </div>

                {apiError && (
                  <div className="alert alert-danger">
                    {apiError}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">NGO Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Darpan ID</label>
                    <input
                      type="text"
                      className={`form-control ${errors.darpanId ? 'is-invalid' : ''}`}
                      name="darpanId"
                      value={formData.darpanId}
                      onChange={handleChange}
                      required
                    />
                    {errors.darpanId && <div className="invalid-feedback">{errors.darpanId}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.contactPhone ? 'is-invalid' : ''}`}
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      required
                    />
                    {errors.contactPhone && <div className="invalid-feedback">{errors.contactPhone}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="2"
                      required
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                    {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                    {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
                  </div>

                  <button type="submit" className="btn btn-success w-100 py-2 fw-semibold">
                    <i className="bi bi-check-circle me-2"></i>
                    Register NGO
                  </button>
                </form>

                <p className="mt-4 mb-0 text-muted text-center">
                  Already have an account?{" "}
                  <a href="/login" className="text-success fw-semibold">
                    Login here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}