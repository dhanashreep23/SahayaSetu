import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function NGOLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/ngo-dashboard";

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
      // Try NGO login first
      let data;
      try {
        data = await authService.loginNGO({ email, password });
      } catch (ngoError) {
        // If NGO login fails, try regular login (for admin)
        if (ngoError.response?.status === 401) {
          data = await authService.login({ email, password });
        } else {
          throw ngoError;
        }
      }

      // Decode token to get user info
      const decodedUser = parseJwt(data.token);
      const userId = decodedUser?.id;
      const userRole = decodedUser?.role || data.role;

      if (!userId) {
        throw new Error("Failed to retrieve user ID");
      }

      let userData;
      if (userRole === 'ADMIN') {
        userData = {
          token: data.token,
          userId: userId,
          name: data.name || 'Admin',
          role: 'ADMIN',
          type: 'admin'
        };
        login(userData);
        navigate('/admin-dashboard', { replace: true });
      } else {
        userData = {
          token: data.token,
          ngoId: userId,
          name: data.name,
          role: data.role,
          type: 'ngo'
        };
        login(userData);
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
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light" style={{ paddingTop: '80px' }}>
      <div
        className="card shadow-lg border-0"
        style={{ width: "420px", borderRadius: "12px" }}
      >
        <div className="card-body p-4 text-center">

          <div className="mb-3">
            <div
              className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center"
              style={{ width: "70px", height: "70px" }}
            >
              <i className="bi bi-building text-primary fs-2"></i>
            </div>
          </div>

          <h3 className="fw-bold text-primary">NGO Login</h3>
          <p className="text-muted mb-4">
            Login to manage your NGO or access admin dashboard.
          </p>

          {apiError && (
            <div className="alert alert-danger text-start">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-3 text-start">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""
                    }`}
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && (
                <div className="invalid-feedback d-block">
                  {errors.email}
                </div>
              )}
            </div>

            <div className="mb-4 text-start">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-key"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${errors.password ? "is-invalid" : ""
                    }`}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
              {errors.password && (
                <div className="invalid-feedback d-block">
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Login
            </button>
          </form>

          <p className="mt-4 mb-0 text-muted">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-primary fw-semibold">
              Register here
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}