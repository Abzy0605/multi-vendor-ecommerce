import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="product-placeholder">
            No Image
          </div>
        )}
      </div>

      <div className="product-info">
        <span className="product-category">
          {product.category}
        </span>

        <h3>{product.name}</h3>

        <p className="product-description">
          {product.description}
        </p>

        <div className="product-bottom">
          <div>
            <span className="product-price">
              ₹{product.price.toLocaleString("en-IN")}
            </span>

            <span className="product-stock">
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </span>
          </div>

          <Link
            to={`/products/${product._id}`}
            className="view-product-button"
          >
            View
          </Link>
        </div>

        {product.vendor && (
          <div className="product-vendor">
            Sold by <strong>{product.vendor.name}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;