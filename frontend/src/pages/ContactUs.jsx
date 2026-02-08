import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div style={{ paddingTop: "80px" }}>
      {/* Header Section */}
      <section className="py-5 bg-success text-white">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Contact Us</h1>
          <p className="lead">We'd love to hear from you. Get in touch with us!</p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            {/* Contact Information */}
            <div className="col-lg-4">
              <h3 className="fw-bold mb-4">Get In Touch</h3>
              <p className="text-muted mb-4">
                Have questions about our mission or want to get involved? 
                We're here to help and would love to connect with you.
              </p>

              <div className="d-flex align-items-center mb-3">
                <div className="bg-success text-white rounded-circle p-3 me-3">
                  <Mail size={20} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Email</h6>
                  <p className="text-muted mb-0">contact@sahayasetu.org</p>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <div className="bg-success text-white rounded-circle p-3 me-3">
                  <Phone size={20} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Phone</h6>
                  <p className="text-muted mb-0">+91 98765 43210</p>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <div className="bg-success text-white rounded-circle p-3 me-3">
                  <MapPin size={20} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Address</h6>
                  <p className="text-muted mb-0">
                    123 Hope Street<br />
                    Mumbai, Maharashtra 400001
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5">
                  <h3 className="fw-bold mb-4">Send us a Message</h3>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="name" className="form-label fw-semibold">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label fw-semibold">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="col-12">
                        <label htmlFor="subject" className="form-label fw-semibold">
                          Subject *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="col-12">
                        <label htmlFor="message" className="form-label fw-semibold">
                          Message *
                        </label>
                        <textarea
                          className="form-control"
                          id="message"
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>
                      
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-success btn-lg px-4 fw-bold d-flex align-items-center"
                        >
                          <Send size={18} className="me-2" />
                          Send Message
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;