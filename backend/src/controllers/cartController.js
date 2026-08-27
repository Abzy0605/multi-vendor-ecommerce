const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.product",
      populate: {
        path: "vendor",
        select: "name email",
      },
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    res.json({
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const requestedQuantity = Number(quantity);

    if (!productId || !requestedQuantity || requestedQuantity < 1) {
      return res.status(400).json({
        message: "Product ID and a valid quantity are required",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.stock < requestedQuantity) {
      return res.status(400).json({
        message: "Not enough stock available",
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + requestedQuantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: "Requested quantity exceeds available stock",
        });
      }

      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: requestedQuantity,
      });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      populate: {
        path: "vendor",
        select: "name email",
      },
    });

    res.json({
      message: "Product added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const requestedQuantity = Number(quantity);

    if (!productId || !requestedQuantity || requestedQuantity < 1) {
      return res.status(400).json({
        message: "Product ID and a valid quantity are required",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (requestedQuantity > product.stock) {
      return res.status(400).json({
        message: "Requested quantity exceeds available stock",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (cartItem) => cartItem.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Product is not in the cart",
      });
    }

    item.quantity = requestedQuantity;

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      populate: {
        path: "vendor",
        select: "name email",
      },
    });

    res.json({
      message: "Cart updated successfully",
      cart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update cart",
      error: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({
        message: "Product is not in the cart",
      });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      populate: {
        path: "vendor",
        select: "name email",
      },
    });

    res.json({
      message: "Product removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove product from cart",
      error: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.json({
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};