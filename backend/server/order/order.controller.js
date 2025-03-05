const Razorpay = require("razorpay");
const Order = require("./order.model");
const User = require("../user/user.model");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency, receipt, userId } = req.body;

    if (!amount || !currency || !receipt || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }

    // Validate user existence
    const user = await User.find({
      _id: userId,
    });
    console.log(user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const options = {
      amount: amount, // Razorpay expects amount in paisa
      currency: currency || "INR",
      receipt: receipt,
      partial_payment: false,
    };

    // Create Razorpay order
    const razorPay = await razorpayInstance.orders.create(options);
    // const razorPay = {
    //   id: "order_MOCK123456789",
    //   entity: "order",
    //   amount: options.amount,
    //   currency: options.currency,
    //   receipt: options.receipt,
    //   status: "created",
    //   attempts: 0,
    //   created_at: Math.floor(Date.now() / 1000),
    // };

    if (razorPay) {
      const order = new Order({
        order_id: razorPay.id,
        user_id: userId,
        entity: razorPay.entity,
        amount: razorPay.amount,
        currency: razorPay.currency,
        receipt: razorPay.receipt,
        status: razorPay.status,
        attempts: razorPay.attempts || 0,
      });

      await order.save();

      res.status(200).json({
        success: true,
        message: "Razorpay order created successfully",
        razorPay,
        order,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to create Razorpay order",
      });
    }
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const {
      order_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    if (
      !order_id ||
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }

    const order = await Order.findOneAndUpdate(
      { order_id },
      {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        status: "paid", // You can update this if you are marking it as paid
      },
      { new: true } // Return updated document
    );

    if (order) {
      res.status(200).json({
        success: true,
        message: "Razorpay order updated successfully",
        order,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Razorpay order not found",
      });
    }
  } catch (error) {
    console.error("Error updating Razorpay order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update Razorpay order",
      error: error.message,
    });
  }
};
