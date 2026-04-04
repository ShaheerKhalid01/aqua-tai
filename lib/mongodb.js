import { MongoClient } from 'mongodb';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'aqua-tai-db';

// Fallback file-based storage
const DB_FILE = join(process.cwd(), 'data', 'database.json');
let fileBasedMode = false;

let client = null;
let db = null;

// In-memory fallback storage
let fallbackProducts = [];
let fallbackUsers = [];
let fallbackOrders = [];
let activeSessions = new Map(); // Track active user sessions

// Load fallback data from file
function loadFallbackData() {
  try {
    if (existsSync(DB_FILE)) {
      const data = readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(data);
      fallbackProducts = parsed.products || [];
      fallbackUsers = parsed.users || [];
      fallbackOrders = parsed.orders || [];
      
      // Load active sessions if they exist
      if (parsed.activeSessions) {
        activeSessions = new Map(Object.entries(parsed.activeSessions));
      }
      
      console.log('✅ Fallback data loaded from file');
    } else {
      initializeFallbackData();
    }
  } catch (error) {
    console.log('Failed to load fallback data:', error);
    initializeFallbackData();
  }
}

// Initialize sample data for fallback
function initializeFallbackData() {
  if (fallbackProducts.length === 0) {
    fallbackProducts = [
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
        active: true,
        createdAt: new Date()
      }
    ];
  }
}

// Save fallback data to file
function saveFallbackData() {
  try {
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      require('fs').mkdirSync(dataDir, { recursive: true });
    }
    const data = {
      products: fallbackProducts,
      users: fallbackUsers,
      orders: fallbackOrders
    };
    writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to save fallback data:', error);
  }
}

// Connect to MongoDB with fallback
export async function connectDB() {
  if (fileBasedMode) {
    return { fileMode: true };
  }

  if (client && client.topology && client.topology.isConnected()) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB');

    // Initialize collections if they don't exist
    await initializeCollections();

    return db;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    console.log('⚠️  Switching to file-based storage mode');

    // Enable fallback mode
    fileBasedMode = true;
    loadFallbackData();

    return { fileMode: true };
  }
}

// Initialize collections with sample data if empty
async function initializeCollections() {
  try {
    const productsCount = await db.collection('products').countDocuments();
    const usersCount = await db.collection('users').countDocuments();
    const ordersCount = await db.collection('orders').countDocuments();

    if (productsCount === 0) {
      await initializeSampleProducts();
      console.log('✅ Sample products initialized');
    }

    console.log(`Collections status: Products: ${productsCount}, Users: ${usersCount}, Orders: ${ordersCount}`);
  } catch (error) {
    console.error('Error initializing collections:', error);
  }
}

// Initialize sample products
async function initializeSampleProducts() {
  const sampleProducts = [
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
      active: true,
      createdAt: new Date()
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
      images: ["/5.jpeg"],
      badge: "Popular",
      rating: 4.3,
      reviews: 156,
      active: true,
      createdAt: new Date()
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
      active: true,
      createdAt: new Date()
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
      active: true,
      createdAt: new Date()
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
      active: true,
      createdAt: new Date()
    }
  ];

  await db.collection('products').insertMany(sampleProducts);
}

// User functions
export async function findUser(email) {
  await connectDB();

  let user = null;

  // 1. Try MongoDB first (if not in forced file mode)
  if (!fileBasedMode && db) {
    user = await db.collection('users').findOne({ email });
    if (user) return user;
  }

  // 2. Fallback to file-based data
  // Always reload fallback data to get latest updates
  loadFallbackData();
  user = fallbackUsers.find(u => u.email === email) || null;

  return user;
}

export async function getAllUsers() {
  await connectDB();
  if (fileBasedMode) {
    return fallbackUsers;
  }
  const users = await db.collection('users').find({}).toArray();
  return users;
}

export async function createUser(userData) {
  await connectDB();
  const user = {
    ...userData,
    _id: Date.now().toString(),
    createdAt: new Date()
  };

  if (fileBasedMode) {
    fallbackUsers.push(user);
    saveFallbackData();
  } else {
    await db.collection('users').insertOne(user);
  }
  return user;
}

export async function updateUser(email, updates) {
  await connectDB();

  if (fileBasedMode) {
    const index = fallbackUsers.findIndex(u => u.email === email);
    if (index === -1) return null;
    fallbackUsers[index] = { ...fallbackUsers[index], ...updates };
    saveFallbackData();
    return fallbackUsers[index];
  }

  const result = await db.collection('users').updateOne(
    { email },
    { $set: updates }
  );
  if (result.matchedCount === 0) return null;
  return await db.collection('users').findOne({ email });
}

export async function deleteUser(userId) {
  await connectDB();

  if (fileBasedMode) {
    const index = fallbackUsers.findIndex(u => u._id === userId);
    if (index !== -1) {
      const deletedUser = fallbackUsers[index];
      fallbackUsers.splice(index, 1);
      
      // Invalidate all active sessions for this user
      const sessionsToInvalidate = [];
      for (const [sessionToken, sessionData] of activeSessions.entries()) {
        if (sessionData.userId === userId) {
          sessionsToInvalidate.push(sessionToken);
        }
      }
      
      // Remove all sessions for this user
      sessionsToInvalidate.forEach(token => {
        activeSessions.delete(token);
        console.log(`🚫 Session invalidated for user ${userId}: ${token.substring(0, 10)}...`);
      });
      
      saveFallbackData();
      console.log(`✅ User ${deletedUser.email} deleted and ${sessionsToInvalidate.length} sessions invalidated`);
      return true;
    }
    return false;
  }

  const result = await db.collection('users').deleteOne({ _id: userId });
  
  // In MongoDB mode, we'd need to handle sessions differently
  // For now, return the result
  return result.deletedCount > 0;
}

// Session management functions
export async function createSession(userId, userEmail, token) {
  await connectDB();
  
  if (fileBasedMode) {
    activeSessions.set(token, {
      userId: userId,
      email: userEmail,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    });
    saveFallbackData();
    console.log(`🔐 Session created for user ${userEmail}: ${token.substring(0, 10)}...`);
    return true;
  }
  
  // In MongoDB mode, sessions would be stored in a separate collection
  return true;
}

export async function validateSession(token) {
  await connectDB();
  
  if (fileBasedMode) {
    const session = activeSessions.get(token);
    if (!session) return null;
    
    // Check if user still exists
    loadFallbackData(); // Reload to get latest user data
    const user = fallbackUsers.find(u => u._id === session.userId);
    if (!user) {
      // User was deleted, remove session
      activeSessions.delete(token);
      saveFallbackData();
      console.log(`🚫 Invalid session - user deleted: ${token.substring(0, 10)}...`);
      return null;
    }
    
    // Update last activity
    session.lastActivity = new Date().toISOString();
    saveFallbackData();
    return { user, session };
  }
  
  return null;
}

// Product functions
export async function getProducts() {
  await connectDB();

  let allProducts = [];

  // 1. Get products from MongoDB
  if (!fileBasedMode && db) {
    try {
      const mongoProducts = await db.collection('products').find({}).toArray();
      allProducts = [...mongoProducts];
    } catch (e) {
      console.error('Error fetching products from MongoDB:', e);
    }
  }

  // 2. Add products from fallback JSON (if they don't exist in MongoDB)
  if (fallbackProducts.length === 0) loadFallbackData();

  fallbackProducts.forEach(fp => {
    // Match by ID or Slug to avoid duplicates
    if (!allProducts.some(mp => mp._id === fp._id || mp.slug === fp.slug)) {
      allProducts.push(fp);
    }
  });

  return allProducts;
}

export async function createProduct(productData) {
  await connectDB();
  const product = {
    ...productData,
    _id: Date.now().toString(),
    createdAt: new Date()
  };

  if (fileBasedMode) {
    fallbackProducts.push(product);
    saveFallbackData();
  } else {
    await db.collection('products').insertOne(product);
  }
  return product;
}

export async function updateProduct(id, productData) {
  await connectDB();

  // 1. Try updating in MongoDB
  if (!fileBasedMode && db) {
    try {
      const result = await db.collection('products').updateOne(
        { _id: id },
        { $set: productData }
      );
      if (result.matchedCount > 0) {
        return await db.collection('products').findOne({ _id: id });
      }
    } catch (e) {
      console.error('Error updating product in MongoDB:', e);
    }
  }

  // 2. Fallback to updating in JSON
  if (fallbackProducts.length === 0) loadFallbackData();
  const index = fallbackProducts.findIndex(p => p._id === id);
  if (index !== -1) {
    fallbackProducts[index] = { ...fallbackProducts[index], ...productData };
    saveFallbackData();
    return fallbackProducts[index];
  }

  return null;
}

export async function deleteProduct(id) {
  await connectDB();

  if (fileBasedMode) {
    const index = fallbackProducts.findIndex(p => p._id === id);
    if (index !== -1) {
      fallbackProducts.splice(index, 1);
      saveFallbackData();
      return true;
    }
    return false;
  }

  const result = await db.collection('products').deleteOne({ _id: id });
  return result.deletedCount > 0;
}

// Order functions
export async function createOrder(orderData) {
  await connectDB();
  const order = {
    ...orderData,
    _id: Date.now().toString(),
    createdAt: new Date()
  };

  if (fileBasedMode) {
    fallbackOrders.push(order);
    saveFallbackData();
  } else {
    await db.collection('orders').insertOne(order);
  }
  return order;
}

export async function getOrders() {
  await connectDB();

  let allOrders = [];

  // 1. Get orders from MongoDB
  if (!fileBasedMode && db) {
    try {
      const mongoOrders = await db.collection('orders').find({}).toArray();
      allOrders = [...mongoOrders];
    } catch (e) {
      console.error('Error fetching orders from MongoDB:', e);
    }
  }

  // 2. Add orders from fallback JSON (if they don't exist in MongoDB)
  if (fallbackOrders.length === 0) loadFallbackData();

  fallbackOrders.forEach(fo => {
    // Match by MongoDB _id or local orderId to avoid duplicates
    if (!allOrders.some(mo => (mo._id && mo._id.toString() === fo._id.toString()) || mo.orderId === fo.orderId)) {
      allOrders.push(fo);
    }
  });

  return allOrders;
}

export async function updateOrder(id, orderData) {
  await connectDB();

  // 1. Try updating in MongoDB first
  if (!fileBasedMode && db) {
    try {
      const result = await db.collection('orders').updateOne(
        { $or: [{ _id: id }, { orderId: id }] },
        { $set: orderData }
      );
      if (result.matchedCount > 0) {
        return await db.collection('orders').findOne({ $or: [{ _id: id }, { orderId: id }] });
      }
    } catch (e) {
      console.error('Error updating order in MongoDB:', e);
    }
  }

  // 2. Fallback to updating in JSON
  if (fallbackOrders.length === 0) loadFallbackData();
  const index = fallbackOrders.findIndex(o => o._id === id || o.orderId === id);
  if (index !== -1) {
    fallbackOrders[index] = { ...fallbackOrders[index], ...orderData };
    saveFallbackData();
    return fallbackOrders[index];
  }

  return null;
}

export async function deleteOrder(id) {
  await connectDB();

  if (fileBasedMode) {
    const index = fallbackOrders.findIndex(o => o.orderId === id);
    if (index !== -1) {
      fallbackOrders.splice(index, 1);
      saveFallbackData();
      return true;
    }
    return false;
  }

  const result = await db.collection('orders').deleteOne({ orderId: id });
  return result.deletedCount > 0;
}
