import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, isAuthenticated, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Food Delivery Platform</Link>
      </div>
      <div className="navbar-menu">
        {isAuthenticated ? (
          <>
            <span className="welcome-text">Welcome, {user.name}</span>
            {user.role === "delivery-personnel" && (
              <NotificationBell />
            )}
            <Link to="/profile">Profile</Link>
            {user.role === "restaurant-admin" && (
              <Link to="/admin/users">Manage Users</Link>
            )}
            {user.role === "restaurant-admin" && (
              <Link to="/my-restaurants">My Restaurants</Link>
            )}

            {user.role === "restaurant-admin" && (
              <Link to="/resturants-payments">My Payments</Link>
            )}
            {user.role === "customer" && (
              <Link to="/cart" className="nav-link">
                {" "}
                Cart{" "}
              </Link>
            )}
            {user.role === "customer" && (
              <Link to="/myorders" className="nav-link">
                {" "}
                My Orders{" "}
              </Link>
            )}

            {user.role === "customer" && (
              <Link to="/my-payments" className="nav-link">
                {" "}
                My Payments{" "}
              </Link>
            )}

            {user.role === "customer" && (
              <Link to="/track-order" className="nav-link">
                {" "}
                Tracker{" "}
              </Link>
            )}
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
