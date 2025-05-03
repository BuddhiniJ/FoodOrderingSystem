import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

      const ORDER_API = import.meta.env.VITE_ORDER_SERVICE_URL;

  useEffect(() => {
    axios.get(`http://localhost:5004/api/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(err => {
        console.error(err);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load order details',
          icon: 'error',
          confirmButtonText: 'Go Back'
        }).then(() => {
          navigate('/myorders');
        });
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (index, field, value) => {
    const updatedItems = [...order.items];
    updatedItems[index][field] = value;
    setOrder({ ...order, items: updatedItems });
  };

  const handleCancel = () => {
    Swal.fire({
      title: 'Cancel changes?',
      text: 'Any changes will be lost',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go back',
      cancelButtonText: 'Continue editing'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/myorders');
      }
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`${ORDER_API}/orders/${id}`, order);
      Swal.fire({
        title: 'Success!',
        text: 'Your order has been updated.',
        icon: 'success',
        confirmButtonText: 'Go to Orders'
      }).then(() => {
        navigate('/myorders');
      });
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to update order.',
        icon: 'error',
        confirmButtonText: 'Okay'
      });
      console.error(err);
    }
  };

  if (loading) return <div className="editOrder-loadingState">Loading order details<span className="editOrder-loadingDots"></span></div>;
  if (!order) return <div className="editOrder-errorState">Order not found</div>;
  if (order.status !== 'pending') return <div className="editOrder-errorState">This order cannot be modified as it's already being processed.</div>;

  return (
    <div className="editOrder-container">
      <h2 className="editOrder-heading">
        Edit Order <span className="editOrder-orderNumber">#{order.orderNumber || id}</span>
      </h2>

      {order.items.map((item, index) => (
        <div key={index} className="editOrder-item">
          <p className="editOrder-itemName">{item.name}</p>

          <div className="editOrder-formGroup">
            <label className="editOrder-label">
              Quantity:
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={e => handleChange(index, 'quantity', parseInt(e.target.value) || 1)}
                className="editOrder-quantityInput"
              />
            </label>
          </div>

          <div className="editOrder-formGroup">
            <label className="editOrder-label">
              Special Instructions:
              <textarea
                value={item.note || ''}
                onChange={e => handleChange(index, 'note', e.target.value)}
                className="editOrder-noteTextarea"
                placeholder="Add any special requests here..."
              />
            </label>
          </div>
        </div>
      ))}

      <div className="editOrder-buttonContainer">
        <button
          className="editOrder-cancelButton"
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button
          className="editOrder-saveButton"
          onClick={handleSubmit}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditOrderPage;
