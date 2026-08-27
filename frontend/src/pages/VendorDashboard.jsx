import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const VendorDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        setError("");

        const [ordersResponse, productsResponse] =
          await Promise.all([
            api.get("/orders/vendor"),
            api.get("/products/vendor"),
          ]);

        setOrders(
          ordersResponse.data?.orders || []
        );

        setProducts(
          productsResponse.data?.products || []
        );
      } catch (error) {
        console.error(
          "Failed to load vendor dashboard:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load vendor dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const getStatusCount = (status) => {
    return orders.filter(
      (order) => order.status === status
    ).length;
  };

  if (loading) {
    return (
      <div className="products-state">
        <h2>
          Loading vendor dashboard...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-state">
        <h2>
          Could not load dashboard
        </h2>

        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="vendor-dashboard-page">
      <div className="vendor-dashboard-header">
        <div>
          <p className="section-label">
            VENDOR PORTAL
          </p>

          <h1>Vendor Dashboard</h1>

          <p>
            Manage your orders and products
            from one place.
          </p>
        </div>
      </div>

      <section className="vendor-stats-grid">
        <div className="vendor-stat-card">
          <span>Total Orders</span>

          <strong>
            {orders.length}
          </strong>
        </div>

        <div className="vendor-stat-card">
          <span>Confirmed</span>

          <strong>
            {getStatusCount("confirmed")}
          </strong>
        </div>

        <div className="vendor-stat-card">
          <span>Processing</span>

          <strong>
            {getStatusCount("processing")}
          </strong>
        </div>

        <div className="vendor-stat-card">
          <span>Shipped</span>

          <strong>
            {getStatusCount("shipped")}
          </strong>
        </div>

        <div className="vendor-stat-card">
          <span>Delivered</span>

          <strong>
            {getStatusCount("delivered")}
          </strong>
        </div>
      </section>

      <section className="vendor-dashboard-section">
        <div className="vendor-section-header">
          <div>
            <p className="section-label">
              PRODUCT MANAGEMENT
            </p>

            <h2>My Products</h2>
          </div>

          <Link
            to="/vendor/products"
            className="view-all-button"
          >
            Manage Products
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="products-state">
            <h2>
              No products yet
            </h2>

            <p>
              You haven't added any products
              to the marketplace.
            </p>

            <Link
              to="/vendor/products"
              className="hero-button"
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="vendor-products-preview-grid">
            {products
              .slice(0, 4)
              .map((product) => (
                <div
                  className="vendor-product-preview-card"
                  key={product._id}
                >
                  <div className="vendor-product-preview-image">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                    ) : (
                      <span>
                        No image
                      </span>
                    )}
                  </div>

                  <div className="vendor-product-preview-content">
                    <div className="vendor-product-preview-top">
                      <span className="product-category">
                        {product.category}
                      </span>

                      <span
                        className={
                          product.isActive
                            ? "vendor-product-active"
                            : "vendor-product-inactive"
                        }
                      >
                        {product.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <h3>
                      {product.name}
                    </h3>

                    <div className="vendor-product-preview-details">
                      <div>
                        <span>
                          Price
                        </span>

                        <strong>
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Stock
                        </span>

                        <strong>
                          {product.stock}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      <section className="vendor-dashboard-section">
        <div className="vendor-section-header">
          <div>
            <p className="section-label">
              RECENT ORDERS
            </p>

            <h2>Incoming Orders</h2>
          </div>

          <Link
            to="/vendor/orders"
            className="view-all-button"
          >
            View All Orders
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="products-state">
            <h2>
              No orders yet
            </h2>

            <p>
              Orders containing your products
              will appear here.
            </p>
          </div>
        ) : (
          <div className="vendor-orders-list">
            {orders
              .slice(0, 5)
              .map((order) => (
                <div
                  className="vendor-order-card"
                  key={order._id}
                >
                  <div className="vendor-order-main">
                    <div>
                      <span className="order-label">
                        ORDER ID
                      </span>

                      <strong className="vendor-order-id">
                        {order._id}
                      </strong>
                    </div>

                    <span
                      className={`order-status status-${order.status}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="vendor-order-info">
                    <div>
                      <span>
                        Customer
                      </span>

                      <strong>
                        {order.customer?.name ||
                          "Customer"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Items
                      </span>

                      <strong>
                        {order.items.length}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Order Total
                      </span>

                      <strong>
                        ₹
                        {Number(
                          order.totalAmount
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Date
                      </span>

                      <strong>
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="vendor-order-products">
                    {order.items.map(
                      (item, index) => (
                        <div
                          key={`${order._id}-${index}`}
                        >
                          <span>
                            {item.name}
                          </span>

                          <span>
                            ×{" "}
                            {item.quantity}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <Link
                    to={`/vendor/orders/${order._id}`}
                    className="view-order-button"
                  >
                    Manage Order
                  </Link>
                </div>
              ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default VendorDashboard;