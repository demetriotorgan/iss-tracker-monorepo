const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema({
     latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    altitude: {
        type: Number,
        default: null
    },
    velocity: {
        type: Number,
        default: null
    },
    visibility: {
        type: String,
        default: null
    },
    timestamp: {
        type: Number,
        required: true
    }
}, {
    _id: false
});

const OrbitSchema = new mongoose.Schema({
    orbitNumber: {
        type: Number,
        required: true,
        unique: true
    },

    active: {
        type: Boolean,
        default: true
    },

    startedAt: {
        type: Date,
        default: Date.now
    },

    endedAt: {
        type: Date,
        default: null
    },

    totalPoints: {
        type: Number,
        default: 0
    },

    antimeridianCrossing: {
        type: Boolean,
        default: false
    },

    points: [PointSchema]

}, {
    timestamps: true
});

OrbitSchema.index({ active: 1 });
OrbitSchema.index({ startedAt: -1 });

module.exports = mongoose.model('Orbit', OrbitSchema);