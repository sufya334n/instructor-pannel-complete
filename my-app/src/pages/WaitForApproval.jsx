import React from 'react';
import './Auth.css';

const WaitForApproval = () => (
  <div className="auth-bg">
    <div className="auth-form">
      <h2>Account Pending Approval</h2>
      <p>Your account has been created but is not yet verified by admin.<br/>Please wait for admin approval before you can log in.</p>
    </div>
  </div>
);

export default WaitForApproval; 