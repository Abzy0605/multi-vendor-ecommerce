const express = require("express");

const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllProducts,
  updateProductStatus,
  getAllOrders,
} = require("../controllers/adminController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getDashboardStats
);

router.get(
  "/users",
  protect,
  authorize("admin"),
  getAllUsers
);

router.put(
  "/users/:id/status",
  protect,
  authorize("admin"),
  updateUserStatus
);

router.get(
  "/products",
  protect,
  authorize("admin"),
  getAllProducts
);

router.put(
  "/products/:id/status",
  protect,
  authorize("admin"),
  updateProductStatus
);

router.get(
  "/orders",
  protect,
  authorize("admin"),
  getAllOrders
);

module.exports = router;