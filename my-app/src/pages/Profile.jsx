import React, { useEffect, useState } from 'react';
import '../styles/Panel.css';

const API_URL = 'http://localhost:5001/api/instructor';

const Profile = ({ instructorId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    instructorAvatar: '',
    verifiedInstructor: false,
    createdAt: '',
    stripeAccountId: '',
    password:'',
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!instructorId) return;
    setLoading(true);
    fetch(`${API_URL}/${instructorId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.instructor) {
          setFormData({
            name: data.instructor.name || '',
            email: data.instructor.email || '',
            instructorAvatar: data.instructor.instructorAvatar || '',
            verifiedInstructor: data.instructor.verifiedInstructor || false,
            createdAt: data.instructor.createdAt || '',
            password: data.instructor.password ||'',
            stripeAccountId: data.instructor.stripeAccountId || '',
          });
        }
        setLoading(false);
      });
  }, [instructorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch(`${API_URL}/${instructorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setMessage('Profile updated successfully!');
        setEditMode(false);
      } else {
        setMessage('Error updating profile.');
      }
    } catch (err) {
      setMessage('Error updating profile.');
    }
  };

  if (loading) return <div className="panel-bg"><div className="panel-content">Loading...</div></div>;

  return (
    <div className="panel-bg">
      <div className="panel-content">
        <h2>Instructor Profile</h2>
        {/* {formData.instructorAvatar && (
          <img src={formData.instructorAvatar} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 16 }} />
        )} */}
        {(!editMode) && (
          <button type="button" onClick={() => setEditMode(true)} style={{ marginBottom: 12 }}>Edit</button>
        )}
        <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
          <div className="input-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="text" name="password" value={formData.password} onChange={handleChange} disabled={!editMode} />
          </div>
         < div className="input-group">
            <label>Stripe Account ID</label>
            <input type="text" name="stripeAccountId" value={formData.stripeAccountId} onChange={handleChange} disabled={!editMode} />
          </div>

          <div className="input-group">
            <label>Avatar URL</label>
            <input type="text" name="instructorAvatar" value={formData.instructorAvatar} onChange={handleChange} disabled={!editMode} />
          </div>

          <div className="input-group">
            <label>Verified</label>
            <input type="text" value={formData.verifiedInstructor ? 'Yes' : 'No'} disabled />
          </div>
          <div className="input-group">
            <label>Created At</label>
            <input type="text" value={formData.createdAt ? new Date(formData.createdAt).toLocaleString() : ''} disabled />
          </div>
          {message && <div style={{ color: message.includes('success') ? 'green' : 'red', marginBottom: 8 }}>{message}</div>}
          {editMode && (
            <button type="submit">Update</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile; 