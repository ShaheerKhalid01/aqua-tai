// MongoDB connection with fallback to in-memory storage
import mongoose from 'mongoose';

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

// Define schemas
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: "client" },
  createdAt: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  stock: { type: Number, required: true, default: 0 },
  description: { type: String, required: true },
  features: { type: [String] },
  images: { type: [String] },
  badge: { type: String },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customer: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  payment: { type: String, default: "cod" },
  total: { type: Number, required: true },
  items: { type: [mongoose.Schema.Types.Mixed], required: true },
  status: { type: String, default: "Pending" },
  date: { type: Date, default: Date.now },
  userId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// In-memory fallback storage
let inMemoryDB = {
  users: [],
  products: [],
  orders: []
};

// Initialize sample data
function initializeSampleData() {
  if (inMemoryDB.products.length === 0) {
    inMemoryDB.products = [
      {
        _id: "product-1",
        name: "7-Stage Reverse Osmosis System",
        slug: "7-stage-reverse-osmosis-system",
        category: "Reverse Osmosis System",
        price: 35000,
        originalPrice: 45000,
        stock: 15,
        description: "Advanced 7-stage RO system with UV and mineral filters for pure, healthy drinking water.",
        features: "7-Stage Filtration\nUV Sterilization\nMineral Addition\n100 GPD Capacity\n3-Year Warranty\nProfessional Installation",
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
        category: "Water Filters",
        price: 15000,
        originalPrice: 18000,
        stock: 25,
        description: "Compact 5-stage water filter perfect for home use with easy maintenance.",
        features: "5-Stage Filtration\nCompact Design\nEasy Maintenance\n50 GPD Capacity\n1-Year Warranty\nDIY Installation",
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
        category: "Water Softeners",
        price: 45000,
        originalPrice: 55000,
        stock: 8,
        description: "Whole house water softening system for hard water treatment throughout your home.",
        features: "Whole House Coverage\n32,000 Grain Capacity\nDigital Control\nSalt Efficient\n5-Year Warranty\nProfessional Installation",
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
        category: "Accessories",
        price: 3500,
        originalPrice: 4500,
        stock: 50,
        description: "Complete set of replacement cartridges for RO systems including sediment, carbon, and RO membranes.",
        features: "Complete Set\n6-Month Supply\nUniversal Fit\nEasy Installation\nQuality Certified\nValue Pack",
        images: ["/5.jpeg"],
        badge: "Value",
        rating: 4.3,
        reviews: 156,
        active: true
      }
    ];
    console.log("Sample products initialized:", inMemoryDB.products.length);
  }
}

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  // Force in-memory database for now
  console.log("Forcing in-memory database for development");
  initializeSampleData();
  return { inMemory: true };

  if (!MONGODB_URI) {
    console.log("MongoDB URI not found, using in-memory database");
    initializeSampleData();
    return { inMemory: true };
  }

  try {
    if (cached.conn) {
      console.log("Using cached MongoDB connection");
      return cached.conn;
    }

    if (!cached.promise) {
      console.log("Creating new MongoDB connection");
      cached.promise = mongoose.connect(MONGODB_URI);
      cached.conn = await cached.promise;
      console.log("Connected to MongoDB");
      
      // Register models
      mongoose.model('User', UserSchema);
      mongoose.model('Product', ProductSchema);
      mongoose.model('Order', OrderSchema);
    }
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection failed, using in-memory database:", error.message);
    initializeSampleData();
    return { inMemory: true };
  }
}

// User functions
export async function findUser(email) {
  const db = await connectDB();
  if (db.inMemory) {
    return inMemoryDB.users.find(u => u.email === email);
  }
  const User = mongoose.model('User');
  return User.findOne({ email });
}

export async function createUser(userData) {
  const db = await connectDB();
  if (db.inMemory) {
    const user = { ...userData, _id: Date.now().toString() };
    inMemoryDB.users.push(user);
    return user;
  }
  const User = mongoose.model('User');
  const user = new User(userData);
  return await user.save();
}

// Product functions
export async function getProducts() {
  const db = await connectDB();
  console.log("getProducts - db:", db);
  if (db && db.inMemory) {
    console.log("Using in-memory products");
    return inMemoryDB.products;
  }
  console.log("Using MongoDB products");
  const Product = mongoose.model('Product');
  return Product.find({ active: true });
}

export async function createProduct(productData) {
  const db = await connectDB();
  if (db.inMemory) {
    const product = { ...productData, _id: Date.now().toString() };
    inMemoryDB.products.push(product);
    return product;
  }
  const Product = mongoose.model('Product');
  const product = new Product(productData);
  return await product.save();
}

export async function updateProduct(id, productData) {
  const db = await connectDB();
  if (db.inMemory) {
    const index = inMemoryDB.products.findIndex(p => p._id === id);
    if (index !== -1) {
      inMemoryDB.products[index] = { ...inMemoryDB.products[index], ...productData };
      return inMemoryDB.products[index];
    }
    return null;
  }
  const Product = mongoose.model('Product');
  return Product.findOneAndUpdate({ _id: id }, productData, { new: true });
}

export async function deleteProduct(id) {
  const db = await connectDB();
  if (db.inMemory) {
    const index = inMemoryDB.products.findIndex(p => p._id === id);
    if (index !== -1) {
      inMemoryDB.products[index].active = false;
      return inMemoryDB.products[index];
    }
    return null;
  }
  const Product = mongoose.model('Product');
  return Product.findOneAndUpdate({ _id: id }, { active: false }, { new: true });
}

// Order functions
export async function createOrder(orderData) {
  const db = await connectDB();
  if (db.inMemory) {
    const order = { ...orderData, _id: Date.now().toString() };
    inMemoryDB.orders.push(order);
    return order;
  }
  const Order = mongoose.model('Order');
  const order = new Order(orderData);
  return await order.save();
}

export async function getOrders() {
  const db = await connectDB();
  if (db.inMemory) {
    return inMemoryDB.orders;
  }
  const Order = mongoose.model('Order');
  return Order.find({}).sort({ createdAt: -1 });
}

export async function updateOrder(id, orderData) {
  const db = await connectDB();
  if (db.inMemory) {
    const index = inMemoryDB.orders.findIndex(o => o.orderId === id);
    if (index !== -1) {
      inMemoryDB.orders[index] = { ...inMemoryDB.orders[index], ...orderData };
      return inMemoryDB.orders[index];
    }
    return null;
  }
  const Order = mongoose.model('Order');
  return Order.findOneAndUpdate({ orderId: id }, orderData, { new: true });
}
