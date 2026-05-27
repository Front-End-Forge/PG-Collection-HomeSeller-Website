// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');

// Temporary memory allocation for the incoming file stream
const upload = multer({ dest: 'uploads/' });

// POST /api/admin/add-product
// Accepts a dress image, compresses it via sharp, saves product to DB
router.post('/add-product', upload.single('dressImage'), async (req, res) => {
    try {
        const { title, size, price } = req.body;
        
        if (!title || !size || !price || !req.file) {
            return res.status(400).json({ success: false, message: "Fill all parameters" });
        }

        // Process mobile photo upload size restrictions using sharp 
        const optimizedFileName = `optimized-${Date.now()}.jpg`;
        const outputPath = path.join(__dirname, '../uploads', optimizedFileName);

        await sharp(req.file.path)
            .resize(800, 800, { fit: 'cover' }) // Square grid sizing
            .jpeg({ quality: 80 })              // File size compression
            .toFile(outputPath);

        // Remove the raw temp file left by multer
        fs.unlinkSync(req.file.path);

        // Instantiate single-piece logic 
        const newProduct = new Product({
            title,
            size,
            price: parseFloat(price),
            image_url: `/uploads/${optimizedFileName}`
        });

        await newProduct.save();
        res.status(201).json({ success: true, message: "Unique piece listed!" });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET API endpoint to pull live boutique inventory
router.get('/products', async (req, res) => {
    try {
        // Fetch all listed pieces from MongoDB, newest first
        const products = await Product.find().sort({ createdAt: -1 });
        
        // Return a clean structure so axios reads it correctly
        res.status(200).json({ success: true, data: products });
    } catch (err) {
        console.error("Backend Products Route Error:", err.message);
        res.status(500).json({ success: false, message: "Database read failed", error: err.message });
    }
});

// PATCH /api/admin/products/:id/status
// Mark a product as Sold_Out
router.patch('/products/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST API Endpoint to handle completed checkouts and flip item availability
router.post('/checkout', async (req, res) => {
    try {
        const { productIds } = req.body; // Expects an array of product IDs from the cart

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ success: false, message: "No items provided for checkout processing" });
        }

        // Find all matching dresses in MongoDB and change status to 'Sold_Out' at that exact millisecond
        const updateResult = await Product.updateMany(
            { _id: { $in: productIds }, status: 'Available' }, // Only target available items
            { $set: { status: 'Sold_Out' } }
        );

        // If no items were updated, it means they were already snatched by someone else
        if (updateResult.modifiedCount === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Checkout conflict! Items have already been purchased by another buyer." 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Stock successfully locked! Order processed securely.",
            updatedCount: updateResult.modifiedCount
        });

    } catch (err) {
        console.error("Checkout System Error Trace:", err.message);
        res.status(500).json({ success: false, message: "Database lock transaction failed", error: err.message });
    }
});

module.exports = router;
