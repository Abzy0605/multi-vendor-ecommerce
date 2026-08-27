import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [removingProductId, setRemovingProductId] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart");

      const cartData =
        response.data?.cart || response.data;

      setCart(cartData);
    } catch (error) {
      console.error("Failed to load cart:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load your cart."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      setUpdatingProductId(productId);
      setError("");

      const response = await api.put("/cart", {
        productId,
        quantity: newQuantity,
      });

      const updatedCart =
        response.data?.cart || response.data;

      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to update cart:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update cart."
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  const increaseQuantity = (item) => {
    const currentQuantity = Number(item.quantity);
    const stock = Number(item.product?.stock || 0);

    if (currentQuantity >= stock) {
      setError(
        `Only ${stock} units are available for ${item.product?.name}.`
      );
      return;
    }

    updateQuantity(
      item.product._id,
      currentQuantity + 1
    );
  };

  const decreaseQuantity = (item) => {
    const currentQuantity = Number(item.quantity);

    if (currentQuantity <= 1) {
      return;
    }

    updateQuantity(
      item.product._id,
      currentQuantity - 1
    );
  };

  const removeItem = async (productId) => {
    try {
      setRemovingProductId(productId);
      setError("");

      const response = await api.delete(
        `/cart/${productId}`
      );

      const updatedCart =
        response.data?.cart || response.data;

      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to remove item:", error);

      setError(
        error.response?.data?.message ||
          "Failed to remove item from cart."
      );
    } finally {
      setRemovingProductId(null);
    }
  };

  const clearCart = async () => {
    try {
      setClearing(true);
      setError("");

      const response = await api.delete("/cart");

      const updatedCart =
        response.data?.cart || response.data;

      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to clear cart:", error);

      setError(
        error.response?.data?.message ||
          "Failed to clear cart."
      );
    } finally {
      setClearing(false);
    }
  };

  const goToCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="products-state">
        <h2>Loading your cart...</h2>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="products-state">
        <h2>Your cart is empty</h2>

        <Link
          to="/products"
          className="hero-button"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const items = cart.items || [];

  const total = items.reduce((sum, item) => {
    const price = Number(item.product?.price || 0);
    const quantity = Number(item.quantity || 0);

    return sum + price * quantity;
  }, 0);

  const totalQuantity = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0),
    0
  );

  return (
    <main className="cart-page">
      <div className="cart-header">
        <div>
          <p className="section-label">YOUR CART</p>

          <h1>Shopping Cart</h1>
        </div>

        <Link
          to="/products"
          className="continue-shopping"
        >
          Continue Shopping
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="products-state">
          <h2>Your cart is empty</h2>

          <p>
            Add some products before checking out.
          </p>

          <Link
            to="/products"
            className="hero-button"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => {
              const product = item.product;
              const productId = product?._id;

              const isUpdating =
                updatingProductId === productId;

              const isRemoving =
                removingProductId === productId;

              const currentQuantity =
                Number(item.quantity);

              const stock =
                Number(product?.stock || 0);

              return (
                <div
                  className="cart-item"
                  key={productId}
                >
                  <div className="cart-item-image">
                    {product?.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>

                  <div className="cart-item-details">
                    <span className="product-category">
                      {product?.category}
                    </span>

                    <h2>{product?.name}</h2>

                    <p>
                      ₹
                      {Number(
                        product?.price || 0
                      ).toLocaleString("en-IN")}
                    </p>

                    <span className="cart-item-quantity">
                      {stock} units available
                    </span>

                    <div className="cart-quantity-section">
                      <div className="quantity-control">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(item)
                          }
                          disabled={
                            isUpdating ||
                            currentQuantity <= 1
                          }
                        >
                          −
                        </button>

                        <span>
                          {isUpdating
                            ? "..."
                            : currentQuantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(item)
                          }
                          disabled={
                            isUpdating ||
                            currentQuantity >= stock
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="remove-cart-button"
                        onClick={() =>
                          removeItem(productId)
                        }
                        disabled={
                          isRemoving ||
                          isUpdating
                        }
                      >
                        {isRemoving
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">
                    ₹
                    {(
                      Number(product?.price || 0) *
                      currentQuantity
                    ).toLocaleString("en-IN")}
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              className="clear-cart-button"
              onClick={clearCart}
              disabled={clearing}
            >
              {clearing
                ? "Clearing..."
                : "Clear Cart"}
            </button>
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Products</span>

              <span>{items.length}</span>
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
              type="button"
              className="checkout-button"
              onClick={goToCheckout}
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      )}
    </main>
  );
};

export default Cart;