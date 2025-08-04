import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPaidPayouts } from '../services/instructorAuth';
import '../styles/PaidPayments.css';

const PaidPayoutDetails = ({ instructorId: propInstructorId }) => {
  const { instructorId: paramInstructorId, batchId } = useParams();
  const instructorId = propInstructorId || paramInstructorId;
  const [batchDetails, setBatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      if (!instructorId) {
        setError("Instructor ID is missing.");
        setLoading(false);
        return;
      }
      try {
        const response = await getPaidPayouts(instructorId);
        const foundBatch = response.data.paidPayouts.find(batch => batch._id === batchId);
        if (foundBatch) {
          setBatchDetails(foundBatch);
        } else {
          setError('Batch not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBatchDetails();
  }, [instructorId, batchId]);

  if (loading) {
    return <div>Loading batch details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!batchDetails) {
    return <div className="no-items-message">No batch details found.</div>;
  }

  return (
    <div className="paid-payments-container">
      <h1 className="paid-payments-header">Paid Payout Batch Details</h1>
      <div className="batch-details">
        <p><strong>Batch ID:</strong> {batchDetails._id}</p>
        <p><strong>Platform Cut:</strong> ${batchDetails.platformCut ? batchDetails.platformCut.toFixed(2) : 'N/A'}</p>
        <p><strong>Payout Date:</strong> {new Date(batchDetails.payoutAt).toLocaleDateString()}</p>
      </div>

      <h2 className="paid-payments-header">Items in this Batch:</h2>
      <div className="items-table-container">
        {batchDetails.items && batchDetails.items.length > 0 ? (
          <table className="items-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Student</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {batchDetails.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.courseTitle}</td>
                  <td>{item.studentName}</td>
                  <td>${item.amount ? item.amount.toFixed(2) : 'N/A'}</td>
                  <td>
                    {item.paidAt && !isNaN(new Date(item.paidAt)) 
                      ? new Date(item.paidAt).toLocaleDateString()
                      : 'Invalid Date'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items in this batch.</p>
        )}
      </div>
    </div>
  );
};

export default PaidPayoutDetails;