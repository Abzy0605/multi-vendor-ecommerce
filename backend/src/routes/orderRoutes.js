const express = require("express");

const {
  createOrder,
  getCustomerOrders,
  getOrderById,
  getVendorOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Customer routes
router.post(
  "/",
  protect,
  authorize("customer"),
  createOrder
);

router.get(
  "/my-orders",
  protect,
  authorize("customer"),
  getCustomerOrders
);

// Vendor routes
router.get(
  "/vendor",
  protect,
  authorize("vendor"),
  getVendorOrders
);

// Customer, vendor, or admin can view an authorized order
router.get(
  "/:id",
  protect,
  authorize("customer", "vendor", "admin"),
  getOrderById
);

// Vendor or admin can update order status
router.put(
  "/:id/status",
  protect,
  authorize("vendor", "admin"),
  updateOrderStatus
);

module.exports = router;