import React, { useEffect, useState } from 'react';
import { getPendingPayouts } from '../services/instructorAuth';
import '../styles/PendingPayments.css';

const PendingPayments = ({ instructorId }) => {
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!instructorId) {
      setError('Instructor ID not found. Please log in again.');
      console.error('Instructor ID is missing.');
      return;
    }

    const fetchPendingPayouts = async () => {
      try {
        setError('');
        console.log('Fetching pending payouts for instructorId:', instructorId);
        const data = await getPendingPayouts(instructorId);
        setPendingPayouts(data.payouts);
        setSummary(data.summary);
      } catch (err) {
        console.error('Error fetching pending payouts:', err);
        setError('Failed to fetch pending payouts. Please try again later.');
      }
    };

    fetchPendingPayouts();
  }, [instructorId]);

  if (error) {
    return <div className="pending-payments-container"><p className="error-message">{error}</p></div>;
  }

  if (!summary) {
    return <div className="pending-payments-container"><p>Loading pending payouts...</p></div>;
  }

  return (
    <div className="pending-payments-container">
      <h1>Pending Payments</h1>

      <div className="summary-section">
        <h3>Payout Summary</h3>
        
        <p><strong>  Total Amount:</strong> ${summary.totalAmount.toFixed(2)}</p>
        <p><strong>Instructor Amount:</strong> ${summary.instructorAmount.toFixed(2)}</p>
        <p><strong>Platform Fee: </strong>${summary.platformFee.toFixed(2)}</p>
        <p><strong>Commission Rate:</strong> {summary.commissionRate}%</p>
        
        <p><strong>Pending Payouts:</strong> {pendingPayouts.length}</p>
      </div>

      <span className='detailheading'>Details</span>
      {pendingPayouts.length === 0 ? (
        <p>No pending payouts found.</p>
      ) : (
        <div className="payouts-list">
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Student</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayouts.map((payout) => (
                <tr key={payout._id}>
                  <td>{payout.courseTitle}</td>
                  <td>{payout.studentName}</td>
                  <td>${payout.amount.toFixed(2)}</td>
                  <td>{new Date(payout.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingPayments;
