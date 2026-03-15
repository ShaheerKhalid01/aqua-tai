import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  qty:   { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    orderId:  { type: String, required: true, unique: true },
    customer: { type: String, required: true },
    email:    { type: String, required: true },
    phone:    { type: String },
    address:  { type: String },
    city:     { type: String },
    payment:  { type: String, enum: ["cod", "bank"], default: "cod" },
    total:    { type: Number, required: true },
    status:   { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered"], default: "Pending" },
    items:    [OrderItemSchema],
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);