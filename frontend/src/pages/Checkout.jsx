import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("cash_on_delivery");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoadingCart(true);
        setError("");

        const response = await api.get("/cart");

        const cartData =
          response.data?.cart || response.data;

        setCart(cartData);
      } catch (error) {
        console.error(
          "Failed to load cart:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load your cart."
        );
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setShippingAddress((currentAddress) => ({
      ...currentAddress,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    try {
      setPlacingOrder(true);
      setError("");

      const response = await api.post("/orders", {
        shippingAddress,
        paymentMethod,
      });

      console.log(
        "Order creation response:",
        response.data
      );

      const order = response.data?.order;

      if (!order?._id) {
        throw new Error(
          "Order was created but no order ID was returned."
        );
      }

      navigate(`/orders/${order._id}`);
    } catch (error) {
      console.error(
        "Failed to place order:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to place order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loadingCart) {
    return (
      <div className="products-state">
        <h2>Loading checkout...</h2>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="products-state">
        <h2>Unable to load checkout</h2>

        <p>{error}</p>

        <Link
          to="/cart"
          className="hero-button"
        >
          Back to Cart
        </Link>
      </div>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="products-state">
        <h2>Your cart is empty</h2>

        <p>
          Add products to your cart before checking
          out.
        </p>

        <Link
          to="/products"
          className="hero-button"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const total = items.reduce((sum, item) => {
    const price = Number(
      item.product?.price || 0
    );

    const quantity = Number(
      item.quantity || 0
    );

    return sum + price * quantity;
  }, 0);

  const totalQuantity = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0),
    0
  );

  return (
    <main className="checkout-page">
      <div className="checkout-header">
        <div>
          <p className="section-label">
            CHECKOUT
          </p>

          <h1>Complete Your Order</h1>
        </div>

        <Link
          to="/cart"
          className="continue-shopping"
        >
          ← Back to Cart
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form
        className="checkout-layout"
        onSubmit={handlePlaceOrder}
      >
        <div className="checkout-form-card">
          <div className="checkout-section">
            <h2>Shipping Address</h2>

            <div className="checkout-grid">
              <div className="form-group">
                <label htmlFor="fullName">
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={
                    shippingAddress.fullName
                  }
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={
                    shippingAddress.phone
                  }
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="addressLine">
                Address
              </label>

              <input
                id="addressLine"
                name="addressLine"
                type="text"
                value={
                  shippingAddress.addressLine
                }
                onChange={handleInputChange}
                placeholder="House number, street, area"
                required
              />
            </div>

            <div className="checkout-grid">
              <div className="form-group">
                <label htmlFor="city">
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={
                    shippingAddress.city
                  }
                  onChange={handleInputChange}
                  placeholder="City"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">
                  State
                </label>

                <input
                  id="state"
                  name="state"
                  type="text"
                  value={
                    shippingAddress.state
                  }
                  onChange={handleInputChange}
                  placeholder="State"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">
                Postal Code
              </label>

              <input
                id="postalCode"
                name="postalCode"
                type="text"
                value={
                  shippingAddress.postalCode
                }
                onChange={handleInputChange}
                placeholder="Postal code"
                required
              />
            </div>
          </div>

          <div className="checkout-section">
            <h2>Payment Method</h2>

            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={
                    paymentMethod ===
                    "cash_on_delivery"
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                />

                <div>
                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order arrives.
                  </span>
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={
                    paymentMethod === "online"
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                />

                <div>
                  <strong>
                    Online Payment
                  </strong>

                  <span>
                    Online payment integration
                    coming soon.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-items">
            {items.map((item) => (
              <div
                className="checkout-item"
                key={item.product?._id}
              >
                <div>
                  <strong>
                    {item.product?.name}
                  </strong>

                  <span>
                    Qty: {item.quantity}
                  </span>
                </div>

                <strong>
                  ₹
                  {(
                    Number(
                      item.product?.price || 0
                    ) *
                    Number(item.quantity || 0)
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Total Quantity</span>

            <span>{totalQuantity}</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>

            <strong>
              ₹{total.toLocaleString("en-IN")}
            </strong>
          </div>

          <button
            type="submit"
            className="place-order-button"
            disabled={placingOrder}
          >
            {placingOrder
              ? "Placing Order..."
              : "Place Order"}
          </button>
        </aside>
      </form>
    </main>
  );
};

export default Checkout;