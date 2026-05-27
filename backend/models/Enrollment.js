// backend/models/Enrollment.js
const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    phone: { type: String, required: true },
    classType: { type: String, required: true },
    totalFee: { type: Number, default: 3000 }, // Locked at ₹3,000 flat fee
    amountPaid: { type: Number, required: true }, // e.g., ₹500 advance or full ₹3,000
    paymentStatus: { 
        type: String, 
        enum: ['Unpaid', 'Advance_Paid', 'Fully_Paid'], 
        default: 'Unpaid' 
    }
}, { timestamps: true });

const MongooseEnrollment = mongoose.model('Enrollment', EnrollmentSchema);

// --- premium local JSON mock database fallback ---
const fs = require('fs');
const path = require('path');
const dbFilePath = path.join(__dirname, '../data/enrollments.json');

// Ensure database directory and file exist
function ensureDbFile() {
    const dir = path.dirname(dbFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(dbFilePath)) {
        // Initialize with defaults if empty
        const defaults = [
            { _id: 'ENR_01', studentName: 'Anitha Raj',   phone: '+919443212345', classType: 'Offline',    amountPaid: 500,  paymentStatus: 'Advance_Paid', totalFee: 3000, createdAt: new Date() },
            { _id: 'ENR_02', studentName: 'Meena Suresh', phone: '+919841276543', classType: 'Online',     amountPaid: 3000, paymentStatus: 'Fully_Paid',   totalFee: 3000, createdAt: new Date() },
            { _id: 'ENR_03', studentName: 'Kavitha M.',   phone: '+919789054321', classType: 'Offline',    amountPaid: 0,    paymentStatus: 'Unpaid',       totalFee: 3000, createdAt: new Date() }
        ];
        fs.writeFileSync(dbFilePath, JSON.stringify(defaults, null, 2));
    }
}

class MockEnrollment {
    constructor(data) {
        this.studentName = data.studentName;
        this.phone = data.phone;
        this.classType = data.classType;
        this.totalFee = data.totalFee || 3000;
        this.amountPaid = data.amountPaid || 0;
        this.paymentStatus = data.paymentStatus || 'Unpaid';
        this._id = data._id || `ENR_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
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
        const index = db.findIndex(e => e._id === id);
        if (index === -1) return null;
        const removed = db.splice(index, 1)[0];
        fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
        return removed;
    }
}

// Export a Proxy class that acts exactly like Mongoose or the Local File DB depending on the state
class EnrollmentProxy {
    constructor(data) {
        if (global.useMockDb) {
            return new MockEnrollment(data);
        } else {
            return new MongooseEnrollment(data);
        }
    }

    static find(...args) {
        if (global.useMockDb) {
            return MockEnrollment.find(...args);
        } else {
            return MongooseEnrollment.find(...args);
        }
    }

    static findByIdAndDelete(...args) {
        if (global.useMockDb) {
            return MockEnrollment.findByIdAndDelete(...args);
        } else {
            return MongooseEnrollment.findByIdAndDelete(...args);
        }
    }
}

module.exports = EnrollmentProxy;
