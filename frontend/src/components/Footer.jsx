import React, { useEffect, useState } from "react";
import { Phone, Mail, MapPin, ArrowUp } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer({ darkMode }) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* FOOTER */}
      <footer className={`pt-5 pb-4 ${darkMode ? "bg-black text-white" : "bg-dark text-white"}`}>
        <div className="container">
          <div className="row border-bottom border-secondary pb-4 mb-4">

            <div className="col-md-4 mb-4">
              <h5 className="fw-bold text-success mb-3">SAHAYASETU</h5>
              <p className="small text-secondary">
                A bridge of compassion connecting those who want to help with those in need.
              </p>
            </div>

            <div className="col-md-4 mb-4">
              <h5 className="fw-bold mb-3">Contact Us</h5>
              <p className="small"><Phone size={14} /> +91 90000 00000</p>
              <p className="small"><Mail size={14} /> info@sahyasetu.org</p>
              <p className="small"><MapPin size={14} /> India</p>
            </div>

            <div className="col-md-4 mb-4">
              <h5 className="fw-bold mb-3">Quick Links</h5>
              <Link className="d-block small text-secondary" to="/privacy">
                Privacy Policy
              </Link>
              <Link className="d-block small text-secondary" to="/terms">
                Terms & Conditions
              </Link>

              <div className="mt-3 d-flex gap-3">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <FaFacebookF size={18} className="text-primary" />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram size={18} className="text-danger" />
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                  <FaTwitter size={18} className="text-info" />
                </a>
              </div>
            </div>

          </div>

          <div className="text-center">
            <small className="text-secondary">
              © 2025 Sahyasetu Foundation. All rights reserved.
            </small>
          </div>
        </div>
      </footer>

      {/* SCROLL TO TOP */}
      {showTop && (
        <button
          className="btn btn-success rounded-circle position-fixed bottom-0 end-0 m-4"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
}

export default Footer;
