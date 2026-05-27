// backend/models/CategoryAsset.js
const mongoose = require('mongoose');

const CategoryAssetSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    icon: { type: String, default: '👗' },
    image_url: { type: String, default: '' }
}, { timestamps: true });

const MongooseCategoryAsset = mongoose.model('CategoryAsset', CategoryAssetSchema);

// --- premium local JSON mock database fallback ---
const fs = require('fs');
const path = require('path');
const dbFilePath = path.join(__dirname, '../data/categories.json');

// Ensure database directory and file exist
function ensureDbFile() {
    const dir = path.dirname(dbFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(dbFilePath)) {
        // Initialize with default categories
        const defaults = [
            { _id: 'cat_1', name: '₹150 டாப்ஸ்', icon: '👚', image_url: '' },
            { _id: 'cat_2', name: 'நைட்டிகள்', icon: '👗', image_url: '' },
            { _id: 'cat_3', name: 'இன்னர்வேர்', icon: '🩲', image_url: '' },
            { _id: 'cat_4', name: 'குழந்தை ஆடைகள்', icon: '👶', image_url: '' }
        ];
        fs.writeFileSync(dbFilePath, JSON.stringify(defaults, null, 2));
    }
}

class MockCategoryAsset {
    constructor(data) {
        this.name = data.name;
        this.icon = data.icon || '👗';
        this.image_url = data.image_url || '';
        this._id = data._id || `mock_cat_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    async save() {
        ensureDbFile();
        const raw = fs.readFileSync(dbFilePath, 'utf8');
        const db = JSON.parse(raw);
        const index = db.findIndex(c => c.name === this.name);
        if (index !== -1) {
            db[index] = { ...db[index], icon: this.icon, image_url: this.image_url, updatedAt: new Date() };
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

    static async findOneAndUpdate(filter, update, options) {
        ensureDbFile();
        const raw = fs.readFileSync(dbFilePath, 'utf8');
        let db = JSON.parse(raw);
        const name = filter.name;
        let index = db.findIndex(c => c.name === name);
        if (index === -1) {
            const newItem = {
                _id: `mock_cat_${Date.now()}`,
                name: name,
                icon: update.icon || '👗',
                image_url: update.image_url || '',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            db.push(newItem);
            fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
            return newItem;
        } else {
            db[index] = {
                ...db[index],
                ...update,
                updatedAt: new Date()
            };
            fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
            return db[index];
        }
    }
}

// Export a Proxy class that acts exactly like Mongoose or the Local File DB depending on the state
class CategoryAssetProxy {
    constructor(data) {
        if (global.useMockDb) {
            return new MockCategoryAsset(data);
        } else {
            return new MongooseCategoryAsset(data);
        }
    }

    static find(...args) {
        if (global.useMockDb) {
            return MockCategoryAsset.find(...args);
        } else {
            return MongooseCategoryAsset.find(...args);
        }
    }

    static findOneAndUpdate(...args) {
        if (global.useMockDb) {
            return MockCategoryAsset.findOneAndUpdate(...args);
        } else {
            return MongooseCategoryAsset.findOneAndUpdate(...args);
        }
    }
}

module.exports = CategoryAssetProxy;
