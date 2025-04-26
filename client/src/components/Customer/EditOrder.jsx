import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';


const EditOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5004/api/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (index, field, value) => {
    const updatedItems = [...order.items];
    updatedItems[index][field] = value;
    setOrder({ ...order, items: updatedItems });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5004/api/orders/${id}`, order);
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
  

  if (loading) return <div>Loading...</div>;
  if (!order || order.status !== 'pending') return <div>Order cannot be modified</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Edit Order</h2>
      {order.items.map((item, index) => (
        <div key={index} className="mb-4 border p-3 rounded shadow">
          <p className="font-semibold">{item.name}</p>
          <input
            type="number"
            value={item.quantity}
            onChange={e => handleChange(index, 'quantity', parseInt(e.target.value))}
            className="border p-1 w-20"
          />
          <textarea
            value={item.note}
            onChange={e => handleChange(index, 'note', e.target.value)}
            className="w-full mt-2 border p-2"
            placeholder="Special instructions"
          />
        </div>
      ))}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditOrderPage;
