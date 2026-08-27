import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/orders/${id}`
        );

        console.log(
          "Order details response:",
          response.data
        );

        setOrder(response.data?.order || null);
      } catch (error) {
        console.error(
          "Failed to load order:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="products-state">
        <h2>Loading order...</h2>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="products-state">
        <h2>Order not found</h2>

        <p>
          {error || "This order could not be found."}
        </p>

        <Link
          to="/orders"
          className="hero-button"
        >
          Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <main className="order-details-page">
      <div className="order-details-header">
        <div>
          <p className="section-label">
            ORDER DETAILS
          </p>

          <h1>Order #{order._id}</h1>
        </div>

        <Link
          to="/orders"
          className="continue-shopping"
        >
          ← Back to My Orders
        </Link>
      </div>

      <div className="order-details-grid">
        <div className="order-details-main">
          <section className="order-detail-card">
            <div className="order-detail-card-header">
              <h2>Order Status</h2>

              <span
                className={`order-status status-${order.status}`}
              >
                {order.status}
              </span>
            </div>

            <div className="order-status-info">
              <div>
                <span>Order Date</span>

                <strong>
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </strong>
              </div>

              <div>
                <span>Payment Method</span>

                <strong>
                  {order.paymentMethod ===
                  "cash_on_delivery"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </strong>
              </div>

              <div>
                <span>Payment Status</span>

                <strong>
                  {order.paymentStatus}
                </strong>
              </div>
            </div>
          </section>

          <section className="order-detail-card">
            <h2>Items</h2>

            <div className="order-detail-items">
              {order.items.map(
                (item, index) => (
                  <div
                    className="order-detail-item"
                    key={`${item.product?._id || item.name}-${index}`}
                  >
                    <div className="order-detail-image">
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.name}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>

                    <div className="order-detail-product">
                      <span className="product-category">
                        {item.product?.category ||
                          "Product"}
                      </span>

                      <h3>{item.name}</h3>

                      <p>
                        ₹
                        {Number(
                          item.price
                        ).toLocaleString(
                          "en-IN"
                        )}{" "}
                        × {item.quantity}
                      </p>
                    </div>

                    <strong>
                      ₹
                      {Number(
                        item.subtotal
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>
                )
              )}
            </div>
          </section>

          <section className="order-detail-card">
            <h2>Shipping Address</h2>

            <div className="shipping-address">
              <strong>
                {order.shippingAddress.fullName}
              </strong>

              <span>
                {order.shippingAddress.phone}
              </span>

              <span>
                {order.shippingAddress.addressLine}
              </span>

              <span>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}
              </span>

              <span>
                {order.shippingAddress.postalCode}
              </span>
            </div>
          </section>
        </div>

        <aside className="order-details-sidebar">
          <div className="order-total-card">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items</span>

              <span>
                {order.items.reduce(
                  (sum, item) =>
                    sum +
                    Number(
                      item.quantity || 0
                    ),
                  0
                )}
              </span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>

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
        </aside>
      </div>
    </main>
  );
};

export default OrderDetails;