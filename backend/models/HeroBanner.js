// backend/models/HeroBanner.js
const mongoose = require('mongoose');

const HeroBannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    badge: { type: String, default: 'முக்கிய அறிவிப்பு' },
    btnText: { type: String, default: 'இப்போதே வாங்க' },
    tab: { type: String, enum: ['shop', 'stitching', 'classes'], default: 'shop' },
    image_url: { type: String, default: '' }
}, { timestamps: true });

const MongooseHeroBanner = mongoose.model('HeroBanner', HeroBannerSchema);

// --- premium local JSON mock database fallback ---
const fs = require('fs');
const path = require('path');
const dbFilePath = path.join(__dirname, '../data/herobanners.json');

// Ensure database directory and file exist
function ensureDbFile() {
    const dir = path.dirname(dbFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(dbFilePath)) {
        // Initialize with default slide banners
        const defaults = [
            {
                _id: 'slide_1',
                title: "புதிய நைட்டிகள் & டாப்ஸ் வருகை!",
                desc: "ஒவ்வொரு ஞாயிறும் மாலை 6 மணிக்கு. ஒரு டிசைனில் ஒரு ஆடை மட்டுமே!",
                badge: "முக்கிய அறிவிப்பு",
                btnText: "இப்போதே வாங்க",
                tab: "shop",
                image_url: ""
            },
            {
                _id: 'slide_2',
                title: "பிரீமியம் டிசைனர் கவுன்கள்",
                desc: "உங்களது சரியான உடல் அளவிற்கு ஏற்ப கச்சிதமாக தைத்து தரப்படும்.",
                badge: "தையல் கலை",
                btnText: "ஆர்டர் செய்ய",
                tab: "stitching",
                image_url: ""
            },
            {
                _id: 'slide_3',
                title: "தொழில்முறை ஆரி எம்பிராய்டரி வகுப்பு",
                desc: "முன்பதிவு செய்ய மற்றும் புதிய பேட்ச் விவரங்களை வாட்ஸ்அப்பில் கேட்கவும்.",
                badge: "அட்மிஷன் ஓபன்",
                btnText: "விவரம் கேட்க",
                tab: "classes",
                image_url: ""
            }
        ];
        fs.writeFileSync(dbFilePath, JSON.stringify(defaults, null, 2));
    }
}

class MockHeroBanner {
    constructor(data) {
        this.title = data.title;
        this.desc = data.desc;
        this.badge = data.badge || 'முக்கிய அறிவிப்பு';
        this.btnText = data.btnText || 'இப்போதே வாங்க';
        this.tab = data.tab || 'shop';
        this.image_url = data.image_url || '';
        this._id = data._id || `mock_slide_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    async save() {
        ensureDbFile();
        const raw = fs.readFileSync(dbFilePath, 'utf8');
        const db = JSON.parse(raw);
        const index = db.findIndex(s => s._id === this._id);
        if (index !== -1) {
            db[index] = { ...db[index], ...this, updatedAt: new Date() };
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

    static async findByIdAndDelete(id) {
        ensureDbFile();
        const raw = fs.readFileSync(dbFilePath, 'utf8');
        let db = JSON.parse(raw);
        const index = db.findIndex(s => s._id === id);
        if (index === -1) return null;
        const removed = db.splice(index, 1)[0];
        fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
        return removed;
    }
}

// Export a Proxy class that acts exactly like Mongoose or the Local File DB depending on the state
class HeroBannerProxy {
    constructor(data) {
        if (global.useMockDb) {
            return new MockHeroBanner(data);
        } else {
            return new MongooseHeroBanner(data);
        }
    }

    static find(...args) {
        if (global.useMockDb) {
            return MockHeroBanner.find(...args);
        } else {
            return MongooseHeroBanner.find(...args);
        }
    }

    static findByIdAndDelete(...args) {
        if (global.useMockDb) {
            return MockHeroBanner.findByIdAndDelete(...args);
        } else {
            return MongooseHeroBanner.findByIdAndDelete(...args);
        }
    }
}

module.exports = HeroBannerProxy;
