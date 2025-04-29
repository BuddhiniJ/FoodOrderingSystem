import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import MainLayout from "../layout/MainLayout";
import "./MyPayments.css";

const MyPayments = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5006/api/payments/user/${user._id}`
        );
        setPayments(response.data);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchPayments();
    }
  }, [user]);

  const handleDelete = async () => {
    if (!selectedPayment) return;

    setDeleting(true);
    try {
      await axios.delete(
        `http://localhost:5006/api/payments/${selectedPayment._id}`
      );
      setPayments(
        payments.filter((payment) => payment._id !== selectedPayment._id)
      );
      setSelectedPayment(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete payment:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <MainLayout>
      <div className="payments-container">
        <div className="payments-header">
          <h2>My Payments</h2>
          <div className="payment-count-badge">
            {payments.length} {payments.length === 1 ? "Payment" : "Payments"}
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24">
              <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
            </svg>
            <h3>No Payments Found</h3>
            <p>You haven't made any payments yet.</p>
          </div>
        ) : (
          <div className="payments-layout">
            {/* Payments List */}
            <div className="payments-list">
              {payments.map((payment) => (
                <div
                  key={payment._id}
                  className={`payment-card ${
                    selectedPayment?._id === payment._id ? "active" : ""
                  }`}
                  onClick={() => setSelectedPayment(payment)}
                >
                  <div className="payment-card-header">
                    <span className="order-id">
                      Order #{payment.orderId.slice(0, 8)}...
                    </span>
                    <span
                      className={`payment-status ${payment.paymentStatus.toLowerCase()}`}
                    >
                      {payment.paymentStatus}
                    </span>
                  </div>
                  <div className="payment-card-body">
                    <div className="payment-amount">
                      Rs. {payment.amount.toLocaleString()}
                    </div>
                    <div className="payment-method">
                      <span className="method-icon">
                        {payment.paymentMethod === "card" ? (
                          <svg viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                          </svg>
                        )}
                      </span>
                      {payment.paymentMethod}
                    </div>
                  </div>
                  <div className="payment-card-footer">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Details */}
            <div className="payment-details-panel">
              {selectedPayment ? (
                <>
                  <div className="details-panel-header">
                    <h3>Payment Details</h3>
                    <span
                      className={`payment-status ${selectedPayment.paymentStatus.toLowerCase()}`}
                    >
                      {selectedPayment.paymentStatus}
                    </span>
                  </div>

                  <div className="details-grid">
                    <div className="detail-row">
                      <span className="detail-label">Payment ID:</span>
                      <span className="detail-value">
                        {selectedPayment._id}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Order ID:</span>
                      <span className="detail-value">
                        {selectedPayment.orderId}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value">
                        Rs. {selectedPayment.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Payment Method:</span>
                      <span className="detail-value">
                        <span className="method-icon">
                          {selectedPayment.paymentMethod === "card" ? (
                            <svg viewBox="0 0 24 24">
                              <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                            </svg>
                          )}
                        </span>
                        {selectedPayment.paymentMethod}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Currency:</span>
                      <span className="detail-value">
                        {selectedPayment.currency.toUpperCase()}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Stripe Payment ID:</span>
                      <span className="detail-value">
                        {selectedPayment.stripePaymentId}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">
                        {new Date(selectedPayment.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="payment-actions">
                    <button
                      className="btn btn-delete"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={deleting}
                    >
                      {deleting ? (
                        <>
                          <span className="spinner-small"></span>
                          Deleting...
                        </>
                      ) : (
                        "Delete Payment"
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="select-prompt">
                  <svg viewBox="0 0 24 24">
                    <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
                  </svg>
                  <p>Select a payment to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Confirm Deletion</h3>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this payment record?</p>
                <p className="warning-message">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <span className="spinner-small"></span>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyPayments;
