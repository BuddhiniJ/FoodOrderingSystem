// src/pages/Customer/CartPage.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import MainLayout from '../layout/MainLayout';
import Swal from 'sweetalert2';
import { useEffect } from 'react'; // make sure this is imported


const CartPage = () => {
  const { cart, clearCart } = useCart();
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ For navigation

  // Group items by restaurant
  const groupedByRestaurant = cart.reduce((acc, item) => {
    const restId = item.restaurantId;
    if (!acc[restId]) {
      acc[restId] = {
        restaurantName: item.restaurantName,
        restaurantId: restId,
        items: [],
      };
    }
    acc[restId].items.push(item);
    return acc;
  }, {});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
 

  const placeOrder = async () => {
    try {
      const orderPromises = Object.values(groupedByRestaurant).map(async group => {
        const reference = uuidv4().slice(0, 8).toUpperCase();
        const order = {
          reference,
          restaurantId: group.restaurantId,
          customerId: user?._id || user?.id || 'guest',
          items: group.items.map(i => ({
            itemId: i._id,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            note: i.note
          })),
          totalAmount: group.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        };

        await axios.post('http://localhost:5004/api/orders', order);
        return reference;
      });

      const references = await Promise.all(orderPromises);
      clearCart();
      Swal.fire({
        title: 'Success!',
        text: `Orders placed successfully. References: ${references.join(', ')}`,
        icon: 'success',
        confirmButtonText: 'View My Orders',
      }).then(() => {
        navigate('/myorders');
      });

    } catch (err) {
      console.error(err);

      // ❌ SweetAlert2 error modal
      Swal.fire({
        title: 'Error',
        text: 'Failed to place orders. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <MainLayout>

      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">Your Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <button
              onClick={() => navigate('/restaurantsList')}
              className="browse-btn-rest"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <>
            {Object.values(groupedByRestaurant).map(group => (
              <div key={group.restaurantId} className="order-group-rest">
                <div className="restaurant-banner">
                  <h2 className="restaurant-name">{group.restaurantName}</h2>
                </div>
                <ul className="items-list">
                  {group.items.map((item, index) => (
                    <li key={index} className="cart-item">
                      <div className="item-details">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">x {item.quantity}</span>
                      </div>
                      <div className="item-price">Rs. {item.price * item.quantity}</div>
                      {item.note && <div className="item-note">{item.note}</div>}
                    </li>
                  ))}
                </ul>
                <div className="group-total">
                  <span>Total</span>
                  <span>Rs. {group.items.reduce((sum, i) => sum + i.price * i.quantity, 0)}</span>
                </div>
              </div>
            ))}

            <div className="cart-actions">
              <button
                onClick={() => navigate('/restaurantsList')}
                className="continue-btn-rest"
              >
                Continue Shopping
              </button>
              <button
                onClick={placeOrder}
                className="place-order-btn"
              >
                Place Orders
              </button>
            </div>
          </>
        )}
      </div>
    </MainLayout>

  );
};

export default CartPage;
