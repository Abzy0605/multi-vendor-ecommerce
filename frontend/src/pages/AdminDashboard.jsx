import { useEffect, useState } from "react";
import api from "../services/api";

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [error, setError] = useState("");
  const [usersError, setUsersError] = useState("");
  const [productsError, setProductsError] = useState("");
  const [ordersError, setOrdersError] = useState("");

  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [updatingProductId, setUpdatingProductId] =
    useState(null);
  const [updatingOrderId, setUpdatingOrderId] =
    useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/admin/dashboard"
        );

        setStatistics(
          response.data?.statistics || null
        );
      } catch (error) {
        console.error(
          "Failed to load admin dashboard:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        setUsersError("");

        const response = await api.get(
          "/admin/users"
        );

        setUsers(
          response.data?.users || []
        );
      } catch (error) {
        console.error(
          "Failed to load admin users:",
          error
        );

        setUsersError(
          error.response?.data?.message ||
            "Failed to load users."
        );
      } finally {
        setUsersLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError("");

        const response = await api.get(
          "/admin/products"
        );

        setProducts(
          response.data?.products || []
        );
      } catch (error) {
        console.error(
          "Failed to load admin products:",
          error
        );

        setProductsError(
          error.response?.data?.message ||
            "Failed to load products."
        );
      } finally {
        setProductsLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError("");

        const response = await api.get(
          "/admin/orders"
        );

        setOrders(
          response.data?.orders || []
        );
      } catch (error) {
        console.error(
          "Failed to load admin orders:",
          error
        );

        setOrdersError(
          error.response?.data?.message ||
            "Failed to load orders."
        );
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchDashboardStats();
    fetchUsers();
    fetchProducts();
    fetchOrders();
  }, []);

  const handleUserStatusChange = async (
    userId,
    isActive
  ) => {
    try {
      setUpdatingUserId(userId);

      const response = await api.put(
        `/admin/users/${userId}/status`,
        {
          isActive,
        }
      );

      const updatedUser =
        response.data?.user;

      if (updatedUser) {
        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  isActive:
                    updatedUser.isActive,
                }
              : user
          )
        );
      }
    } catch (error) {
      console.error(
        "Failed to update user status:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update user status."
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleProductStatusChange = async (
    productId,
    isActive
  ) => {
    try {
      setUpdatingProductId(productId);

      const response = await api.put(
        `/admin/products/${productId}/status`,
        {
          isActive,
        }
      );

      const updatedProduct =
        response.data?.product;

      if (updatedProduct) {
        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product._id === productId
              ? {
                  ...product,
                  isActive:
                    updatedProduct.isActive,
                }
              : product
          )
        );
      }
    } catch (error) {
      console.error(
        "Failed to update product status:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update product status."
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleOrderStatusChange = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingOrderId(orderId);

      const response = await api.put(
        `/orders/${orderId}/status`,
        {
          status,
        }
      );

      const updatedOrder =
        response.data?.order;

      if (updatedOrder) {
        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status:
                    updatedOrder.status,
                }
              : order
          )
        );
      }
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="products-state">
        <h2>Loading admin dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-state">
        <h2>Could not load dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="admin-dashboard-page">
      {/* =========================
          ADMIN HEADER
      ========================= */}

      <div className="admin-dashboard-header">
        <div>
          <p className="section-label">
            ADMIN PORTAL
          </p>

          <h1>Admin Dashboard</h1>

          <p>
            Monitor your marketplace and manage
            the platform from one place.
          </p>
        </div>
      </div>

      {/* =========================
          STATISTICS
      ========================= */}

      <section className="admin-stats-grid">
        <div className="admin-stat-card">
          <span>Total Users</span>
          <strong>
            {statistics?.totalUsers ?? 0}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Customers</span>
          <strong>
            {statistics?.totalCustomers ?? 0}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Vendors</span>
          <strong>
            {statistics?.totalVendors ?? 0}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Total Products</span>
          <strong>
            {statistics?.totalProducts ?? 0}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Active Products</span>
          <strong>
            {statistics?.activeProducts ?? 0}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Total Orders</span>
          <strong>
            {statistics?.totalOrders ?? 0}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Pending Orders</span>
          <strong>
            {statistics?.pendingOrders ?? 0}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Processing Orders</span>
          <strong>
            {statistics?.processingOrders ?? 0}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Delivered Orders</span>
          <strong>
            {statistics?.deliveredOrders ?? 0}
          </strong>
        </div>

        <div className="admin-stat-card admin-sales-card">
          <span>Total Sales</span>

          <strong>
            ₹
            {Number(
              statistics?.totalSales || 0
            ).toLocaleString("en-IN")}
          </strong>
        </div>
      </section>

      {/* =========================
          USER MANAGEMENT
      ========================= */}

      <section className="admin-management-section">
        <div className="admin-section-header">
          <div>
            <p className="section-label">
              USER MANAGEMENT
            </p>

            <h2>Platform Users</h2>

            <p>
              View customers, vendors and admins
              registered on the platform.
            </p>
          </div>

          <div className="admin-section-count">
            {users.length} users
          </div>
        </div>

        {usersLoading ? (
          <div className="admin-state-card">
            <h3>Loading users...</h3>
          </div>
        ) : usersError ? (
          <div className="admin-state-card">
            <h3>Could not load users</h3>
            <p>{usersError}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="admin-state-card">
            <h3>No users found</h3>

            <p>
              There are currently no users on the
              platform.
            </p>
          </div>
        ) : (
          <div className="admin-users-table-wrapper">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const isUpdating =
                    updatingUserId ===
                    user._id;

                  const isCurrentAdmin =
                    user.role === "admin";

                  return (
                    <tr key={user._id}>
                      <td>
                        <strong>
                          {user.name}
                        </strong>
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>
                        <span
                          className={`admin-role-badge admin-role-${user.role}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td>
                        {user.phone || "—"}
                      </td>

                      <td>
                        <span
                          className={
                            user.isActive
                              ? "admin-user-active"
                              : "admin-user-inactive"
                          }
                        >
                          {user.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>
                        {isCurrentAdmin ? (
                          <span className="admin-protected-label">
                            Protected
                          </span>
                        ) : (
                          <button
                            type="button"
                            className={
                              user.isActive
                                ? "admin-deactivate-button"
                                : "admin-activate-button"
                            }
                            disabled={isUpdating}
                            onClick={() =>
                              handleUserStatusChange(
                                user._id,
                                !user.isActive
                              )
                            }
                          >
                            {isUpdating
                              ? "Updating..."
                              : user.isActive
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =========================
          PRODUCT MANAGEMENT
      ========================= */}

      <section className="admin-management-section">
        <div className="admin-section-header">
          <div>
            <p className="section-label">
              PRODUCT MANAGEMENT
            </p>

            <h2>Platform Products</h2>

            <p>
              View products listed by vendors
              across the marketplace.
            </p>
          </div>

          <div className="admin-section-count">
            {products.length} products
          </div>
        </div>

        {productsLoading ? (
          <div className="admin-state-card">
            <h3>Loading products...</h3>
          </div>
        ) : productsError ? (
          <div className="admin-state-card">
            <h3>Could not load products</h3>
            <p>{productsError}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="admin-state-card">
            <h3>No products found</h3>

            <p>
              There are currently no products on
              the platform.
            </p>
          </div>
        ) : (
          <div className="admin-products-table-wrapper">
            <table className="admin-products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Vendor</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  const isUpdating =
                    updatingProductId ===
                    product._id;

                  return (
                    <tr key={product._id}>
                      <td>
                        <strong>
                          {product.name}
                        </strong>
                      </td>

                      <td>
                        {product.category}
                      </td>

                      <td>
                        {product.vendor?.name ||
                          "Unknown vendor"}
                      </td>

                      <td>
                        ₹
                        {Number(
                          product.price || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      <td>
                        {product.stock}
                      </td>

                      <td>
                        <span
                          className={
                            product.isActive
                              ? "admin-product-active"
                              : "admin-product-inactive"
                          }
                        >
                          {product.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={
                            product.isActive
                              ? "admin-deactivate-button"
                              : "admin-activate-button"
                          }
                          disabled={isUpdating}
                          onClick={() =>
                            handleProductStatusChange(
                              product._id,
                              !product.isActive
                            )
                          }
                        >
                          {isUpdating
                            ? "Updating..."
                            : product.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =========================
          ORDER MANAGEMENT
      ========================= */}

      <section className="admin-management-section">
        <div className="admin-section-header">
          <div>
            <p className="section-label">
              ORDER MANAGEMENT
            </p>

            <h2>Platform Orders</h2>

            <p>
              View all orders placed across the
              marketplace.
            </p>
          </div>

          <div className="admin-section-count">
            {orders.length} orders
          </div>
        </div>

        {ordersLoading ? (
          <div className="admin-state-card">
            <h3>Loading orders...</h3>
          </div>
        ) : ordersError ? (
          <div className="admin-state-card">
            <h3>Could not load orders</h3>
            <p>{ordersError}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="admin-state-card">
            <h3>No orders found</h3>

            <p>
              There are currently no orders on
              the platform.
            </p>
          </div>
        ) : (
          <div className="admin-orders-list">
            {orders.map((order) => {
              const isUpdating =
                updatingOrderId === order._id;

              return (
                <div
                  className="admin-order-card"
                  key={order._id}
                >
                  <div className="admin-order-header">
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

                  <div className="admin-order-info">
                    <div>
                      <span>Customer</span>

                      <strong>
                        {order.customer?.name ||
                          "Unknown customer"}
                      </strong>

                      <small>
                        {order.customer?.email ||
                          ""}
                      </small>
                    </div>

                    <div>
                      <span>Items</span>

                      <strong>
                        {order.items?.length || 0}
                      </strong>
                    </div>

                    <div>
                      <span>Payment</span>

                      <strong>
                        {order.paymentMethod
                          ?.replaceAll(
                            "_",
                            " "
                          )}
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
                          order.totalAmount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="admin-order-items">
                    <h3>Order Items</h3>

                    {order.items?.map(
                      (item, index) => (
                        <div
                          className="admin-order-item"
                          key={`${order._id}-${index}`}
                        >
                          <div>
                            <strong>
                              {item.name}
                            </strong>

                            <span>
                              Vendor:{" "}
                              {item.vendor?.name ||
                                "Unknown vendor"}
                            </span>

                            <span>
                              Quantity:{" "}
                              {item.quantity}
                            </span>
                          </div>

                          <strong>
                            ₹
                            {Number(
                              item.subtotal || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </div>
                      )
                    )}
                  </div>

                  <div className="admin-order-shipping">
                    <h3>
                      Shipping Address
                    </h3>

                    <div>
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

                  <div className="admin-order-footer">
                    <span>
                      Ordered{" "}
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleString(
                            "en-IN"
                          )
                        : "—"}
                    </span>
                  </div>

                  <div className="admin-order-status-actions">
                    {[
                      "pending",
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
                            ? "admin-status-button active"
                            : "admin-status-button"
                        }
                        disabled={isUpdating}
                        onClick={() =>
                          handleOrderStatusChange(
                            order._id,
                            status
                          )
                        }
                      >
                        {isUpdating
                          ? "Updating..."
                          : status}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminDashboard;