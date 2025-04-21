import React from 'react';
import { useCart } from '../../context/CartContext';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const CartPage = () => {
    const { cart, removeFromCart, clearCart, getTotal } = useCart();

    const placeOrder = async () => {
        const referenceNumber = uuidv4().slice(0, 8).toUpperCase();
        const restaurantInfo = cart[0]?.restaurant || {};

        const orderItems = cart.map(item => ({
            itemId: item.menuId,
            name: item.name,
            quantity: item.quantity,
            price: item.price
        }));

        const order = {
            reference: referenceNumber,
            customerId: 'TEMP_USER_1',
            restaurantId: restaurantInfo._id,
            items: orderItems,
            totalAmount: getTotal()
        };


        try {
            const res = await axios.post('http://localhost:5002/api/orders', order);
            alert(`Order placed successfully!\nReference: ${referenceNumber}`);
            clearCart();
        } catch (err) {
            console.error('Order error:', err?.response?.data || err.message);
            alert('Failed to place order');
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">🛒 Your Cart</h1>

            {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
            ) : (
                <>
                    <ul className="space-y-4">
                        {cart.map((item, index) => (
                            <li key={index} className="bg-white shadow p-4 rounded-lg flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    {item.instructions && (
                                        <p className="text-sm italic text-gray-400">Note: {item.instructions}</p>
                                    )}
                                    <p className="text-sm font-medium mt-1">Rs. {item.price} × {item.quantity} = Rs. {item.price * item.quantity}</p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.menuId)}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 border-t pt-4">
                        <p className="text-lg font-semibold">Total: Rs. {getTotal()}</p>
                        <button
                            onClick={placeOrder}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Place Order
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;