const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  getVendorProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Vendor routes
router.get(
  "/vendor",
  protect,
  authorize("vendor"),
  getVendorProducts
);

router.post(
  "/",
  protect,
  authorize("vendor", "admin"),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorize("vendor", "admin"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("vendor", "admin"),
  deleteProduct
);

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

module.exports = router;