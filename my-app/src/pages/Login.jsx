import React, { useState } from 'react';
import '../styles/Auth.css';
import { instructorLogin } from '../services/instructorAuth';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!email || !password) {
      setError('Please enter email and password');
      setLoading(false);
      return;
    }
    const result = await instructorLogin({ email, password });
    setLoading(false);
    if (result.user) {
      onLogin(result.user.id, result.user.name); // Pass instructorId and name to parent
    } else if (result.message) {
      if (result.message === 'Your account is not verified by admin.') {
        navigate('/wait-for-approval');
      } else {
        setError(result.message);
      }
    } else {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-bg">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Instructor Login</h2>
        {error && <div className="auth-error">{error}</div>}
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
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        <div className="auth-link">
          Don&apos;t have an account? <a href="/signup">Sign Up</a>
        </div>
      </form>
    </div>
  );
};

export default Login; 