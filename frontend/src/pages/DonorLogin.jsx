import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function DonorLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/donor-dashboard";

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setApiError("");
    setErrors({});

    try {
      const data = await authService.login({ email, password });

      // Decode token to get user ID / donor ID
      const decodedUser = parseJwt(data.token);
      const userId = decodedUser?.id;

      if (!userId) {
        throw new Error("Failed to retrieve User ID");
      }

      const userData = {
        token: data.token,
        userId: userId, // This works as donorId or adminId based on role
        donorId: data.role === 'DONOR' ? userId : undefined,
        name: data.name,
        role: data.role,
      };

      login(userData);

      if (data.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (data.role === "DONOR") {
        navigate(from, { replace: true });
      }
    } catch (err) {
      if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          setApiError(errorData);
        } else if (errorData.errors) {
          setErrors(errorData.errors);
        } else {
          setApiError("Invalid input. Please check your credentials.");
        }
      } else if (err.response?.status === 401) {
        setApiError("Invalid credentials.");
      } else {
        setApiError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light" style={{ paddingTop: "80px" }}>
      <div className="card shadow-lg border-0" style={{ width: "420px", borderRadius: "12px" }}>
        <div className="card-body p-4 text-center">

          <div className="mb-3">
            <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center" style={{ width: "70px", height: "70px" }}>
              <i className="bi bi-person-check text-success fs-2"></i>
            </div>
          </div>

          <h3 className="fw-bold text-success">User Login</h3>
          <p className="text-muted mb-4">Sign in to access your account and manage your activities.</p>

          {apiError && (
            <div className="alert alert-danger text-start">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label">Email Address</label>
              <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
            </div>

            <div className="mb-4 text-start">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input type={showPassword ? "text" : "password"} className={`form-control ${errors.password ? "is-invalid" : ""}`} value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
              {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
            </div>

            <button type="submit" className="btn btn-success w-100 py-2 fw-semibold">
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Login
            </button>
          </form>

          <p className="mt-4 mb-0 text-muted">
            Don&apos;t have an account? <a href="/register" className="text-success fw-semibold">Register here</a>
          </p>

        </div>
      </div>
    </div>
  );
}
