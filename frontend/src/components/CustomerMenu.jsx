import React, { useEffect, useState } from 'react';
import axiosMenu from '../api/restaurantAPI';
import axiosOrder from '../api/orderAPI';

const CustomerMenu = ({ restaurant }) => {
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        axiosMenu.get('/menu').then(res => {
            const filtered = res.data.filter(item => item.restaurantId === restaurant._id && item.isAvailable);
            setMenu(filtered);
        });
    }, [restaurant]);

    const toggleCart = (item) => {
        const exists = cart.find((i) => i._id === item._id);
        if (exists) {
            setCart(cart.filter((i) => i._id !== item._id));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const updateQuantity = (id, qty) => {
        setCart(cart.map(item =>
            item._id === id ? { ...item, quantity: parseInt(qty) || 1 } : item
        ));
    };


    const placeOrder = async () => {
        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        await axiosOrder.post('/orders', {
            customerId: 'TEMP_CUSTOMER', // replace later with logged-in user
            restaurantId: restaurant._id,
            items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
            totalAmount
        });
        alert('Order placed!');
        setCart([]);
    };

    return (
        <div>
            <h2>{restaurant.name} Menu</h2>
            <ul>
                {menu.map(item => (
                    <li key={item._id}>
                        {item.name} - Rs.{item.price} <br />
                        {item.description}
                        <button onClick={() => toggleCart(item)}>
                            {cart.some(i => i._id === item._id) ? 'Remove' : 'Add to Cart'}
                        </button>
                    </li>
                ))}
            </ul>
            {cart.length > 0 && (
                <>
                    <h3>Cart</h3>
                    <ul>
                        {cart.map(item => (
                            <li key={item._id}>
                                {item.name} - Rs.{item.price} ×
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={e => updateQuantity(item._id, e.target.value)}
                                    style={{ width: '60px', margin: '0 10px' }}
                                />
                                = Rs.{item.price * item.quantity}
                            </li>
                        ))}
                    </ul>
                    <h4>Total: Rs.{cart.reduce((sum, i) => sum + i.price * i.quantity, 0)}</h4>
                    <button onClick={placeOrder}>Place Order</button>
                </>
            )}

        </div>
    );
};

export default CustomerMenu;
