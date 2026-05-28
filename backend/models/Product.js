// backend/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    size: { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'], required: true },
    price: { type: Number, required: true },
    image_url: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Available', 'Sold_Out'], 
        default: 'Available' 
    },
    stock: { 
        type: Number, 
        default: 1, 
        max: 1 // Prevents quantity from exceeding single-piece limits
    },
    fabricType: { type: String, default: '' },
    stitchingQuality: { type: String, default: '' },
    guaranteeNote: { type: String, default: '' },
    additional_images: { type: [String], default: [] }
}, { timestamps: true });

const MongooseProduct = mongoose.model('Product', ProductSchema);

// --- premium local JSON mock database fallback ---
const fs = require('fs');
const path = require('path');
const dbFilePath = path.join(__dirname, '../data/products.json');

// Ensure database directory and file exist
function ensureDbFile() {
    const dir = path.dirname(dbFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(dbFilePath)) {
        fs.writeFileSync(dbFilePath, JSON.stringify([]));
    }
}

class MockProduct {
    constructor(data) {
        this.title = data.title;
        this.size = data.size;
        this.price = data.price;
        this.image_url = data.image_url;
        this.status = data.status || 'Available';
        this.stock = data.stock || 1;
        this.fabricType = data.fabricType || '';
        this.stitchingQuality = data.stitchingQuality || '';
        this.guaranteeNote = data.guaranteeNote || '';
        this.additional_images = data.additional_images || [];
        this._id = data._id || `mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    async save() {
        ensureDbFile();
        const raw = fs.readFileSync(dbFilePath, 'utf8');
        const db = JSON.parse(raw);
        const index = db.findIndex(p => p._id === this._id);
        if (index !== -1) {
            db[index] = {
                ...db[index],
                title: this.title,
                size: this.size,
                price: this.price,
                image_url: this.image_url,
                status: this.status,
                stock: this.stock,
                fabricType: this.fabricType,
                stitchingQuality: this.stitchingQuality,
                guaranteeNote: this.guaranteeNote,
                additional_images: this.additional_images,
                updatedAt: new Date()
            };
        } else {
            db.push(this);
        }
        fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
        return this;
    }

    static find() {
        ensureDbFile();
        const raw = fs.readFileSync(dbFilePath, 'utf8');
        const db = JSON.parse(raw);
        const query = {
            sort: function(criteria) {
                db.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                return this;
            },
            then: function(resolve, reject) {
                try {
                    resolve(db);
                } catch (err) {
                    reject(err);
                }
            }
        };
        return query;
    }

    static async findById(id) {
        ensureDbFile();
        const raw = fs.readFileSync(dbFilePath, 'utf8');
        const db = JSON.parse(raw);
        const product = db.find(p => p._id === id);
        if (!product) return null;
        const instance = new MockProduct(product);
        instance._id = product._id;
        instance.createdAt = product.createdAt;
        instance.updatedAt = product.updatedAt;
        return instance;
    }

    static async findByIdAndDelete(id) {
        ensureDbFile();
        const raw = fs.readFileSync(dbFilePath, 'utf8');
        let db = JSON.parse(raw);
        const index = db.findIndex(p => p._id === id);
        if (index === -1) return null;
        const removed = db.splice(index, 1)[0];
        fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
        return removed;
    }

    static async findByIdAndUpdate(id, update, options) {
        ensureDbFile();
        const raw = fs.readFileSync(dbFilePath, 'utf8');
        let db = JSON.parse(raw);
        const index = db.findIndex(p => p._id === id);
        if (index === -1) return null;
        
        db[index] = {
            ...db[index],
            ...update,
            updatedAt: new Date()
        };
        fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
        return db[index];
    }

    static async updateMany(filter, update) {
        ensureDbFile();
        const raw = fs.readFileSync(dbFilePath, 'utf8');
        let db = JSON.parse(raw);
        
        let modifiedCount = 0;
        const ids = filter._id && filter._id.$in ? filter._id.$in : [];
        
        db = db.map(p => {
            const matchesId = ids.includes(p._id || p.id);
            const matchesStatus = !filter.status || p.status === filter.status;
            
            if (matchesId && matchesStatus) {
                modifiedCount++;
                return {
                    ...p,
                    ...update.$set,
                    updatedAt: new Date()
                };
            }
            return p;
        });
        
        fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
        return { modifiedCount };
    }
}

// Export a Proxy class that acts exactly like Mongoose or the Local File DB depending on the state
class ProductProxy {
    constructor(data) {
        if (global.useMockDb) {
            return new MockProduct(data);
        } else {
            return new MongooseProduct(data);
        }
    }

    static find(...args) {
        if (global.useMockDb) {
            return MockProduct.find(...args);
        } else {
            return MongooseProduct.find(...args);
        }
    }

    static findById(...args) {
        if (global.useMockDb) {
            return MockProduct.findById(...args);
        } else {
            return MongooseProduct.findById(...args);
        }
    }

    static findByIdAndDelete(...args) {
        if (global.useMockDb) {
            return MockProduct.findByIdAndDelete(...args);
        } else {
            return MongooseProduct.findByIdAndDelete(...args);
        }
    }

    static findByIdAndUpdate(...args) {
        if (global.useMockDb) {
            return MockProduct.findByIdAndUpdate(...args);
        } else {
            return MongooseProduct.findByIdAndUpdate(...args);
        }
    }

    static updateMany(...args) {
        if (global.useMockDb) {
            return MockProduct.updateMany(...args);
        } else {
            return MongooseProduct.updateMany(...args);
        }
    }
}

module.exports = ProductProxy;
