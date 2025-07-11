import Address from "../models/Address.js";

// Add Address : /api/address/add
export const addAddress = async (req, res) => {
  try {
    // Get userId from authenticated user (set by auth middleware)
    const userId = req.user._id;

    // Get address fields directly from req.body
    const {
      firstName,
      lastName,
      email,
      phone,
      street,
      city,
      state,
      zipcode,
      country,
    } = req.body;

    // Create and save address with userId attached
    const newAddress = await Address.create({
      userId,
      firstName,
      lastName,
      email,
      phone,
      street,
      city,
      state,
      zipcode,
      country,
    });

    res.json({ success: true, message: "Address added successfully", address: newAddress });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Address : /api/address/get
export const getAddress = async (req, res) => {
  try {
    // Get userId from authenticated user
    const userId = req.user._id;

    const addresses = await Address.find({ userId });

    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
