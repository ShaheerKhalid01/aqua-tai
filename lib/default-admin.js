// Create default admin user for development
import bcrypt from "bcryptjs";

const defaultAdmin = {
  _id: "admin_default",
  name: "Administrator",
  email: "admin@aquatai.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6QJw/2Ej7W", // "admin123" hashed
  role: "admin",
  createdAt: new Date().toISOString(),
};

export default function setupDefaultAdmin() {
  if (typeof window !== 'undefined') {
    // Client-side - add to localStorage for memory DB
    const existingUsers = JSON.parse(localStorage.getItem('memory_db_users') || '[]');
    const adminExists = existingUsers.some(u => u.email === defaultAdmin.email);
    
    if (!adminExists) {
      existingUsers.push(defaultAdmin);
      localStorage.setItem('memory_db_users', JSON.stringify(existingUsers));
      console.log("Default admin user created");
    }
  }
}
