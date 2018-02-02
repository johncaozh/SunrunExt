var mongoose = require("mongoose");

const schema = mongoose.Schema({
    //在IAM平台的用户ID
    id: {
        type: String,
        default: null,
        required: true
    },
    name: {
        type: String,
        default: null,
        required: true
    },
    email: {
        type: String,
        default: null,
        required: false,
    },
    phone: {
        type: String,
        default: null,
        required: false,
    },
    //职位
    rank: {
        type: String,
        default: null,
        required: false,
    },
    //关联的组织ID
    parentId: {
        type: String,
        default: null,
        required: true
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    }
});

const userModel = mongoose.model("user", schema);
module.exports = userModel;