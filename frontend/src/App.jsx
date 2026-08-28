import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import VendorDashboard from "./pages/VendorDashboard";
import VendorOrders from "./pages/VendorOrders";
import VendorProducts from "./pages/VendorProducts";
import AdminDashboard from "./pages/AdminDashboard";

const ProtectedRoute = ({
  children,
  allowedRoles,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-label">
            WELCOME TO MULTISHOP
          </p>

          <h1>
            Everything you need,
            <br />
            from trusted vendors.
          </h1>

          <p className="hero-description">
            Discover products from multiple vendors,
            add them to your cart, and shop with ease.
          </p>

          <Link
            to="/products"
            className="hero-button"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      <section className="products-section">
        <div className="section-heading">
          <div>
            <p className="section-label">
              MARKETPLACE
            </p>

            <h2>Shop with confidence</h2>
          </div>

          <p>
            {user
              ? `Welcome back, ${user.name}`
              : "Quality products from trusted vendors"}
          </p>
        </div>

        <div className="home-shopping-card">
          <div>
            <h3>
              Discover our marketplace
            </h3>

            <p>
              Browse products from multiple vendors
              and find everything you need in one
              place.
            </p>
          </div>

          <Link
            to="/products"
            className="hero-button"
          >
            Browse Products
          </Link>
        </div>
      </section>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/:productId"
            element={<ProductDetails />}
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute
                allowedRoles={["customer"]}
              >
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute
                allowedRoles={["customer"]}
              >
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute
                allowedRoles={["customer"]}
              >
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute
                allowedRoles={["customer"]}
              >
                <OrderDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/vendor"
            element={
              <ProtectedRoute
                allowedRoles={["vendor"]}
              >
                <VendorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor/orders"
            element={
              <ProtectedRoute
                allowedRoles={["vendor"]}
              >
                <VendorOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor/products"
            element={
              <ProtectedRoute
                allowedRoles={["vendor"]}
              >
                <VendorProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;