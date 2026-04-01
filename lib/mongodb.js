import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// File-based database persistence
const DB_FILE = join(process.cwd(), 'data', 'database.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    try {
      require('fs').mkdirSync(dataDir, { recursive: true });
    } catch (error) {
      console.log('Data directory creation failed, using in-memory storage');
    }
  }
}

// Load data from file
function loadDataFromFile() {
  try {
    if (existsSync(DB_FILE)) {
      const data = readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(data);
      console.log('Database loaded from file');
      return parsed;
    }
  } catch (error) {
    console.log('Failed to load database from file, using defaults');
  }
  return null;
}

// Save data to file
function saveDataToFile(data) {
  try {
    ensureDataDir();
    writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    console.log('Database saved to file');
  } catch (error) {
    console.log('Failed to save database to file:', error.message);
  }
}

// Simple database solution with file persistence
let products = [];
let users = [];
let orders = [];

// Initialize data from file or defaults
function initializeDatabase() {
  const savedData = loadDataFromFile();
  
  if (savedData) {
    products = savedData.products || [];
    users = savedData.users || [];
    orders = savedData.orders || [];
  } else {
    // Initialize sample data if no file exists
    initializeSampleData();
    saveDataToFile({ products, users, orders });
  }
}

// Initialize sample data
function initializeSampleData() {
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
        price: 12000,
        originalPrice: 15000,
        stock: 25,
        description: "Compact 5-stage water filter perfect for home use with easy installation and maintenance.",
        features: ["5-Stage Filtration", "Easy Installation", "Low Maintenance", "NSF Certified", "1-Year Warranty", "White Color"],
        images: ["/2.jpeg"],
        badge: "Popular",
        rating: 4.5,
        reviews: 89,
        active: true
      },
      {
        _id: "product-3",
        name: "Commercial RO System 1000 GPD",
        slug: "commercial-ro-system-1000-gpd",
        category: "Commercial RO System",
        price: 85000,
        originalPrice: 95000,
        stock: 8,
        description: "High-capacity commercial reverse osmosis system suitable for offices, restaurants, and small businesses.",
        features: ["1000 GPD Capacity", "Commercial Grade", "Stainless Steel", "Auto Flushing", "2-Year Warranty", "Professional Installation"],
        images: ["/3.jpeg"],
        badge: "Heavy Duty",
        rating: 4.9,
        reviews: 43,
        active: true
      },
      {
        _id: "product-4",
        name: "UV Water Purifier",
        slug: "uv-water-purifier",
        category: "UV Water Purifier",
        price: 8000,
        originalPrice: 10000,
        stock: 30,
        description: "UV water purifier that eliminates bacteria and viruses without chemicals, perfect for pre-treated water.",
        features: ["UV Sterilization", "Chemical Free", "Low Power", "Compact Design", "1-Year Warranty", "Wall Mountable"],
        images: ["/4.jpeg"],
        badge: "Eco Friendly",
        rating: 4.3,
        reviews: 156,
        active: true
      },
      {
        _id: "product-5",
        name: "Industrial Water Softener",
        slug: "industrial-water-softener",
        category: "Water Softener",
        price: 65000,
        originalPrice: 75000,
        stock: 5,
        description: "Industrial-grade water softener for large-scale water treatment applications with automatic regeneration.",
        features: ["Industrial Grade", "Automatic Regeneration", "High Capacity", "Digital Control", "3-Year Warranty", "Commercial Installation"],
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

// Database connection (initializes file-based storage)
export async function connectDB() {
  if (products.length === 0 && users.length === 0 && orders.length === 0) {
    initializeDatabase();
  }
}

// Save data after any changes
function saveAfterChange() {
  saveDataToFile({ products, users, orders });
}

// User functions
export async function findUser(email) {
  await connectDB();
  
  // Force fresh read from file to get latest data
  try {
    const fs = require('fs');
    const path = require('path');
    const dbPath = path.join(process.cwd(), 'data', 'database.json');
    
    if (fs.existsSync(dbPath)) {
      const freshData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      users = freshData.users || [];
    }
  } catch (error) {
    console.error('Error reading fresh data for findUser:', error);
  }
  
  return users.find(u => u.email === email) || null;
}

export async function getAllUsers() {
  await connectDB();
  
  // Force fresh read from file to get latest data
  try {
    const fs = require('fs');
    const path = require('path');
    const dbPath = path.join(process.cwd(), 'data', 'database.json');
    
    if (fs.existsSync(dbPath)) {
      const freshData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      console.log('Fresh data read from file:', freshData.users?.length || 0, 'users');
      users = freshData.users || [];
    } else {
      console.log('Database file not found, using in-memory data');
    }
  } catch (error) {
    console.error('Error reading fresh data from file:', error);
  }
  
  return users;
}

export async function createUser(userData) {
  await connectDB();
  const user = { ...userData, _id: Date.now().toString() };
  users.push(user);
  saveAfterChange(); // Save to file
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
    saveAfterChange(); // Save to file
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
  saveAfterChange(); // Save to file
  return product;
}

export async function updateProduct(id, productData) {
  await connectDB();
  const index = products.findIndex(p => p._id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...productData };
    saveAfterChange(); // Save to file
    return products[index];
  }
  return null;
}

export async function deleteProduct(id) {
  await connectDB();
  const index = products.findIndex(p => p._id === id);
  if (index !== -1) {
    products[index].active = false;
    saveAfterChange(); // Save to file
    return products[index];
  }
  return null;
}

// Order functions
export async function createOrder(orderData) {
  await connectDB();
  const order = { ...orderData, _id: Date.now().toString() };
  orders.push(order);
  saveAfterChange(); // Save to file
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
    saveAfterChange(); // Save to file
    return orders[index];
  }
  return null;
}

export async function deleteOrder(id) {
  await connectDB();
  const index = orders.findIndex(o => o.orderId === id);
  if (index !== -1) {
    const deletedOrder = orders.splice(index, 1)[0];
    saveAfterChange(); // Save to file
    return deletedOrder;
  }
  return null;
}
