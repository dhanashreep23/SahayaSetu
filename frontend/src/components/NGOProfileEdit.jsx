import { useState } from 'react';
import { ngoService } from '../services/ngoService';

export default function NGOProfileEdit({ ngoData }) {
  const [formData, setFormData] = useState({
    name: ngoData?.name || '',
    email: ngoData?.email || '',
    contactPhone: ngoData?.contactPhone || ngoData?.phone || '',
    addressLine1: ngoData?.addressLine1 || ngoData?.fullAddress || '',
    city: ngoData?.city || ''
  });
  const [edited, setEdited] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setEdited(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await ngoService.updateNGODetails(ngoData.ngoId, {
        name: formData.name,
        contactPhone: formData.contactPhone,
        addressLine1: formData.addressLine1,
        city: formData.city
      });
      setMessage({ type: 'success', text: '✓ Profile updated successfully!' });
      setEdited(false);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-section">
      <div className="row">
        <div className="col-lg-8">
          <div className="profile-card">
            <h2>Edit Your NGO Profile</h2>
            <p className="text-muted">Keep your information up-to-date for donors.</p>

            {message.text && (
              <div className={`alert alert-${message.type} alert-dismissible fade show`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="form-label">NGO Name</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="form-label">Email Address (Read-Only)</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    disabled
                  />
                </div>

                <div className="col-md-6 mb-4">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={!edited || loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="profile-summary">
            <h5>Profile Summary</h5>
            <div className="summary-item">
              <strong>Name:</strong>
              <span>{formData.name}</span>
            </div>
            <div className="summary-item">
              <strong>Phone:</strong>
              <span>{formData.contactPhone}</span>
            </div>
            <div className="summary-item">
              <strong>City:</strong>
              <span>{formData.city}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}