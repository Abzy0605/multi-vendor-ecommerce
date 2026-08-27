const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        message: "Complete shipping address is required",
      });
    }

    const selectedPaymentMethod =
      paymentMethod || "cash_on_delivery";

    if (!["cash_on_delivery", "online"].includes(selectedPaymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty",
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const product = cartItem.product;

      if (!product || !product.isActive) {
        return res.status(400).json({
          message: "One or more products in your cart are no longer available",
        });
      }

      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          message: `Not enough stock available for ${product.name}`,
        });
      }

      const subtotal = product.price * cartItem.quantity;

      orderItems.push({
        product: product._id,
        vendor: product.vendor,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        subtotal,
      });

      totalAmount += subtotal;
    }

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      status: "confirmed",
      paymentStatus:
        selectedPaymentMethod === "cash_on_delivery"
          ? "pending"
          : "pending",
      paymentMethod: selectedPaymentMethod,
      shippingAddress,
    });

    for (const cartItem of cart.items) {
      await Product.findByIdAndUpdate(cartItem.product._id, {
        $inc: {
          stock: -cartItem.quantity,
        },
      });
    }

    cart.items = [];
    await cart.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("customer", "name email")
      .populate("items.product", "name category image")
      .populate("items.vendor", "name email");

    res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  }
};

const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user._id,
    })
      .populate("items.product", "name category image")
      .populate("items.vendor", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email")
      .populate("items.product", "name category image")
      .populate("items.vendor", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const isCustomer =
      order.customer._id.toString() === req.user._id.toString();

    const isVendor = order.items.some(
      (item) =>
        item.vendor &&
        item.vendor._id.toString() === req.user._id.toString()
    );

    const isAdmin = req.user.role === "admin";

    if (!isCustomer && !isVendor && !isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to view this order",
      });
    }

    res.json({
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

const getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "items.vendor": req.user._id,
    })
      .populate("customer", "name email")
      .populate("items.product", "name category image")
      .populate("items.vendor", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch vendor orders",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const isAdmin = req.user.role === "admin";

    const isVendor = order.items.some(
      (item) => item.vendor.toString() === req.user._id.toString()
    );

    if (!isAdmin && !isVendor) {
      return res.status(403).json({
        message: "You are not authorized to update this order",
      });
    }

    order.status = status;

    await order.save();

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getCustomerOrders,
  getOrderById,
  getVendorOrders,
  updateOrderStatus,
};