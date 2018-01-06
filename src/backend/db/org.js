var mongoose = require("mongoose");

const schema = mongoose.Schema({
    //在IAM平台的组织ID
    iamOrgId: {
        type: Number,
        default: null,
        required: true
    },
    name: {
        type: String,
        default: null,
        required: true
    },
    parentIamOrgId: {
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