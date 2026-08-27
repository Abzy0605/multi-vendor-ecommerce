import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders/vendor");

      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error("Failed to load vendor orders:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load vendor orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingOrder(orderId);
      setError("");

      const response = await api.put(
        `/orders/${orderId}/status`,
        {
          status,
        }
      );

      const updatedOrder = response.data?.order;

      if (updatedOrder) {
        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  ...updatedOrder,
                }
              : order
          )
        );
      } else {
        await fetchOrders();
      }
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="products-state">
        <h2>Loading vendor orders...</h2>
      </div>
    );
  }

  return (
    <main className="vendor-orders-page">
      <div className="vendor-orders-header">
        <div>
          <p className="section-label">
            VENDOR PORTAL
          </p>

          <h1>Orders</h1>

          <p>
            View and manage orders containing your
            products.
          </p>
        </div>

        <Link
          to="/vendor"
          className="back-link"
        >
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="products-state">
          <h2>No orders yet</h2>

          <p>
            Orders containing your products will
            appear here.
          </p>
        </div>
      ) : (
        <div className="vendor-orders-page-list">
          {orders.map((order) => (
            <article
              className="vendor-full-order-card"
              key={order._id}
            >
              <div className="vendor-full-order-header">
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

              <div className="vendor-full-order-info">
                <div>
                  <span>Customer</span>

                  <strong>
                    {order.customer?.name ||
                      "Customer"}
                  </strong>

                  {order.customer?.email && (
                    <small>
                      {order.customer.email}
                    </small>
                  )}
                </div>

                <div>
                  <span>Order Date</span>

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

                <div>
                  <span>Payment</span>

                  <strong>
                    {order.paymentMethod ===
                    "cash_on_delivery"
                      ? "Cash on Delivery"
                      : "Online"}
                  </strong>

                  <small>
                    {order.paymentStatus}
                  </small>
                </div>

                <div>
                  <span>Total</span>

                  <strong>
                    ₹
                    {Number(
                      order.totalAmount
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              <div className="vendor-full-order-items">
                <h2>Order Items</h2>

                {order.items.map(
                  (item, index) => (
                    <div
                      className="vendor-full-order-item"
                      key={`${order._id}-${index}`}
                    >
                      <div>
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          Quantity: {item.quantity}
                        </span>
                      </div>

                      <div>
                        <span>
                          ₹
                          {Number(
                            item.price
                          ).toLocaleString(
                            "en-IN"
                          )}{" "}
                          × {item.quantity}
                        </span>

                        <strong>
                          ₹
                          {Number(
                            item.subtotal
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="vendor-shipping-section">
                <h2>Shipping Address</h2>

                <div className="vendor-shipping-address">
                  <strong>
                    {
                      order.shippingAddress
                        ?.fullName
                    }
                  </strong>

                  <span>
                    {
                      order.shippingAddress
                        ?.phone
                    }
                  </span>

                  <span>
                    {
                      order.shippingAddress
                        ?.addressLine
                    }
                  </span>

                  <span>
                    {
                      order.shippingAddress
                        ?.city
                    }
                    ,{" "}
                    {
                      order.shippingAddress
                        ?.state
                    }{" "}
                    -{" "}
                    {
                      order.shippingAddress
                        ?.postalCode
                    }
                  </span>
                </div>
              </div>

              <div className="vendor-status-section">
                <div>
                  <h2>
                    Update Order Status
                  </h2>

                  <p>
                    Change the current status of
                    this order.
                  </p>
                </div>

                <div className="vendor-status-actions">
                  {[
                    "confirmed",
                    "processing",
                    "shipped",
                    "delivered",
                    "cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={
                        order.status === status
                          ? "vendor-status-button active"
                          : "vendor-status-button"
                      }
                      disabled={
                        updatingOrder ===
                          order._id ||
                        order.status === status
                      }
                      onClick={() =>
                        updateStatus(
                          order._id,
                          status
                        )
                      }
                    >
                      {updatingOrder ===
                        order._id &&
                      order.status !==
                        status
                        ? "Updating..."
                        : status
                            .charAt(0)
                            .toUpperCase() +
                          status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default VendorOrders;