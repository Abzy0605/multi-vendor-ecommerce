# Multi-Vendor E-Commerce Platform with Analytics

A full-stack multi-vendor e-commerce platform that allows customers to browse and purchase products, vendors to manage products and orders, and administrators to monitor and manage the entire marketplace.

---

## Overview

This project is a role-based e-commerce platform built with React, Node.js, Express, and MongoDB.

The platform supports three main user roles:

- **Customer** – Browse products, manage cart, checkout, and track orders.
- **Vendor** – Manage products, view orders containing their products, and update order status.
- **Admin** – Monitor the marketplace, manage users and products, and view all orders and platform statistics.

The application uses authentication and role-based authorization to ensure that users can only access functionality available to their role.

---

## Features

### Customer

- User registration and login
- Browse available products
- View product details
- View product categories
- Add products to cart
- Increase or decrease product quantity
- Remove products from cart
- Clear cart
- Checkout
- Enter shipping information
- Select payment method
- Place orders
- View previous orders
- View individual order details
- View order status
- View ordered products and shipping information

### Vendor

- Vendor authentication
- Vendor dashboard
- View vendor statistics
- Add new products
- Edit existing products
- Delete products
- Activate/deactivate products
- View vendor products
- View orders containing vendor products
- View customer/order information relevant to vendor orders
- Update order status
- Track processing, shipping, and delivery progress

### Admin

- Admin authentication
- Admin dashboard
- View marketplace statistics
- View total users
- View total customers
- View total vendors
- View total products
- View active products
- View total orders
- View pending orders
- View processing orders
- View delivered orders
- View total sales
- View all registered users
- Activate/deactivate users
- Prevent administrators from deactivating their own account
- View all marketplace products
- Activate/deactivate products
- View all marketplace orders
- View customer information
- View vendor information
- View payment information
- View order items
- View shipping information

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Development Tools

- npm
- Git
- ESLint
- Vite

---

## Project Structure

```text
project/
│
├── backend/
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   │
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md