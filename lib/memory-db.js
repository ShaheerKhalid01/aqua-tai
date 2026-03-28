// Simple in-memory database for development
// This replaces MongoDB for quick testing

import bcrypt from "bcryptjs";

let data = {
  products: [],
  orders: [],
  users: [],
};

let initialized = false;

// Initialize with default admin user and sample products
async function initializeDefaultAdmin() {
  const adminExists = data.users.some(u => u.email === "admin@aquatai.com");
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("admin123", 12);
    data.users.push({
      _id: "admin_default",
      name: "Administrator",
      email: "admin@aquatai.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date().toISOString(),
    });
    console.log("Default admin user created: admin@aquatai.com / admin123");
  }
}

async function initializeSampleProducts() {
  // Only initialize if products array is completely empty
  if (data.products.length === 0) {
    const sampleProducts = [
      {
        _id: "product-1",
        name: "7-Stage Reverse Osmosis System",
        slug: "7-stage-reverse-osmosis-system",
        category: "Reverse Osmosis System",
        price: 35000,
        originalPrice: 45000,
        stock: 15,
        description: "Advanced 7-stage RO system with UV sterilization and alkaline filter. Removes 99.9% of contaminants including bacteria, viruses, heavy metals, and dissolved solids.",
        features: "7-Stage Filtration\nUV Sterilization\nAlkaline Filter\n500 GPD Flow Rate\n2-Year Warranty\nFree Installation",
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
        price: 12000,
        originalPrice: 15000,
        stock: 25,
        description: "Compact 5-stage domestic water filter perfect for home use. Easy installation and maintenance. Provides clean, safe drinking water for your family.",
        features: "5-Stage Filtration\nSediment Filter\nCarbon Filter\nEasy Installation\n1-Year Warranty\nLow Maintenance",
        images: ["/2.jpeg"],
        badge: "Popular",
        rating: 4.6,
        reviews: 89,
        active: true
      },
      {
        _id: "product-3",
        name: "Whole House Water Softener",
        slug: "whole-house-water-softener",
        category: "Whole House Water Softener",
        price: 28000,
        originalPrice: 35000,
        stock: 8,
        description: "Professional whole house water softener system. Protects your pipes, appliances, and skin from hard water damage. Suitable for large homes.",
        features: "40,000 Grain Capacity\nDigital Metered Valve\nAutomatic Regeneration\n10-Year Warranty\nProfessional Installation\nSalt Saving Technology",
        images: ["/3.jpeg"],
        badge: "Premium",
        rating: 4.7,
        reviews: 56,
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
        description: "Heavy-duty commercial reverse osmosis plant ideal for restaurants, hotels, and small businesses. High-capacity 1000 GPD production.",
        features: "1000 GPD Capacity\nCommercial Grade\nStainless Steel Frame\nPre-filtration System\n3-Year Warranty\nProfessional Support",
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
        category: "Cartridges & Accessories",
        price: 3500,
        originalPrice: 4500,
        stock: 50,
        description: "Complete replacement cartridge set for RO systems. Includes sediment, carbon, and RO membrane. Compatible with most standard RO units.",
        features: "Complete Set\nUniversal Compatibility\n6-Month Life\nEasy Replacement\nHigh Quality\nNSF Certified",
        images: ["/5.jpeg"],
        badge: "",
        rating: 4.5,
        reviews: 78,
        active: true
      }
    ];

    for (const product of sampleProducts) {
      data.products.push({
        ...product,
        createdAt: new Date().toISOString(),
      });
    }
    console.log("Sample products created:", data.products.length);
  }
}

export async function connectDB() {
  console.log("Using in-memory database (development mode)");
  if (!initialized) {
    await initializeDefaultAdmin();
    await initializeSampleProducts();
    initialized = true;
    console.log("Database initialized with sample data");
  }
  return Promise.resolve();
}

// Product functions
export async function getProducts() {
  return data.products;
}

export async function createProduct(productData) {
  const product = {
    _id: Date.now().toString(),
    ...productData,
    createdAt: new Date().toISOString(),
  };
  data.products.push(product);
  return product;
}

export async function updateProduct(id, productData) {
  console.log("=== MEMORY DB UPDATE DEBUG ===");
  console.log("1. Updating product with ID:", id);
  console.log("2. Product data received:", productData);
  console.log("3. Stock in productData:", productData.stock);
  
  const index = data.products.findIndex(p => p._id === id);
  console.log("4. Product index found:", index);
  
  if (index !== -1) {
    console.log("5. Current product before update:", data.products[index]);
    data.products[index] = { ...data.products[index], ...productData };
    console.log("6. Product after update:", data.products[index]);
    console.log("7. Stock after update:", data.products[index].stock);
    return data.products[index];
  }
  console.log("8. Product not found!");
  return null;
}

export async function deleteProduct(id) {
  const index = data.products.findIndex(p => p._id === id);
  if (index !== -1) {
    data.products.splice(index, 1);
    return true;
  }
  return false;
}

// Order functions
export async function getOrders() {
  return data.orders;
}

export async function createOrder(orderData) {
  const order = {
    _id: Date.now().toString(),
    ...orderData,
    createdAt: new Date().toISOString(),
  };
  data.orders.push(order);
  return order;
}

export async function updateOrder(id, orderData) {
  const index = data.orders.findIndex(o => o._id === id);
  if (index !== -1) {
    data.orders[index] = { ...data.orders[index], ...orderData };
    return data.orders[index];
  }
  return null;
}

// User functions
export async function createUser(userData) {
  const user = {
    _id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
  };
  data.users.push(user);
  return user;
}

export async function findUser(email) {
  return data.users.find(u => u.email === email);
}
