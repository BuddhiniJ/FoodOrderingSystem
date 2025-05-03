import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import MainLayout from "../layout/MainLayout";

const MenuPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({});
  const [popupItem, setPopupItem] = useState(null);

  const RESTAURANT_API = import.meta.env.VITE_RESTAURANT_SERVICE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, menuRes] = await Promise.all([
          axios.get(`${RESTAURANT_API}/restaurants/${id}`),
          axios.get(`${RESTAURANT_API}/restaurants/menu/${id}`),
        ]);
        setRestaurant(restaurantRes.data);
        setMenuItems(menuRes.data);

        // Initialize form state for each item
        const initialForm = {};
        menuRes.data.forEach((item) => {
          initialForm[item._id] = { quantity: 1, note: "" };
        });
        setFormState(initialForm);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (itemId, field, value) => {
    setFormState((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  const handleAdd = (item) => {
    const { quantity, note } = formState[item._id] || { quantity: 1, note: "" };

    addToCart({
      ...item,
      quantity,
      note,
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
    });

    setPopupItem(item); // Show modal
  };

  const closePopup = () => setPopupItem(null);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <MainLayout>
      <div className="menu-container">
        <div className="restaurant-header">
          <h1 className="menu-title">{restaurant.name} - Menu</h1>
        </div>

        <div className="menu-items-grid">
          {menuItems.map((item) => (
            <div key={item._id} className="menu-item-card">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="menu-item-image"
                />
              )}
              <div className="menu-item-content">
                <h2 className="menu-item-name">{item.name}</h2>
                <p className="menu-item-description">{item.description}</p>
                <p className="menu-item-price">Rs. {item.price}</p>

                <div className="form-group-rest">
                  <label className="form-label">Qty:</label>
                  <input
                    type="number"
                    min={1}
                    value={formState[item._id]?.quantity || 1}
                    onChange={(e) =>
                      handleChange(item._id, "quantity", Number(e.target.value))
                    }
                    className="quantity-input-rest"
                  />
                </div>

                <textarea
                  className="note-textarea-rest"
                  rows={2}
                  placeholder="Special instructions (optional)"
                  value={formState[item._id]?.note || ""}
                  onChange={(e) =>
                    handleChange(item._id, "note", e.target.value)
                  }
                />

                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAdd(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Popup Modal */}
        {popupItem && (
          <div className="rest-modal-overlay">
            <div className="rest-modal-content">
              <h2 className="rest-modal-title">Item added to cart!</h2>
              <p className="rest-modal-item-name">{popupItem.name}</p>
              <div className="rest-modal-buttons">
                <button onClick={() => navigate("/cart")} className="cart-btn">
                  Go to Cart
                </button>
                <button onClick={closePopup} className="close-btn-rest">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MenuPage;
