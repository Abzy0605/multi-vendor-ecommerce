import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/products/${productId}`);

        console.log("Product API response:", response.data);

        const productData =
          response.data?.product || response.data;

        if (!productData || !productData._id) {
          throw new Error("Product data was not found.");
        }

        setProduct(productData);
      } catch (error) {
        console.error("Failed to load product:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((currentQuantity) => currentQuantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((currentQuantity) => currentQuantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "customer") {
      setError("Only customers can add products to the cart.");
      return;
    }

    try {
      setAddingToCart(true);
      setError("");
      setSuccess("");

      await api.post("/cart", {
        productId: product._id,
        quantity,
      });

      setSuccess("Product added to your cart!");
    } catch (error) {
      console.error("Failed to add product to cart:", error);

      setError(
        error.response?.data?.message ||
          "Failed to add product to cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="products-state">
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="products-state">
        <h2>Product could not be loaded</h2>

        <p>
          {error || "The requested product does not exist."}
        </p>

        <Link to="/products" className="hero-button">
          Back to Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <main className="product-details-page">
      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>

      <div className="product-details-card">
        <div className="product-details-image">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
            />
          ) : (
            <div className="product-details-placeholder">
              No Image Available
            </div>
          )}
        </div>

        <div className="product-details-content">
          <span className="product-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <p className="product-details-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>

          <p className="product-details-description">
            {product.description}
          </p>

          <div className="product-details-vendor">
            <span>Sold by</span>

            <strong>
              {product.vendor?.name || "Unknown Vendor"}
            </strong>

            {product.vendor?.email && (
              <small>{product.vendor.email}</small>
            )}
          </div>

          <div className="product-details-stock">
            {isOutOfStock
              ? "Out of stock"
              : `${product.stock} units available`}
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          {!isOutOfStock && (
            <div className="purchase-section">
              <div className="quantity-control">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart
                  ? "Adding..."
                  : "Add to Cart"}
              </button>
            </div>
          )}

          {!user && (
            <p className="customer-only-message">
              Please log in as a customer to add this product
              to your cart.
            </p>
          )}

          {user && user.role !== "customer" && (
            <p className="customer-only-message">
              Only customer accounts can purchase products.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;