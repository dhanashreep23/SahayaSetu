import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function RegisterSelection() {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light" style={{ paddingTop: '80px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0" style={{ borderRadius: "12px" }}>
              <div className="card-body p-5 text-center">
                
                <div className="mb-4">
                  <div
                    className="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="bi bi-person-plus text-warning fs-1"></i>
                  </div>
                  <h3 className="fw-bold text-dark">Join Our Mission</h3>
                  <p className="text-muted">
                    Choose your role to get started
                  </p>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div 
                      className="card h-100 border-success cursor-pointer hover-card"
                      onClick={() => navigate("/register/donor")}
                      style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                      }}
                    >
                      <div className="card-body p-4">
                        <div className="mb-3">
                          <i className="bi bi-person-heart text-success fs-1"></i>
                        </div>
                        <h5 className="card-title text-success fw-bold">Register as Donor</h5>
                        <p className="card-text text-muted small">
                          Help NGOs by donating and supporting causes
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div 
                      className="card h-100 border-primary cursor-pointer hover-card"
                      onClick={() => navigate("/register/ngo")}
                      style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                      }}
                    >
                      <div className="card-body p-4">
                        <div className="mb-3">
                          <i className="bi bi-building text-primary fs-1"></i>
                        </div>
                        <h5 className="card-title text-primary fw-bold">Register as NGO</h5>
                        <p className="card-text text-muted small">
                          Create requests and manage your organization
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-muted mb-0">
                    Already have an account?{" "}
                    <a href="/login" className="text-warning fw-semibold">
                      Login here
                    </a>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}