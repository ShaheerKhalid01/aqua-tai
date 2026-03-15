import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    slug:          { type: String, required: true, unique: true, lowercase: true, trim: true },
    category:      { type: String, required: true, trim: true },
    price:         { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    stock:         { type: Number, required: true, default: 0 },
    badge:         { type: String, default: "" },
    description:   { type: String, required: true },
    features:      [{ type: String }],
    specifications:{ type: Map, of: String, default: {} },
    images:        [{ type: String }], // Cloudinary URLs
    rating:        { type: Number, default: 0 },
    reviews:       { type: Number, default: 0 },
    active:        { type: Boolean, default: true },
  },
  { timestamps: true }
);

if (mongoose.models.Product) delete mongoose.models.Product;
export default mongoose.model("Product", ProductSchema);