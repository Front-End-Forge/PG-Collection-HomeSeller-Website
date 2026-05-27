// backend/models/PortfolioItem.js
const mongoose = require('mongoose');

const PortfolioItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['SIMPLE', 'AARI_FUSED'], 
        default: 'SIMPLE' 
    },
    image_url: { type: String, required: true }
}, { timestamps: true });

const MongoosePortfolioItem = mongoose.model('PortfolioItem', PortfolioItemSchema);

// --- premium local JSON mock database fallback ---
const fs = require('fs');
const path = require('path');
const dbFilePath = path.join(__dirname, '../data/portfolio.json');

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

class MockPortfolioItem {
    constructor(data) {
        this.title = data.title;
        this.desc = data.desc;
        this.type = data.type || 'SIMPLE';
        this.image_url = data.image_url;
        this._id = `mock_port_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    async save() {
        ensureDbFile();
        const raw = fs.readFileSync(dbFilePath, 'utf8');
        const db = JSON.parse(raw);
        db.push(this);
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
}

// Export a Proxy class that acts exactly like Mongoose or the Local File DB depending on the state
class PortfolioItemProxy {
    constructor(data) {
        if (global.useMockDb) {
            return new MockPortfolioItem(data);
        } else {
            return new MongoosePortfolioItem(data);
        }
    }

    static find(...args) {
        if (global.useMockDb) {
            return MockPortfolioItem.find(...args);
        } else {
            return MongoosePortfolioItem.find(...args);
        }
    }

    static findByIdAndDelete(...args) {
        if (global.useMockDb) {
            return MockPortfolioItem.findByIdAndDelete(...args);
        } else {
            return MongoosePortfolioItem.findByIdAndDelete(...args);
        }
    }
}

module.exports = PortfolioItemProxy;
