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
// Accepts a dress image and optional additional images, compresses them via sharp, saves product to DB
router.post('/add-product', upload.fields([
    { name: 'dressImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 8 }
]), async (req, res) => {
    try {
        const { title, size, price, fabricType, stitchingQuality, guaranteeNote } = req.body;
        
        const mainImageField = req.files && req.files['dressImage'] ? req.files['dressImage'][0] : null;
        if (!title || !size || !price || !mainImageField) {
            return res.status(400).json({ success: false, message: "Fill all parameters including primary image" });
        }

        // Process main photo upload using sharp
        const optimizedFileName = `optimized-${Date.now()}.jpg`;
        const outputPath = path.join(__dirname, '../uploads', optimizedFileName);

        await sharp(mainImageField.path)
            .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toFile(outputPath);

        fs.unlinkSync(mainImageField.path);
        const image_url = `/uploads/${optimizedFileName}`;

        // Process additional images if any
        const additional_images = [];
        const extraImagesFields = req.files && req.files['additionalImages'] ? req.files['additionalImages'] : [];
        for (const file of extraImagesFields) {
            const extraOptimizedName = `optimized-extra-${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;
            const extraOutputPath = path.join(__dirname, '../uploads', extraOptimizedName);

            await sharp(file.path)
                .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 80 })
                .toFile(extraOutputPath);

            fs.unlinkSync(file.path);
            additional_images.push(`/uploads/${extraOptimizedName}`);
        }

        // Instantiate single-piece logic 
        const newProduct = new Product({
            title,
            size,
            price: parseFloat(price),
            image_url,
            additional_images,
            fabricType: fabricType || undefined,
            stitchingQuality: stitchingQuality || undefined,
            guaranteeNote: guaranteeNote || undefined
        });

        await newProduct.save();
        res.status(201).json({ success: true, message: "Unique piece listed!", data: newProduct });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET API endpoint to pull live boutique inventory
router.get('/products', async (req, res) => {
    try {
        // Fetch all listed pieces from MongoDB, newest first
        const products = await Product.find().sort({ createdAt: -1 });
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

// DELETE /api/admin/products/:id
// Physically unlinks optimized dress photo assets from server disk storage and deletes record from DB
router.delete('/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        // Remove the primary image file from disk
        if (deletedProduct.image_url) {
            const filePath = path.join(__dirname, '..', deletedProduct.image_url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        // Remove all additional images from disk
        if (deletedProduct.additional_images && Array.isArray(deletedProduct.additional_images)) {
            for (const imgUrl of deletedProduct.additional_images) {
                const filePath = path.join(__dirname, '..', imgUrl);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }
        res.json({ success: true, message: "Product listing deleted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PUT /api/admin/products/:id
// Update dress details and optional images
router.put('/products/:id', upload.fields([
    { name: 'dressImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 8 }
]), async (req, res) => {
    try {
        const { title, size, price, fabricType, stitchingQuality, guaranteeNote, existingAdditionalImages } = req.body;
        
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Update fields if provided
        if (title !== undefined) product.title = title;
        if (size !== undefined) product.size = size;
        if (price !== undefined) product.price = parseFloat(price);
        if (fabricType !== undefined) product.fabricType = fabricType || undefined;
        if (stitchingQuality !== undefined) product.stitchingQuality = stitchingQuality || undefined;
        if (guaranteeNote !== undefined) product.guaranteeNote = guaranteeNote || undefined;

        // Process primary image replacement if provided
        const newPrimaryFile = req.files && req.files['dressImage'] ? req.files['dressImage'][0] : null;
        if (newPrimaryFile) {
            // Delete the old main image file if it exists
            if (product.image_url) {
                const oldFilePath = path.join(__dirname, '..', product.image_url);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            // Save the optimized new image file
            const optimizedFileName = `optimized-${Date.now()}.jpg`;
            const outputPath = path.join(__dirname, '../uploads', optimizedFileName);

            await sharp(newPrimaryFile.path)
                .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 80 })
                .toFile(outputPath);

            fs.unlinkSync(newPrimaryFile.path);
            product.image_url = `/uploads/${optimizedFileName}`;
        }

        // Handle existing additional images sync
        let keepExtraImages = [];
        if (existingAdditionalImages) {
            try {
                keepExtraImages = JSON.parse(existingAdditionalImages);
            } catch (e) {
                keepExtraImages = Array.isArray(existingAdditionalImages) ? existingAdditionalImages : [existingAdditionalImages];
            }
        } else {
            // If empty string is passed (deleted all), keepExtraImages is empty
            keepExtraImages = [];
        }

        // Physically delete any old extra images that are no longer kept
        const currentExtraImages = product.additional_images || [];
        for (const oldUrl of currentExtraImages) {
            if (!keepExtraImages.includes(oldUrl)) {
                const oldFilePath = path.join(__dirname, '..', oldUrl);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
        }
        product.additional_images = [...keepExtraImages];

        // Process newly uploaded extra images if any
        const newExtraFiles = req.files && req.files['additionalImages'] ? req.files['additionalImages'] : [];
        for (const file of newExtraFiles) {
            const extraOptimizedName = `optimized-extra-${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;
            const extraOutputPath = path.join(__dirname, '../uploads', extraOptimizedName);

            await sharp(file.path)
                .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 80 })
                .toFile(extraOutputPath);

            fs.unlinkSync(file.path);
            product.additional_images.push(`/uploads/${extraOptimizedName}`);
        }

        await product.save();
        res.json({ success: true, message: "Product listing updated successfully!", data: product });
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
            .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
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
        const deletedItem = await PortfolioItem.findByIdAndDelete(req.params.id);
        if (deletedItem && deletedItem.image_url) {
            const filePath = path.join(__dirname, '..', deletedItem.image_url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
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
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please select an image file" });
        }

        const optimizedFileName = `optimized-hero-${Date.now()}.jpg`;
        const outputPath = path.join(__dirname, '../uploads', optimizedFileName);

        await sharp(req.file.path)
            .resize(800, 800, { fit: 'cover' }) // Square cover to fit the standard dynamic containers beautifully
            .jpeg({ quality: 80 })
            .toFile(outputPath);

        fs.unlinkSync(req.file.path);

        const newSlide = new HeroBanner({
            title: title !== undefined ? title : '',
            desc: desc !== undefined ? desc : '',
            badge: badge !== undefined ? badge : '',
            btnText: btnText !== undefined ? btnText : '',
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

