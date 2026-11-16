const mongoose = require("mongoose");

const networkCheckSchema = new mongoose.Schema({
    hostname: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Online", "Offline"],
        required: true
    },
    responseTime: {
        type: Number,
        required: true
    },
    checkedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("NetworkCheck", networkCheckSchema);