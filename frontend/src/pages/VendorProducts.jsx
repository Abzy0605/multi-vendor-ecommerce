import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "",
};

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProductId, setEditingProductId] =
    useState(null);

  const [formData, setFormData] =
    useState(initialForm);

  const [submitting, setSubmitting] =
    useState(false);

  const [deletingProductId, setDeletingProductId] =
    useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/products/vendor"
      );

      const vendorProducts =
        response.data?.products || [];

      setProducts(
        vendorProducts.filter(
          (product) => product.isActive !== false
        )
      );
    } catch (error) {
      console.error(
        "Failed to load vendor products:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load vendor products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleAddProduct = () => {
    setFormData(initialForm);
    setEditingProductId(null);
    setShowAddForm(true);
    setError("");
    setSuccess("");
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "",
      image: product.image || "",
      stock: product.stock ?? "",
    });

    setEditingProductId(product._id);
    setShowAddForm(true);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const productData = {
        name: formData.name.trim(),
        description:
          formData.description.trim(),
        price: Number(formData.price),
        category: formData.category.trim(),
        image: formData.image.trim(),
        stock: Number(formData.stock || 0),
      };

      if (editingProductId) {
        const response = await api.put(
          `/products/${editingProductId}`,
          productData
        );

        const updatedProduct =
          response.data?.product;

        if (updatedProduct) {
          setProducts((current) =>
            current.map((product) =>
              product._id === editingProductId
                ? updatedProduct
                : product
            )
          );
        } else {
          await fetchProducts();
        }

        setSuccess(
          "Product updated successfully."
        );
      } else {
        const response = await api.post(
          "/products",
          productData
        );

        if (response.data?.product) {
          setProducts((current) => [
            response.data.product,
            ...current,
          ]);
        } else {
          await fetchProducts();
        }

        setSuccess(
          "Product created successfully."
        );
      }

      setFormData(initialForm);
      setEditingProductId(null);
      setShowAddForm(false);
    } catch (error) {
      console.error(
        "Failed to save product:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save product."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialForm);
    setEditingProductId(null);
    setShowAddForm(false);
    setError("");
  };

  const handleDeleteProduct = async (
    product
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingProductId(product._id);
      setError("");
      setSuccess("");

      await api.delete(
        `/products/${product._id}`
      );

      setProducts((current) =>
        current.filter(
          (item) => item._id !== product._id
        )
      );

      if (
        editingProductId === product._id
      ) {
        setFormData(initialForm);
        setEditingProductId(null);
        setShowAddForm(false);
      }

      setSuccess(
        "Product deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  if (loading) {
    return (
      <div className="products-state">
        <h2>
          Loading your products...
        </h2>
      </div>
    );
  }

  return (
    <main className="vendor-products-page">
      <div className="vendor-products-header">
        <div>
          <p className="section-label">
            VENDOR PORTAL
          </p>

          <h1>My Products</h1>

          <p>
            Manage the products you sell in the
            marketplace.
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

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <div className="vendor-products-toolbar">
        <div>
          <strong>
            {products.length}
          </strong>

          <span>
            {products.length === 1
              ? " product"
              : " products"}
          </span>
        </div>

        <button
          type="button"
          className="primary-button vendor-add-product-button"
          onClick={handleAddProduct}
        >
          Add Product
        </button>
      </div>

      {showAddForm && (
        <section className="vendor-product-form-card">
          <div className="vendor-product-form-header">
            <div>
              <p className="section-label">
                PRODUCT MANAGEMENT
              </p>

              <h2>
                {editingProductId
                  ? "Edit Product"
                  : "Add New Product"}
              </h2>

              <p>
                {editingProductId
                  ? "Update your product information and inventory."
                  : "Add a product to your marketplace inventory."}
              </p>
            </div>
          </div>

          <form
            className="vendor-product-form"
            onSubmit={handleSubmit}
          >
            <div className="vendor-product-form-grid">
              <div className="form-group">
                <label htmlFor="name">
                  Product Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Electronics"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">
                  Price
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">
                  Stock
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Enter stock quantity"
                />
              </div>

              <div className="form-group vendor-product-form-full">
                <label htmlFor="image">
                  Image URL
                </label>

                <input
                  id="image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-group vendor-product-form-full">
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the product"
                  rows="5"
                  required
                />
              </div>
            </div>

            <div className="vendor-product-form-actions">
              <button
                type="button"
                className="vendor-cancel-product-button"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button vendor-save-product-button"
                disabled={submitting}
              >
                {submitting
                  ? editingProductId
                    ? "Updating..."
                    : "Creating..."
                  : editingProductId
                  ? "Update Product"
                  : "Create Product"}
              </button>
            </div>
          </form>
        </section>
      )}

      {products.length === 0 ? (
        <div className="products-state">
          <h2>
            No products yet
          </h2>

          <p>
            You haven't added any products to the
            marketplace.
          </p>

          {!showAddForm && (
            <button
              type="button"
              className="primary-button vendor-add-product-button"
              onClick={handleAddProduct}
            >
              Add Your First Product
            </button>
          )}
        </div>
      ) : (
        <div className="vendor-products-grid">
          {products.map((product) => (
            <article
              className="vendor-product-card"
              key={product._id}
            >
              <div className="vendor-product-image">
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

              <div className="vendor-product-content">
                <div className="vendor-product-top">
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

                <h2>
                  {product.name}
                </h2>

                <p className="vendor-product-description">
                  {product.description}
                </p>

                <div className="vendor-product-details">
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

                <div className="vendor-product-actions">
                  <button
                    type="button"
                    className="vendor-edit-product-button"
                    onClick={() =>
                      handleEditProduct(
                        product
                      )
                    }
                    disabled={
                      deletingProductId ===
                      product._id
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="vendor-delete-product-button"
                    onClick={() =>
                      handleDeleteProduct(
                        product
                      )
                    }
                    disabled={
                      deletingProductId ===
                      product._id
                    }
                  >
                    {deletingProductId ===
                    product._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default VendorProducts;