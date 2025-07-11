// controllers/cartController.js
import User from "../models/User.js";

export const updateCart = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from token (middleware)
    const { cartItems } = req.body;

    if (!cartItems || typeof cartItems !== "object") {
      return res.status(400).json({ success: false, message: "Invalid cart items" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.cartItems = cartItems;
    await user.save();

    res.status(200).json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.error("Cart update error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
