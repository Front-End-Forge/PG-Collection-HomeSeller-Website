// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const PortfolioItem = require('../models/PortfolioItem');
const CategoryAsset = require('../models/CategoryAsset');
const HeroBanner = require('../models/HeroBanner');
const Enrollment = require('../models/Enrollment');


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

// ==========================================
// 1. STITCHING PORTFOLIO ENDPOINTS
// ==========================================

// GET /api/admin/portfolio -> Fetch all stitching portfolio items
router.get('/portfolio', async (req, res) => {
    try {
        const items = await PortfolioItem.find().sort({ createdAt: -1 });
        res.json({ success: true, data: items });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/admin/add-portfolio -> Add item to stitching portfolio
router.post('/add-portfolio', upload.single('portfolioImage'), async (req, res) => {
    try {
        const { title, desc, type } = req.body;
        if (!title || !desc || !req.file) {
            return res.status(400).json({ success: false, message: "Fill all parameters" });
        }

        const optimizedFileName = `optimized-portfolio-${Date.now()}.jpg`;
        const outputPath = path.join(__dirname, '../uploads', optimizedFileName);

        await sharp(req.file.path)
            .resize(800, 800, { fit: 'cover' })
            .jpeg({ quality: 80 })
            .toFile(outputPath);

        fs.unlinkSync(req.file.path);

        const newPortfolioItem = new PortfolioItem({
            title,
            desc,
            type: type || 'SIMPLE',
            image_url: `/uploads/${optimizedFileName}`
        });

        await newPortfolioItem.save();
        res.status(201).json({ success: true, message: "Portfolio design listed!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE /api/admin/portfolio/:id -> Delete a portfolio item
router.delete('/portfolio/:id', async (req, res) => {
    try {
        await PortfolioItem.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Portfolio item deleted" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ==========================================
// 2. CATEGORY ENDPOINTS
// ==========================================

// GET /api/admin/categories -> Fetch all category assets
router.get('/categories', async (req, res) => {
    try {
        const categories = await CategoryAsset.find();
        res.json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/admin/update-category -> Upload custom category image
router.post('/update-category', upload.single('categoryImage'), async (req, res) => {
    try {
        const { name, icon } = req.body;
        if (!name || !req.file) {
            return res.status(400).json({ success: false, message: "Fill all parameters" });
        }

        const optimizedFileName = `optimized-category-${Date.now()}.jpg`;
        const outputPath = path.join(__dirname, '../uploads', optimizedFileName);

        await sharp(req.file.path)
            .resize(400, 400, { fit: 'cover' })
            .jpeg({ quality: 80 })
            .toFile(outputPath);

        fs.unlinkSync(req.file.path);

        const updated = await CategoryAsset.findOneAndUpdate(
            { name },
            { icon: icon || '👗', image_url: `/uploads/${optimizedFileName}` },
            { new: true, upsert: true }
        );

        res.json({ success: true, data: updated, message: "Category icon customized!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ==========================================
// 3. HERO BANNER ENDPOINTS
// ==========================================

// GET /api/admin/hero-slides -> Fetch all hero banner slides
router.get('/hero-slides', async (req, res) => {
    try {
        const slides = await HeroBanner.find();
        res.json({ success: true, data: slides });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/admin/add-hero-slide -> Add item to hero banners
router.post('/add-hero-slide', upload.single('heroImage'), async (req, res) => {
    try {
        const { title, desc, badge, btnText, tab } = req.body;
        if (!title || !desc || !req.file) {
            return res.status(400).json({ success: false, message: "Fill all parameters" });
        }

        const optimizedFileName = `optimized-hero-${Date.now()}.jpg`;
        const outputPath = path.join(__dirname, '../uploads', optimizedFileName);

        await sharp(req.file.path)
            .resize(800, 800, { fit: 'cover' }) // Square cover to fit the standard dynamic containers beautifully
            .jpeg({ quality: 80 })
            .toFile(outputPath);

        fs.unlinkSync(req.file.path);

        const newSlide = new HeroBanner({
            title,
            desc,
            badge: badge || 'முக்கிய அறிவிப்பு',
            btnText: btnText || 'இப்போதே வாங்க',
            tab: tab || 'shop',
            image_url: `/uploads/${optimizedFileName}`
        });

        await newSlide.save();
        res.status(201).json({ success: true, message: "Hero slide added!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE /api/admin/hero-slides/:id -> Delete a hero slide
router.delete('/hero-slides/:id', async (req, res) => {
    try {
        await HeroBanner.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Hero slide deleted" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ==========================================
// 4. STUDENT ENROLLMENT ENDPOINTS
// ==========================================

// GET /api/admin/enrollments -> Fetch all students
router.get('/enrollments', async (req, res) => {
    try {
        const students = await Enrollment.find().sort({ createdAt: -1 });
        res.json({ success: true, data: students });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/admin/add-enrollment -> Add a student enrollment
router.post('/add-enrollment', async (req, res) => {
    try {
        const { studentName, phone, classType, amountPaid, paymentStatus } = req.body;
        if (!studentName || !phone || !classType) {
            return res.status(400).json({ success: false, message: "Fill all required parameters" });
        }

        const newEnrollment = new Enrollment({
            studentName,
            phone,
            classType,
            amountPaid: Number(amountPaid) || 0,
            paymentStatus: paymentStatus || 'Unpaid'
        });

        await newEnrollment.save();
        res.status(201).json({ success: true, data: newEnrollment, message: "Student enrolled!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;

