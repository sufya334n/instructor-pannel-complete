import React, { useState } from 'react';
import '../styles/Auth.css';
import { instructorSignup } from '../services/instructorAuth';
import { useNavigate } from 'react-router-dom';

const Signup = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (!name || !email || !password || !confirm) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    } else if (password !== confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    const result = await instructorSignup({ name, email, password });
    setLoading(false);
    if (result.message && result.message.toLowerCase().includes('successful')) {
      setSuccess(result.message);
      setError('');
      setName('');
      setEmail('');
      setPassword('');
      setConfirm('');
      alert('Signup successful! Please wait for admin verification. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } else if (result.message) {
      setError(result.message);
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-bg">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Instructor Sign Up</h2>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
        <button type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
        <div className="auth-link">
          Already have an account? <a href="/login">Login</a>
        </div>
      </form>
    </div>
  );
};

export default Signup; 