import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data.products);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="products-state">
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-state">
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="products-page">
      <div className="products-page-header">
        <div>
          <p className="section-label">MARKETPLACE</p>
          <h1>Explore Products</h1>
          <p>
            Discover products from our trusted vendors.
          </p>
        </div>

        <span className="product-count">
          {products.length} products
        </span>
      </div>

      {products.length === 0 ? (
        <div className="products-state">
          <h2>No products available</h2>
          <p>Check back soon for new products.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Products;