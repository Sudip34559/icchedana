const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // user ID
    order_id: { type: String, required: true }, // order ID (e.g., order_IluGWxBm9U8zJ8)
    entity: { type: String, default: "order" }, // always "order"
    amount: { type: Number, required: true }, // total amount in smallest currency unit (e.g., paisa)
    currency: { type: String, default: "INR" }, // currency code (INR)
    receipt: { type: String, required: true }, // receipt ID
    status: { type: String, default: "created" }, // order status (created, paid, etc.)
    attempts: { type: Number, default: 0 }, // number of payment attempts

    // Razorpay fields (nullable)
    razorpay_payment_id: { type: String, default: null },
    razorpay_order_id: { type: String, default: null },
    razorpay_signature: { type: String, default: null },
  },
  {
    timestamps: false, // Don't auto-add createdAt/updatedAt fields
  }
);

// Create the model
module.exports = mongoose.model("Order", OrderSchema);
