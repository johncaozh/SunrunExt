var mongoose = require("mongoose");

const schema = mongoose.Schema({
    //在IAM平台的组织ID
    id: {
        type: Number,
        default: null,
        required: true
    },
    name: {
        type: String,
        default: null,
        required: true
    },
    parentId: {
        type: Number,
        default: null,
        required: false
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
    }
});

const orgModel = mongoose.model("org", schema);
module.exports = orgModel;