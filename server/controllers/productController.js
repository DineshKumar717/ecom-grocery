import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// Add Product : POST /api/product/add
export const addProduct = async (req, res) => {
  try {
    const { productData } = req.body;
    const parsedData = JSON.parse(productData);
    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({ success: false, message: "No images uploaded" });
    }

    const imagesUrl = await Promise.all(
      images.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    await Product.create({ ...parsedData, image: imagesUrl });

    res.status(201).json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.error("Add Product Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Products : GET /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Product List Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Product by ID : POST /api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Get Product Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change Product In-Stock Status : PUT /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    await Product.findByIdAndUpdate(id, { inStock });
    res.status(200).json({ success: true, message: "Stock updated successfully" });
  } catch (error) {
    console.error("Change Stock Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
