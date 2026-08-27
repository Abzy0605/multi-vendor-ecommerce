import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          MultiShop
        </Link>

        <div className="navbar-links">
          <Link to="/">Home</Link>

          {user?.role === "customer" && (
            <>
              <Link to="/cart">Cart</Link>
              <Link to="/orders">My Orders</Link>
            </>
          )}

          {user?.role === "vendor" && (
            <Link to="/vendor">Vendor Dashboard</Link>
          )}

          {user?.role === "admin" && (
            <Link to="/admin">Admin Dashboard</Link>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <span className="navbar-user">
                Hi, {user.name}
              </span>

              <button
                className="navbar-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-login">
                Login
              </Link>

              <Link to="/register" className="navbar-register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;