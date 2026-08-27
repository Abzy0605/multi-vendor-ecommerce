const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCustomers,
      totalVendors,
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      salesResult,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "vendor" }),
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "processing" }),
      Order.countDocuments({ status: "delivered" }),
      Order.aggregate([
        {
          $match: {
            status: {
              $ne: "cancelled",
            },
          },
        },
        {
          $group: {
            _id: null,
            totalSales: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),
    ]);

    const totalSales =
      salesResult.length > 0
        ? salesResult[0].totalSales
        : 0;

    res.json({
      statistics: {
        totalUsers,
        totalCustomers,
        totalVendors,
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        totalSales,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch admin dashboard statistics:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch admin dashboard statistics",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Failed to fetch users:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message:
          "isActive must be true or false",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      user._id.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        message:
          "You cannot deactivate your own admin account",
      });
    }

    user.isActive = isActive;

    await user.save();

    res.json({
      message: isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(
      "Failed to update user status:",
      error
    );

    res.status(500).json({
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("vendor", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(
      "Failed to fetch admin products:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message:
          "isActive must be true or false",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.isActive = isActive;

    await product.save();

    res.json({
      message: isActive
        ? "Product activated successfully"
        : "Product deactivated successfully",
      product: {
        id: product._id,
        name: product.name,
        isActive: product.isActive,
      },
    });
  } catch (error) {
    console.error(
      "Failed to update product status:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update product status",
      error: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("items.product", "name category image")
      .populate("items.vendor", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Failed to fetch admin orders:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllProducts,
  updateProductStatus,
  getAllOrders,
};