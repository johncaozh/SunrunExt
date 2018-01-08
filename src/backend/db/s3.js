var mongoose = require("mongoose");

const schema = mongoose.Schema({
    objectKey: {
        type: String,
        default: null,
        required: true,
        unique: true,
    },
    presignedUrl: {
        type: String,
        default: null,
        required: false,
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
    }
});

const s3Model = mongoose.model("s3", schema);
module.exports = s3Model;