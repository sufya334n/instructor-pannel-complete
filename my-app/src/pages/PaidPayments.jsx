

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPaidPayouts } from '../services/instructorAuth';
import '../styles/PaidPayments.css';

const PaidPayments = ({ instructorId: propInstructorId }) => {
  const { instructorId: paramInstructorId } = useParams();
  const instructorId = propInstructorId || paramInstructorId;
  const [paidPayouts, setPaidPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!instructorId) {
      setError("Instructor ID is missing.");
      setLoading(false);
      return;
    }

    const fetchPaidPayouts = async () => {
      try {
        const response = await getPaidPayouts(instructorId);
        const { paidPayouts } = response;
        console.log("✅ Fetched paid payouts:", paidPayouts);
        setPaidPayouts(paidPayouts);
      } catch (err) {
        console.error("❌ Error fetching payouts:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPaidPayouts();
  }, [instructorId]);

  if (loading) {
    return <div>Loading paid payouts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!paidPayouts || paidPayouts.length === 0) {
    return <div className="no-items-message">No paid payouts found.</div>;
  }

  return (
    <div className="paid-payments-container">
      <h4 className="paid-payments-header">Paid Payout Batches</h4>
      <div className="scroll">
      {
        paidPayouts.map((batch) => (
          <div key={batch._id} className="batch-details">
            {/* <p><strong>Batch ID:</strong> {batch._id}</p> */}
            {/* <p><strong>Platform Cut:</strong> ${batch.platformCut?.toFixed(2) || 'N/A'}</p> */}
            <p><strong>Instructor Amount:</strong> ${batch.instructorAmount?.toFixed(2) || 'N/A'}</p>
            <p><strong>Payout Date:</strong> {new Date(batch.payoutAt).toLocaleDateString()}</p>
            {/* <p><strong>Total Amount:</strong> ${batch.items.reduce((total, item) => total + item.amount, 0).toFixed(2)}</p> */}
            <p><strong>Number of Transactions:</strong> {batch.items.length}</p>
            <div className="transaction-list">
              <h4>Transactions:</h4>
              {
                batch.items && batch.items.length > 0 ? (
                  <table className="transaction-table">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Student</th>
                        <th>Amount</th>
                        <th>Paid At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        batch.items.map(item => (
                          <tr key={item._id}>
                            <td>{item.courseTitle}</td>
                            <td>{item.studentName}</td>
                            <td>${item.amount.toFixed(2)}</td>
                            <td>{new Date(item.paidAt).toLocaleString()}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                ) : (
                  <p>No transactions found for this batch.</p>
                )
              }
            </div>
          </div>
        ))
      }
</div>

    </div>
  );
};

export default PaidPayments;
