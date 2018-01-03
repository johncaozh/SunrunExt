var mongoose = require("mongoose");

const schema = mongoose.Schema({
    iamOrgId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    parentId: {
        type: String,
        required: null
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'iamOrg',
        required: true
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
    }
});

const iamOrgModel = mongoose.model("iamOrg", schema);

module.exports = iamOrgModel;