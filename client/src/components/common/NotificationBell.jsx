import React, { useContext, useState } from "react";
import { DeliveryNotificationContext } from "../../context/DeliveryNotificationContext";
import { FaBell } from "react-icons/fa";

const NotificationBell = () => {
  const { notifications, unreadCount, markAllRead } = useContext(
    DeliveryNotificationContext
  );
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", marginRight: "1.5rem" }}>
      <button
        style={{ background: "none", border: "none", position: "relative" }}
        onClick={() => {
          setOpen((o) => !o);
          markAllRead();
        }}
      >
        <FaBell size={24} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "2.5rem",
            width: "320px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 100,
          }}
        >
          <div style={{ maxHeight: "350px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "1rem", textAlign: "center" }}>
                No notifications
              </div>
            ) : (
              notifications.map((n, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "0.8rem",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                  }}                 
                >
                  <div style={{ fontWeight: "bold" }}>{n.title}</div>
                  <div style={{ fontSize: "0.95em", color: "#444" }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: "0.8em", color: "#888" }}>
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
