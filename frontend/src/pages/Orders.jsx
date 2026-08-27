import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/orders/my-orders"
        );

        console.log(
          "Orders API response:",
          response.data
        );

        setOrders(response.data?.orders || []);
      } catch (error) {
        console.error(
          "Failed to load orders:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="products-state">
        <h2>Loading your orders...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-state">
        <h2>Could not load orders</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-header">
        <div>
          <p className="section-label">
            ORDER HISTORY
          </p>

          <h1>My Orders</h1>
        </div>

        <Link
          to="/products"
          className="continue-shopping"
        >
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="products-state">
          <h2>No orders yet</h2>

          <p>
            Your completed orders will appear here.
          </p>

          <Link
            to="/products"
            className="hero-button"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div
              className="order-card"
              key={order._id}
            >
              <div className="order-card-header">
                <div>
                  <span className="order-label">
                    ORDER ID
                  </span>

                  <strong>
                    {order._id}
                  </strong>
                </div>

                <span
                  className={`order-status status-${order.status}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-card-body">
                <div className="order-products">
                  {order.items.map(
                    (item, index) => (
                      <div
                        className="order-product"
                        key={`${order._id}-${index}`}
                      >
                        <div>
                          <strong>
                            {item.name}
                          </strong>

                          <span>
                            Qty: {item.quantity}
                          </span>
                        </div>

                        <span>
                          ₹
                          {Number(
                            item.subtotal
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>
                    )
                  )}
                </div>

                <div className="order-summary">
                  <span>
                    {order.items.length}{" "}
                    {order.items.length === 1
                      ? "product"
                      : "products"}
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
              </div>

              <div className="order-card-footer">
                <span>
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
                </span>

                <Link
                  to={`/orders/${order._id}`}
                  className="view-order-button"
                >
                  View Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Orders;