// Simple database solution that works everywhere
let products = [];
let users = [];
let orders = [];

// Initialize sample data
function initializeData() {
  if (products.length === 0) {
    products = [
      {
        _id: "product-1",
        name: "7-Stage Reverse Osmosis System",
        slug: "7-stage-reverse-osmosis-system",
        category: "Reverse Osmosis System",
        price: 35000,
        originalPrice: 45000,
        stock: 15,
        description: "Advanced 7-stage RO system with UV and mineral filters for pure, healthy drinking water.",
        features: ["7-Stage Filtration", "UV Sterilization", "Mineral Addition", "100 GPD Capacity", "3-Year Warranty", "Professional Installation"],
        images: ["/1.jpeg"],
        badge: "Best Seller",
        rating: 4.8,
        reviews: 127,
        active: true
      },
      {
        _id: "product-2",
        name: "Domestic Water Filter 5-Stage",
        slug: "domestic-water-filter-5-stage",
        category: "Domestic Water Filter",
        price: 15000,
        originalPrice: 18000,
        stock: 25,
        description: "Compact 5-stage water filter perfect for home use with easy maintenance.",
        features: ["5-Stage Filtration", "Compact Design", "Easy Maintenance", "50 GPD Capacity", "1-Year Warranty", "DIY Installation"],
        images: ["/2.jpeg"],
        badge: "Popular",
        rating: 4.5,
        reviews: 89,
        active: true
      },
      {
        _id: "product-3",
        name: "Whole House Water Softener",
        slug: "whole-house-water-softener",
        category: "Whole House Water Softener",
        price: 45000,
        originalPrice: 55000,
        stock: 8,
        description: "Whole house water softening system for hard water treatment throughout your home.",
        features: ["Whole House Coverage", "32,000 Grain Capacity", "Digital Control", "Salt Efficient", "5-Year Warranty", "Professional Installation"],
        images: ["/3.jpeg"],
        badge: "Premium",
        rating: 4.7,
        reviews: 45,
        active: true
      },
      {
        _id: "product-4",
        name: "Commercial RO Plant 1000 GPD",
        slug: "commercial-ro-plant-1000-gpd",
        category: "Commercial Water Plants",
        price: 125000,
        originalPrice: 150000,
        stock: 3,
        description: "Heavy-duty commercial reverse osmosis plant ideal for restaurants, hotels, and small businesses.",
        features: ["1000 GPD Capacity", "Commercial Grade", "Stainless Steel Frame", "Pre-filtration System", "3-Year Warranty", "Professional Support"],
        images: ["/4.jpeg"],
        badge: "Top Rated",
        rating: 4.9,
        reviews: 34,
        active: true
      },
      {
        _id: "product-5",
        name: "RO Filter Cartridge Set",
        slug: "ro-filter-cartridge-set",
        category: "Accessories",
        price: 3500,
        originalPrice: 4500,
        stock: 50,
        description: "Complete set of replacement cartridges for RO systems including sediment, carbon, and RO membranes.",
        features: ["Complete Set", "6-Month Supply", "Universal Fit", "Easy Installation", "Quality Certified", "Value Pack"],
        images: ["/5.jpeg"],
        badge: "Value",
        rating: 4.3,
        reviews: 156,
        active: true
      }
    ];
    console.log("Sample products initialized:", products.length);
  }
}

export async function connectDB() {
  console.log("Using simple in-memory database");
  initializeData();
  return { inMemory: true };
}

// User functions
export async function findUser(email) {
  await connectDB();
  return users.find(u => u.email === email);
}

export async function createUser(userData) {
  await connectDB();
  const user = { ...userData, _id: Date.now().toString() };
  users.push(user);
  return user;
}

export async function updateUser(email, updates) {
  try {
    await connectDB();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex === -1) {
      return null;
    }
    users[userIndex] = { ...users[userIndex], ...updates };
    return users[userIndex];
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Product functions
export async function getProducts() {
  await connectDB();
  return products;
}

export async function createProduct(productData) {
  await connectDB();
  const product = { ...productData, _id: Date.now().toString() };
  products.push(product);
  return product;
}

export async function updateProduct(id, productData) {
  await connectDB();
  const index = products.findIndex(p => p._id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...productData };
    return products[index];
  }
  return null;
}

export async function deleteProduct(id) {
  await connectDB();
  const index = products.findIndex(p => p._id === id);
  if (index !== -1) {
    products[index].active = false;
    return products[index];
  }
  return null;
}

// Order functions
export async function createOrder(orderData) {
  await connectDB();
  const order = { ...orderData, _id: Date.now().toString() };
  orders.push(order);
  return order;
}

export async function getOrders() {
  await connectDB();
  return orders;
}

export async function updateOrder(id, orderData) {
  await connectDB();
  const index = orders.findIndex(o => o.orderId === id);
  if (index !== -1) {
    orders[index] = { ...orders[index], ...orderData };
    return orders[index];
  }
  return null;
}
