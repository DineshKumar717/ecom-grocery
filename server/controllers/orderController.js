import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Stripe from "stripe";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 🟡 Place COD Order
export const placeCodOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, address } = req.body;

    if (!items || !items.length || !address) {
      return res.status(400).json({ success: false, message: "Missing order details" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    totalAmount += Math.floor(totalAmount * 0.02); // Add 2% tax

    const newOrder = await Order.create({
      userId,
      items: orderItems,
      address,
      paymentType: "COD",
      isPaid: false,
      amount: totalAmount,
      status: "Placed",
    });

    res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟡 Place Online Payment Order using Stripe
export const placeCodOrderStripe = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, address } = req.body;
    const { origin } = req.headers;

    if (!items || !items.length || !address) {
      return res.status(400).json({ success: false, message: "Missing order details" });
    }

    let totalAmount = 0;
    const orderItems = [];
    const productData = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      productData.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    totalAmount += Math.floor(totalAmount * 0.02); // Add 2% tax

    const newOrder = await Order.create({
      userId,
      items: orderItems,
      address,
      paymentType: "Online",
      isPaid: false,
      amount: totalAmount,
      status: "Placed",
    });

    const line_items = productData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.floor(item.price * 1.02 * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: newOrder._id.toString(),
        userId: userId.toString(),
      },
    });

    res.status(201).json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟡 Stripe Webhook for Payment Verification
export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const { orderId, userId } = session.metadata;

      try {
        await Order.findByIdAndUpdate(orderId, { isPaid: true });
        await User.findByIdAndUpdate(userId, { cartItems: {} });
      } catch (err) {
        console.error("Webhook DB update error:", err);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      console.log("Payment failed:", event.data.object.id);
      break;
    }

    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

// 🟡 Get User Orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching orders.",
    });
  }
};

// 🟡 Get All Orders (Admin/Seller)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
