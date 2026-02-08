import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function DonorRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
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
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
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
    setErrors({});

    try {
      await authService.registerDonor({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        dateOfBirth: formData.dateOfBirth,
        password: formData.password,
      });

      navigate("/login/donor");
    } catch (err) {
      if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          setApiError(errorData);
        } else if (errorData.errors) {
          setErrors(errorData.errors);
        } else if (errorData.message) {
          setApiError(errorData.message);
        } else {
          setApiError("Registration failed. Please check your input.");
        }
      } else {
        setApiError(err.response?.data?.message || "Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light" style={{ paddingTop: "100px", paddingBottom: "50px" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0" style={{ borderRadius: "12px" }}>
              <div className="card-body p-4">

                <div className="text-center mb-4">
                  <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "70px", height: "70px" }}>
                    <i className="bi bi-person-heart text-success fs-2"></i>
                  </div>
                  <h3 className="fw-bold text-success">Donor Registration</h3>
                  <p className="text-muted">Join us to make a difference in the community</p>
                </div>

                {apiError && (
                  <div className="alert alert-danger text-center">
                    {apiError}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className={`form-control ${errors.fullName ? "is-invalid" : ""}`} name="fullName" value={formData.fullName} onChange={handleChange} />
                    {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input type="tel" className={`form-control ${errors.phone ? "is-invalid" : ""}`} name="phone" value={formData.phone} onChange={handleChange} />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea className={`form-control ${errors.address ? "is-invalid" : ""}`} name="address" value={formData.address} onChange={handleChange} rows="2" />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">City</label>
                    <input type="text" className={`form-control ${errors.city ? "is-invalid" : ""}`} name="city" value={formData.city} onChange={handleChange} />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" className={`form-control ${errors.dateOfBirth ? "is-invalid" : ""}`} name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                    {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <input type={showPassword ? "text" : "password"} className={`form-control ${errors.password ? "is-invalid" : ""}`} name="password" value={formData.password} onChange={handleChange} />
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </button>
                    </div>
                    {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-group">
                      <input type={showConfirmPassword ? "text" : "password"} className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </button>
                    </div>
                    {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
                  </div>

                  <button type="submit" className="btn btn-success w-100 py-2 fw-semibold">
                    <i className="bi bi-check-circle me-2"></i>
                    Register as Donor
                  </button>
                </form>

                <p className="mt-4 mb-0 text-muted text-center">
                  Already have an account? <a href="/login" className="text-success fw-semibold">Login here</a>
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
